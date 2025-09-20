import React, { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    price: '$25',
    period: '/month',
    features: [
      '100 AI image generations',
      'Commercial license included',
      'Standard resolution',
      'Email support',
      'Basic editing tools',
    ],
    priceId: 'price_starter123', // Replace with your Stripe price ID
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    features: [
      '300 AI image generations',
      'Commercial license included',
      'High resolution output',
      'Priority support',
      'Advanced editing tools',
      'Batch processing',
    ],
    priceId: 'price_professional123', // Replace with your Stripe price ID
  },
  {
    name: 'Unlimited',
    price: '$89',
    period: '/month',
    features: [
      'Unlimited AI image generations',
      'Commercial license included',
      'Maximum resolution output',
      'Priority support',
      'Full editing suite',
      'Batch processing',
      'API access',
    ],
    priceId: 'price_unlimited123', // Replace with your Stripe price ID
  },
];

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (priceId) => {
    try {
      setLoading(true);
      setError('');

      // Replace with your API endpoint to create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      setError('');

      // Replace with your API endpoint to create Stripe billing portal session
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError('Failed to open billing portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary p-6 w-full text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-400">
            Select the perfect plan for your needs
          </p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-dark-secondary rounded-lg p-6 flex flex-col ring ring-zinc-500 "
            >
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleCheckout(plan.priceId)}
                disabled={loading}
                className="mt-auto bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-400 mb-4">Already have a subscription?</p>
          <button
            onClick={handleManageSubscription}
            disabled={loading}
            className="bg-dark-secondary text-white py-2 px-6 rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Manage Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
