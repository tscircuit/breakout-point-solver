import { expect, test } from "bun:test"
import { BreakoutPointSolver } from "lib/index"

test("solves multiple breakout points around blocking pads", () => {
  const solver = new BreakoutPointSolver({
    bounds: { minX: -5, maxX: 5, minY: -4, maxY: 4 },
    boundaryPointSpacing: 0.5,
    usedBoundaryPoints: [
      { x: 5, y: -0.5 },
      { x: 0.5, y: 4 },
    ],
    traces: [
      {
        sourceTraceId: "source_trace_right_1",
        insidePorts: [
          {
            sourcePortId: "source_port_right_1",
            position: { x: 1.4, y: -1.05 },
            width: 0.55,
            height: 0.32,
          },
        ],
        outsidePorts: [
          {
            sourcePortId: "source_port_header_right_1",
            position: { x: 10, y: -1.05 },
          },
        ],
      },
      {
        sourceTraceId: "source_trace_right_2",
        insidePorts: [
          {
            sourcePortId: "source_port_right_2",
            position: { x: 1.4, y: 1.05 },
            width: 0.55,
            height: 0.32,
          },
        ],
        outsidePorts: [
          {
            sourcePortId: "source_port_header_right_2",
            position: { x: 10, y: 1.05 },
          },
        ],
      },
      {
        sourceTraceId: "source_trace_top",
        insidePorts: [
          {
            sourcePortId: "source_port_top",
            position: { x: -0.35, y: 1.4 },
            width: 0.32,
            height: 0.55,
          },
        ],
        outsidePorts: [
          {
            sourcePortId: "source_port_header_top",
            position: { x: -0.35, y: 9 },
          },
        ],
      },
      {
        sourceTraceId: "source_trace_bottom",
        insidePorts: [
          {
            sourcePortId: "source_port_bottom",
            position: { x: 0.35, y: -1.4 },
            width: 0.32,
            height: 0.55,
          },
        ],
        outsidePorts: [
          {
            sourcePortId: "source_port_header_bottom",
            position: { x: 0.35, y: -9 },
          },
        ],
      },
    ],
    pads: [
      {
        center: { x: 3.1, y: -0.7 },
        width: 1,
        height: 0.9,
        clearance: 0.1,
        label: "right blocking pad",
      },
      {
        center: { x: 3.1, y: 0.7 },
        width: 0.8,
        height: 1.4,
        ccwRotationDegrees: 35,
        label: "rotated blocking pad",
      },
      {
        center: { x: -0.7, y: 2.8 },
        width: 0.9,
        height: 1.2,
        label: "top blocking pad",
      },
      {
        center: { x: 0.35, y: -1.4 },
        width: 0.8,
        height: 0.8,
        sourcePortIds: ["source_port_bottom"],
        label: "self pad",
      },
    ],
  })

  solver.solve()

  expect(solver.getOutput()).toEqual({
    breakoutPoints: [
      {
        sourcePortId: "source_port_right_1",
        sourceTraceId: "source_trace_right_1",
        x: 5,
        y: -2,
      },
      {
        sourcePortId: "source_port_right_2",
        sourceTraceId: "source_trace_right_2",
        x: 5,
        y: 2.5,
      },
      {
        sourcePortId: "source_port_top",
        sourceTraceId: "source_trace_top",
        x: 0,
        y: 4,
      },
      {
        sourcePortId: "source_port_bottom",
        sourceTraceId: "source_trace_bottom",
        x: 0.35,
        y: -4,
      },
    ],
  })
  expect(solver).toMatchSolverSnapshot(import.meta.path)
})

test("ignores pad connected to the inside source port", () => {
  const solver = new BreakoutPointSolver({
    bounds: { minX: -5, maxX: 5, minY: -4, maxY: 4 },
    boundaryPointSpacing: 0.5,
    traces: [
      {
        sourceTraceId: "source_trace_1",
        insidePorts: [
          {
            sourcePortId: "source_port_inside_1",
            position: { x: 0, y: 0 },
            width: 0.55,
            height: 0.32,
          },
        ],
        outsidePorts: [
          {
            sourcePortId: "source_port_outside_1",
            position: { x: 10, y: 0 },
          },
        ],
      },
    ],
    pads: [
      {
        center: { x: 0, y: 0 },
        width: 1,
        height: 1,
        sourcePortIds: ["source_port_inside_1"],
      },
    ],
  })

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
})
