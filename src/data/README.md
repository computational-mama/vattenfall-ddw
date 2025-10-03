# Parts Data Management

This directory contains the data structure and management utilities for the parts selection system.

## File Structure

- `partsData.ts` - Main data file containing parts definitions and utility functions

## Parts Data Structure

Each part in the system follows this TypeScript interface:

```typescript
interface PartData {
  id: string;              // Unique identifier
  name: string;            // Display name of the part
  description: string;     // Brief description for UI
  iconSrc: string;         // Path to part icon/image
  priority: 1 | 2 | 3 | 4; // Visual priority (1=largest, 4=smallest)
  tags?: string[];         // Optional tags for categorization
}
```

## Priority System

The priority field determines the visual size and prominence of parts in the grid layout:

- **Priority 1**: Largest boxes, most prominent positioning, shows description and tags
- **Priority 2**: Large boxes, shows description, positioned prominently
- **Priority 3**: Medium boxes, shows description
- **Priority 4**: Smallest boxes, name only

## Adding New Parts

To add a new part to the system:

1. Open `src/data/partsData.ts`
2. Add a new object to the `partsData` array:

```typescript
{
  id: "unique-id",
  name: "Part Name",
  description: "Brief description of the part's purpose and characteristics",
  iconSrc: "/src/assets/images/icon-name.png",
  priority: 2, // Choose 1-4 based on importance
  tags: ["Tag1", "Tag2", "Tag3"] // Optional
}
```

## Image Assets

Part icons should be placed in `/src/assets/images/` and referenced with the full path:
- Recommended size: 64x64px to 128x128px
- Format: PNG with transparent background
- Style: Simple, clear iconography that works at small sizes

## Grid Layout

The parts are automatically arranged in a CSS Grid Template Areas layout defined in `/src/assets/css/parts-grid.css`. The current layout supports up to 8 parts with a staggered masonry design.

To modify the grid layout:
1. Update the `grid-template-areas` in `parts-grid.css`
2. Ensure part positioning classes (`.part-1`, `.part-2`, etc.) match the new areas

## Usage in Components

```vue
<script setup>
import { getPartsByPriority, type PartData } from '../data/partsData'

// Get all parts sorted by priority
const sortedParts = computed(() => getPartsByPriority())

// Handle part selection
const selectPart = (part: PartData) => {
  // Your selection logic
}
</script>
```

## Available Functions

- `getPartsByPriority()`: Returns all parts sorted by priority (1 first, 4 last)
- `getPartById(id: string)`: Returns a specific part by its ID
- Access to raw `partsData` array for custom filtering/sorting

## Best Practices

1. **Keep descriptions concise** - They display in limited space
2. **Use consistent icon style** - Maintain visual coherence
3. **Balance priorities** - Don't make everything priority 1
4. **Test on vertical monitors** - Layout is optimized for vertical screens
5. **Limit tags** - Only first 3 tags show for priority 1 parts