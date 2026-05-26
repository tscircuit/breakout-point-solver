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
      sourcePortId: "source_port_109",
      sourceTraceId: "source_trace_98",
      x: 3.1,
      y: 0.7000000000000014,
      layer: "top",
    },
    {
      sourcePortId: "source_port_110",
      sourceTraceId: "source_trace_99",
      x: 17.5,
      y: 5.900000000000002,
      layer: "top",
    },
    {
      sourcePortId: "source_port_111",
      sourceTraceId: "source_trace_100",
      x: 17.5,
      y: -3.1999999999999984,
      layer: "top",
    },
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
      sourcePortId: "source_port_91",
      sourceTraceId: "source_trace_82",
      x: 17.5,
      y: 1.3500000000000014,
      layer: "top",
    },
    {
      sourcePortId: "source_port_92",
      sourceTraceId: "source_trace_83",
      x: 17.5,
      y: 2.0000000000000013,
      layer: "top",
    },
    {
      sourcePortId: "source_port_93",
      sourceTraceId: "source_trace_84",
      x: 17.5,
      y: 2.6500000000000012,
      layer: "top",
    },
    {
      sourcePortId: "source_port_94",
      sourceTraceId: "source_trace_85",
      x: 17.5,
      y: 3.950000000000001,
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
      x: 16.100000000000005,
      y: -7.1,
      layer: "top",
    },
    {
      sourcePortId: "source_port_104",
      sourceTraceId: "source_trace_93",
      x: 17.5,
      y: 3.300000000000001,
      layer: "top",
    },
    {
      sourcePortId: "source_port_105",
      sourceTraceId: "source_trace_94",
      x: 17.5,
      y: -5.799999999999999,
      layer: "top",
    },
    {
      sourcePortId: "source_port_106",
      sourceTraceId: "source_trace_95",
      x: 17.5,
      y: -5.149999999999999,
      layer: "top",
    },
    {
      sourcePortId: "source_port_107",
      sourceTraceId: "source_trace_96",
      x: 17.5,
      y: -4.499999999999998,
      layer: "top",
    },
    {
      sourcePortId: "source_port_108",
      sourceTraceId: "source_trace_97",
      x: 3.1,
      y: -1.8999999999999986,
      layer: "top",
    },
    {
      sourcePortId: "source_port_99",
      sourceTraceId: "source_trace_89",
      x: 10.250000000000004,
      y: 7.3,
      layer: "top",
    },
  ])
  expect(solver).toMatchSolverSnapshot(import.meta.path, {
    svgWidth: 1280,
    svgHeight: 1280,
  })
})
