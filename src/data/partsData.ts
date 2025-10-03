// Parts data structure for PartsView
export interface PartData {
  id: string;
  name: string;
  description: string;
  iconSrc: string;
  priority: 1 | 2 | 3 | 4; // 1 = largest, 4 = smallest
  tags?: string[];
}

export const partsData: PartData[] = [
  {
    id: "turbine-blade",
    name: "Turbine Blade",
    description:
      "Aerodynamic fiberglass composite blades designed to capture wind energy efficiently",
    iconSrc: "/src/assets/images/icon-connection.png",
    priority: 1, // Largest box
    tags: ["Fiberglass", "Aerodynamic", "50-80m Length"],
  },
  {
    id: "nacelle",
    name: "Nacelle",
    description: "Weather-resistant housing containing gearbox, generator, and control systems",
    iconSrc: "/src/assets/images/icon-plant.png",
    priority: 2, // Largest box
    tags: ["Housing", "Gearbox", "Generator"],
  },
  {
    id: "rotor-hub",
    name: "Rotor Hub",
    description: "Cast iron hub connecting three blades to the main shaft assembly",
    iconSrc: "/src/assets/images/icon-connection.png",
    priority: 3, // Medium-large box
    tags: ["Cast Iron", "Central Hub", "Rotating"],
  },
  {
    id: "tower",
    name: "Tower",
    description: "Steel tubular structure supporting the entire turbine at optimal height",
    iconSrc: "/src/assets/images/icon-plant.png",
    priority: 3, // Medium-large box
    tags: ["Steel", "Tubular", "80-120m Height"],
  },
  {
    id: "gearbox",
    name: "Gearbox",
    description:
      "High-precision transmission system converting slow blade rotation to generator speed",
    iconSrc: "/src/assets/images/icon-connection.png",
    priority: 4, // Medium box
    tags: ["Transmission", "Precision", "Speed Conversion"],
  },
  {
    id: "generator",
    name: "Generator",
    description: "Electrical generator converting mechanical rotation into clean electricity",
    iconSrc: "/src/assets/images/icon-plant.png",
    priority: 1, // Medium box
    tags: ["Electrical", "Clean Energy", "Conversion"],
  },
  {
    id: "foundation",
    name: "Foundation",
    description: "Reinforced concrete foundation anchoring the turbine to bedrock",
    iconSrc: "/src/assets/images/icon-connection.png",
    priority: 4, // Small box
    tags: ["Concrete", "Reinforced", "Underground"],
  },
  {
    id: "control-system",
    name: "Control System",
    description: "Advanced computerized system managing turbine operations and safety",
    iconSrc: "/src/assets/images/icon-plant.png",
    priority: 4, // Small box
    tags: ["Computer", "Safety", "Automation"],
  },
];

// Grid layout configurations based on priority
export const gridConfigurations = {
  // Configuration for 8 parts with different priorities
  default: {
    gridAreas: `
      "part1    part1    part2     part2     part2"
      "part1    part1    part2     part2     part2"
      "part1    part1    part2     part2     part2"
      "part3    part3    part4     part4     part4"
      "part3    part3    part4     part4     part4"
      "part5    part5    part6     part6     part6"
      "part5    part5    part6     part6     part6"
      "part7    part7    part8     part8     part8"
      "part7    part7    part8     part8     part8"
      ".        .        .         .         ."
      ".        .        .         .         ."
      ".        .        .         .         ."
    `,
    areaClasses: {
      part1: "priority-1", // 2x3 - largest
      part2: "priority-1", // 3x3 - largest
      part3: "priority-2", // 2x2 - medium-large
      part4: "priority-2", // 3x2 - medium-large
      part5: "priority-3", // 2x2 - medium
      part6: "priority-3", // 3x2 - medium
      part7: "priority-4", // 2x1 - small
      part8: "priority-4", // 3x1 - small
    },
  },
};

// Priority-based sizing classes
export const priorityClasses = {
  1: "priority-1", // Largest - spans 2x3 or 3x3
  2: "priority-2", // Medium-large - spans 2x2 or 3x2
  3: "priority-3", // Medium - spans 2x2 or 3x2
  4: "priority-4", // Small - spans 2x1 or 3x1
};

// Helper function to get grid area name for a part index
export const getGridAreaName = (index: number): string => {
  return `part${index + 1}`;
};

// Helper function to get parts sorted by priority (1 = highest priority first)
export const getPartsByPriority = (): PartData[] => {
  return [...partsData].sort((a, b) => a.priority - b.priority);
};
