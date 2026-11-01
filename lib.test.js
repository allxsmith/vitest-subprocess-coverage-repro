import { spawnSync } from 'node:child_process'
import { expect, test } from 'vitest'
import { inWorker } from './lib.js'

test('one function runs here and the other in a child process', () => {
  expect(inWorker()).toBe('b')

  const child = spawnSync(process.execPath, ['child.js'], {
    cwd: import.meta.dirname,
    encoding: 'utf8',
  })
  expect(child.status, child.stderr).toBe(0)
})
