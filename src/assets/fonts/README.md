# Vattenfall Fonts Integration

This directory contains the custom Vattenfall brand fonts and their integration with the Tailwind CSS system.

## Available Font Files

This directory contains the complete Vattenfall font family with multiple weights and styles:

### VattenfallHallDisplay (Display Font)
- `VattenfallHallDisplay-Bold.woff2` ✅ **Currently Used**
- Usage: Page titles, large headings (h1, h2)
- Weight: Bold (600)
- Class: `font-vattenfall-display`

### VattenfallHall (Body Font Family)
- `VattenfallHall-Light.woff2` ✅ Available
- `VattenfallHall-Regular.woff2` ✅ **Currently Used**
- `VattenfallHall-Medium.woff2` ✅ Available
- `VattenfallHall-Bold.woff2` ✅ Available
- `VattenfallHall-Heavy.woff2` ✅ Available

All fonts include italic variants and legacy formats (woff, eot) for broader browser support.

## Current Implementation

### Font Face Declarations
Located in `vattenfall-fonts.css`:
```css
@font-face {
  font-family: 'VattenfallHallDisplay';
  src: url('./VattenfallHallDisplay-Bold.woff2') format('woff2');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'VattenfallHall';
  src: url('./VattenfallHall-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### Tailwind Integration
```css
@theme {
  --font-vattenfall-display: "VattenfallHallDisplay", sans-serif;
  --font-vattenfall: "VattenfallHall", sans-serif;
}
```

## Usage in Components

### Vue Templates
```vue
<template>
  <!-- Page titles -->
  <h1 class="font-vattenfall-display text-[56px] font-bold">
    Choose a part to get started
  </h1>

  <!-- Body text -->
  <p class="font-vattenfall text-lg text-gray-600">
    Part description and details
  </p>

  <!-- Button text -->
  <button class="font-vattenfall font-medium">
    Submit
  </button>
</template>
```

### Direct CSS Application
```css
.vattenbot-title {
  font-family: 'VattenfallHall', sans-serif;
  font-weight: 600;
}

.idea-generation-grid h1,
.idea-generation-grid h2,
.idea-generation-grid h3 {
  font-family: 'VattenfallHall', sans-serif;
}
```

## Font Weight Mapping

| Font File | Weight | Tailwind Class | Usage |
|-----------|---------|----------------|--------|
| VattenfallHallDisplay-Bold | 600 | `font-vattenfall-display` | Page titles, major headings |
| VattenfallHall-Light | 300 | `font-vattenfall font-light` | Light emphasis text |
| VattenfallHall-Regular | 400 | `font-vattenfall` | Body text, UI elements |
| VattenfallHall-Medium | 500 | `font-vattenfall font-medium` | Button text, emphasis |
| VattenfallHall-Bold | 700 | `font-vattenfall font-bold` | Strong emphasis |
| VattenfallHall-Heavy | 800 | `font-vattenfall font-extrabold` | Heavy emphasis |

## Expanding Font Support

To add more font weights to the current implementation:

1. **Update `vattenfall-fonts.css`:**
```css
@font-face {
  font-family: 'VattenfallHall';
  src: url('./VattenfallHall-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

2. **Use in components:**
```vue
<p class="font-vattenfall font-medium">Medium weight text</p>
```

## Performance Optimization

- **Current**: Only 2 font files loaded (~65KB total)
- **WOFF2 format**: Modern compression for faster loading
- **font-display: swap**: Text visible during font load
- **Strategic loading**: Only essential weights loaded

## Brand Guidelines Compliance

### Typography Hierarchy
1. **Page Titles**: VattenfallHallDisplay Bold, 56px
2. **Section Headings**: VattenfallHall Regular/Medium, 24-32px
3. **Body Text**: VattenfallHall Regular, 16-18px
4. **UI Elements**: VattenfallHall Regular, 14-16px

### Color Pairing
- **Primary Text**: `#1d1d1d` (dark gray)
- **Secondary Text**: `#696977` (medium gray)
- **Brand Blue**: `#196db9` (Vattenfall blue)
- **Accent**: `#3752a4` (secondary blue)

## Browser Support

- **Modern browsers**: Full WOFF2 support
- **Legacy support**: WOFF and EOT files available
- **Fallback**: Sans-serif system fonts
- **Progressive enhancement**: font-display: swap

## Integration Checklist

- [x] Font files available in directory
- [x] `vattenfall-fonts.css` configured
- [x] Tailwind theme integration complete
- [x] Components using font classes
- [x] Fallback fonts specified
- [x] Performance optimized (selective loading)