import { doesSegmentIntersectRect, type Point } from "@tscircuit/math-utils"
import type { BreakoutObstacleRect, PcbLayer } from "lib/types"

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180

const rotatePoint = (point: Point, radians: number): Point => {
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)

  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  }
}

const getLocalObstaclePoint = (
  point: Point,
  obstacle: BreakoutObstacleRect,
): Point => {
  const translatedPoint = {
    x: point.x - obstacle.center.x,
    y: point.y - obstacle.center.y,
  }

  return rotatePoint(
    translatedPoint,
    -degreesToRadians(obstacle.ccwRotationDegrees ?? 0),
  )
}

const getInflatedObstacleRect = (obstacle: BreakoutObstacleRect) => {
  const clearance = obstacle.clearance ?? 0
  const halfWidth = obstacle.width / 2 + clearance
  const halfHeight = obstacle.height / 2 + clearance

  return {
    minX: -halfWidth,
    maxX: halfWidth,
    minY: -halfHeight,
    maxY: halfHeight,
  }
}

export const isBreakoutObstacleIgnoredForSourcePort = ({
  obstacle,
  sourcePortId,
}: {
  obstacle: BreakoutObstacleRect
  sourcePortId: string
}) => {
  if (!obstacle.sourcePortIds) return false
  return obstacle.sourcePortIds.includes(sourcePortId)
}

export const isBreakoutObstacleIgnoredForLayer = ({
  obstacle,
  layer,
}: {
  obstacle: BreakoutObstacleRect
  layer?: PcbLayer
}) => {
  if (!obstacle.layer || !layer) return false
  return obstacle.layer !== layer
}

export const doesBreakoutSegmentIntersectObstacle = ({
  from,
  to,
  obstacle,
}: {
  from: Point
  to: Point
  obstacle: BreakoutObstacleRect
}) =>
  doesSegmentIntersectRect(
    getLocalObstaclePoint(from, obstacle),
    getLocalObstaclePoint(to, obstacle),
    getInflatedObstacleRect(obstacle),
  )

export const doesBreakoutSegmentIntersectObstacles = ({
  from,
  to,
  obstacles,
  sourcePortId,
  layer,
}: {
  from: Point
  to: Point
  obstacles: BreakoutObstacleRect[]
  sourcePortId: string
  layer?: PcbLayer
}) => {
  for (const obstacle of obstacles) {
    if (
      isBreakoutObstacleIgnoredForSourcePort({
        obstacle,
        sourcePortId,
      }) ||
      isBreakoutObstacleIgnoredForLayer({
        obstacle,
        layer,
      })
    ) {
      continue
    }

    if (doesBreakoutSegmentIntersectObstacle({ from, to, obstacle })) {
      return true
    }
  }

  return false
}
