import { expect, test } from "bun:test"
import { BreakoutPointSolver } from "lib/index"
import fixture from "./assets/qfn-right-pad-conflict.input.json"

test("moves right-side QFN breakout point away from used boundary point", () => {
  const solver = new BreakoutPointSolver(fixture)

  solver.solve()

  expect(solver.getOutput()).toEqual({
    breakoutPoints: [
      {
        sourcePortId: "source_port_inside_1",
        sourceTraceId: "source_trace_1",
        x: 5,
        y: 0,
      },
    ],
  })
  expect(solver).toMatchSolverSnapshot(import.meta.path)
})
