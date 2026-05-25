import { distance, type Point } from "@tscircuit/math-utils"
import type { Boundary, BreakoutObstacleRect } from "lib/types"
import { doesBreakoutSegmentIntersectObstacles } from "lib/obstacle/breakout-obstacle-collisions"

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

const getBoundaryCandidateSearchStep = ({
  boundary,
  boundaryPointSpacing,
  boundaryCandidateSearchStep,
}: {
  boundary: Boundary
  boundaryPointSpacing: number
  boundaryCandidateSearchStep?: number
}) => {
  if (boundaryCandidateSearchStep !== undefined) {
    return boundaryCandidateSearchStep
  }
  if (boundaryPointSpacing > 0) return boundaryPointSpacing

  return (
    Math.min(boundary.right - boundary.left, boundary.top - boundary.bottom) /
    40
  )
}

const hasBoundarySpacingConflict = ({
  candidate,
  usedBoundaryPoints,
  boundaryPointSpacing,
}: {
  candidate: Point
  usedBoundaryPoints: Point[]
  boundaryPointSpacing: number
}) => {
  for (const usedPoint of usedBoundaryPoints) {
    if (
      isInsideRequiredSpacing({
        candidate,
        usedPoint,
        boundaryPointSpacing,
      })
    ) {
      return true
    }
  }

  return false
}

const isBoundaryCandidateBlocked = ({
  candidate,
  routeFrom,
  obstacles,
  sourcePortId,
}: {
  candidate: Point
  routeFrom?: Point
  obstacles?: BreakoutObstacleRect[]
  sourcePortId?: string
}) => {
  if (!routeFrom || !obstacles || !sourcePortId) return false

  return doesBreakoutSegmentIntersectObstacles({
    from: routeFrom,
    to: candidate,
    obstacles,
    sourcePortId,
  })
}

const isCandidateAvailable = ({
  candidate,
  usedBoundaryPoints,
  boundaryPointSpacing,
  routeFrom,
  obstacles,
  sourcePortId,
}: {
  candidate: Point
  usedBoundaryPoints: Point[]
  boundaryPointSpacing: number
  routeFrom?: Point
  obstacles?: BreakoutObstacleRect[]
  sourcePortId?: string
}) => {
  if (
    hasBoundarySpacingConflict({
      candidate,
      usedBoundaryPoints,
      boundaryPointSpacing,
    })
  ) {
    return false
  }

  return !isBoundaryCandidateBlocked({
    candidate,
    routeFrom,
    obstacles,
    sourcePortId,
  })
}

export const getAvailableBreakoutBoundaryPoint = ({
  idealPoint,
  boundary,
  usedBoundaryPoints,
  boundaryPointSpacing,
  boundaryCandidateSearchStep,
  routeFrom,
  obstacles,
  sourcePortId,
}: {
  idealPoint: Point
  boundary: Boundary
  usedBoundaryPoints: Point[]
  boundaryPointSpacing: number
  boundaryCandidateSearchStep?: number
  routeFrom?: Point
  obstacles?: BreakoutObstacleRect[]
  sourcePortId?: string
}): Point | null => {
  if (
    isCandidateAvailable({
      candidate: idealPoint,
      usedBoundaryPoints,
      boundaryPointSpacing,
      routeFrom,
      obstacles,
      sourcePortId,
    })
  ) {
    return idealPoint
  }

  const edge = getBoundaryEdge(idealPoint, boundary)
  if (!edge) return null

  const step = getBoundaryCandidateSearchStep({
    boundary,
    boundaryPointSpacing,
    boundaryCandidateSearchStep,
  })
  if (step <= 0) return null

  const candidates = getBoundaryEdgeCandidates({
    edge,
    boundary,
    step,
  })

  candidates.sort((a, b) => distance(a, idealPoint) - distance(b, idealPoint))

  for (const candidate of candidates) {
    if (
      isCandidateAvailable({
        candidate,
        usedBoundaryPoints,
        boundaryPointSpacing,
        routeFrom,
        obstacles,
        sourcePortId,
      })
    ) {
      return candidate
    }
  }

  return null
}
