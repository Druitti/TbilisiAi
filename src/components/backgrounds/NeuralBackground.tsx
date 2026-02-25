"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Depth and field - AUMENTAR A ÁREA
// Depth and field - MAIS DISPERSO
const Z_NEAR = -5;  // Mais profundo ainda
const Z_FAR = 5;     // Mais para frente
const Z_MID = (Z_NEAR + Z_FAR) / 2;
const XY_RANGE = 5;  // Era 3.5, agora ainda mais espalhado lateralmente
const PARALLAX_FACTOR = 0.02;
const SCALE_NEAR = 0.03;
const SCALE_FAR = 0.01;
const OPACITY_NEAR = 0.75;
const OPACITY_FAR = 0.2;

// Camera zoom (scroll-based)
const Z_CAMERA_OUT = 2.5;
const Z_CAMERA_IN = 1.5;
const FOV_OUT = 75;
const FOV_IN = 1;
const CAMERA_DAMP = 0.04;

// Motion
const FLOAT_AMPLITUDE_1 = 0.06;
const FLOAT_AMPLITUDE_2 = 0.04;
const FLOAT_SPEED_1 = 0.25;
const FLOAT_SPEED_2 = 0.15;
const DRIFT_SPEED = 0.015;
const REDUCED_MOTION_SCALE = 0.05;

// Performance - MENOS NÓS MAS MAIS ESPALHADOS
const MOBILE_BREAKPOINT = 768;
const NODES_MOBILE = 50;         // Reduzido de 60
const NODES_DESKTOP = 150;       // Reduzido de 150
const MAX_CONNECTIONS_MOBILE = 3;  // Menos conexões
const MAX_CONNECTIONS_DESKTOP = 4; // Menos conexões (era 6)
const CONNECTION_MAX_DISTANCE = 2.2;  // Era 1.8, conexões mais longas mas menos densas
const RECOMPUTE_CONNECTIONS_INTERVAL = 2;
const RECOMPUTE_INTERVAL_MOBILE = 3;

function useNeuralCount() {
  const [nodeCount, setNodeCount] = useState(NODES_DESKTOP);
  const [maxConnections, setMaxConnections] = useState(MAX_CONNECTIONS_DESKTOP);
  const [recomputeInterval, setRecomputeInterval] = useState(RECOMPUTE_CONNECTIONS_INTERVAL);

  useEffect(() => {
    const update = () => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
      setNodeCount(isMobile ? NODES_MOBILE : NODES_DESKTOP);
      setMaxConnections(isMobile ? MAX_CONNECTIONS_MOBILE : MAX_CONNECTIONS_DESKTOP);
      setRecomputeInterval(isMobile ? RECOMPUTE_INTERVAL_MOBILE : RECOMPUTE_CONNECTIONS_INTERVAL);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { nodeCount, maxConnections, recomputeInterval };
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function computeConnections(
  positions: Float32Array,
  nodeCount: number,
  maxConnections: number,
  maxDist: number
): [number, number][] {
  const pairs: [number, number][] = [];
  const countPerNode = new Array(nodeCount).fill(0);

  for (let i = 0; i < nodeCount; i++) {
    const ix = positions[i * 3];
    const iy = positions[i * 3 + 1];
    const iz = positions[i * 3 + 2];
    const candidates: { j: number; d: number }[] = [];

    for (let j = 0; j < nodeCount; j++) {
      if (i === j) continue;
      const jx = positions[j * 3];
      const jy = positions[j * 3 + 1];
      const jz = positions[j * 3 + 2];
      const d = Math.sqrt((ix - jx) ** 2 + (iy - jy) ** 2 + (iz - jz) ** 2);
      if (d <= maxDist) candidates.push({ j, d });
    }

    candidates.sort((a, b) => a.d - b.d);
    for (const { j } of candidates) {
      if (countPerNode[i] >= maxConnections || countPerNode[j] >= maxConnections) continue;
      pairs.push([i, j]);
      countPerNode[i]++;
      countPerNode[j]++;
    }
  }

  return pairs;
}

function ScrollCamera({
  scrollProgressRef,
  reducedMotion,
}: {
  scrollProgressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const currentZRef = useRef(Z_CAMERA_OUT);
  const currentFovRef = useRef(FOV_OUT);

  useFrame(() => {
    if (!cameraRef.current) return;
    const scrollProgress = scrollProgressRef?.current ?? 0;
    const targetZ = reducedMotion ? Z_CAMERA_OUT : Z_CAMERA_OUT + scrollProgress * (Z_CAMERA_IN - Z_CAMERA_OUT);
    const targetFov = reducedMotion ? FOV_OUT : FOV_OUT + scrollProgress * (FOV_IN - FOV_OUT);
    currentZRef.current += (targetZ - currentZRef.current) * CAMERA_DAMP;
    currentFovRef.current += (targetFov - currentFovRef.current) * CAMERA_DAMP;
    cameraRef.current.position.set(0, 0, currentZRef.current);
    cameraRef.current.fov = currentFovRef.current;
    cameraRef.current.updateProjectionMatrix();
  });

  return (
    <perspectiveCamera
      ref={cameraRef}
      fov={FOV_OUT}
      near={0.1}
      far={15}
      position={[0, 0, Z_CAMERA_OUT]}
    />
  );
}

function InfiniteNeuralNodes({
  basePositionsRef,
  positionsRef,
  nodeCount,
  reducedMotion,
}: {
  basePositionsRef: React.MutableRefObject<Float32Array>;
  positionsRef: React.MutableRefObject<Float32Array>;
  nodeCount: number;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const scaleVec = useMemo(() => new THREE.Vector3(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const depthRange = Z_FAR - Z_NEAR;
  const motionScale = reducedMotion ? REDUCED_MOTION_SCALE : 1;
  const parallaxScale = reducedMotion ? 0 : 1;

  useFrame((_, delta) => {
    if (!meshRef.current || !positionsRef.current || !basePositionsRef.current) return;
    timeRef.current += delta * motionScale;
    const t = timeRef.current;

    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3;
      const bx = basePositionsRef.current[i3];
      const by = basePositionsRef.current[i3 + 1];
      const bz = basePositionsRef.current[i3 + 2];

      const driftX = Math.sin(t * FLOAT_SPEED_1 + i * 0.7) * FLOAT_AMPLITUDE_1 + Math.cos(t * FLOAT_SPEED_2 + i * 0.3) * FLOAT_AMPLITUDE_2;
      const driftY = Math.cos(t * FLOAT_SPEED_1 * 0.8 + i * 0.5) * FLOAT_AMPLITUDE_1 + Math.sin(t * FLOAT_SPEED_2 * 0.7 + i * 0.2) * FLOAT_AMPLITUDE_2;
      const driftZ = Math.sin(t * FLOAT_SPEED_1 * 0.6 + i * 0.3) * FLOAT_AMPLITUDE_1 * 0.5 + Math.cos(t * FLOAT_SPEED_2 * 0.5 + i * 0.4) * FLOAT_AMPLITUDE_2 * 0.5;

      let z = bz + driftZ * motionScale;
      z += DRIFT_SPEED * motionScale;

      if (z > Z_FAR) {
        z = Z_NEAR;
        basePositionsRef.current[i3 + 2] = Z_NEAR;
        basePositionsRef.current[i3] = bx + (Math.random() - 0.5) * 0.3;
        basePositionsRef.current[i3 + 1] = by + (Math.random() - 0.5) * 0.3;
      }

      const parallax = (z - Z_MID) * PARALLAX_FACTOR * parallaxScale;
      const x = bx + driftX * motionScale + parallax;
      const y = by + driftY * motionScale + parallax;

      positionsRef.current[i3] = x;
      positionsRef.current[i3 + 1] = y;
      positionsRef.current[i3 + 2] = z;

      const depthT = (z - Z_NEAR) / depthRange;
      const s = SCALE_NEAR + depthT * (SCALE_FAR - SCALE_NEAR);
      scaleVec.set(s, s, s);
      matrix.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion(), scaleVec);
      meshRef.current!.setMatrixAt(i, matrix);

      const opacityFactor = OPACITY_NEAR + depthT * (OPACITY_FAR - OPACITY_NEAR);
      const g = 0.42 * opacityFactor + 0.18;
      color.setRGB(g, g, g + 0.02);
      meshRef.current!.setColorAt(i, color);
    }
    meshRef.current!.instanceMatrix.needsUpdate = true;
    if (meshRef.current!.instanceColor) meshRef.current!.instanceColor.needsUpdate = true;
  });

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 24, 20), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
      }),
    []
  );

  const instanceColorAttr = useMemo(() => {
    const attr = new THREE.InstancedBufferAttribute(new Float32Array(nodeCount * 3), 3);
    const g = 0.38;
    for (let i = 0; i < nodeCount; i++) {
      attr.setXYZ(i, g, g, g + 0.02);
    }
    return attr;
  }, [nodeCount]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, nodeCount]} instanceColor={instanceColorAttr} />
  );
}

function ConnectionUpdater({
  positionsRef,
  connectionsRef,
  nodeCount,
  maxConnections,
  interval,
}: {
  positionsRef: React.MutableRefObject<Float32Array>;
  connectionsRef: React.MutableRefObject<[number, number][]>;
  nodeCount: number;
  maxConnections: number;
  interval: number;
}) {
  const accRef = useRef(0);

  useFrame((_, delta) => {
    accRef.current += delta;
    if (accRef.current < interval) return;
    accRef.current = 0;
    if (!positionsRef.current || positionsRef.current.length < nodeCount * 3) return;
    connectionsRef.current = computeConnections(
      positionsRef.current,
      nodeCount,
      maxConnections,
      CONNECTION_MAX_DISTANCE
    );
  });

  return null;
}

function NeuralEdges({
  positionsRef,
  connectionsRef,
}: {
  positionsRef: React.MutableRefObject<Float32Array>;
  connectionsRef: React.MutableRefObject<[number, number][]>;
  nodeCount: number;
}) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const positionAttribute = useRef<THREE.BufferAttribute | null>(null);

  useFrame(() => {
    if (!lineRef.current || !positionsRef.current || !connectionsRef.current.length) return;
    const conn = connectionsRef.current;
    const pos = positionsRef.current;
    const array = new Float32Array(conn.length * 2 * 3);
    for (let i = 0; i < conn.length; i++) {
      const [a, b] = conn[i];
      array[i * 6] = pos[a * 3];
      array[i * 6 + 1] = pos[a * 3 + 1];
      array[i * 6 + 2] = pos[a * 3 + 2];
      array[i * 6 + 3] = pos[b * 3];
      array[i * 6 + 4] = pos[b * 3 + 1];
      array[i * 6 + 5] = pos[b * 3 + 2];
    }
    const geom = lineRef.current.geometry;
    if (!positionAttribute.current || positionAttribute.current.array.length !== array.length) {
      geom.setAttribute("position", new THREE.BufferAttribute(array, 3));
      positionAttribute.current = geom.attributes.position as THREE.BufferAttribute;
    } else {
      (positionAttribute.current.array as Float32Array).set(array);
      positionAttribute.current.needsUpdate = true;
    }
  });

  const initialPositions = useMemo(() => new Float32Array(6), []);

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={initialPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={0xb8c5e0}
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function InfiniteNeuralScene({
  nodeCount,
  maxConnections,
  recomputeInterval,
  reducedMotion,
  scrollProgressRef,
}: {
  nodeCount: number;
  maxConnections: number;
  recomputeInterval: number;
  reducedMotion: boolean;
  scrollProgressRef: React.MutableRefObject<number>;
}) {
  const positionsRef = useRef<Float32Array>(new Float32Array(nodeCount * 3));
  const basePositionsRef = useRef<Float32Array>(new Float32Array(nodeCount * 3));
  const connectionsRef = useRef<[number, number][]>([]);

  const initialBase = useMemo(() => {
    const arr = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 2 * XY_RANGE;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2 * XY_RANGE;
      arr[i * 3 + 2] = Z_NEAR + Math.random() * (Z_FAR - Z_NEAR);
    }
    return arr;
  }, [nodeCount]);

  useEffect(() => {
    basePositionsRef.current = new Float32Array(initialBase);
    positionsRef.current = new Float32Array(initialBase);
    connectionsRef.current = [];
  }, [nodeCount, initialBase]);

  return (
    <>
      <ScrollCamera scrollProgressRef={scrollProgressRef} reducedMotion={reducedMotion} />
      <InfiniteNeuralNodes
        basePositionsRef={basePositionsRef}
        positionsRef={positionsRef}
        nodeCount={nodeCount}
        reducedMotion={reducedMotion}
      />
      <ConnectionUpdater
        positionsRef={positionsRef}
        connectionsRef={connectionsRef}
        nodeCount={nodeCount}
        maxConnections={maxConnections}
        interval={recomputeInterval}
      />
      <NeuralEdges
        positionsRef={positionsRef}
        connectionsRef={connectionsRef}
        nodeCount={nodeCount}
      />
    </>
  );
}

export interface InfiniteNeuralFieldProps {
  scrollProgress?: number;
  scrollProgressRef?: React.MutableRefObject<number>;
}

export function InfiniteNeuralField({ scrollProgress = 0, scrollProgressRef: scrollProgressRefProp }: InfiniteNeuralFieldProps) {
  const { nodeCount, maxConnections, recomputeInterval } = useNeuralCount();
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const defaultScrollRef = useRef(0);
  const scrollProgressRef = scrollProgressRefProp ?? defaultScrollRef;
  
  // ADICIONE ESTE useEffect:
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    defaultScrollRef.current = scrollProgress;
  }, [scrollProgress]);

  if (!mounted || nodeCount === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] w-full h-full min-h-[300px]"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
      role="img"
      aria-label=""
    >
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        }}
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <color attach="background" args={["transparent"]} />
        <InfiniteNeuralScene
          nodeCount={nodeCount}
          maxConnections={maxConnections}
          recomputeInterval={recomputeInterval}
          reducedMotion={reducedMotion}
          scrollProgressRef={scrollProgressRef}
        />
      </Canvas>
    </div>
  );
}

export function NeuralBackground() {
  return <InfiniteNeuralField />;
}
