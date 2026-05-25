import { expect, test } from "bun:test"
import { getBreakoutBoundaryIntersection } from "lib/index"

test("gets ray intersection with breakout boundary", () => {
  expect(
    getBreakoutBoundaryIntersection({
      from: { x: 0, y: 0 },
      to: { x: 10, y: 2 },
      bounds: { minX: -5, maxX: 5, minY: -4, maxY: 4 },
    }),
  ).toEqual({ x: 5, y: 1 })
})
