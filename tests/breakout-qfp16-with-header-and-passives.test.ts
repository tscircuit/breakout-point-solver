import { expect, test } from "bun:test"
import { BreakoutPointSolver } from "lib/index"
import type { BreakoutPointSolverInput } from "lib/types"
import fixture from "./assets/breakout-qfp16-with-header-and-passives.input.json"

test("solves qfp16 breakout points to header pins with nearby passives", () => {
  const solver = new BreakoutPointSolver(fixture as BreakoutPointSolverInput)

  solver.solve()

  const breakoutPoints = solver.getOutput().breakoutPoints

  expect(breakoutPoints).toEqual([
    {
      sourcePortId: "source_port_u1_vcc",
      sourceTraceId: "source_trace_j1_vcc_to_u1_vcc",
      x: -0.2999999999999998,
      y: -3.5,
      layer: "top",
    },
    {
      sourcePortId: "source_port_u1_gnd",
      sourceTraceId: "source_trace_j1_gnd_to_u1_gnd",
      x: 0.20000000000000018,
      y: -3.5,
      layer: "top",
    },
    {
      sourcePortId: "source_port_u1_sda",
      sourceTraceId: "source_trace_j1_sda_to_u1_sda",
      x: 3,
      y: 3.5,
      layer: "top",
    },
    {
      sourcePortId: "source_port_u1_scl",
      sourceTraceId: "source_trace_j1_scl_to_u1_scl",
      x: 3,
      y: -1,
      layer: "top",
    },
  ])
  expect(solver).toMatchSolverSnapshot(import.meta.path)
})
