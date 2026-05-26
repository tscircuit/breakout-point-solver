import { expect, test } from "bun:test"
import { getAvailableBreakoutBoundaryPoint } from "lib/index"

test("moves breakout point away from occupied boundary spacing", () => {
  expect(
    getAvailableBreakoutBoundaryPoint({
      idealPoint: { x: 5, y: 0 },
      bounds: { minX: -5, maxX: 5, minY: -4, maxY: 4 },
      usedBoundaryPoints: [{ x: 5, y: 0.25 }],
      boundaryPointSpacing: 0.5,
    }),
  ).toEqual({ x: 5, y: -0.5 })
})

test("allows breakout point exactly at required boundary spacing", () => {
  expect(
    getAvailableBreakoutBoundaryPoint({
      idealPoint: { x: 5, y: 0 },
      bounds: { minX: -5, maxX: 5, minY: -4, maxY: 4 },
      usedBoundaryPoints: [{ x: 5, y: -0.49999999999999994 }],
      boundaryPointSpacing: 0.5,
    }),
  ).toEqual({ x: 5, y: 0 })
})

test("falls back to another boundary edge when pad collisions block the ideal edge", () => {
  expect(
    getAvailableBreakoutBoundaryPoint({
      idealPoint: { x: 5, y: 0 },
      bounds: { minX: -5, maxX: 5, minY: -1, maxY: 1 },
      usedBoundaryPoints: [],
      boundaryPointSpacing: 1,
      routeFrom: { x: 0, y: 0 },
      sourcePortId: "source_port_1",
      pads: [
        {
          center: { x: 2.5, y: 0 },
          width: 1,
          height: 4,
          sourcePortIds: ["source_port_blocker"],
        },
      ],
    }),
  ).toEqual({ x: 1, y: -1 })
})
