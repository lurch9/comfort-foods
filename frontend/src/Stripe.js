import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(getEnv('VITE_STRIPE_PUBLIC_KEY'));
