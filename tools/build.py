"""Gera SPA e HTML autônomo da mesma fonte. Sem dependências externas."""
from pathlib import Path
import re,json,hashlib
ROOT=Path(__file__).resolve().parent.parent
s=(ROOT/'src/app.template.html').read_text()
(ROOT/'index.html').write_text(s)
def script(m):
 path=m[2];attrs=m[1]
 return '<script'+attrs+'>'+ (ROOT/path).read_text()+'</script>'
a=re.sub(r'<script([^>]*?) src="\./([^"]+)"[^>]*></script>',script,s)
def style(m):return '<style'+m[1]+'>'+(ROOT/m[2]).read_text()+'</style>'
a=re.sub(r'<link([^>]*?) rel="stylesheet" href="\./([^"]+)"[^>]*>',style,a)
(ROOT/'evolufisico.html').write_text(a)
files=['./','./index.html','./evolufisico.html','./manifest.webmanifest','./favicon.svg','./icon-192.png','./icon-512.png']+['./'+str(p.relative_to(ROOT)) for p in sorted((ROOT/'assets').rglob('*')) if p.is_file()]
sw=(ROOT/'sw.js').read_text();sw=re.sub(r'/\* PRECACHE_START \*/.*?/\* PRECACHE_END \*/','/* PRECACHE_START */'+json.dumps(files)+'/* PRECACHE_END */',sw,flags=re.S)
fingerprint=hashlib.sha256((s+a+(ROOT/'manifest.webmanifest').read_text()).encode()).hexdigest()[:12]
sw=re.sub(r"const CACHE_NAME = '[^']+';",f"const CACHE_NAME = 'evolufisico-9.0-beta-{fingerprint}';",sw)
(ROOT/'sw.js').write_text(sw)
print('Build concluído:',len(files),'recursos;',fingerprint)
