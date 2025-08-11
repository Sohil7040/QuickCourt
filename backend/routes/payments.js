const express = require('express');
const { auth } = require('./auth');
const router = express.Router();

// NOTE: Placeholder payments routes. Integrate with a real provider (e.g., Stripe) later.

// @desc    Create payment intent (e.g., for a booking)
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'INR', metadata = {} } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    // Placeholder implementation
    const fakeIntent = {
      id: 'pi_fake_123',
      clientSecret: 'cs_test_fake_123',
      amount,
      currency,
      status: 'requires_payment_method',
      metadata,
    };

    res.status(201).json({
      success: true,
      message: 'Payment intent created',
      data: { intent: fakeIntent },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Payment webhook (provider callback)
// @route   POST /api/payments/webhook
// @access  Public (should be protected with provider secret)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify signature with provider's SDK in a real implementation
    // For now, accept payload and return success
    res.json({ success: true, received: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;

