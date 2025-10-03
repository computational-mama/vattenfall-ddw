# CSS Grid Systems

This directory contains custom CSS grid layouts optimized for vertical monitors and the Vattenfall Supply Chain application.

## File Overview

- `parts-grid.css` - Dynamic grid layout for parts selection page
- `idea-generation-grid.css` - Vertical-optimized layout for idea generation interface

## Parts Grid System (`parts-grid.css`)

### Layout Concept
A 5x12 CSS Grid using Template Areas to create a staggered masonry-style layout that accommodates different part priorities.

### Grid Structure
```css
grid-template-columns: repeat(5, 1fr);
grid-template-rows: repeat(12, 1fr);
```

### Template Areas Layout
```
part1    part1    part2     part2     part2
part1    part1    part2     part2     part2
part3    part3    part2     part2     part2
part3    part3    part4     part4     part4
part5    part5    part4     part4     part4
part5    part5    part4     part4     part4
part6    part6    part6     part7     part7
part6    part6    part6     part7     part7
part6    part6    part6     part8     part8
part6    part6    part6     part8     part8
.        .        .         .         .
.        .        .         .         .
```

### Priority-Based Styling
- **Priority 1**: Largest areas (part1), full styling with borders
- **Priority 2**: Large areas (part2), medium styling
- **Priority 3**: Medium areas (part3, part5), reduced styling
- **Priority 4**: Small areas (part7, part8), minimal styling

### Usage in Vue Components
```vue
<div class="parts-grid" data-layout="default">
  <div class="part-1 priority-1"><!-- Content --></div>
  <div class="part-2 priority-2"><!-- Content --></div>
  <!-- ... -->
</div>
```

### Customizing the Layout
To modify the grid arrangement:
1. Update `grid-template-areas` in the `.parts-grid[data-layout="default"]` rule
2. Ensure part classes (`.part-1`, `.part-2`, etc.) match your new areas
3. Test on vertical monitors for optimal spacing

### Responsive Breakpoints
- **Max height 900px**: Reduced gap and height
- **Min height 1200px**: Increased gap and height

## Idea Generation Grid System (`idea-generation-grid.css`)

### Layout Concept
A 1-column grid with 3 rows optimized for vertical monitor usage, ensuring content stays above the fixed footer.

### Grid Structure
```css
grid-template-columns: 1fr;
grid-template-rows: auto auto 1fr;
```

### Template Areas
```
vattenbot    (Auto height - header section)
part-info    (Auto height - part information)
chat-area    (Flexible - fills remaining space)
```

### Key Features
- **Fixed height calculation**: `height: calc(100vh - 280px)` prevents overflow
- **Chat area flexibility**: Uses `1fr` to fill remaining vertical space
- **Footer clearance**: Padding-bottom ensures content doesn't overlap fixed footer

### Component Integration
```vue
<div class="idea-generation-grid">
  <div class="vattenbot-header"><!-- Header content --></div>
  <div class="part-information"><!-- Part details --></div>
  <div class="chat-interface"><!-- Chat UI --></div>
</div>
```

### Vertical Monitor Optimization
- Optimized for 1440x2560 and similar vertical resolutions
- Efficient use of vertical space
- Proper scaling for different screen heights

### Responsive Adjustments
- **Min height 1200px**: Larger gaps and increased footer clearance
- **Max height 900px**: Compressed layout with reduced spacing

## Best Practices

### Grid Maintenance
1. **Template Areas**: Use semantic names that match component purposes
2. **Responsive Design**: Test all layouts on target vertical monitor sizes
3. **Gap Consistency**: Maintain consistent gap sizes across breakpoints
4. **Footer Clearance**: Always account for fixed footer height in calculations

### Performance Considerations
- Grid layouts are hardware-accelerated
- Template areas provide better maintainability than manual positioning
- Responsive breakpoints minimize layout shifts

### Development Workflow
1. Design layout in CSS Grid Template Areas
2. Create corresponding classes for each area
3. Test on vertical monitors (1440x2560 recommended)
4. Adjust responsive breakpoints as needed
5. Validate footer positioning and overflow prevention

## Common Issues & Solutions

### Overflow Problems
- **Issue**: Content extending behind fixed footer
- **Solution**: Use `height` instead of `min-height` and add proper padding-bottom

### Grid Area Misalignment
- **Issue**: Parts not appearing in expected positions
- **Solution**: Verify class names match template area names exactly

### Responsive Scaling
- **Issue**: Layout breaking on different screen sizes
- **Solution**: Test and adjust media query breakpoints, especially for vertical monitors

## Future Modifications

To add more parts to the grid:
1. Extend the `grid-template-areas` to include new areas (part9, part10, etc.)
2. Add corresponding CSS classes
3. Update the parts data structure accordingly
4. Test the new layout on vertical monitors