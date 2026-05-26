export { BreakoutPointSolver } from "./BreakoutPointSolver"
export { getAvailableBreakoutBoundaryPoint } from "./boundary/get-available-breakout-boundary-point"
export { getBreakoutBoundaryIntersection } from "./boundary/get-breakout-boundary-intersection"
export {
  doesBreakoutSegmentIntersectPad,
  doesBreakoutSegmentIntersectPads,
  isBreakoutPadIgnoredForLayer,
  isBreakoutPadIgnoredForSourcePort,
} from "./pad/breakout-pad-collisions"

export type {
  BreakoutComponent,
  BreakoutPad,
  BreakoutPort,
  BreakoutPointSolverInput,
  BreakoutPointSolverOutput,
  BreakoutPointSolverOutputPoint,
  BreakoutTrace,
  PcbLayer,
} from "./types"
