# @wrikka/animation

> 🚀 Fast, lightweight JavaScript animation library with Clean Architecture

A modern animation library built with TypeScript and Clean Architecture principles, providing framework-agnostic core animation capabilities with dedicated Solid.js adapter.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-ff69b4.svg)](https://bun.sh/)
[![Biome](https://img.shields.io/badge/Biome-2.5-60a5fa.svg)](https://biomejs.dev/)

## Features

| Icon | Feature | Description | Benefit |
|------|---------|-------------|---------|
| 🎬 | Core Animation Engine | Powerful animation and timeline entities with full control methods | Create complex animations with simple, intuitive API |
| 🎨 | Graphics & Visual Effects | Lottie animations, WebGL shaders, 3D transforms, video export, and kinetic typography | Create stunning visual effects with GPU acceleration |
| 🤖 | AI-Powered Tools | AI animation generator and reverse engineering for motion analysis | Generate animations automatically and analyze existing motion patterns |
| 📊 | Advanced Animation Tools | Timeline editor, animation inspector, animation chains, and advanced stagger effects | Build complex animation systems with professional-grade tools |
| ⚡ | High Performance | Built with Bun runtime and tsdown bundler for optimal performance | Fast execution and minimal bundle size |
| 🔄 | Advanced Easing | 13 built-in easing functions with custom registration support | Smooth, natural-feeling animations for any use case |
| 🌊 | Stagger Effects | Grid-based stagger with direction and axis control | Create beautiful sequential animations for lists and grids |
| 📜 | Scroll Observer | Scroll-triggered animations with threshold detection | Engage users with scroll-based storytelling |
| 🎯 | Draggable Elements | Draggable elements with snap, inertia, and bounds | Build interactive interfaces with drag functionality |
| ✂️ | Text Splitting | Split text into characters, words, or lines for animation | Create kinetic typography and text effects |
| 🎭 | SVG Animation | SVG morph, draw, and motion path animations | Animate SVG graphics with precision |
| 🖼️ | Canvas Drawing | Canvas drawing methods for 2D graphics | Create custom canvas animations |
| 🎵 | Audio Reactive | Beat detection and frequency-based animations | Synchronize animations with audio input |
| 🎪 | 3D Transforms | Full 3D transform support with perspective | Create immersive 3D animations |
| 📊 | Performance Profiling | Built-in performance monitoring and metrics | Optimize animations with real-time insights |
| 📱 | Responsive Animations | Breakpoint-based animation properties | Adapt animations to different screen sizes |
| 🔍 | Animation Inspector | Visual debugging and animation state inspection | Debug animations with visual feedback |
| 🎮 | WebGL Renderer | WebGL shader support for GPU-accelerated graphics | Create high-performance GPU animations |
| 🔗 | GSAP Compatibility | GSAP-like API for easy migration | Seamlessly migrate from GSAP projects |

## Quick Start

1. **Install the package**

```bash
bun add @wrikka/animation
```

2. **Import and use**

```typescript
import { animate, stagger } from "@wrikka/animation";

// Basic animation
animate(".box", { x: 250, rotate: "1turn" }, { duration: 800 });

// Staggered animation
animate(".item", { opacity: 1, y: 0 }, {
  delay: stagger(100, { from: "first" })
});
```

**Modular imports for smaller bundles:**

```typescript
// Core API (15.34 kB gzipped)
import { animate, stagger } from "@wrikka/animation";

// Graphics features (17.13 kB gzipped)
import { useTransform3D } from "@wrikka/animation/graphics";

// Advanced features (9.12 kB gzipped)
import { useAnimationChain } from "@wrikka/animation/advanced";

// AI tools (5.12 kB gzipped)
import { useAIAnimationGenerator } from "@wrikka/animation/ai-tools";
```

3. **Use with Solid.js**

```typescript
// Solid.js
import { useAnimation } from "@wrikka/animation/solid";
```

## Usage

### Basic Animation

```typescript
import { animate } from "@wrikka/animation";

// Animate CSS properties
animate(".element", {
  x: 100,
  y: 50,
  rotate: "90deg",
  scale: 1.5,
  opacity: 0.8
}, {
  duration: 1000,
  delay: 200,
  easing: "easeOutQuad",
  onComplete: () => console.log("Animation complete")
});
```


### Timeline Sequencing

```typescript
import { createTimeline } from "@wrikka/animation";

const timeline = createTimeline();

timeline
  .add(animate(".box1", { x: 100 }, { duration: 500 }))
  .add(animate(".box2", { y: 100 }, { duration: 500 }), 200)
  .add(animate(".box3", { scale: 1.5 }, { duration: 500 }), 400);

timeline.play();
```


### Stagger Effects

```typescript
import { animate, stagger } from "@wrikka/animation";

// Grid stagger
animate(".grid-item", { opacity: 1, scale: 1 }, {
  delay: stagger(50, {
    from: "center",
    grid: [3, 4],
    axis: "x"
  })
});

// Directional stagger
animate(".list-item", { x: 0, opacity: 1 }, {
  delay: stagger(100, {
    from: "last",
    direction: "reverse"
  })
});
```


### Scroll Observer

```typescript
import { onScroll } from "@wrikka/animation";

const observer = onScroll(".section", {
  threshold: 0.5,
  onEnter: (element) => {
    animate(element, { y: 0, opacity: 1 }, { duration: 600 });
  },
  onLeave: (element) => {
    animate(element, { y: 50, opacity: 0 }, { duration: 600 });
  }
});
```


### Draggable Elements

```typescript
import { createDraggable } from "@wrikka/animation";

const draggable = createDraggable(".draggable", {
  snap: 50,
  inertia: true,
  bounds: { left: 0, right: 500, top: 0, bottom: 500 }
});

draggable.on("drag", (position) => {
  console.log("Position:", position);
});
```


### Text Splitting

```typescript
import { splitText, animate } from "@wrikka/animation";

// Split text into characters
const chars = splitText(".text", {
  type: "chars",
  tag: "span",
  className: "char"
});

// Animate each character
animate(chars, { opacity: 1, y: 0 }, {
  delay: stagger(30, { from: "first" })
});
```


### Solid.js Integration

```typescript
import { useAnimation, useTimeline, useStagger } from "@wrikka/animation/solid";

function MyComponent() {
  const { animation, isPlaying, play, pause } = useAnimation(
    ".box",
    { x: 250, rotate: "1turn" },
    { duration: 800 }
  );

  const timeline = useTimeline();
  const staggerFn = useStagger(100, { from: "first" });

  return (
    <div>
      <div class="box">Animate me</div>
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </div>
  );
}
```


### Graphics & Visual Effects

```typescript
import { createLottieAnimation, createWebGLRenderer, createTransform3D } from "@wrikka/animation";

// Lottie animation
const lottie = createLottieAnimation({
  container: ".lottie-container",
  path: "/animation.json",
  autoplay: true,
  loop: true
});

// WebGL renderer
const renderer = createWebGLRenderer({
  canvas: ".webgl-canvas",
  shaders: [vertexShader, fragmentShader]
});

// 3D transforms
const transform3D = createTransform3D(
  ".element",
  { rotateX: "45deg", rotateY: "45deg", translateZ: 100 },
  { perspective: 1000 }
);
```


### AI-Powered Tools

```typescript
import { createAIAnimationGenerator, createReverseEngineering } from "@wrikka/animation";

// AI animation generator
const aiGenerator = createAIAnimationGenerator({
  prompt: "Create a smooth fade-in animation",
  target: ".element",
  style: "elegant"
});

const animation = aiGenerator.generate();

// Reverse engineering
const reverseEng = createReverseEngineering({
  target: ".animated-element",
  analyzeProperties: true
});

const analysis = reverseEng.analyze();
console.log("Animation properties:", analysis.properties);
```


### Advanced Animation Tools

```typescript
import { createAnimationChain, createAnimationInspector, createTimelineEditor } from "@wrikka/animation";

// Animation chain
const chain = createAnimationChain([
  { target: ".box1", properties: { x: 100 }, options: { duration: 500 } },
  { target: ".box2", properties: { y: 100 }, options: { duration: 500 } },
  { target: ".box3", properties: { scale: 1.5 }, options: { duration: 500 } }
]);

chain.play();

// Animation inspector
const inspector = createAnimationInspector({
  showOverlay: true,
  showTimeline: true
});

inspector.inspect(".animated-element");

// Timeline editor
const editor = createTimelineEditor({
  container: ".timeline-editor",
  interactive: true
});

editor.loadTimeline(timeline);
```

## License

This project is licensed under the MIT License, allowing for commercial use, distribution, modification, and private use with proper attribution.

This project is licensed under the <a href="https://choosealicense.com/licenses/mit/" target="_blank" rel="noopener noreferrer">MIT License</a>.

- ✓ Commercial use, Distribution, Modification, Private use
- ⓘ License and copyright notice
- ✕ Liability, Warranty
