import { expect, test } from "bun:test"
import { getAvailableBreakoutBoundaryPoint } from "lib/index"

test("moves breakout point away from occupied boundary spacing", () => {
  expect(
    getAvailableBreakoutBoundaryPoint({
      idealPoint: { x: 5, y: 0 },
      boundary: { left: -5, right: 5, bottom: -4, top: 4 },
      usedBoundaryPoints: [{ x: 5, y: 0.25 }],
      boundaryPointSpacing: 0.5,
    }),
  ).toEqual({ x: 5, y: -0.5 })
})

test("allows breakout point exactly at required boundary spacing", () => {
  expect(
    getAvailableBreakoutBoundaryPoint({
      idealPoint: { x: 5, y: 0 },
      boundary: { left: -5, right: 5, bottom: -4, top: 4 },
      usedBoundaryPoints: [{ x: 5, y: -0.49999999999999994 }],
      boundaryPointSpacing: 0.5,
    }),
  ).toEqual({ x: 5, y: 0 })
})
