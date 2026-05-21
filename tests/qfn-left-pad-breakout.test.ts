import { expect, test } from "bun:test"
import { BreakoutPointSolver } from "lib/index"
import fixture from "./assets/qfn-left-pad-breakout.input.json"

test("solves left-side QFN pad breakout point placement", () => {
  const solver = new BreakoutPointSolver(fixture)

  solver.solve()

  expect(solver.getOutput()).toEqual({
    breakoutPoints: [
      {
        sourcePortId: "source_port_inside_left",
        sourceTraceId: "source_trace_left",
        x: -5,
        y: 1.034090909090909,
      },
    ],
  })
  expect(solver).toMatchSolverSnapshot(import.meta.path)
})
