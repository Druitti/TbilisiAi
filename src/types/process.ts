export interface ProcessStep {
  stepNumber: string;
  title: string;
  topics: string[];
  /** Font Awesome–style icon name (e.g. "lightbulb", "pen-ruler", "rocket"). Must exist in processStepIcons registry. */
  icon?: string;
  /** CSS color for the icon (e.g. "#7B61FF" or "rgb(123, 97, 255)"). */
  iconColor?: string;
}

export interface ProcessDict {
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}
