import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import { getSidebarSkeletonWidth, sidebar_skeleton_widths } from '../lib/sidebar-skeleton.ts'

describe('getSidebarSkeletonWidth', () => {
  test('returns deterministic widths for the same seed', () => {
    assert.equal(getSidebarSkeletonWidth(':r0:'), getSidebarSkeletonWidth(':r0:'))
    assert.equal(getSidebarSkeletonWidth(':r1:'), getSidebarSkeletonWidth(':r1:'))
  })

  test('only returns supported width tokens', () => {
    const seen = new Set<string>()

    for (const seed of [':r0:', ':r1:', ':r2:', ':r3:', ':r4:', ':r5:', ':r6:']) {
      const width = getSidebarSkeletonWidth(seed)
      assert.ok(sidebar_skeleton_widths.includes(width))
      seen.add(width)
    }

    assert.ok(seen.size >= 3)
  })
})
