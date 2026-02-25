import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faLightbulb,
  faPenRuler,
  faRocket,
  faPencil,
  faCompassDrafting,
  faMagnifyingGlass,
  faWrench,
  faHeadset,
  faChartLine,
  faGears,
  
} from "@fortawesome/free-solid-svg-icons";

/**
 * Registry of Font Awesome icon names (as used in JSON) to icon definitions.
 * Add more entries here to use more icons in process steps.
 * Use kebab-case keys matching Font Awesome icon names (e.g. "pen-ruler", "lightbulb").
 */
export const processStepIconRegistry: Record<string, IconDefinition> = {
  "lightbulb": faLightbulb,
  "pen-ruler": faPenRuler,
  "pencil-ruler": faPenRuler,
  "rocket": faRocket,
  "pencil": faPencil,
  "compass-drafting": faCompassDrafting,
  "magnifying-glass": faMagnifyingGlass,
  "wrench": faWrench,
  "headset": faHeadset,
  "chart-line": faChartLine,
  "gears": faGears,
};

export function getProcessStepIcon(name: string | undefined): IconDefinition | null {
  if (!name || typeof name !== "string") return null;
  const key = name.trim().toLowerCase().replace(/\s+/g, "-");
  return processStepIconRegistry[key] ?? null;
}
