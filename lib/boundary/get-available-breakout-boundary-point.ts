import { distance, type Bounds, type Point } from "@tscircuit/math-utils"
import type { BreakoutObstacleRect } from "lib/types"
import { doesBreakoutSegmentIntersectObstacles } from "lib/obstacle/breakout-obstacle-collisions"

type BoundsEdge = "left" | "right" | "bottom" | "top"

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

const getBoundsEdge = (point: Point, bounds: Bounds): BoundsEdge | null => {
  if (Math.abs(point.x - bounds.minX) < BOUNDARY_POINT_DISTANCE_TOLERANCE)
    return "left"
  if (Math.abs(point.x - bounds.maxX) < BOUNDARY_POINT_DISTANCE_TOLERANCE)
    return "right"
  if (Math.abs(point.y - bounds.minY) < BOUNDARY_POINT_DISTANCE_TOLERANCE)
    return "bottom"
  if (Math.abs(point.y - bounds.maxY) < BOUNDARY_POINT_DISTANCE_TOLERANCE)
    return "top"
  return null
}

const getBoundsEdgeCandidates = ({
  edge,
  bounds,
  step,
}: {
  edge: BoundsEdge
  bounds: Bounds
  step: number
}) => {
  const candidates: Point[] = []

  if (edge === "left" || edge === "right") {
    const x = edge === "left" ? bounds.minX : bounds.maxX
    for (let y = bounds.minY; y <= bounds.maxY + step / 2; y += step) {
      candidates.push({ x, y: Math.min(y, bounds.maxY) })
    }
  } else {
    const y = edge === "bottom" ? bounds.minY : bounds.maxY
    for (let x = bounds.minX; x <= bounds.maxX + step / 2; x += step) {
      candidates.push({ x: Math.min(x, bounds.maxX), y })
    }
  }

  return candidates
}

const getBoundaryCandidateSearchStep = ({
  bounds,
  boundaryPointSpacing,
}: {
  bounds: Bounds
  boundaryPointSpacing: number
}) => {
  if (boundaryPointSpacing > 0) return boundaryPointSpacing

  return Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) / 40
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
  bounds,
  usedBoundaryPoints,
  boundaryPointSpacing,
  routeFrom,
  obstacles,
  sourcePortId,
}: {
  idealPoint: Point
  bounds: Bounds
  usedBoundaryPoints: Point[]
  boundaryPointSpacing: number
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

  const edge = getBoundsEdge(idealPoint, bounds)
  if (!edge) return null

  const step = getBoundaryCandidateSearchStep({
    bounds,
    boundaryPointSpacing,
  })
  if (step <= 0) return null

  const candidates = getBoundsEdgeCandidates({
    edge,
    bounds,
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
