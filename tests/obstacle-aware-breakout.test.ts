import { expect, test } from "bun:test"
import { BreakoutPointSolver } from "lib/index"

test("solves multiple breakout points around pads and keepout obstacles", () => {
  const solver = new BreakoutPointSolver({
    boundary: { left: -5, right: 5, bottom: -4, top: 4 },
    boundaryPointSpacing: 0.5,
    usedBoundaryPoints: [
      { x: 5, y: -0.5 },
      { x: 0.5, y: 4 },
    ],
    visualComponents: [
      {
        center: { x: 0, y: 0 },
        width: 2.8,
        height: 2.8,
        label: "QFN body",
      },
    ],
    visualPads: [
      {
        center: { x: 1.4, y: -1.05 },
        width: 0.55,
        height: 0.32,
        label: "right pad 1",
      },
      {
        center: { x: 1.4, y: -0.35 },
        width: 0.55,
        height: 0.32,
        label: "right pad 2",
      },
      {
        center: { x: 1.4, y: 0.35 },
        width: 0.55,
        height: 0.32,
        label: "right pad 3",
      },
      {
        center: { x: 1.4, y: 1.05 },
        width: 0.55,
        height: 0.32,
        label: "right pad 4",
      },
      {
        center: { x: -1.4, y: -1.05 },
        width: 0.55,
        height: 0.32,
        label: "left pad 1",
      },
      {
        center: { x: -1.4, y: -0.35 },
        width: 0.55,
        height: 0.32,
        label: "left pad 2",
      },
      {
        center: { x: -1.4, y: 0.35 },
        width: 0.55,
        height: 0.32,
        label: "left pad 3",
      },
      {
        center: { x: -1.4, y: 1.05 },
        width: 0.55,
        height: 0.32,
        label: "left pad 4",
      },
      {
        center: { x: -1.05, y: 1.4 },
        width: 0.32,
        height: 0.55,
        label: "top pad 1",
      },
      {
        center: { x: -0.35, y: 1.4 },
        width: 0.32,
        height: 0.55,
        label: "top pad 2",
      },
      {
        center: { x: 0.35, y: 1.4 },
        width: 0.32,
        height: 0.55,
        label: "top pad 3",
      },
      {
        center: { x: 1.05, y: 1.4 },
        width: 0.32,
        height: 0.55,
        label: "top pad 4",
      },
      {
        center: { x: -1.05, y: -1.4 },
        width: 0.32,
        height: 0.55,
        label: "bottom pad 1",
      },
      {
        center: { x: -0.35, y: -1.4 },
        width: 0.32,
        height: 0.55,
        label: "bottom pad 2",
      },
      {
        center: { x: 0.35, y: -1.4 },
        width: 0.32,
        height: 0.55,
        label: "bottom pad 3",
      },
      {
        center: { x: 1.05, y: -1.4 },
        width: 0.32,
        height: 0.55,
        label: "bottom pad 4",
      },
    ],
    traces: [
      {
        sourceTraceId: "source_trace_right_1",
        insidePorts: [
          {
            sourcePortId: "source_port_right_1",
            position: { x: 1.4, y: -1.05 },
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
    obstacles: [
      {
        center: { x: 3.1, y: -0.7 },
        width: 1,
        height: 0.9,
        clearance: 0.1,
        kind: "keepout",
        label: "right keepout",
      },
      {
        center: { x: 3.1, y: 0.7 },
        width: 0.8,
        height: 1.4,
        ccwRotationDegrees: 35,
        kind: "component",
        label: "rotated component",
      },
      {
        center: { x: -0.7, y: 2.8 },
        width: 0.9,
        height: 1.2,
        kind: "keepout",
        label: "top keepout",
      },
      {
        center: { x: 0.35, y: -1.4 },
        width: 0.8,
        height: 0.8,
        kind: "pad",
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

test("ignores obstacle connected to the inside source port", () => {
  const solver = new BreakoutPointSolver({
    boundary: { left: -5, right: 5, bottom: -4, top: 4 },
    boundaryPointSpacing: 0.5,
    traces: [
      {
        sourceTraceId: "source_trace_1",
        insidePorts: [
          {
            sourcePortId: "source_port_inside_1",
            position: { x: 0, y: 0 },
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
    obstacles: [
      {
        center: { x: 0, y: 0 },
        width: 1,
        height: 1,
        kind: "pad",
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
