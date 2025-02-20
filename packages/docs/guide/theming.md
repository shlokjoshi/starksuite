# BlockSuite Theming System

This guide explains BlockSuite's theming system architecture and how to modify it.

## Overview

BlockSuite uses a CSS variable-based theming system with Shadow DOM encapsulation. The system enables consistent styling across blocks while supporting theme customization and efficient updates.

## Theme Architecture

### CSS Variable System

BlockSuite uses CSS custom properties for theming, with core variables prefixed with `--affine-`. Key variable categories include:

```css
/* Colors */
--affine-text-primary-color
--affine-background-primary-color
--affine-border-color

/* Typography */
--affine-font-family
--affine-font-base
--affine-line-height

/* Spacing */
--affine-editor-width
--affine-paragraph-space

/* Effects */
--affine-shadow-2
--affine-hover-color
```

### Theme Configuration

Themes are applied using the `data-app-theme` attribute at the root level:

```css
[data-app-theme='light'] {
  --paper-border-color: var(--affine-pure-white);
  --paper-foriegn-color: rgba(0, 0, 0, 0.1);
  --paper-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
}

[data-app-theme='dark'] {
  --paper-border-color: var(--affine-divider-color);
  --paper-foriegn-color: rgba(255, 255, 255, 0.12);
  --paper-shadow: 0px 2px 6px rgba(0, 0, 0, 0.8);
}
```

### Component-Level Styling

Components use lit-element's static styles and Shadow DOM for style encapsulation:

```typescript
static override styles = css`
  :host {
    display: block;
    height: 100%;
  }

  .my-class {
    color: var(--affine-text-primary-color);
    background: var(--affine-background-primary-color);
  }
`;
```

## Making Theme Changes

### Adding New Variables

1. Define the variable in the root theme
2. Add values for both light and dark themes
3. Document in theme schema
4. Update components to use the new variable

### Modifying Existing Variables

1. Identify where the variable is used
2. Update values in theme definitions
3. Test across all components
4. Verify dark/light mode compatibility

## Theme Extension Points

### Creating New Themes

1. Define theme configuration
2. Create CSS variable set
3. Add theme switching logic
4. Test component compatibility

### Adding Custom Properties

1. Add new CSS variables
2. Document in theme schema
3. Update components
4. Add to theme switcher

## Best Practices

### Variable Naming

- Use `--affine-` prefix
- Use descriptive names
- Follow existing patterns
- Document purpose

### Component Styling

- Use Shadow DOM
- Inherit theme variables
- Handle state changes
- Test all themes

### Testing Changes

- Verify light/dark modes
- Check component states
- Test responsive behavior
- Validate accessibility

## Common Pitfalls

- Hardcoding colors/values instead of using variables
- Missing dark mode variable definitions
- Incomplete state handling in components
- Poor performance due to complex selectors
- Inconsistent variable naming

## Performance Considerations

- Minimize CSS complexity
- Use efficient selectors
- Optimize transitions
- Cache computed styles
- Reduce repaints

## Examples

### State-Based Styling

```typescript
// Selected state
.block-selected {
  background: var(--affine-hover-color);
}

// Interactive states
:host(:hover) {
  border-color: var(--affine-border-color);
}
```

### Theme Switching

```typescript
// Apply theme
document.documentElement.setAttribute('data-app-theme', 'dark');

// Remove theme
document.documentElement.removeAttribute('data-app-theme');
```

## Conclusion

BlockSuite's theming system provides a robust foundation for consistent styling while enabling customization. By following these guidelines, you can maintain and extend the system effectively while ensuring performance and compatibility.
