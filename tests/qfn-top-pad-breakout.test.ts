import { expect, test } from "bun:test"
import { BreakoutPointSolver } from "lib/index"
import fixture from "./assets/qfn-top-pad-breakout.input.json"

test("solves top-side QFN pad breakout point placement", () => {
  const solver = new BreakoutPointSolver(fixture)

  solver.solve()

  expect(solver.getOutput()).toEqual({
    breakoutPoints: [
      {
        sourcePortId: "source_port_inside_top",
        sourceTraceId: "source_trace_top",
        x: 0.8409090909090908,
        y: 4,
      },
    ],
  })
  expect(solver).toMatchSolverSnapshot(import.meta.path)
})
