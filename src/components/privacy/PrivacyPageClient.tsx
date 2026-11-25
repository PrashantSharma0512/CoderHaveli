'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import {
  ShieldCheck,
  Lock,
  Database,
  Bell,
  CheckCircle2,
  Check,
  ArrowLeft,
  FileText
} from 'lucide-react';
import toast from '@/components/common/CoderHaveliToast';
import axiosInstance from '@/components/helper/axiosInstance';

interface PolicyData {
  title: string;
  content: string;
  version: number;
  updatedAt?: string;
}

interface ParsedSection {
  heading: string;
  bodyLines: string[];
}

function parsePolicySections(rawContent: string): { intro: string; sections: ParsedSection[] } {
  const lines = (rawContent || '').split(/\r?\n/);
  const introLines: string[] = [];
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^\d+\.\s+/.test(trimmed)) {
      if (current) sections.push(current);
      current = { heading: trimmed, bodyLines: [] };
    } else if (current) {
      if (trimmed) current.bodyLines.push(trimmed);
    } else if (trimmed) {
      introLines.push(trimmed);
    }
  }
  if (current) sections.push(current);

  return { intro: introLines.join(' '), sections };
}

export default function PrivacyPageClient({ initialPolicy }: { initialPolicy?: PolicyData | null }) {
  const { isAuthenticated, userId, initialized } = useSelector((state: any) => state?.login || {});
  const [policy, setPolicy] = useState<PolicyData>(
    initialPolicy || {
      title: 'CoderHaveli Privacy Policy',
      content:
        'CoderHaveli respects your privacy and protects your account, code submissions, and learning progress.',
      version: 1
    }
  );
  const [hasAccepted, setHasAccepted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!initialized) return;
    axiosInstance
      .get('/api/privacy-policy')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const { policy: latest, needsAcceptance } = res.data.data;
          if (latest) setPolicy(latest);
          if (isAuthenticated && userId) {
            setHasAccepted(!needsAcceptance);
          } else {
            try {
              const guestVer = Number(localStorage.getItem('coderhaveli_privacy_accepted_v') || '0');
              setHasAccepted(Boolean(latest && guestVer === Number(latest.version)));
            } catch {
              setHasAccepted(false);
            }
          }
        }
      })
      .catch(() => {});
  }, [initialized, isAuthenticated, userId]);

  const handleRespond = async (action: 'accept' | 'decline') => {
    try {
      setSubmitting(true);
      if (isAuthenticated && userId) {
        await axiosInstance.post('/api/privacy-policy/respond', { action });
      }
      if (action === 'accept') {
        try {
          localStorage.setItem('coderhaveli_privacy_accepted_v', String(policy.version));
        } catch {
          // ignore
        }
        setHasAccepted(true);
        toast.success(`Accepted Privacy Policy v${policy.version}`);
      } else {
        try {
          localStorage.removeItem('coderhaveli_privacy_accepted_v');
        } catch {
          // ignore
        }
        setHasAccepted(false);
        toast('Privacy Policy declined for now');
      }
    } catch {
      toast.error('Could not update privacy preference');
    } finally {
      setSubmitting(false);
    }
  };

  const { intro, sections } = parsePolicySections(policy.content);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-16">
      {/* Top Architectural Banner */}
      <div className="bg-amber-400 dark:bg-[#0B0F19] border-b-2 border-amber-600 dark:border-amber-500 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(120,53,15,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,53,15,0.45) 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#FFFBEB] dark:bg-[#131926] border border-amber-700/25 dark:border-amber-500/40 shadow-sm shrink-0">
              <ShieldCheck className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-[#FFFBEB] dark:bg-[#131926] text-amber-800 dark:text-amber-300 border border-amber-700/20 dark:border-amber-500/30">
                  Version {policy.version}
                </span>
                {policy.updatedAt && (
                  <span className="text-xs font-semibold text-amber-950/80 dark:text-gray-400">
                    Updated {new Date(policy.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-amber-950 dark:text-white">
                {policy.title}
              </h1>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFBEB] dark:bg-[#131926] text-amber-900 dark:text-amber-300 font-bold text-xs sm:text-sm border border-amber-700/25 dark:border-amber-500/40 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Trust Highlights & Consent Action */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Consent Status Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                Your Consent Status
              </span>
              {hasAccepted ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Accepted v{policy.version}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                  Pending Review
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {hasAccepted
                ? `You have accepted Privacy Policy v${policy.version}. You will only be prompted again if CoderHaveli updates these terms.`
                : 'Please review the policy sections and click Accept to confirm your consent.'}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={submitting || hasAccepted}
                onClick={() => handleRespond('accept')}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{hasAccepted ? 'Accepted' : 'Accept Policy'}</span>
              </button>
              {!hasAccepted && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleRespond('decline')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer disabled:opacity-50"
                >
                  Decline
                </button>
              )}
            </div>
          </div>

          {/* Key Commitments */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3.5">
            <h2 className="text-sm font-black text-gray-900 dark:text-white">Our Privacy Commitments</h2>
            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Encrypted JWT authentication &amp; HTTP-only refresh cookies.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Database className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Zero third-party data selling — your code &amp; progress stay yours.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Bell className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <span>Versioned updates notify you whenever terms change.</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Content: Structured Policy Sections */}
        <section className="lg:col-span-8 space-y-5">
          {intro && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {intro}
              </p>
            </div>
          )}

          {sections.length > 0 ? (
            sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3"
              >
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{sec.heading}</span>
                </h2>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {sec.bodyLines.map((line, lIdx) =>
                    line.startsWith('- ') ? (
                      <div key={lIdx} className="flex items-start gap-2 pl-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <span>{line.slice(2)}</span>
                      </div>
                    ) : (
                      <p key={lIdx}>{line}</p>
                    )
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {policy.content}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

