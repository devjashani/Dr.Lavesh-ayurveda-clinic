import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

export const isRazorpayLiveConfigured = (): boolean => {
  return Boolean(
    keyId &&
      keySecret &&
      !keyId.includes('your_test_key') &&
      !keySecret.includes('your_test_key') &&
      keyId.startsWith('rzp_')
  );
};

export const razorpay = new Razorpay({
  key_id: keyId || 'dummy_test_key',
  key_secret: keySecret || 'dummy_test_secret',
});

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId;
export const RAZORPAY_KEY_SECRET = keySecret;
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
