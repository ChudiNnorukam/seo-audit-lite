// Pages Function: Stripe connectivity health check (TEST MODE ONLY)
// Requires: STRIPE_SECRET_KEY (sk_test...), optional STRIPE_PRICE_ID
// Safeguard: rejects live keys to prevent accidental use

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/ping-stripe') return new Response('Not Found', { status: 404 });

    const key = env.STRIPE_SECRET_KEY || '';
    if (!key) return Response.json({ ok:false, error:'missing STRIPE_SECRET_KEY' }, { status: 500 });
    if (!key.startsWith('sk_test_')) {
      return Response.json({ ok:false, error:'live key blocked in health check' }, { status: 400 });
    }

    // Minimal request to confirm auth works
    const res = await fetch('https://api.stripe.com/v1/prices?limit=1', {
      headers: { Authorization: `Bearer ${key}` }
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ ok:false, error:data.error?.message || 'stripe_error' }, { status: 500 });

    return Response.json({ ok:true, mode:'test', prices_preview: data.data?.map(p=>({ id:p.id, currency:p.currency, unit_amount:p.unit_amount })) || [] });
  }
}
