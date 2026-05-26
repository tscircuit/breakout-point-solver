import { expect, test } from "bun:test"
import {
  doesBreakoutSegmentIntersectPad,
  doesBreakoutSegmentIntersectPads,
} from "lib/index"

test("detects segment collision with rotated pad rectangle", () => {
  expect(
    doesBreakoutSegmentIntersectPad({
      from: { x: -2, y: 0 },
      to: { x: 2, y: 0 },
      pad: {
        center: { x: 0, y: 0 },
        width: 0.5,
        height: 3,
        ccwRotationDegrees: 45,
      },
    }),
  ).toBe(true)
})

test("ignores segment outside rotated pad rectangle", () => {
  expect(
    doesBreakoutSegmentIntersectPad({
      from: { x: -2, y: 2 },
      to: { x: 2, y: 2 },
      pad: {
        center: { x: 0, y: 0 },
        width: 0.5,
        height: 3,
        ccwRotationDegrees: 45,
      },
    }),
  ).toBe(false)
})

test("ignores pad on a different PCB layer", () => {
  expect(
    doesBreakoutSegmentIntersectPads({
      from: { x: -2, y: 0 },
      to: { x: 2, y: 0 },
      layer: "top",
      sourcePortIds: ["source_port_1"],
      pads: [
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
