import { expect, test } from "bun:test"
import {
  doesBreakoutSegmentIntersectObstacle,
  doesBreakoutSegmentIntersectObstacles,
} from "lib/index"

test("detects segment collision with rotated obstacle rectangle", () => {
  expect(
    doesBreakoutSegmentIntersectObstacle({
      from: { x: -2, y: 0 },
      to: { x: 2, y: 0 },
      obstacle: {
        center: { x: 0, y: 0 },
        width: 0.5,
        height: 3,
        ccwRotationDegrees: 45,
      },
    }),
  ).toBe(true)
})

test("ignores segment outside rotated obstacle rectangle", () => {
  expect(
    doesBreakoutSegmentIntersectObstacle({
      from: { x: -2, y: 2 },
      to: { x: 2, y: 2 },
      obstacle: {
        center: { x: 0, y: 0 },
        width: 0.5,
        height: 3,
        ccwRotationDegrees: 45,
      },
    }),
  ).toBe(false)
})

test("ignores obstacle on a different PCB layer", () => {
  expect(
    doesBreakoutSegmentIntersectObstacles({
      from: { x: -2, y: 0 },
      to: { x: 2, y: 0 },
      layer: "top",
      sourcePortId: "source_port_1",
      obstacles: [
        {
          center: { x: 0, y: 0 },
          width: 0.5,
          height: 3,
          layer: "bottom",
        },
      ],
    }),
  ).toBe(false)
})
