# autoAttachSubprocess coverage repro

`lib.test.js` calls `inWorker()` from `lib.js`, then spawns `child.js`, which calls `inChild()`.
Both functions run, so `lib.js` should be fully covered.

```sh
npm install
npm test
```

Vitest 5.0.5 (and 5.1.0-beta.1) on Node 24.22.2 and 25.2.1 reports line 6, `inChild`'s body, as
uncovered:

```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |      50 |      100 |     100 |      50 |
 lib.js   |      50 |      100 |     100 |      50 | 6
----------|---------|----------|---------|---------|-------------------
```

The child's call reaches `% Funcs` but not the lines. Each half alone is reported correctly:

- With `--coverage.autoAttachSubprocess=false`, only the worker counts, and line 6 is uncovered.
- Without the `inWorker` import and call in the test, only the child runs `lib.js`, and line 2 is
  uncovered.

It depends on the length of `inWorker`'s return value. With `'a'`, `'b'` or `'c'` (and the test
expecting it), line 6 is uncovered on every run. With `'bb'`, `'worker'` or `'abcdef'`, the file
is fully covered on every run.
