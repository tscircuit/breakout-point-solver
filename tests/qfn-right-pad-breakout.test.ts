import { expect, test } from "bun:test"
import { BreakoutPointSolver } from "lib/index"
import fixture from "./assets/simple-two-port-breakout.input.json"

test("solves right-side QFN pad breakout point placement", () => {
  const solver = new BreakoutPointSolver(fixture)

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
