import { expect, test } from "bun:test"
import { BreakoutSolver, getBreakoutBoundaryIntersection } from "lib/index"
import simpleFixture from "./assets/simple-two-port-breakout.input.json"

test("gets ray intersection with breakout boundary", () => {
  expect(
    getBreakoutBoundaryIntersection({
      from: { x: 0, y: 0 },
      to: { x: 10, y: 2 },
      boundary: { left: -5, right: 5, bottom: -4, top: 4 },
    }),
  ).toEqual({ x: 5, y: 1 })
})

test("solves simple two-port breakout", () => {
  const solver = new BreakoutSolver(simpleFixture)

  solver.solve()

  expect(solver.getOutput()).toEqual({
    breakoutPoints: [
      {
        sourcePortId: "source_port_inside_1",
        sourceTraceId: "source_trace_1",
        x: 5,
        y: 0.6931818181818179,
      },
    ],
  })
  expect(solver).toMatchSolverSnapshot(import.meta.path)
})
