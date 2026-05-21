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
        const boundaryPoint = getBreakoutBoundaryIntersection({
          from: insidePort.position,
          to: outsideTarget,
          boundary: this.input.boundary,
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
    const { boundary } = this.input
    const width = boundary.right - boundary.left
    const height = boundary.top - boundary.bottom
    const center = {
      x: boundary.left + width / 2,
      y: boundary.bottom + height / 2,
    }

    return {
      title: "BreakoutPointSolver",
      rects: [
        {
          center,
          width,
          height,
          fill: "rgba(210, 225, 255, 0.25)",
          stroke: "#315fba",
          label: "breakout boundary",
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
      ],
      lines: this.input.traces.flatMap((trace) => {
        const outsideTarget = getOutsideTarget(trace)
        if (!outsideTarget) return []

        return trace.insidePorts.map((insidePort) => ({
          points: [insidePort.position, outsideTarget],
          strokeColor: "#777777",
          strokeDash: "0.15 0.15",
          label: trace.sourceTraceId,
        }))
      }),
      points: [
        ...this.input.traces.flatMap((trace) =>
          trace.insidePorts.map((port) => ({
            ...port.position,
            color: "#1b5e20",
            label: port.sourcePortId,
          })),
        ),
        ...this.input.traces.flatMap((trace) =>
          trace.outsidePorts.map((port) => ({
            ...port.position,
            color: "#6a1b9a",
            label: port.sourcePortId,
          })),
        ),
        ...this.output.breakoutPoints.map((point) => ({
          x: point.x,
          y: point.y,
          color: "#0d47a1",
          label: `breakout ${point.sourcePortId}`,
        })),
      ],
    }
  }
}
