# Border Customization Guide

This guide explains how to edit and customize all borders across your Star Wars frontend application.

## Files Created

1. **`src/styles/border-themes.css`** - Contains CSS variables for easy theme switching
2. **`src/styles/custom-borders.css`** - Contains all border styles and overrides
3. **`src/main.jsx`** - Updated to import the CSS files

##  Quick Theme Changes

To change the entire border theme, edit `src/styles/border-themes.css`:

### Method 1: Edit CSS Variables

```css
:root {
  --primary-border-color: #your-color; /* Main border color */
  --accent-border-color: #your-color; /* Hover/focus color */
  --normal-border: 2px; /* Border thickness */
  --normal-radius: 8px; /* Border roundness */
}
```

### Method 2: Use Predefined Themes

Uncomment one of the theme blocks in `border-themes.css`:

- **Classic Gold** (default) - Star Wars gold theme
- **Imperial Red** - Dark side Sith theme
- **Rebel Blue** - Light side theme
- **Jedi Green** - Nature/Jedi theme
- **Sith Purple** - Royal/mystical theme
- **Minimalist White** - Clean modern theme

## 🛠️ Customization Options

### Border Colors

```css
--primary-border-color: #ffd700; /* Main borders */
--accent-border-color: #ffed4a; /* Hover states */
--error-border-color: #ff6b6b; /* Error states */
--success-border-color: #28a745; /* Success states */
```

### Border Widths

```css
--thin-border: 1px; /* Thin borders */
--normal-border: 2px; /* Standard borders */
--thick-border: 3px; /* Thick borders */
--extra-thick-border: 4px; /* Extra thick borders */
```

### Border Radius

```css
--small-radius: 5px; /* Slightly rounded */
--normal-radius: 8px; /* Standard roundness */
--large-radius: 15px; /* More rounded */
--xl-radius: 25px; /* Very rounded */
```

##  Special Border Classes

You can add these classes to any element:

### Basic Borders

- `.border-gold` - Gold border
- `.border-gold-thick` - Thick gold border
- `.border-gold-thin` - Thin gold border

### Themed Borders

- `.border-sith` - Red Sith border
- `.border-jedi` - Blue Jedi border

### Rounded Borders

- `.border-rounded` - Large rounded corners
- `.border-rounded-lg` - Extra large rounded corners
- `.border-rounded-xl` - Maximum rounded corners

### Special Effects

- `.border-glow` - Animated glowing border
- `.border-lightsaber` - Green lightsaber effect with enhanced neon beams
- `.border-lightsaber-blue` - Blue lightsaber effect with enhanced neon beams
- `.border-lightsaber-red` - Red lightsaber effect with enhanced neon beams
- `.border-neon` - Neon beam light effect
- `.border-neon-intense` - Intense neon beam with multiple layers
- `.border-neon-pulse` - Pulsing neon effect
- `.border-scanner` - Scanning beam effect across border
- `.border-tube` - Neon tube effect with gradient

##  Elements Affected

The CSS automatically styles these elements:

- All Bootstrap border utilities (`.border`, `.border-light`, etc.)
- Cards (`.card`)
- Form controls (`.form-control`)
- Buttons (`.btn`)
- Navigation bar (`.navbar`)
- Alerts (`.alert`)
- Images (`img`)

##  Responsive Design

Borders automatically adjust on mobile devices:

- Thinner borders on screens smaller than 768px
- Maintains visual hierarchy on all devices

##  Usage Examples

### In JSX Components

```jsx
// Regular card with custom border
<div className="card border-glow">

// Button with lightsaber effect
<button className="btn btn-primary border-lightsaber-blue">

// Form with Jedi theme
<input className="form-control border-jedi" />
```

### Quick Color Changes

To change from gold to blue theme, edit `border-themes.css`:

```css
:root {
  --primary-border-color: #2563eb; /* Blue */
  --accent-border-color: #3b82f6; /* Light blue */
  --glow-color: rgba(37, 99, 235, 0.5);
}
```

##  Advanced Customization

### Add New Border Styles

Add to `custom-borders.css`:

```css
.border-custom {
  border: 3px dashed #purple !important;
  border-radius: 50% !important;
}
```

### Override Specific Components

```css
.navbar {
  border-bottom: 5px solid #rainbow !important;
}
```

## Tips

1. **Test Changes**: Restart your dev server after editing CSS files
2. **Use Variables**: Always use CSS variables for consistency
3. **Mobile First**: Test border changes on mobile devices
4. **Performance**: Use `!important` sparingly, only when overriding Bootstrap
5. **Theme Switching**: Comment/uncomment theme blocks for quick changes

## Live Preview

Your changes will be visible immediately on:

- Login forms
- Navigation bar
- Character/planet/vehicle cards
- Buttons and form inputs
- All interactive elements

## Neon Beam Effects Guide

### Automatic Neon Effects

All borders now have built-in neon beam lighting with multiple glow layers:

- **Inner glow**: Bright core light
- **Middle glow**: Medium intensity spread
- **Outer glow**: Soft diffuse light

### Special Neon Classes

```jsx
// Basic neon effect
<div className="card border-neon">

// Intense multi-layer neon
<div className="card border-neon-intense">

// Pulsing neon animation
<button className="btn border-neon-pulse">

// Scanning beam effect
<div className="card border-scanner">

// Neon tube effect
<div className="navbar border-tube">
```

### Customizing Neon Intensity

Edit the neon variables in `border-themes.css`:

```css
:root {
  --neon-glow-inner: rgba(220, 38, 38, 0.9); /* More intense inner glow */
  --neon-glow-middle: rgba(220, 38, 38, 0.6); /* Stronger middle layer */
  --neon-glow-outer: rgba(220, 38, 38, 0.3); /* Wider outer glow */
  --neon-beam-size: 30px; /* Larger beam spread */
}
```

### Performance Note

Neon effects use CSS `box-shadow` with multiple layers. For better performance on mobile devices, the effects automatically scale down on smaller screens.

May the Force be with your borders! 
