// Import parts data from JSON file
import partsDataJson from './partsData.json';

// Parts data structure for PartsView
export interface PartData {
  id: string;
  name: string;
  description: string;
  iconSrc: string;
  priority: 1 | 2 | 3 | 4; // 1 = largest, 4 = smallest
  tags?: string[];
}

// Export parts data from JSON with type safety
export const partsData: PartData[] = partsDataJson as PartData[];

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
