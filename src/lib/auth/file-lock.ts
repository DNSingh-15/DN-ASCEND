import fs from "node:fs/promises";

// Serialises read-modify-write cycles on a file:
//  - inside this process: a promise queue per lock path
//  - across processes sharing one data dir: an exclusive lock file ("wx" fails if it already exists)
const queues = new Map<string, Promise<unknown>>();

const STALE_AFTER_MS = 15_000; // a lock older than this belongs to a crashed process
const WAIT_LIMIT_MS = 10_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function acquire(lockPath: string): Promise<() => Promise<void>> {
  const started = Date.now();
  for (;;) {
    try {
      const handle = await fs.open(lockPath, "wx");
      await handle.writeFile(`${process.pid} ${Date.now()}`);
      return async () => {
        await handle.close().catch(() => {});
        await fs.unlink(lockPath).catch(() => {});
      };
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== "EEXIST" && code !== "EPERM" && code !== "EBUSY") throw err; // EPERM/EBUSY: Windows while another handle is closing
      const age = await fs.stat(lockPath).then((s) => Date.now() - s.mtimeMs, () => 0);
      if (age > STALE_AFTER_MS) await fs.unlink(lockPath).catch(() => {});
      else if (Date.now() - started > WAIT_LIMIT_MS) throw new Error("Timed out waiting for the users file lock.");
      else await sleep(10 + Math.random() * 30);
    }
  }
}

export function withFileLock<T>(lockPath: string, fn: () => Promise<T>): Promise<T> {
  const previous = queues.get(lockPath) ?? Promise.resolve();
  const run = previous
    .catch(() => {})
    .then(async () => {
      const release = await acquire(lockPath);
      try {
        return await fn();
      } finally {
        await release();
      }
    });
  queues.set(lockPath, run.catch(() => {}));
  return run;
}
