const CACHE='isometrica-v1';
const ASSETS=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png',
'fonts/barlow-latin-400-normal.woff2','fonts/barlow-latin-500-normal.woff2','fonts/barlow-latin-600-normal.woff2',
'fonts/barlow-condensed-latin-500-normal.woff2','fonts/barlow-condensed-latin-600-normal.woff2','fonts/barlow-condensed-latin-700-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// pagina: prima la rete (per ricevere gli aggiornamenti), poi la copia offline
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return r}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(n=>{const cp=n.clone();caches.open(CACHE).then(c=>c.put(req,cp));return n})));
});
