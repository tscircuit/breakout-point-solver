import { expect, test } from "bun:test"
import { BreakoutPointSolver } from "lib/index"
import type { BreakoutPointSolverInput } from "lib/types"
import fixture from "./assets/bottom-layer-breakout.input.json"

test("solves bottom-layer breakout while ignoring top-layer pads", () => {
  const solver = new BreakoutPointSolver(fixture as BreakoutPointSolverInput)

  solver.solve()

  expect(solver.getOutput()).toEqual({
    breakoutPoints: [
      {
        sourcePortId: "source_port_bottom_inside",
        sourceTraceId: "source_trace_bottom",
        x: 5,
        y: -3,
        layer: "bottom",
      },
    ],
  })
  expect(solver).toMatchSolverSnapshot(import.meta.path)
})
