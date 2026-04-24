import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import { formatRelativeTime, isAnalysisStale } from '@/lib/utils'

describe('privacy-peek date helpers', () => {
  test('returns an empty string for invalid relative-time inputs', () => {
    assert.equal(formatRelativeTime('not-a-date'), '')
  })

  test('treats invalid timestamps as not stale', () => {
    assert.equal(isAnalysisStale('not-a-date'), false)
  })
})
