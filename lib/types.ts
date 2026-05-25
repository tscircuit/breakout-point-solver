import type { Bounds, Point } from "@tscircuit/math-utils"

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
  label?: string
}

export interface BreakoutPointSolverInput {
  bounds: Bounds
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
