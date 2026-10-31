import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
async function walk(dir) { const out = []; for (const entry of await readdir(dir, { withFileTypes: true })) { const p = `${dir}/${entry.name}`; if (entry.isDirectory()) out.push(...await walk(p)); else out.push(p) } return out }
const files = (await walk('dist')).filter(p => !p.endsWith('/sw.js'))
const hash = createHash('sha256')
for (const path of files) hash.update(await readFile(path))
const version = `ustaad-${hash.digest('hex').slice(0, 12)}`
const urls = files.map(p => './' + p.slice(5)).concat('./')
await writeFile('dist/sw.js', `const CACHE=${JSON.stringify(version)};
const ASSETS=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
// Wait for existing clients to close: never replace a running lesson mid-session.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ustaad-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  if(event.request.mode==='navigate')return (await cache.match('./index.html'))||fetch(event.request);
  return (await cache.match(event.request))||fetch(event.request);
 }));
});`)
console.log(`Offline shell: ${files.length} assets, ${version}`)
