'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, MapPin, CheckCircle2 } from 'lucide-react';
import toast from '@/components/common/CoderHaveliToast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitted(true);
    toast.success('Message received! Our team will get back to you soon.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-16">
      <div className="bg-amber-400 dark:bg-[#0B0F19] border-b-2 border-amber-600 dark:border-amber-500 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(120,53,15,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,53,15,0.45) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase bg-[#FFFBEB] dark:bg-[#131926] text-amber-800 dark:text-amber-300 border border-amber-700/20 dark:border-amber-500/30 mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            Support
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-amber-950 dark:text-white">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-amber-950/80 dark:text-gray-300 mt-2">
            Have feedback, bug reports, or contest inquiries? Drop us a message.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
            <h2 className="text-base font-black text-gray-900 dark:text-white">Reach CoderHaveli</h2>
            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900 dark:text-white">Email Support</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">support@coderhaveli.com</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900 dark:text-white">Community</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Built in India for developers worldwide</div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Thank You!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your message has been sent. We&apos;ll respond as soon as possible.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prashant Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contest / Problem / Feedback"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

