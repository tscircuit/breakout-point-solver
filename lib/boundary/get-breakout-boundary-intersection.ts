import {
  distance,
  getSegmentIntersection,
  type Point,
} from "@tscircuit/math-utils"
import type { Boundary } from "lib/types"

export const getBreakoutBoundaryIntersection = ({
  from,
  to,
  boundary,
}: {
  from: Point
  to: Point
  boundary: Boundary
}): Point | null => {
  if (from.x === to.x && from.y === to.y) return null

  const boundarySegments: Array<[Point, Point]> = [
    [
      { x: boundary.left, y: boundary.bottom },
      { x: boundary.right, y: boundary.bottom },
    ],
    [
      { x: boundary.right, y: boundary.bottom },
      { x: boundary.right, y: boundary.top },
    ],
    [
      { x: boundary.right, y: boundary.top },
      { x: boundary.left, y: boundary.top },
    ],
    [
      { x: boundary.left, y: boundary.top },
      { x: boundary.left, y: boundary.bottom },
    ],
  ]

  const candidates = boundarySegments
    .map(([start, end]) => getSegmentIntersection(from, to, start, end))
    .filter((point): point is Point => point !== null)

  candidates.sort((a, b) => distance(from, a) - distance(from, b))
  return candidates[0] ?? null
}
