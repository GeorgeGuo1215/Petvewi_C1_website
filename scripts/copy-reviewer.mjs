import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export const reviewerFiles = ['index.html', 'styles.css', 'app.js', 'clock-sync.js', 'review-data.js'];
export async function copyReviewer(destination) {
  const source = fileURLToPath(new URL('../tools/imu-video-reviewer/', import.meta.url));
  await mkdir(destination, { recursive: true });
  // Explicit allowlist: never publish local videos, CSVs, binaries, backend or logs.
  for (const file of reviewerFiles) await copyFile(join(source, file), join(destination, file));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await copyReviewer(fileURLToPath(new URL('../public/imu-review/', import.meta.url)));
}
