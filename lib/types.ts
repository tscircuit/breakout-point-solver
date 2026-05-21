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

export interface BreakoutSolverInput {
  boundary: Boundary
  traces: BreakoutTrace[]
}

export interface BreakoutSolverOutputPoint {
  sourcePortId: string
  sourceTraceId: string
  x: number
  y: number
}

export interface BreakoutSolverOutput {
  breakoutPoints: BreakoutSolverOutputPoint[]
}
