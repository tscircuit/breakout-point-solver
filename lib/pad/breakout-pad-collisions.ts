import { doesSegmentIntersectRect, type Point } from "@tscircuit/math-utils"
import type { BreakoutPad, PcbLayer } from "lib/types"

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180

const rotatePoint = (point: Point, radians: number): Point => {
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)

  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  }
}

const getLocalPadPoint = (point: Point, pad: BreakoutPad): Point => {
  const translatedPoint = {
    x: point.x - pad.center.x,
    y: point.y - pad.center.y,
  }

  return rotatePoint(
    translatedPoint,
    -degreesToRadians(pad.ccwRotationDegrees ?? 0),
  )
}

const getInflatedPadRect = (pad: BreakoutPad) => {
  const clearance = pad.clearance ?? 0
  const halfWidth = pad.width / 2 + clearance
  const halfHeight = pad.height / 2 + clearance

  return {
    minX: -halfWidth,
    maxX: halfWidth,
    minY: -halfHeight,
    maxY: halfHeight,
  }
}

export const isBreakoutPadIgnoredForSourcePort = ({
  pad,
  sourcePortId,
}: {
  pad: BreakoutPad
  sourcePortId: string
}) => {
  if (!pad.sourcePortIds) return false
  return pad.sourcePortIds.includes(sourcePortId)
}

export const isBreakoutPadIgnoredForLayer = ({
  pad,
  layer,
}: {
  pad: BreakoutPad
  layer?: PcbLayer
}) => {
  if (!pad.layer || !layer) return false
  return pad.layer !== layer
}

export const doesBreakoutSegmentIntersectPad = ({
  from,
  to,
  pad,
}: {
  from: Point
  to: Point
  pad: BreakoutPad
}) =>
  doesSegmentIntersectRect(
    getLocalPadPoint(from, pad),
    getLocalPadPoint(to, pad),
    getInflatedPadRect(pad),
  )

export const doesBreakoutSegmentIntersectNonIgnoredPads = ({
  from,
  to,
  pads,
  ignoredSourcePortIds,
  layer,
}: {
  from: Point
  to: Point
  pads: BreakoutPad[]
  ignoredSourcePortIds: string[]
  layer?: PcbLayer
}) => {
  for (const pad of pads) {
    if (
      ignoredSourcePortIds.some((sourcePortId) =>
        isBreakoutPadIgnoredForSourcePort({
          pad,
          sourcePortId,
        }),
      ) ||
      isBreakoutPadIgnoredForLayer({
        pad,
        layer,
      })
    ) {
      continue
    }

    if (doesBreakoutSegmentIntersectPad({ from, to, pad })) {
      return true
    }
  }

  return false
}

export const doesBreakoutSegmentIntersectPads = ({
  from,
  to,
  pads,
  sourcePortId,
  layer,
}: {
  from: Point
  to: Point
  pads: BreakoutPad[]
  sourcePortId: string
  layer?: PcbLayer
}) =>
  doesBreakoutSegmentIntersectNonIgnoredPads({
    from,
    to,
    pads,
    ignoredSourcePortIds: [sourcePortId],
    layer,
  })
