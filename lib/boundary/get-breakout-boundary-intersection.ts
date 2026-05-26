import {
  distance,
  getSegmentIntersection,
  type Bounds,
  type Point,
} from "@tscircuit/math-utils"

export const getBreakoutBoundaryIntersection = ({
  from,
  to,
  bounds,
}: {
  from: Point
  to: Point
  bounds: Bounds
}): Point | null => {
  if (from.x === to.x && from.y === to.y) return null

  const boundarySegments: Array<[Point, Point]> = [
    [
      { x: bounds.minX, y: bounds.minY },
      { x: bounds.maxX, y: bounds.minY },
    ],
    [
      { x: bounds.maxX, y: bounds.minY },
      { x: bounds.maxX, y: bounds.maxY },
    ],
    [
      { x: bounds.maxX, y: bounds.maxY },
      { x: bounds.minX, y: bounds.maxY },
    ],
    [
      { x: bounds.minX, y: bounds.maxY },
      { x: bounds.minX, y: bounds.minY },
    ],
  ]

  const candidates = boundarySegments
    .map(([start, end]) => getSegmentIntersection(from, to, start, end))
    .filter((point): point is Point => point !== null)

  candidates.sort((a, b) => distance(from, a) - distance(from, b))
  return candidates[0] ?? null
}
