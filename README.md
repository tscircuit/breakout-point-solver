# @tscircuit/breakout-point-solver

Finds boundary breakout points for traces that need to leave a rectangular
routing area. It is useful for PCB routing flows where pads or ports inside a
component boundary need a clean handoff point on the outside edge before routing
continues to external targets.

The solver projects each inside port toward the average position of its outside
ports, intersects that ray with the configured boundary, and optionally moves
the point along the same edge to satisfy spacing from already used breakout
points.

## Installation

```bash
bun add @tscircuit/breakout-point-solver
```

## Usage

```ts
import { BreakoutPointSolver } from "@tscircuit/breakout-point-solver"

const solver = new BreakoutPointSolver({
  boundary: {
    left: -5,
    right: 5,
    bottom: -4,
    top: 4,
  },
  boundaryPointSpacing: 0.5,
  traces: [
    {
      sourceTraceId: "source_trace_1",
      insidePorts: [
        {
          sourcePortId: "source_port_inside_1",
          position: { x: 1.2, y: -0.3 },
        },
      ],
      outsidePorts: [
        {
          sourcePortId: "source_port_outside_1",
          position: { x: 10, y: 2 },
        },
      ],
    },
  ],
})

solver.solve()

console.log(solver.getOutput())
// {
//   breakoutPoints: [
//     {
//       sourcePortId: "source_port_inside_1",
//       sourceTraceId: "source_trace_1",
//       x: 5,
//       y: 0.6931818181818179,
//     },
//   ],
// }
```

## API

### `BreakoutPointSolver`

```ts
const solver = new BreakoutPointSolver(input)
solver.solve()
const output = solver.getOutput()
```

Input:

```ts
interface BreakoutPointSolverInput {
  boundary: {
    left: number
    right: number
    bottom: number
    top: number
  }
  traces: Array<{
    sourceTraceId: string
    insidePorts: Array<{
      sourcePortId: string
      position: { x: number; y: number }
    }>
    outsidePorts: Array<{
      sourcePortId: string
      position: { x: number; y: number }
    }>
  }>
  usedBoundaryPoints?: Array<{ x: number; y: number }>
  boundaryPointSpacing?: number
  visualComponents?: BreakoutVisualRect[]
  visualPads?: BreakoutVisualRect[]
}
```

Output:

```ts
interface BreakoutPointSolverOutput {
  breakoutPoints: Array<{
    sourcePortId: string
    sourceTraceId: string
    x: number
    y: number
  }>
}
```

### Boundary helpers

The package also exports lower-level helpers:

```ts
import {
  getAvailableBreakoutBoundaryPoint,
  getBreakoutBoundaryIntersection,
} from "@tscircuit/breakout-point-solver"
```

`getBreakoutBoundaryIntersection` returns the point where a ray from an inside
port toward an outside target intersects the rectangular boundary.

`getAvailableBreakoutBoundaryPoint` returns the nearest available point on the
same boundary edge while respecting `boundaryPointSpacing` from already used
points.

## Development

```bash
bun install
bun test
bun run typecheck
bun run build
```

Snapshot visualizations are generated through the test fixtures in `tests/`.
