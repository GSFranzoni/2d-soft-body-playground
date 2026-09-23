# 2D Soft Body Playground

[![Live demo](https://img.shields.io/badge/live%20demo-open-a855f7?logo=github)](https://gsfranzoni.github.io/2d-soft-body-playground/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.4-000?logo=bun&logoColor=white)](https://bun.sh/)

[Live demo →](https://gsfranzoni.github.io/2d-soft-body-playground/)

2D Soft Body Playground is a small, interactive 2D particle simulation. A square world holds a population of differently sized particles that move, collide elastically, and bounce from its bounds. The gravity control changes the world's vertical gravitational acceleration live, from 0 to 20 m/s².

The project keeps simulation logic separate from rendering and UI. `World` owns particles, gravity, integration, boundary handling, and collision resolution. `Canvas` advances and renders that world on each animation frame. The React app only creates the initial scene and exposes the gravity control.

## How it works

```text
Animation frame
     │
     ▼
World.update(delta time)
     │
     ├── Apply gravity force: F = m × g
     │
     ├── Integrate acceleration, velocity, and position
     │
     ├── Resolve collisions with the world's four bounds
     │
     └── Check every particle pair and resolve elastic collisions
     │
     ▼
Canvas renders the updated particle positions
```

Particles are represented in meters and seconds. The canvas renderer uses a fixed pixels-per-meter scale only when drawing, so changing gravity still uses its physical value in m/s² rather than a pixel conversion.

For an overlapping pair, the collision solver first separates the particles according to their inverse masses, then updates their velocities along the collision normal using the equations for a 2D elastic collision.

## What you can explore

- Watch 50 randomly placed particles move and collide in a square world.
- Adjust downward gravity from 0 to 20 m/s² with the native popover slider.
- See particles reflect from each world boundary.
- Inspect a small physics core made up of vectors, particles, collisions, and the world simulation.
- Explore a responsive canvas renderer driven by `requestAnimationFrame`.

## Improvements

- [ ] Add controls for particle count, radius range, mass, and initial velocity.
- [ ] Add pause, step, reset, and randomize controls.
- [ ] Add restitution and friction parameters for inelastic collisions.
- [ ] Add spatial partitioning to scale collision detection beyond the current all-pairs check.
- [ ] Add trails, velocity vectors, and collision diagnostics.

## References

- [2D Elastic Collisions](https://www.vobarian.com/collisions/2dcollisions2.pdf) — derivation used by the particle-pair collision resolver.

## Support

If you enjoyed this small physics experiment, you can support its creator here:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?logo=buymeacoffee&logoColor=000)](https://buymeacoffee.com/gsfranzoni)

<a href="https://buymeacoffee.com/gsfranzoni">
  <img src="public/assets/buymeacoffee.png" width="220" alt="Buy Me a Coffee QR code for gsfranzoni" />
</a>

## Quick start

Requires [Bun](https://bun.sh/) 1.4 or newer.

```bash
bun install
bun run dev
```

Open the Vite URL printed in the terminal, usually [`http://localhost:5173`](http://localhost:5173).

To create a production build locally:

```bash
bun run build
```

## Commands

| Command             | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `bun run dev`       | Start the Vite development server.        |
| `bun run build`     | Type-check and create a production build. |
| `bun run preview`   | Preview the production build locally.     |
| `bun run lint`      | Run Oxlint.                               |
| `bun run lint:fix`  | Apply available Oxlint fixes.             |
| `bun run fmt`       | Format source files with Oxfmt.           |
| `bun run fmt:check` | Check formatting without modifying files. |

## Project structure

```text
src
├── components
│   └── canvas.tsx              Canvas renderer and animation-frame simulation loop
├── core
│   ├── collision.ts            Particle-pair and world-boundary collision resolution
│   ├── particle.ts             Particle state, forces, and integration
│   ├── vector2.ts              2D vector math primitives
│   └── world.ts                Particle collection, gravity, and simulation updates
├── hooks
│   └── use-animation-frame.ts  requestAnimationFrame scheduling with a delta-time cap
├── app.tsx                     Simulation setup and gravity control UI
├── index.css                   shadcn-inspired design tokens and Tailwind theme mapping
└── main.tsx                    React application entry point
```
