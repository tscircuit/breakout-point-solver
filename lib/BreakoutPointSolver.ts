import { BaseSolver } from "@tscircuit/solver-utils"
import type { Point } from "@tscircuit/math-utils"
import type { GraphicsObject } from "graphics-debug"
import type {
  BreakoutPointSolverInput,
  BreakoutPointSolverOutput,
  BreakoutPointSolverOutputPoint,
  BreakoutTrace,
} from "./types"
import { getBreakoutBoundaryIntersection } from "./boundary/get-breakout-boundary-intersection"
import { getAvailableBreakoutBoundaryPoint } from "./boundary/get-available-breakout-boundary-point"

const getOutsideTarget = (trace: BreakoutTrace): Point | null => {
  if (trace.outsidePorts.length === 0) return null

  const total = trace.outsidePorts.reduce(
    (sum, port) => ({
      x: sum.x + port.position.x,
      y: sum.y + port.position.y,
    }),
    { x: 0, y: 0 },
  )

  return {
    x: total.x / trace.outsidePorts.length,
    y: total.y / trace.outsidePorts.length,
  }
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

    for (const trace of this.input.traces) {
      const outsideTarget = getOutsideTarget(trace)
      if (!outsideTarget) continue

      for (const insidePort of trace.insidePorts) {
        const idealBoundaryPoint = getBreakoutBoundaryIntersection({
          from: insidePort.position,
          to: outsideTarget,
          bounds: this.input.bounds,
        })
        if (!idealBoundaryPoint) continue

        const usedBoundaryPoints = [
          ...(this.input.usedBoundaryPoints ?? []),
          ...breakoutPoints,
        ]
        const boundaryPoint = getAvailableBreakoutBoundaryPoint({
          idealPoint: idealBoundaryPoint,
          bounds: this.input.bounds,
          usedBoundaryPoints,
          boundaryPointSpacing: this.input.boundaryPointSpacing ?? 0,
          routeFrom: insidePort.position,
          obstacles: this.input.obstacles,
          sourcePortId: insidePort.sourcePortId,
        })
        if (!boundaryPoint) continue

        breakoutPoints.push({
          sourcePortId: insidePort.sourcePortId,
          sourceTraceId: trace.sourceTraceId,
          x: boundaryPoint.x,
          y: boundaryPoint.y,
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
        ...(this.input.visualComponents ?? []).map((component) => ({
          center: component.center,
          width: component.width,
          height: component.height,
          ccwRotationDegrees: component.ccwRotationDegrees,
          fill: "rgba(255, 245, 170, 0.65)",
          stroke: "#7a5b00",
          label: component.label ?? "component",
        })),
        ...(this.input.visualPads ?? []).map((pad) => ({
          center: pad.center,
          width: pad.width,
          height: pad.height,
          ccwRotationDegrees: pad.ccwRotationDegrees,
          fill: "rgba(170, 120, 40, 0.75)",
          stroke: "#4e342e",
          label: pad.label ?? "pad",
        })),
        ...(this.input.obstacles ?? []).map((obstacle) => ({
          center: obstacle.center,
          width: obstacle.width + (obstacle.clearance ?? 0) * 2,
          height: obstacle.height + (obstacle.clearance ?? 0) * 2,
          ccwRotationDegrees: obstacle.ccwRotationDegrees,
          fill: "rgba(220, 38, 38, 0.22)",
          stroke: "#b91c1c",
          label: obstacle.label ?? "obstacle",
        })),
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
              strokeColor: "#7e8794",
              label: `breakout segment ${trace.sourceTraceId}`,
            },
            {
              points: [
                { x: breakoutPoint.x, y: breakoutPoint.y },
                outsideTarget,
              ],
              strokeColor: "#7e8794",
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
            color: "#1b5e20",
            label: `inside pad ${port.sourcePortId}`,
          })),
        ),
        ...this.input.traces.flatMap((trace) =>
          trace.outsidePorts.map((port) => ({
            ...port.position,
            color: "#6a1b9a",
            label: `outside target ${port.sourcePortId}`,
          })),
        ),
        ...this.output.breakoutPoints.map((point) => ({
          x: point.x,
          y: point.y,
          color: "#0d47a1",
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
