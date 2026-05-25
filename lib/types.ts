import type { Point } from "@tscircuit/math-utils"

export type { Point }

export interface Boundary {
  left: number
  right: number
  bottom: number
  top: number
}

export interface BreakoutPort {
  sourcePortId: string
  position: Point
}

export interface BreakoutTrace {
  sourceTraceId: string
  insidePorts: BreakoutPort[]
  outsidePorts: BreakoutPort[]
}

export interface BreakoutVisualRect {
  center: Point
  width: number
  height: number
  ccwRotationDegrees?: number
  label?: string
}

export interface BreakoutObstacleRect {
  center: Point
  width: number
  height: number
  ccwRotationDegrees?: number
  clearance?: number
  sourcePortIds?: string[]
  kind?: "pad" | "component" | "keepout" | "trace" | "congestion"
  label?: string
}

export interface BreakoutPointSolverInput {
  boundary: Boundary
  traces: BreakoutTrace[]
  usedBoundaryPoints?: Point[]
  boundaryPointSpacing?: number
  obstacles?: BreakoutObstacleRect[]
  visualComponents?: BreakoutVisualRect[]
  visualPads?: BreakoutVisualRect[]
}

export interface BreakoutPointSolverOutputPoint {
  sourcePortId: string
  sourceTraceId: string
  x: number
  y: number
}

export interface BreakoutPointSolverOutput {
  breakoutPoints: BreakoutPointSolverOutputPoint[]
}
