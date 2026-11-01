'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import AuthLayout from '@/layouts/Authlayout';

const Practice = dynamic(() => import('@/legacy_pages/Practice'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full" />
    </div>
  ),
});

export default function ProblemPracticeClient() {
  return (
    <AuthLayout>
      <Practice />
    </AuthLayout>
  );
}
