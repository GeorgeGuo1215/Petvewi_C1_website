import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewerFiles } from './copy-reviewer.mjs';
const root=fileURLToPath(new URL('../out/',import.meta.url));
const base=process.env.NEXT_PUBLIC_BASE_PATH ?? '/Petvewi_C1_website';
let checked=0;
async function walk(dir) {
  for(const entry of await readdir(dir,{withFileTypes:true})) {
    const path=join(dir,entry.name);
    if(entry.isDirectory()) await walk(path);
    else if(entry.name.endsWith('.html')) {
      const html=await readFile(path,'utf8'); checked++;
      for(const match of html.matchAll(/(?:src|href)="(\/[^"#?]*)/g)) {
        const url=match[1]; if(url.startsWith('//')) continue;
        assert.ok(!base || url===base || url.startsWith(base+'/'),`Missing basePath in ${path}: ${url}`);
        const local=resolve(root,decodeURIComponent(url.slice(base.length)).replace(/^\//,''));
        assert.ok(local.startsWith(root.slice(0,-1)),`Unsafe path: ${url}`);
        const info=await stat(local).catch(()=>null);
        assert.ok(info,`Missing asset/route in ${path}: ${url}`);
      }
    }
  }
}
await walk(root);
assert.ok(checked>10,'Expected full website, not just the reviewer');
assert.deepEqual((await readdir(join(root,'imu-review'))).sort(),[...reviewerFiles].sort());
await stat(join(root,'index.html')); await stat(join(root,'en','index.html')); await stat(join(root,'team','index.html'));
console.log(`Validated ${checked} HTML pages and local links/assets; reviewer public allowlist passed.`);
