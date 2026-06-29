# Kaustuv Pokharel — Portfolio

A premium cinematic personal portfolio website built with pure HTML, CSS, and vanilla JavaScript. No frameworks. No build tools. Open the folder and it works.

---

## Project Structure

```
Portfolio/
├── index.html          ← All the HTML / content
├── style.css           ← All styling (edit here to change look)
├── script.js           ← All interactivity (edit here for behaviour)
└── assets/
    ├── images/         ← General images (portrait, code screenshots)
    ├── videos/         ← Film thumbnails
    ├── icons/          ← Any icon files
    ├── posters/        ← Project posters, design work
    └── photography/    ← Gallery photos
```

---

## Getting Started

1. **Open `index.html`** in your browser — that's it. No server needed.
2. Replace all placeholder content with your real content.
3. Add your images to the `assets/` folders.

---

## How to Customise

### Change your name / text
Open `index.html` and search for placeholder text. Everything is clearly labelled with HTML comments.

### Change colours
Open `style.css` and edit the `:root { }` block at the very top. All colours are CSS variables — changing one value updates the whole site.

```css
:root {
  --color-accent: #c8a97e;   /* ← change this to your accent colour */
  --color-bg:     #0a0a0a;   /* ← main background */
}
```

### Add a project card
In `index.html`, find the `<!-- Project Card -->` comment and copy the entire `<article class="project-card">` block. Update the image path, title, category, and description.

### Set up the contact form
1. Sign up at [formspree.io](https://formspree.io) (free plan works fine)
2. Create a new form and copy the endpoint URL
3. In `index.html`, find the `<form>` tag and replace `YOUR_FORM_ID` in the `action` attribute

### Add photos to the gallery
Drop images into `assets/photography/` and update the `src` attributes in the `#photography` section of `index.html`.

---

## Libraries Used

| Library | Version | Purpose |
|---------|---------|---------|
| GSAP | 3.12.5 | Scroll-triggered animations |
| Lenis | 1.0.42 | Smooth scrolling |

Both are loaded from CDN links in `index.html`. No npm, no build step.

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). The custom cursor and particle canvas gracefully degrade on mobile.

---

## Performance Tips

- Compress your images before adding them (use [Squoosh](https://squoosh.app))
- All images already use `loading="lazy"` so they only load when needed
- The particle canvas is automatically reduced on mobile

---

Made with obsessive attention to detail · Kathmandu, Nepal
