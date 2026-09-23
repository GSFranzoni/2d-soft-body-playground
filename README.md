# 2D Soft Body Playground

[![Live demo](https://img.shields.io/badge/live%20demo-open-a855f7?logo=github)](https://gsfranzoni.github.io/2d-soft-body-playground/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.4-000?logo=bun&logoColor=white)](https://bun.sh/)

[Open the live demo →](https://gsfranzoni.github.io/2d-soft-body-playground/)

An interactive 2D soft-body physics playground built with React, Canvas 2D, and TypeScript. Select a body, watch its particle-and-spring system react to gravity and collisions, and switch between a clean surface view and the underlying physics representation.

## Controls

- **DEBUG** — toggles between smooth filled bodies and the particles/springs that drive them.
- **Body picker** — choose a **Blob** or **Grid**. Selecting one creates a fresh simulation.
- **Reset** — recreates the current body from its initial state.

The particle badge shows the number of physics particles in the active scene.

## Simulation

Each scene contains a physics `World` and rendering metadata for its soft bodies:

```text
Scene
├── World
│   ├── particles
│   └── springs
└── bodies
    └── ordered perimeter-particle references
```

`World` owns only the entities that participate in physics. It applies gravity and spring forces, integrates particles, resolves world-boundary collisions, and resolves particle-particle collisions. The body metadata references the same particles, so the renderer always reads the current simulated positions without duplicating state.

### Bodies

- **Blob** — perimeter particles are linked in a loop and connected to a center particle with radial springs.
- **Grid** — particles are connected by structural and shear springs. Its outer particles form the rendered perimeter.

In normal mode, the renderer traces a closed curve through the midpoints between ordered perimeter particles. Quadratic Canvas 2D curves give the visible surface a rounded shape while keeping internal particles out of the outline. In Debug mode, every spring and particle is rendered directly.

Physics stays in meters and seconds. `PIXELS_PER_METER` is used only at the Canvas boundary to convert between simulation coordinates and drawing coordinates.

## Tech stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- Canvas 2D
- Lucide React
- Bun

## Getting started

Requires [Bun](https://bun.sh/) 1.4 or newer.

```bash
bun install
bun run dev
```

Open the Vite URL printed in the terminal, usually [`http://localhost:5173`](http://localhost:5173).

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server. |
| `bun run build` | Type-check and create a production build. |
| `bun run preview` | Preview the production build locally. |
| `bun run lint` | Run Oxlint. |
| `bun run lint:fix` | Apply available lint fixes. |
| `bun run fmt` | Format files with Oxfmt. |
| `bun run fmt:check` | Check formatting without modifying files. |

## Project structure

```text
src
├── components
│   └── canvas.tsx       Animation loop and Canvas boundary
├── core
│   ├── collision.ts     Particle and world-boundary collision resolution
│   ├── factory.ts       Blob and grid construction
│   ├── particle.ts      Particle state and integration
│   ├── renderer.ts      Debug and smooth-surface Canvas rendering
│   ├── spring.ts        Spring-damper force calculation
│   ├── vector2.ts       2D vector math
│   └── world.ts         Physics-world update loop
├── hooks
│   └── use-animation-frame.ts
├── app.tsx              Scene setup and simulation toolbar
└── index.css            Design tokens and Tailwind theme mapping
```

## Support

If you enjoyed this physics experiment, you can support its creator here:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?logo=buymeacoffee&logoColor=000)](https://buymeacoffee.com/gsfranzoni)

<a href="https://buymeacoffee.com/gsfranzoni">
  <img src="public/assets/buymeacoffee.png" width="220" alt="Buy Me a Coffee QR code for gsfranzoni" />
</a>
