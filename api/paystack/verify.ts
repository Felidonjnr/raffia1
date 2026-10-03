export async function GET(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return Response.json({ error: 'Payment gateway is not configured yet.' }, { status: 503 });
    }

    const reference = new URL(request.url).searchParams.get('reference')?.trim();
    if (!reference) {
      return Response.json({ error: 'Payment reference is required.' }, { status: 400 });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data?.status) {
      return Response.json(
        { error: data?.message || 'Unable to verify the payment.' },
        { status: response.ok ? 502 : response.status }
      );
    }

    return Response.json({
      status: data.data?.status,
      reference: data.data?.reference,
      amount: data.data?.amount,
      currency: data.data?.currency,
      channel: data.data?.channel,
      paid_at: data.data?.paid_at,
    });
  } catch (error) {
    console.error('Paystack verification failed', error);
    return Response.json({ error: 'Unable to verify payment. Please contact support.' }, { status: 500 });
  }
}
