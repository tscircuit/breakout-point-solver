import { distance, type Bounds, type Point } from "@tscircuit/math-utils"
import type { BreakoutPad, BreakoutPort, PcbLayer } from "lib/types"
import {
  doesBreakoutSegmentIntersectNonIgnoredPads,
  doesBreakoutSegmentIntersectPads,
} from "lib/pad/breakout-pad-collisions"

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

const getAllBoundsCandidates = ({
  bounds,
  step,
}: {
  bounds: Bounds
  step: number
}) => {
  const candidatesByCoordinate = new Map<string, Point>()

  for (const edge of ["left", "right", "bottom", "top"] as const) {
    for (const candidate of getBoundsEdgeCandidates({ edge, bounds, step })) {
      candidatesByCoordinate.set(`${candidate.x}:${candidate.y}`, candidate)
    }
  }

  return [...candidatesByCoordinate.values()]
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
  pads,
  sourcePortId,
  layer,
}: {
  candidate: Point
  routeFrom?: Point
  pads?: BreakoutPad[]
  sourcePortId?: string
  layer?: PcbLayer
}) => {
  if (!routeFrom || !pads || !sourcePortId) return false

  return doesBreakoutSegmentIntersectPads({
    from: routeFrom,
    to: candidate,
    pads,
    sourcePortId,
    layer,
  })
}

const isCandidateAvailable = ({
  candidate,
  usedBoundaryPoints,
  boundaryPointSpacing,
  routeFrom,
  pads,
  sourcePortId,
  layer,
}: {
  candidate: Point
  usedBoundaryPoints: Point[]
  boundaryPointSpacing: number
  routeFrom?: Point
  pads?: BreakoutPad[]
  sourcePortId?: string
  layer?: PcbLayer
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
    pads,
    sourcePortId,
    layer,
  })
}

const hasOutsideAccessConflict = ({
  candidate,
  outsidePorts,
  pads,
  sourcePortId,
  layer,
}: {
  candidate: Point
  outsidePorts?: BreakoutPort[]
  pads?: BreakoutPad[]
  sourcePortId?: string
  layer?: PcbLayer
}) => {
  if (!outsidePorts || !pads || !sourcePortId) return false

  for (const outsidePort of outsidePorts) {
    if (
      doesBreakoutSegmentIntersectNonIgnoredPads({
        from: candidate,
        to: outsidePort.position,
        pads,
        ignoredSourcePortIds: [sourcePortId, outsidePort.sourcePortId],
        layer,
      })
    ) {
      return true
    }
  }

  return false
}

const isCandidateAvailableForOutsidePorts = ({
  candidate,
  bounds,
  usedBoundaryPoints,
  boundaryPointSpacing,
  routeFrom,
  pads,
  sourcePortId,
  outsidePorts,
  layer,
}: {
  candidate: Point
  bounds: Bounds
  usedBoundaryPoints: Point[]
  boundaryPointSpacing: number
  routeFrom?: Point
  pads?: BreakoutPad[]
  sourcePortId?: string
  outsidePorts?: BreakoutPort[]
  layer?: PcbLayer
}) => {
  if (
    !isCandidateAvailable({
      candidate,
      usedBoundaryPoints,
      boundaryPointSpacing,
      routeFrom,
      pads,
      sourcePortId,
      layer,
    })
  ) {
    return false
  }

  return !hasOutsideAccessConflict({
    candidate,
    outsidePorts,
    pads,
    sourcePortId,
    layer,
  })
}

export const getAvailableBreakoutBoundaryPoint = ({
  idealPoint,
  bounds,
  usedBoundaryPoints,
  boundaryPointSpacing,
  routeFrom,
  pads,
  sourcePortId,
  layer,
}: {
  idealPoint: Point
  bounds: Bounds
  usedBoundaryPoints: Point[]
  boundaryPointSpacing: number
  routeFrom?: Point
  pads?: BreakoutPad[]
  sourcePortId?: string
  layer?: PcbLayer
}): Point | null => {
  if (
    isCandidateAvailable({
      candidate: idealPoint,
      usedBoundaryPoints,
      boundaryPointSpacing,
      routeFrom,
      pads,
      sourcePortId,
      layer,
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

  const edgeCandidates = getBoundsEdgeCandidates({
    edge,
    bounds,
    step,
  })

  edgeCandidates.sort(
    (a, b) => distance(a, idealPoint) - distance(b, idealPoint),
  )

  for (const candidate of edgeCandidates) {
    if (
      isCandidateAvailable({
        candidate,
        usedBoundaryPoints,
        boundaryPointSpacing,
        routeFrom,
        pads,
        sourcePortId,
        layer,
      })
    ) {
      return candidate
    }
  }

  const candidates = getAllBoundsCandidates({ bounds, step })
  candidates.sort((a, b) => distance(a, idealPoint) - distance(b, idealPoint))

  for (const candidate of candidates) {
    if (
      isCandidateAvailable({
        candidate,
        usedBoundaryPoints,
        boundaryPointSpacing,
        routeFrom,
        pads,
        sourcePortId,
        layer,
      })
    ) {
      return candidate
    }
  }

  return null
}

export const getAvailableBreakoutBoundaryPointForOutsidePorts = ({
  idealPoints,
  bounds,
  usedBoundaryPoints,
  boundaryPointSpacing,
  routeFrom,
  pads,
  sourcePortId,
  outsidePorts,
  layer,
}: {
  idealPoints: Point[]
  bounds: Bounds
  usedBoundaryPoints: Point[]
  boundaryPointSpacing: number
  routeFrom?: Point
  pads?: BreakoutPad[]
  sourcePortId?: string
  outsidePorts?: BreakoutPort[]
  layer?: PcbLayer
}): Point | null => {
  const step = getBoundaryCandidateSearchStep({
    bounds,
    boundaryPointSpacing,
  })
  if (step <= 0) return null

  for (const idealPoint of idealPoints) {
    if (
      isCandidateAvailableForOutsidePorts({
        candidate: idealPoint,
        bounds,
        usedBoundaryPoints,
        boundaryPointSpacing,
        routeFrom,
        pads,
        sourcePortId,
        outsidePorts,
        layer,
      })
    ) {
      return idealPoint
    }

    const edge = getBoundsEdge(idealPoint, bounds)
    if (!edge) continue

    const edgeCandidates = getBoundsEdgeCandidates({ edge, bounds, step })
    edgeCandidates.sort(
      (a, b) => distance(a, idealPoint) - distance(b, idealPoint),
    )

    for (const candidate of edgeCandidates) {
      if (
        isCandidateAvailableForOutsidePorts({
          candidate,
          bounds,
          usedBoundaryPoints,
          boundaryPointSpacing,
          routeFrom,
          pads,
          sourcePortId,
          outsidePorts,
          layer,
        })
      ) {
        return candidate
      }
    }
  }

  for (const idealPoint of idealPoints) {
    const candidates = getAllBoundsCandidates({ bounds, step })
    candidates.sort((a, b) => distance(a, idealPoint) - distance(b, idealPoint))

    for (const candidate of candidates) {
      if (
        isCandidateAvailableForOutsidePorts({
          candidate,
          bounds,
          usedBoundaryPoints,
          boundaryPointSpacing,
          routeFrom,
          pads,
          sourcePortId,
          outsidePorts,
          layer,
        })
      ) {
        return candidate
      }
    }
  }

  return null
}
