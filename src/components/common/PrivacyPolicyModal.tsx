'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ShieldCheck, Check, X } from 'lucide-react';
import axiosInstance from '@/components/helper/axiosInstance';

interface PolicyData {
  title: string;
  content: string;
  version: number;
  updatedAt?: string;
}

export default function PrivacyPolicyModal() {
  const pathname = usePathname() || '';
  const { isAuthenticated, userId, initialized } = useSelector((state: any) => state?.login || {});

  const [policy, setPolicy] = useState<PolicyData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [declinedThisVisit, setDeclinedThisVisit] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!initialized || declinedThisVisit) return;
    if (pathname === '/privacy' || pathname.startsWith('/admin')) {
      setIsOpen(false);
      return;
    }

    let cancelled = false;
    const checkPolicyStatus = async () => {
      try {
        const res = await axiosInstance.get('/api/privacy-policy');
        if (cancelled || !res.data?.success || !res.data?.data?.policy) return;

        const { policy: latestPolicy, needsAcceptance } = res.data.data;
        setPolicy(latestPolicy);

        if (isAuthenticated && userId) {
          // Authenticated users: server checks user.privacyPolicy.accepted && acceptedVersion === policy.version
          setIsOpen(Boolean(needsAcceptance));
        } else {
          // Guest users: check localStorage accepted version
          let guestAcceptedVer = 0;
          try {
            guestAcceptedVer = Number(localStorage.getItem('coderhaveli_privacy_accepted_v') || '0');
          } catch {
            guestAcceptedVer = 0;
          }
          setIsOpen(guestAcceptedVer !== Number(latestPolicy.version));
        }
      } catch {
        // Silently ignore if backend is temporarily unreachable
      }
    };

    checkPolicyStatus();
    return () => {
      cancelled = true;
    };
  }, [initialized, isAuthenticated, userId, pathname, declinedThisVisit]);

  const handleAccept = async () => {
    if (!policy) return;
    try {
      setSubmitting(true);
      if (isAuthenticated && userId) {
        await axiosInstance.post('/api/privacy-policy/respond', { action: 'accept' });
      }
      try {
        localStorage.setItem('coderhaveli_privacy_accepted_v', String(policy.version));
      } catch {
        // ignore storage errors
      }
      setIsOpen(false);
    } catch {
      // Keep open if API failed
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async () => {
    try {
      setSubmitting(true);
      if (isAuthenticated && userId) {
        await axiosInstance.post('/api/privacy-policy/respond', { action: 'decline' });
      }
      try {
        localStorage.removeItem('coderhaveli_privacy_accepted_v');
      } catch {
        // ignore
      }
      // Close for current browsing session; will show again when user comes initially
      setDeclinedThisVisit(true);
      setIsOpen(false);
    } catch {
      setDeclinedThisVisit(true);
      setIsOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !policy) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-2 sm:p-4 pointer-events-none">
      <div className="pointer-events-auto max-w-5xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-amber-300/70 dark:border-gray-700 rounded-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.18)] overflow-hidden">
        {/* Expandable Policy Details */}
        {expanded && (
          <div className="px-4 sm:px-6 py-3.5 max-h-56 overflow-y-auto border-b border-gray-200 dark:border-gray-800 bg-slate-50/90 dark:bg-gray-950/60 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {policy.content}
          </div>
        )}

        {/* Bottom Consent Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                  {policy.title}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
                  v{policy.version}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                {policy.content}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  {expanded ? 'Hide Details' : 'View Summary'}
                </button>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <Link
                  href="/privacy"
                  className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:underline"
                >
                  Full Policy Page
                </Link>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 justify-end">
            <button
              type="button"
              disabled={submitting}
              onClick={handleDecline}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 cursor-pointer disabled:opacity-50"
            >
              Decline
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleAccept}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{submitting ? 'Saving...' : 'Accept'}</span>
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer hidden sm:inline-flex"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

