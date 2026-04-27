import test from "node:test";
import assert from "node:assert/strict";

import { formatRelativeTime } from "../lib/utils.ts";

test("formatRelativeTime returns an empty label for invalid dates", () => {
  assert.equal(formatRelativeTime("not-a-date"), "");
});

test("formatRelativeTime still renders a relative label for valid past dates", () => {
  const ninetyMinutesAgo = new Date(Date.now() - 90 * 60 * 1000).toISOString();

  assert.equal(formatRelativeTime(ninetyMinutesAgo), "2 hr. ago");
});
