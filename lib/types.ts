import type { Bounds, Point } from "@tscircuit/math-utils"

export type PcbLayer = "top" | "bottom"

export interface BreakoutPort {
  sourcePortId: string
  position: Point
  width?: number
  height?: number
  ccwRotationDegrees?: number
  layer?: PcbLayer
  label?: string
}

export interface BreakoutTrace {
  sourceTraceId: string
  insidePorts: BreakoutPort[]
  outsidePorts: BreakoutPort[]
}

export interface BreakoutObstacleRect {
  center: Point
  width: number
  height: number
  ccwRotationDegrees?: number
  clearance?: number
  sourcePortIds?: string[]
  layer?: PcbLayer
  label?: string
}

export interface BreakoutPointSolverInput {
  bounds: Bounds
  traces: BreakoutTrace[]
  usedBoundaryPoints?: Point[]
  boundaryPointSpacing?: number
  obstacles?: BreakoutObstacleRect[]
}

export interface BreakoutPointSolverOutputPoint {
  sourcePortId: string
  sourceTraceId: string
  x: number
  y: number
  layer?: PcbLayer
}

export interface BreakoutPointSolverOutput {
  breakoutPoints: BreakoutPointSolverOutputPoint[]
}
