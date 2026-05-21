import { expect, test } from "bun:test"
import { BreakoutPointSolver, getBreakoutBoundaryIntersection } from "lib/index"
import leftPadFixture from "./assets/qfn-left-pad-breakout.input.json"
import topPadFixture from "./assets/qfn-top-pad-breakout.input.json"
import rightPadFixture from "./assets/simple-two-port-breakout.input.json"

test("gets ray intersection with breakout boundary", () => {
  expect(
    getBreakoutBoundaryIntersection({
      from: { x: 0, y: 0 },
      to: { x: 10, y: 2 },
      boundary: { left: -5, right: 5, bottom: -4, top: 4 },
    }),
  ).toEqual({ x: 5, y: 1 })
})

test("solves right-side QFN pad breakout point placement", () => {
  const solver = new BreakoutPointSolver(rightPadFixture)

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
  expect(solver).toMatchSolverSnapshot(import.meta.path, "qfn-right-pad")
})

test("solves top-side QFN pad breakout point placement", () => {
  const solver = new BreakoutPointSolver(topPadFixture)

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
  expect(solver).toMatchSolverSnapshot(import.meta.path, "qfn-top-pad")
})

test("solves left-side QFN pad breakout point placement", () => {
  const solver = new BreakoutPointSolver(leftPadFixture)

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
  expect(solver).toMatchSolverSnapshot(import.meta.path, "qfn-left-pad")
})
