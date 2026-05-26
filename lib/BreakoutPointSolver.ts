import { BaseSolver } from "@tscircuit/solver-utils"
import type { Point } from "@tscircuit/math-utils"
import type { GraphicsObject } from "graphics-debug"
import type {
  BreakoutPointSolverInput,
  BreakoutPointSolverOutput,
  BreakoutPointSolverOutputPoint,
  BreakoutPort,
  BreakoutTrace,
  PcbLayer,
} from "./types"
import { getBreakoutBoundaryIntersection } from "./boundary/get-breakout-boundary-intersection"
import {
  getAvailableBreakoutBoundaryPoint,
  getAvailableBreakoutBoundaryPointForOutsidePorts,
} from "./boundary/get-available-breakout-boundary-point"

type GraphicsRect = NonNullable<GraphicsObject["rects"]>[number]

type LayerVisualStyle = {
  insidePadFill: string
  insidePadStroke: string
  insidePointColor: string
  outsidePadFill: string
  outsidePadStroke: string
  outsidePointColor: string
  padFill: string
  padStroke: string
  componentFill: string
  componentStroke: string
  traceStroke: string
  breakoutPointColor: string
}

const getLayerVisualStyle = (layer?: PcbLayer): LayerVisualStyle => {
  if (layer === "bottom") {
    return {
      insidePadFill: "rgba(2, 132, 199, 0.28)",
      insidePadStroke: "#0369a1",
      insidePointColor: "#0369a1",
      outsidePadFill: "rgba(30, 64, 175, 0.2)",
      outsidePadStroke: "#1e40af",
      outsidePointColor: "#1e40af",
      padFill: "rgba(37, 99, 235, 0.18)",
      padStroke: "#1d4ed8",
      componentFill: "rgba(245, 158, 11, 0.1)",
      componentStroke: "#b45309",
      traceStroke: "#2563eb",
      breakoutPointColor: "#0f766e",
    }
  }

  return {
    insidePadFill: "rgba(46, 125, 50, 0.28)",
    insidePadStroke: "#1b5e20",
    insidePointColor: "#1b5e20",
    outsidePadFill: "rgba(106, 27, 154, 0.2)",
    outsidePadStroke: "#6a1b9a",
    outsidePointColor: "#6a1b9a",
    padFill: "rgba(220, 38, 38, 0.22)",
    padStroke: "#b91c1c",
    componentFill: "rgba(245, 158, 11, 0.1)",
    componentStroke: "#b45309",
    traceStroke: "#7e8794",
    breakoutPointColor: "#0d47a1",
  }
}

const getPortPadRect = ({
  port,
  fill,
  stroke,
  fallbackLabel,
}: {
  port: BreakoutPort
  fill: string
  stroke: string
  fallbackLabel: string
}): GraphicsRect | null => {
  if (port.width === undefined || port.height === undefined) return null

  return {
    center: port.position,
    width: port.width,
    height: port.height,
    ccwRotationDegrees: port.ccwRotationDegrees,
    fill,
    stroke,
    label: port.label ?? fallbackLabel,
  }
}

const getAveragePortPosition = (ports: BreakoutPort[]): Point | null => {
  if (ports.length === 0) return null

  const total = ports.reduce(
    (sum, port) => ({
      x: sum.x + port.position.x,
      y: sum.y + port.position.y,
    }),
    { x: 0, y: 0 },
  )

  return {
    x: total.x / ports.length,
    y: total.y / ports.length,
  }
}

const getOutsideTarget = (trace: BreakoutTrace): Point | null =>
  getAveragePortPosition(trace.outsidePorts)

const getInsidePortKey = (port: BreakoutPort) =>
  `${port.sourcePortId}:${port.layer ?? "top"}`

const getOutsidePortsForInsidePort = ({
  traces,
  insidePort,
}: {
  traces: BreakoutTrace[]
  insidePort: BreakoutPort
}) => {
  const outsidePorts: BreakoutPort[] = []
  const insidePortKey = getInsidePortKey(insidePort)

  for (const trace of traces) {
    const hasMatchingInsidePort = trace.insidePorts.some(
      (port) => getInsidePortKey(port) === insidePortKey,
    )
    if (!hasMatchingInsidePort) continue

    outsidePorts.push(...trace.outsidePorts)
  }

  return outsidePorts
}

const getIdealBoundaryPoints = ({
  insidePort,
  outsidePorts,
  bounds,
}: {
  insidePort: BreakoutPort
  outsidePorts: BreakoutPort[]
  bounds: BreakoutPointSolverInput["bounds"]
}) => {
  const idealBoundaryPoints: Point[] = []

  for (const outsidePort of outsidePorts) {
    const idealBoundaryPoint = getBreakoutBoundaryIntersection({
      from: insidePort.position,
      to: outsidePort.position,
      bounds,
    })
    if (idealBoundaryPoint) idealBoundaryPoints.push(idealBoundaryPoint)
  }

  return idealBoundaryPoints
}

export class BreakoutPointSolver extends BaseSolver {
  private input: BreakoutPointSolverInput
  private output: BreakoutPointSolverOutput = { breakoutPoints: [] }

  constructor(input: BreakoutPointSolverInput) {
    super()
    this.input = input
  }

  override _step() {
    const breakoutPoints: BreakoutPointSolverOutputPoint[] = []
    const boundaryPointsByInsidePort = new Map<string, Point>()

    for (const trace of this.input.traces) {
      for (const insidePort of trace.insidePorts) {
        const insidePortKey = getInsidePortKey(insidePort)
        let boundaryPoint: Point | null =
          boundaryPointsByInsidePort.get(insidePortKey) ?? null

        if (!boundaryPoint) {
          const outsidePorts = getOutsidePortsForInsidePort({
            traces: this.input.traces,
            insidePort,
          })
          const idealBoundaryPoints = getIdealBoundaryPoints({
            insidePort,
            outsidePorts,
            bounds: this.input.bounds,
          })
          if (idealBoundaryPoints.length === 0) continue

          const usedBoundaryPoints = [
            ...(this.input.usedBoundaryPoints ?? []),
            ...boundaryPointsByInsidePort.values(),
          ]
          if (outsidePorts.length > 1) {
            boundaryPoint = getAvailableBreakoutBoundaryPointForOutsidePorts({
              idealPoints: idealBoundaryPoints,
              bounds: this.input.bounds,
              usedBoundaryPoints,
              boundaryPointSpacing: this.input.boundaryPointSpacing ?? 0,
              routeFrom: insidePort.position,
              pads: this.input.pads,
              sourcePortId: insidePort.sourcePortId,
              outsidePorts,
              layer: insidePort.layer,
            })
          }

          boundaryPoint ??= getAvailableBreakoutBoundaryPoint({
            idealPoint: idealBoundaryPoints[0]!,
            bounds: this.input.bounds,
            usedBoundaryPoints,
            boundaryPointSpacing: this.input.boundaryPointSpacing ?? 0,
            routeFrom: insidePort.position,
            pads: this.input.pads,
            sourcePortId: insidePort.sourcePortId,
            layer: insidePort.layer,
          })
          if (!boundaryPoint) continue

          boundaryPointsByInsidePort.set(insidePortKey, boundaryPoint)
        }

        breakoutPoints.push({
          sourcePortId: insidePort.sourcePortId,
          sourceTraceId: trace.sourceTraceId,
          x: boundaryPoint.x,
          y: boundaryPoint.y,
          ...(insidePort.layer ? { layer: insidePort.layer } : {}),
        })
      }
    }

    this.output = { breakoutPoints }
    this.solved = true
  }

  override getConstructorParams() {
    return [this.input]
  }

  override getOutput(): BreakoutPointSolverOutput {
    return this.output
  }

  override visualize(): GraphicsObject {
    const { bounds } = this.input
    const width = bounds.maxX - bounds.minX
    const height = bounds.maxY - bounds.minY
    const center = {
      x: bounds.minX + width / 2,
      y: bounds.minY + height / 2,
    }

    return {
      title: "BreakoutPointSolver - generated breakout points",
      rects: [
        {
          center,
          width,
          height,
          fill: "rgba(210, 225, 255, 0.25)",
          stroke: "#315fba",
          label: "breakout bounds",
        },
        ...(this.input.components ?? []).map((component) => ({
          center: component.center,
          width: component.width,
          height: component.height,
          ccwRotationDegrees: component.ccwRotationDegrees,
          fill: getLayerVisualStyle(component.layer).componentFill,
          stroke: getLayerVisualStyle(component.layer).componentStroke,
          label: component.label ?? "component",
        })),
        ...(this.input.pads ?? []).map((pad) => ({
          center: pad.center,
          width: pad.width + (pad.clearance ?? 0) * 2,
          height: pad.height + (pad.clearance ?? 0) * 2,
          ccwRotationDegrees: pad.ccwRotationDegrees,
          fill: getLayerVisualStyle(pad.layer).padFill,
          stroke: getLayerVisualStyle(pad.layer).padStroke,
          label: pad.label ?? "pad",
        })),
        ...this.input.traces.flatMap((trace) =>
          trace.insidePorts.flatMap((port) => {
            const rect = getPortPadRect({
              port,
              fill: getLayerVisualStyle(port.layer).insidePadFill,
              stroke: getLayerVisualStyle(port.layer).insidePadStroke,
              fallbackLabel: `inside pad ${port.sourcePortId}`,
            })
            return rect ? [rect] : []
          }),
        ),
        ...this.input.traces.flatMap((trace) =>
          trace.outsidePorts.flatMap((port) => {
            const rect = getPortPadRect({
              port,
              fill: getLayerVisualStyle(port.layer).outsidePadFill,
              stroke: getLayerVisualStyle(port.layer).outsidePadStroke,
              fallbackLabel: `outside pad ${port.sourcePortId}`,
            })
            return rect ? [rect] : []
          }),
        ),
      ],
      lines: this.input.traces.flatMap((trace) =>
        trace.insidePorts.flatMap((insidePort) => {
          const outsideTarget = getOutsideTarget(trace)
          if (!outsideTarget) return []

          const breakoutPoint = this.output.breakoutPoints.find(
            (point) =>
              point.sourceTraceId === trace.sourceTraceId &&
              point.sourcePortId === insidePort.sourcePortId,
          )
          if (!breakoutPoint) return []

          return [
            {
              points: [
                insidePort.position,
                { x: breakoutPoint.x, y: breakoutPoint.y },
              ],
              strokeColor: getLayerVisualStyle(insidePort.layer).traceStroke,
              label: `breakout segment ${trace.sourceTraceId}`,
            },
            {
              points: [
                { x: breakoutPoint.x, y: breakoutPoint.y },
                outsideTarget,
              ],
              strokeColor: getLayerVisualStyle(insidePort.layer).traceStroke,
              strokeDash: "0.15 0.15",
              label: `target guide ${trace.sourceTraceId}`,
            },
          ]
        }),
      ),
      points: [
        ...this.input.traces.flatMap((trace) =>
          trace.insidePorts.map((port) => ({
            ...port.position,
            color: getLayerVisualStyle(port.layer).insidePointColor,
            label: `inside pad ${port.sourcePortId}`,
          })),
        ),
        ...this.input.traces.flatMap((trace) =>
          trace.outsidePorts.map((port) => ({
            ...port.position,
            color: getLayerVisualStyle(port.layer).outsidePointColor,
            label: `outside target ${port.sourcePortId}`,
          })),
        ),
        ...this.output.breakoutPoints.map((point) => ({
          x: point.x,
          y: point.y,
          color: getLayerVisualStyle(point.layer).breakoutPointColor,
          label: `selected breakout ${point.sourcePortId}`,
        })),
        ...(this.input.usedBoundaryPoints ?? []).map((point) => ({
          ...point,
          color: "#ef6c00",
          label: "pre-existing breakout point",
        })),
      ],
    }
  }
}
