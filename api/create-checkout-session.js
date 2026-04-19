const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, total, products, gradName } = req.body;

  const lineItems = [];
  if (products?.figurine) {
    lineItems.push({ price_data: { currency: 'usd', product_data: { name: `Custom Figurine for ${gradName || 'Graduate'}` }, unit_amount: 8900 }, quantity: 1 });
  }
  if (products?.comic) {
    lineItems.push({ price_data: { currency: 'usd', product_data: { name: `Custom Comic Book for ${gradName || 'Graduate'}` }, unit_amount: 3400 }, quantity: 1 });
  }
  if (products?.storybook) {
    lineItems.push({ price_data: { currency: 'usd', product_data: { name: `Custom Storybook for ${gradName || 'Graduate'}` }, unit_amount: 4400 }, quantity: 1 });
  }

  if (lineItems.length === 0) {
    return res.status(400).json({ error: 'No products selected' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gradseason.com'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gradseason.com'}/order`,
      metadata: { gradName: gradName || '', orderTotal: String(total || 0) },
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
