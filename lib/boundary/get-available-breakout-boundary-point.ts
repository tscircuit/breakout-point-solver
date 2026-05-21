import { distance, type Point } from "@tscircuit/math-utils"
import type { Boundary } from "lib/types"

type BoundaryEdge = "left" | "right" | "bottom" | "top"

const BOUNDARY_POINT_DISTANCE_TOLERANCE = 1e-6

const isInsideRequiredSpacing = ({
  candidate,
  usedPoint,
  boundaryPointSpacing,
}: {
  candidate: Point
  usedPoint: Point
  boundaryPointSpacing: number
}) =>
  distance(usedPoint, candidate) <
  boundaryPointSpacing - BOUNDARY_POINT_DISTANCE_TOLERANCE

const getBoundaryEdge = (
  point: Point,
  boundary: Boundary,
): BoundaryEdge | null => {
  if (Math.abs(point.x - boundary.left) < BOUNDARY_POINT_DISTANCE_TOLERANCE)
    return "left"
  if (Math.abs(point.x - boundary.right) < BOUNDARY_POINT_DISTANCE_TOLERANCE)
    return "right"
  if (Math.abs(point.y - boundary.bottom) < BOUNDARY_POINT_DISTANCE_TOLERANCE)
    return "bottom"
  if (Math.abs(point.y - boundary.top) < BOUNDARY_POINT_DISTANCE_TOLERANCE)
    return "top"
  return null
}

const getBoundaryEdgeCandidates = ({
  edge,
  boundary,
  step,
}: {
  edge: BoundaryEdge
  boundary: Boundary
  step: number
}) => {
  const candidates: Point[] = []

  if (edge === "left" || edge === "right") {
    const x = edge === "left" ? boundary.left : boundary.right
    for (let y = boundary.bottom; y <= boundary.top + step / 2; y += step) {
      candidates.push({ x, y: Math.min(y, boundary.top) })
    }
  } else {
    const y = edge === "bottom" ? boundary.bottom : boundary.top
    for (let x = boundary.left; x <= boundary.right + step / 2; x += step) {
      candidates.push({ x: Math.min(x, boundary.right), y })
    }
  }

  return candidates
}

export const getAvailableBreakoutBoundaryPoint = ({
  idealPoint,
  boundary,
  usedBoundaryPoints,
  boundaryPointSpacing,
}: {
  idealPoint: Point
  boundary: Boundary
  usedBoundaryPoints: Point[]
  boundaryPointSpacing: number
}): Point | null => {
  if (boundaryPointSpacing <= 0) return idealPoint

  const hasConflict = (candidate: Point) =>
    usedBoundaryPoints.some((usedPoint) =>
      isInsideRequiredSpacing({
        candidate,
        usedPoint,
        boundaryPointSpacing,
      }),
    )

  if (!hasConflict(idealPoint)) return idealPoint

  const edge = getBoundaryEdge(idealPoint, boundary)
  if (!edge) return null

  const candidates = getBoundaryEdgeCandidates({
    edge,
    boundary,
    step: boundaryPointSpacing,
  })

  candidates.sort((a, b) => distance(a, idealPoint) - distance(b, idealPoint))

  return candidates.find((candidate) => !hasConflict(candidate)) ?? null
}
