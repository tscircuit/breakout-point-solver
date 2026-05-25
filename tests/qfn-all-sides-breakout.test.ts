import { expect, test } from "bun:test"
import { BreakoutPointSolver } from "lib/index"
import type { BreakoutPointSolverInput } from "lib/types"
import fixture from "./assets/qfn-all-sides-breakout.input.json"

test("solves QFN breakout points on all four sides with spacing conflicts", () => {
  const solver = new BreakoutPointSolver(fixture as BreakoutPointSolverInput)

  solver.solve()

  const breakoutPoints = solver.getOutput().breakoutPoints

  expect(breakoutPoints).toEqual([
    {
      sourcePortId: "source_port_right_1",
      sourceTraceId: "source_trace_right_1",
      x: 5,
      y: -1.5,
      layer: "top",
    },
    {
      sourcePortId: "source_port_right_2",
      sourceTraceId: "source_trace_right_2",
      x: 5,
      y: -0.5,
      layer: "top",
    },
    {
      sourcePortId: "source_port_right_3",
      sourceTraceId: "source_trace_right_3",
      x: 5,
      y: 0,
      layer: "top",
    },
    {
      sourcePortId: "source_port_right_4",
      sourceTraceId: "source_trace_right_4",
      x: 5,
      y: 1.5,
      layer: "top",
    },
    {
      sourcePortId: "source_port_left_1",
      sourceTraceId: "source_trace_left_1",
      x: -5,
      y: -1.5,
      layer: "top",
    },
    {
      sourcePortId: "source_port_left_2",
      sourceTraceId: "source_trace_left_2",
      x: -5,
      y: -1,
      layer: "top",
    },
    {
      sourcePortId: "source_port_left_3",
      sourceTraceId: "source_trace_left_3",
      x: -5,
      y: 0.5,
      layer: "top",
    },
    {
      sourcePortId: "source_port_left_4",
      sourceTraceId: "source_trace_left_4",
      x: -5,
      y: 1.5,
      layer: "top",
    },
    {
      sourcePortId: "source_port_top_1",
      sourceTraceId: "source_trace_top_1",
      x: -1.5,
      y: 4,
      layer: "top",
    },
    {
      sourcePortId: "source_port_top_2",
      sourceTraceId: "source_trace_top_2",
      x: -0.5,
      y: 4,
      layer: "top",
    },
    {
      sourcePortId: "source_port_top_3",
      sourceTraceId: "source_trace_top_3",
      x: 0,
      y: 4,
      layer: "top",
    },
    {
      sourcePortId: "source_port_top_4",
      sourceTraceId: "source_trace_top_4",
      x: 1.5,
      y: 4,
      layer: "top",
    },
    {
      sourcePortId: "source_port_bottom_1",
      sourceTraceId: "source_trace_bottom_1",
      x: -1.5,
      y: -4,
      layer: "top",
    },
    {
      sourcePortId: "source_port_bottom_2",
      sourceTraceId: "source_trace_bottom_2",
      x: -1,
      y: -4,
      layer: "top",
    },
    {
      sourcePortId: "source_port_bottom_3",
      sourceTraceId: "source_trace_bottom_3",
      x: 0.5,
      y: -4,
      layer: "top",
    },
    {
      sourcePortId: "source_port_bottom_4",
      sourceTraceId: "source_trace_bottom_4",
      x: 1.5,
      y: -4,
      layer: "top",
    },
  ])
  expect(solver).toMatchSolverSnapshot(import.meta.path)
})
