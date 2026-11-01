'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import {
  Sparkles,
  Trophy,
  Check,
  ShieldCheck,
  Zap,
  Crown,
  Users,
  CreditCard,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../components/helper/axiosInstance';

export default function ContestPassPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.login || {});

  const [plans, setPlans] = useState([]);
  const [entitlement, setEntitlement] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState(null);

  // Helper to dynamically load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansRes, entRes, purchasesRes] = await Promise.all([
        axiosInstance.get('/api/contests/pass/plans'),
        isAuthenticated ? axiosInstance.get('/api/contests/user/hosting-entitlement').catch(() => null) : null,
        isAuthenticated ? axiosInstance.get('/api/contests/pass/my-purchases').catch(() => null) : null
      ]);

      if (plansRes.data?.success) {
        setPlans(plansRes.data.plans || []);
      }
      if (entRes?.data?.success) {
        setEntitlement(entRes.data);
      }
      if (purchasesRes?.data?.success) {
        setPurchases(purchasesRes.data.purchases || []);
      }
    } catch (err) {
      console.error('Error loading contest pass page data:', err);
      toast.error('Failed to load Contest Pass plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  // Handle Plan Purchase
  const handlePurchase = async (plan) => {
    if (!isAuthenticated) {
      toast.error('Please log in to purchase a Contest Pass');
      navigate('/login', { state: { from: '/contests/pass' } });
      return;
    }

    if (plan.isDefaultFree || plan.price === 0) {
      toast.success('You already have access to the Free hosting tier!');
      return;
    }

    try {
      setProcessingPlanId(plan._id);

      // Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load Razorpay payment gateway. Please check your internet connection.');
        return;
      }

      // Create Razorpay Order on Backend
      const orderRes = await axiosInstance.post('/api/contests/pass/order', {
        planId: plan._id
      });

      if (!orderRes.data?.success) {
        toast.error(orderRes.data?.message || 'Failed to create payment order');
        return;
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      // Configure Razorpay Checkout options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency || 'INR',
        name: 'CoderHaveli',
        description: `Contest Pass - ${plan.name}`,
        image: 'https://coderhaveli.com/logo.png',
        order_id: orderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#f59e0b' // Amber 500
        },
        handler: async (response) => {
          try {
            toast.loading('Verifying payment signature securely...', { id: 'verify-payment' });
            
            // Backend signature verification
            const verifyRes = await axiosInstance.post('/api/contests/pass/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data?.success) {
              toast.success('🎉 Contest Pass activated successfully!', { id: 'verify-payment' });
              await fetchData();
            } else {
              toast.error(verifyRes.data?.message || 'Payment verification failed', { id: 'verify-payment' });
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            toast.error(err.response?.data?.message || 'Payment verification failed', { id: 'verify-payment' });
          }
        },
        modal: {
          ondismiss: () => {
            toast('Payment process was cancelled by user.', { icon: 'ℹ️' });
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment checkout');
    } finally {
      setProcessingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wide">
            <Crown className="w-4 h-4" />
            <span>CoderHaveli Contest Pass</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Host Bigger Contests. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 dark:from-amber-400 dark:via-amber-500 dark:to-yellow-500 bg-clip-text text-transparent">
              Compete With Your Whole Circle.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Every user gets free private hosting for up to 5 participants. Unlock higher capacities, custom coding tournaments, and unlimited participants with a Contest Pass.
          </p>
        </div>

        {/* Current Active Entitlement Card (if logged in) */}
        {isAuthenticated && entitlement && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">Your Active Hosting Status</span>
                {entitlement.hasActivePass ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pass Active</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    Free Tier (5 max)
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>Effective Hosting Limit:</span>
                <span className="text-amber-600 dark:text-amber-400">
                  {entitlement.isUnlimited || entitlement.effectiveParticipantLimit >= 99999 || entitlement.effectiveParticipantLimit === null ? 'Unlimited' : `${entitlement.effectiveParticipantLimit || 5} Participants`}
                </span>
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {entitlement.hasActivePass
                  ? `Active plan: ${entitlement.activePlan?.name || 'Contest Pass'} • Valid for hosting private coding contests.`
                  : 'Upgrade to a pass below to host large groups, college clubs, or corporate hackathons.'}
              </p>
            </div>

            <Link
              to="/contests/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:hover:from-amber-400 dark:hover:to-amber-500 text-white dark:text-gray-950 font-black text-xs sm:text-sm rounded-xl shadow-xs dark:shadow-none shrink-0 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Host a Contest Now</span>
            </Link>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isUnlimited = plan.participantLimit >= 999999 || plan.participantLimit === -1;
            const isFree = plan.isDefaultFree || plan.price === 0;
            const isCurrent = entitlement && entitlement.effectiveParticipantLimit === plan.participantLimit;

            return (
              <div
                key={plan._id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between border ${
                  plan.slug === 'premium' || plan.slug === 'unlimited'
                    ? 'bg-gradient-to-b from-amber-50/70 via-white to-white dark:from-amber-950/20 dark:via-gray-900 dark:to-gray-950 border-amber-500 shadow-xs dark:shadow-none'
                    : 'bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 hover:border-amber-400/50 dark:hover:border-gray-700 shadow-xs dark:shadow-none'
                }`}
              >
                {/* Popular / Recommended Tag */}
                {plan.slug === 'premium' && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-yellow-500 text-white dark:text-gray-950 text-[10px] font-black rounded-full uppercase tracking-wider shadow-xs dark:shadow-none">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">{plan.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 min-h-[32px]">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                        {isFree ? '₹0' : `₹${plan.price}`}
                      </span>
                      {!isFree && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                          / {plan.validityDays ? `${plan.validityDays} days` : 'pass'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1 block">
                      {isUnlimited ? 'Unlimited participants' : `Up to ${plan.participantLimit} participants`}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <span className="text-[11px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider block">Included Benefits</span>
                    <ul className="space-y-2.5 text-xs text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">{isUnlimited ? 'Unlimited' : plan.participantLimit}</strong> participants capacity
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>Private arena & question access</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>Real-time leaderboard & judging</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>Valid for {plan.validityDays || 30} days from purchase</span>
                      </li>
                      {plan.features?.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Purchase Button */}
                <div className="pt-8">
                  {isFree ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs font-bold cursor-default border border-gray-200 dark:border-gray-700"
                    >
                      Included by Default
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(plan)}
                      disabled={processingPlanId === plan._id}
                      className={`w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs dark:shadow-none cursor-pointer ${
                        plan.slug === 'premium'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:hover:from-amber-400 dark:hover:to-amber-500 text-white dark:text-gray-950'
                          : 'bg-amber-500 hover:bg-amber-600 dark:bg-gray-800 dark:hover:bg-gray-700 text-white'
                      } disabled:opacity-50`}
                    >
                      {processingPlanId === plan._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Initiating Checkout...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{isCurrent ? 'Extend Pass' : 'Get Pass Now'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Purchase History Section */}
        {isAuthenticated && purchases.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs dark:shadow-none">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Your Purchase History</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 uppercase font-black tracking-wider border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Limit</th>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Purchased Date</th>
                    <th className="py-3 px-4">Expiry</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {purchases.map((p) => (
                    <tr key={p._id} className="hover:bg-amber-50/50 dark:hover:bg-gray-800/50">
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                        {p.planSnapshot?.name || p.plan?.name || 'Contest Pass'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                        ₹{p.amount}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300">
                        {p.participantLimitGranted >= 999999 ? 'Unlimited' : `${p.participantLimitGranted} Users`}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-500 dark:text-gray-400 text-[11px]">
                        {p.paymentOrderId}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                        {p.purchasedAt ? new Date(p.purchasedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                        {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : 'Lifetime'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : p.status === 'revoked'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ / Guarantee Box */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-black text-gray-900 dark:text-white">Secure Payments & Instant Activation</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Payments are processed securely via Razorpay with instant cryptographic verification. Once verified, your hosting limit upgrades immediately for any private contest you create.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
