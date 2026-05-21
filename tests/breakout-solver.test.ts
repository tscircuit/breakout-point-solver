import { expect, test } from "bun:test"
import { breakoutSolver } from "lib/index"

test("exports breakout solver string", () => {
  expect(breakoutSolver).toBe("breakout-solver")
})
