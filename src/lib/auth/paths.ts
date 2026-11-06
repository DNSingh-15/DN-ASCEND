import path from "node:path";

/** Where users.json (and the generated session key) live. Override with ASCEND_DATA_DIR. */
export function dataDir(): string {
  return process.env.ASCEND_DATA_DIR ? path.resolve(process.env.ASCEND_DATA_DIR) : path.join(process.cwd(), "data");
}
