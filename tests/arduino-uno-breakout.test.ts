import { expect, test } from "bun:test"
import { BreakoutPointSolver } from "lib/index"
import type { BreakoutPointSolverInput } from "lib/types"
import fixtureJson from "./assets/arduino-uno-breakout.input.json"

const fixture = fixtureJson as BreakoutPointSolverInput

test("solves breakout points from real Arduino Uno circuit-json pads", () => {
  const solver = new BreakoutPointSolver(fixture)

  solver.solve()

  const breakoutPoints = solver.getOutput().breakoutPoints

  expect(fixture.traces).toHaveLength(22)
  expect(breakoutPoints).toEqual([
    {
      sourcePortId: "source_port_80",
      sourceTraceId: "source_trace_71",
      x: 7.000000000000002,
      y: 7.3,
      layer: "top",
    },
    {
      sourcePortId: "source_port_81",
      sourceTraceId: "source_trace_72",
      x: 16.100000000000005,
      y: 7.3,
      layer: "top",
    },
    {
      sourcePortId: "source_port_88",
      sourceTraceId: "source_trace_79",
      x: 17.5,
      y: -1.2499999999999987,
      layer: "top",
    },
    {
      sourcePortId: "source_port_89",
      sourceTraceId: "source_trace_80",
      x: 17.5,
      y: 0.05000000000000138,
      layer: "top",
    },
    {
      sourcePortId: "source_port_90",
      sourceTraceId: "source_trace_81",
      x: 17.5,
      y: 0.7000000000000014,
      layer: "top",
    },
    {
      sourcePortId: "source_port_95",
      sourceTraceId: "source_trace_86",
      x: 12.200000000000005,
      y: 7.3,
      layer: "top",
    },
    {
      sourcePortId: "source_port_96",
      sourceTraceId: "source_trace_87",
      x: 11.550000000000004,
      y: 7.3,
      layer: "top",
    },
    {
      sourcePortId: "source_port_102",
      sourceTraceId: "source_trace_91",
      x: 8.950000000000003,
      y: -7.1,
      layer: "top",
    },
    {
      sourcePortId: "source_port_103",
      sourceTraceId: "source_trace_92",
      x: 7.000000000000002,
      y: -7.1,
      layer: "top",
    },
    {
      sourcePortId: "source_port_99",
      sourceTraceId: "source_trace_89",
      x: 8.950000000000003,
      y: 7.3,
      layer: "top",
    },
  ])
  expect(solver).toMatchSolverSnapshot(import.meta.path, {
    svgWidth: 1280,
    svgHeight: 1280,
  })
})
