import { PRODUCTS } from '../../src/data/products';

const SHIPPING_COST = 15000;

export async function POST(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return Response.json({ error: 'Payment gateway is not configured yet.' }, { status: 503 });
    }

    const body = await request.json();
    const email = String(body?.email || '').trim();
    const items = Array.isArray(body?.items) ? body.items : [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!items.length) {
      return Response.json({ error: 'Your basket is empty.' }, { status: 400 });
    }

    const normalizedItems = items
      .map((item: { id?: string; quantity?: number }) => ({
        id: String(item?.id || ''),
        quantity: Math.max(1, Math.floor(Number(item?.quantity || 0))),
      }))
      .filter((item: { id: string; quantity: number }) => item.id && item.quantity > 0);

    const subtotal = normalizedItems.reduce((sum: number, item: { id: string; quantity: number }) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      return product ? sum + product.price * item.quantity : sum;
    }, 0);

    if (subtotal <= 0) {
      return Response.json({ error: 'No valid products were found in your basket.' }, { status: 400 });
    }

    const amount = subtotal + SHIPPING_COST;
    const origin = new URL(request.url).origin;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: String(amount * 100),
        currency: 'NGN',
        first_name: String(body?.firstName || '').trim(),
        last_name: String(body?.lastName || '').trim(),
        phone: String(body?.phone || '').trim(),
        callback_url: `${origin}/#/checkout`,
        metadata: {
          custom_fields: [
            { display_name: 'Delivery Address', variable_name: 'delivery_address', value: String(body?.address || '').trim() },
            { display_name: 'City', variable_name: 'city', value: String(body?.city || '').trim() },
            { display_name: 'State / Region', variable_name: 'state_region', value: String(body?.stateRegion || '').trim() },
            { display_name: 'Country', variable_name: 'country', value: String(body?.country || 'Nigeria').trim() },
          ],
          items: normalizedItems,
          subtotal,
          shipping: SHIPPING_COST,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.status || !data?.data?.authorization_url) {
      return Response.json(
        { error: data?.message || 'Unable to initialize the payment.' },
        { status: response.ok ? 502 : response.status }
      );
    }

    return Response.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      amount,
    });
  } catch (error) {
    console.error('Paystack initialization failed', error);
    return Response.json({ error: 'Unable to start payment. Please try again.' }, { status: 500 });
  }
}
