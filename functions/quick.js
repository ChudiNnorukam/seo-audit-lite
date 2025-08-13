export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/quick') return new Response('Not Found', {status:404});
    const domain = (url.searchParams.get('domain')||'').trim();
    if (!domain) return Response.json({error:'missing domain'},{status:400});
    const base = domain.startsWith('http') ? domain : 'https://'+domain;
    const result = { domain, base, sitemap:false, robots_sitemap_line:false, alt_sample:[], errors:[] };
    try {
      // sitemap
      const sm1 = await fetch(base.replace(/\/$/,'') + '/sitemap.xml');
      result.sitemap = sm1.status === 200;
    } catch(e){ result.errors.push('sitemap:'+e.message) }
    try {
      // robots
      const r = await fetch(base.replace(/\/$/,'') + '/robots.txt');
      if (r.status===200){
        const txt = await r.text();
        result.robots_sitemap_line = /(^|\n)\s*sitemap\s*:\s*https?:\/\//i.test(txt);
      }
    } catch(e){ result.errors.push('robots:'+e.message) }
    try {
      // homepage alt sample
      const hp = await fetch(base);
      if (hp.status===200){
        const html = await hp.text();
        const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].slice(0,5).map(m=>m[0]);
        const srcAlt = imgs.map(tag=>{
          const src=(tag.match(/src\s*=\s*"([^"]+)"/i)?.[1]||'');
          const alt=(tag.match(/alt\s*=\s*"([^"]*)"/i)?.[1]||'');
          return {src,alt};
        });
        result.alt_sample = srcAlt;
      }
    } catch(e){ result.errors.push('home:'+e.message) }
    return Response.json(result);
  }
}
