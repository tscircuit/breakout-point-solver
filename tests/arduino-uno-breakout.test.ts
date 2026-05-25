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
      x: 7.44403866166043,
      y: 5.900000000000001,
    },
    {
      sourcePortId: "source_port_110",
      sourceTraceId: "source_trace_99",
      x: 8.32766355861137,
      y: 5.900000000000001,
    },
    {
      sourcePortId: "source_port_111",
      sourceTraceId: "source_trace_100",
      x: 9.310065772656284,
      y: 5.900000000000002,
    },
    {
      sourcePortId: "source_port_80",
      sourceTraceId: "source_trace_71",
      x: 11.632519405326988,
      y: 5.9,
    },
    {
      sourcePortId: "source_port_81",
      sourceTraceId: "source_trace_72",
      x: 13.055562732228118,
      y: 5.9,
    },
    {
      sourcePortId: "source_port_88",
      sourceTraceId: "source_trace_79",
      x: 15.9,
      y: 0.7724230272386068,
    },
    {
      sourcePortId: "source_port_89",
      sourceTraceId: "source_trace_80",
      x: 15.9,
      y: 0.2999999999999998,
    },
    {
      sourcePortId: "source_port_90",
      sourceTraceId: "source_trace_81",
      x: 15.9,
      y: 1.2999999999999998,
    },
    {
      sourcePortId: "source_port_91",
      sourceTraceId: "source_trace_82",
      x: 12.45,
      y: 5.9,
    },
    {
      sourcePortId: "source_port_92",
      sourceTraceId: "source_trace_83",
      x: 13.7,
      y: 5.9,
    },
    {
      sourcePortId: "source_port_93",
      sourceTraceId: "source_trace_84",
      x: 10.95,
      y: 5.9,
    },
    {
      sourcePortId: "source_port_94",
      sourceTraceId: "source_trace_85",
      x: 10.45,
      y: 5.9,
    },
    {
      sourcePortId: "source_port_95",
      sourceTraceId: "source_trace_86",
      x: 14.2,
      y: 5.9,
    },
    {
      sourcePortId: "source_port_96",
      sourceTraceId: "source_trace_87",
      x: 9.95,
      y: 5.9,
    },
    {
      sourcePortId: "source_port_102",
      sourceTraceId: "source_trace_91",
      x: 11.215988493223492,
      y: -5.699999999999999,
    },
    {
      sourcePortId: "source_port_103",
      sourceTraceId: "source_trace_92",
      x: 11.7,
      y: -5.7,
    },
    {
      sourcePortId: "source_port_104",
      sourceTraceId: "source_trace_93",
      x: 10.7,
      y: -5.7,
    },
    {
      sourcePortId: "source_port_105",
      sourceTraceId: "source_trace_94",
      x: 12.2,
      y: -5.7,
    },
    {
      sourcePortId: "source_port_106",
      sourceTraceId: "source_trace_95",
      x: 12.7,
      y: -5.7,
    },
    {
      sourcePortId: "source_port_107",
      sourceTraceId: "source_trace_96",
      x: 13.2,
      y: -5.7,
    },
    {
      sourcePortId: "source_port_108",
      sourceTraceId: "source_trace_97",
      x: 4.7,
      y: -3.274000945338579,
    },
    {
      sourcePortId: "source_port_99",
      sourceTraceId: "source_trace_89",
      x: 6.95,
      y: 5.9,
    },
  ])
  expect(solver).toMatchSolverSnapshot(import.meta.path, {
    svgWidth: 1280,
    svgHeight: 1280,
  })
})
