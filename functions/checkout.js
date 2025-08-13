// Cloudflare Pages Function: Create Stripe Checkout session (minimal)
// ENV required: STRIPE_SECRET_KEY, STRIPE_PRICE_ID, STRIPE_SUCCESS_URL, STRIPE_CANCEL_URL

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/checkout') return new Response('Not Found', { status: 404 });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    const key = env.STRIPE_SECRET_KEY;
    const price = env.STRIPE_PRICE_ID;
    const success = env.STRIPE_SUCCESS_URL || url.origin + '/?success=1';
    const cancel = env.STRIPE_CANCEL_URL || url.origin + '/?canceled=1';
    if (!key || !price) return Response.json({ error: 'Stripe env not configured' }, { status: 500 });

    // Create a Checkout Session via Stripe API
    const body = new URLSearchParams({
      'mode': 'subscription',
      'line_items[0][price]': price,
      'line_items[0][quantity]': '1',
      'success_url': success,
      'cancel_url': cancel,
    });

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const data = await res.json();
    if (!res.ok) return Response.json({ error: data.error?.message || 'stripe_error' }, { status: 500 });
    return Response.json({ url: data.url });
  }
}
