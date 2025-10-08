// Import parts data from CSV file
import partsDataCsv from './partsData.csv?raw';

// Parts data structure for PartsView
export interface PartData {
  id: string;
  name: string;
  description: string;
  iconSrc: string;
  priority: 1 | 2 | 3 | 4; // 1 = largest, 4 = smallest
  tags?: string[];
}

// Parse CSV data
function parseCSV(csv: string): PartData[] {
  const lines = csv.trim().split('\n');

  const data: PartData[] = [];
  const seenIds = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line handling quoted fields with commas and escaped quotes
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];

      if (char === '"' && nextChar === '"' && inQuotes) {
        // Escaped quote - add single quote to value
        currentValue += '"';
        j++; // Skip next quote
      } else if (char === '"') {
        // Toggle quote state
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // Field separator
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue); // Push the last value

    const id = values[0];

    // Skip duplicate IDs
    if (seenIds.has(id)) continue;
    seenIds.add(id);

    const priority = parseInt(values[4]) as 1 | 2 | 3 | 4;

    data.push({
      id: id,
      name: values[1],
      description: values[2],
      iconSrc: `/src/assets/images/${values[3]}`,
      priority: priority,
    });
  }

  return data;
}

// Export parts data from CSV with type safety
export const partsData: PartData[] = parseCSV(partsDataCsv);

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
