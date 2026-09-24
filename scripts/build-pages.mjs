import { cp, mkdtemp, symlink, writeFile, rm, readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { copyReviewer } from './copy-reviewer.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const stage = await mkdtemp(join(root, '.pages-build-'));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Petvewi_C1_website';
if (basePath && !/^\/[A-Za-z0-9_-]+$/.test(basePath)) throw new Error('Invalid Pages base path');
// Exclude server-only routes from a temporary copy, never from the source tree.
for (const file of ['src','public','next.config.ts','tsconfig.json','postcss.config.mjs','package.json']) {
  await cp(join(root,file),join(stage,file), {recursive:true,filter: source => {
    const name=relative(root,source).replaceAll('\\','/');
    return name !== 'src/proxy.ts' && name !== 'src/app/api';
  }});
}
await symlink(join(root,'node_modules'),join(stage,'node_modules'),process.platform==='win32'?'junction':'dir');
await copyReviewer(join(stage,'public','imu-review'));
const build=spawnSync(process.execPath,[join(root,'node_modules/next/dist/bin/next'),'build','--webpack'],{
  cwd:stage,stdio:'inherit',env:{...process.env,NEXT_PUBLIC_STATIC_EXPORT:'true',NEXT_PUBLIC_BASE_PATH:basePath,NEXT_TELEMETRY_DISABLED:'1'}
});
if (build.status !== 0) throw new Error('Pages build failed; original sources were not changed');
// These files are generated only by this script.
const output=join(root,'out');
await rm(output,{recursive:true,force:true});
await cp(join(stage,'out'),output,{recursive:true});
await writeFile(join(output,'.nojekyll'),'');
// Metadata and HTML lang must remain accurate even before hydration.
async function fixHtml(dir) {
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const path=join(dir,entry.name);
    if(entry.isDirectory()) await fixHtml(path);
    else if(entry.name.endsWith('.html')) {
      const route=relative(output,path).replaceAll('\\','/');
      let html=await readFile(path,'utf8');
      const lang=route.startsWith('en/')?'en':route.startsWith('zh-tw/')?'zh-TW':'zh-CN';
      if(!route.startsWith('imu-review/')) html=html.replace(/<html[^>]*>/,tag=>tag.replace(/lang="[^"]*"/,`lang="${lang}"`));
      await writeFile(path,html);
    }
  }
}
await fixHtml(output);
console.log(`Pages output: ${output} (basePath=${basePath || '/'})`);
