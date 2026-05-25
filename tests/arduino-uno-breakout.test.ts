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
      x: 7.750146498943776,
      y: 7.299999999999999,
    },
    {
      sourcePortId: "source_port_110",
      sourceTraceId: "source_trace_99",
      x: 8.760975188778353,
      y: 7.300000000000001,
    },
    {
      sourcePortId: "source_port_111",
      sourceTraceId: "source_trace_100",
      x: 9.86299544453128,
      y: 7.300000000000001,
    },
    {
      sourcePortId: "source_port_80",
      sourceTraceId: "source_trace_71",
      x: 12.20215587447357,
      y: 7.299999999999999,
    },
    {
      sourcePortId: "source_port_81",
      sourceTraceId: "source_trace_72",
      x: 13.71097755257264,
      y: 7.299999999999999,
    },
    {
      sourcePortId: "source_port_88",
      sourceTraceId: "source_trace_79",
      x: 17.5,
      y: 5.313385743692827,
    },
    {
      sourcePortId: "source_port_89",
      sourceTraceId: "source_trace_80",
      x: 17.5,
      y: 4.22796445407931,
    },
    {
      sourcePortId: "source_port_90",
      sourceTraceId: "source_trace_81",
      x: 17.5,
      y: 3.300000000000001,
    },
    {
      sourcePortId: "source_port_91",
      sourceTraceId: "source_trace_82",
      x: 11.550000000000004,
      y: 7.3,
    },
    {
      sourcePortId: "source_port_92",
      sourceTraceId: "source_trace_83",
      x: 10.900000000000004,
      y: 7.3,
    },
    {
      sourcePortId: "source_port_93",
      sourceTraceId: "source_trace_84",
      x: 14.800000000000006,
      y: 7.3,
    },
    {
      sourcePortId: "source_port_94",
      sourceTraceId: "source_trace_85",
      x: 7.000000000000002,
      y: 7.3,
    },
    {
      sourcePortId: "source_port_95",
      sourceTraceId: "source_trace_86",
      x: 15.450000000000006,
      y: 7.3,
    },
    {
      sourcePortId: "source_port_96",
      sourceTraceId: "source_trace_87",
      x: 6.350000000000001,
      y: 7.3,
    },
    {
      sourcePortId: "source_port_102",
      sourceTraceId: "source_trace_91",
      x: 11.618138037959634,
      y: -7.1,
    },
    {
      sourcePortId: "source_port_103",
      sourceTraceId: "source_trace_92",
      x: 12.850000000000005,
      y: -7.1,
    },
    {
      sourcePortId: "source_port_104",
      sourceTraceId: "source_trace_93",
      x: 10.900000000000004,
      y: -7.1,
    },
    {
      sourcePortId: "source_port_105",
      sourceTraceId: "source_trace_94",
      x: 13.500000000000005,
      y: -7.1,
    },
    {
      sourcePortId: "source_port_106",
      sourceTraceId: "source_trace_95",
      x: 14.150000000000006,
      y: -7.1,
    },
    {
      sourcePortId: "source_port_107",
      sourceTraceId: "source_trace_96",
      x: 14.800000000000006,
      y: -7.1,
    },
    {
      sourcePortId: "source_port_108",
      sourceTraceId: "source_trace_97",
      x: 3.138854361767362,
      y: -7.1,
    },
    {
      sourcePortId: "source_port_99",
      sourceTraceId: "source_trace_89",
      x: 5.700000000000001,
      y: 7.3,
    },
  ])
  expect(solver).toMatchSolverSnapshot(import.meta.path, {
    svgWidth: 1280,
    svgHeight: 1280,
  })
})
