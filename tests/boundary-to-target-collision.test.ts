import { expect, test } from "bun:test"
import {
  BreakoutPointSolver,
  doesBreakoutSegmentIntersectPads,
} from "lib/index"
import type { BreakoutPointSolverInput } from "lib/types"
import fixture from "./assets/boundary-to-target-collision.input.json"

test("avoids boundary-to-target pad collision", () => {
  const input = fixture as BreakoutPointSolverInput
  const solver = new BreakoutPointSolver(input)

  solver.solve()

  const breakoutPoint = solver.getOutput().breakoutPoints[0]
  const outsidePort = input.traces[0]?.outsidePorts[0]
  if (!breakoutPoint) throw new Error("Expected a breakout point")
  if (!outsidePort) throw new Error("Expected an outside port")

  expect(breakoutPoint).toEqual({
    sourcePortId: "source_port_inside",
    sourceTraceId: "source_trace_boundary_to_target_collision",
    x: 5,
    y: -3,
    layer: "top",
  })
  expect(
    doesBreakoutSegmentIntersectPads({
      from: { x: breakoutPoint.x, y: breakoutPoint.y },
      to: outsidePort.position,
      pads: input.pads ?? [],
      sourcePortIds: [breakoutPoint.sourcePortId, outsidePort.sourcePortId],
      layer: breakoutPoint.layer,
    }),
  ).toBe(false)
  expect(solver).toMatchSolverSnapshot(import.meta.path)
})
