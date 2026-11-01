'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Crown,
  Sparkles,
  Search,
  Plus,
  RefreshCw,
  CreditCard,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  X,
  Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../components/helper/axiosInstance';

export default function AdminContestPasses() {
  const [plans, setPlans] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Manual Grant Modal
  const [grantModal, setGrantModal] = useState({ open: false, userId: '', userSearch: '', planId: '', reason: '' });
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  // Create / Edit Plan Modal
  const [planModal, setPlanModal] = useState({
    open: false,
    isEdit: false,
    planId: null,
    name: '',
    slug: '',
    price: 0,
    participantLimit: 10,
    validityDays: 30,
    isActive: true,
    description: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansRes, summaryRes, purchasesRes] = await Promise.all([
        axiosInstance.get('/api/admin/contests/passes/plans'),
        axiosInstance.get('/api/admin/contests/passes/summary'),
        axiosInstance.get(`/api/admin/contests/passes/purchases?search=${search}&status=${statusFilter}&page=${page}&limit=12`)
      ]);

      if (plansRes.data?.success) setPlans(plansRes.data.plans || []);
      if (summaryRes.data?.success) setSummary(summaryRes.data.summary);
      if (purchasesRes.data?.success) {
        setPurchases(purchasesRes.data.purchases || []);
        setTotalPages(purchasesRes.data.pagination?.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching admin pass data:', err);
      toast.error('Failed to load pass management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, page]);

  // Search users for manual grant
  useEffect(() => {
    if (!grantModal.userSearch.trim()) {
      setUserSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setSearchingUsers(true);
        const res = await axiosInstance.get(`/api/contests/friends/search?search=${encodeURIComponent(grantModal.userSearch.trim())}`);
        if (res.data?.success) {
          setUserSearchResults(res.data.users || []);
        }
      } catch (err) {
        console.error('Search user error:', err);
      } finally {
        setSearchingUsers(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [grantModal.userSearch]);

  // Execute Manual Grant
  const handleExecuteGrant = async (e) => {
    e.preventDefault();
    if (!grantModal.userId || !grantModal.planId) {
      toast.error('Please select both a user and a plan');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/admin/contests/passes/grant', {
        userId: grantModal.userId,
        planId: grantModal.planId,
        reason: grantModal.reason || 'Admin manual grant'
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Pass granted successfully');
        setGrantModal({ open: false, userId: '', userSearch: '', planId: '', reason: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Grant error:', err);
      toast.error(err.response?.data?.message || 'Failed to grant pass');
    }
  };

  // Revoke Pass
  const handleRevokePass = async (purchaseId) => {
    const reason = window.prompt('Please enter a reason for revoking this pass:');
    if (!reason || !reason.trim()) return;

    try {
      const res = await axiosInstance.post(`/api/admin/contests/passes/revoke/${purchaseId}`, {
        reason: reason.trim()
      });
      if (res.data?.success) {
        toast.success(res.data.message || 'Pass revoked successfully');
        fetchData();
      }
    } catch (err) {
      console.error('Revoke error:', err);
      toast.error(err.response?.data?.message || 'Failed to revoke pass');
    }
  };

  // Save Plan (Create or Update)
  const handleSavePlan = async (e) => {
    e.preventDefault();
    try {
      if (planModal.isEdit) {
        const res = await axiosInstance.put(`/api/admin/contests/passes/plans/${planModal.planId}`, {
          name: planModal.name,
          price: Number(planModal.price),
          participantLimit: Number(planModal.participantLimit),
          validityDays: Number(planModal.validityDays),
          isActive: Boolean(planModal.isActive),
          description: planModal.description
        });
        if (res.data?.success) {
          toast.success('Plan updated successfully');
          setPlanModal({ ...planModal, open: false });
          fetchData();
        }
      } else {
        const res = await axiosInstance.post('/api/admin/contests/passes/plans', {
          name: planModal.name,
          slug: planModal.slug,
          price: Number(planModal.price),
          participantLimit: Number(planModal.participantLimit),
          validityDays: Number(planModal.validityDays),
          isActive: Boolean(planModal.isActive),
          description: planModal.description
        });
        if (res.data?.success) {
          toast.success('New plan created successfully');
          setPlanModal({ ...planModal, open: false });
          fetchData();
        }
      }
    } catch (err) {
      console.error('Plan save error:', err);
      toast.error(err.response?.data?.message || 'Failed to save plan');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <Link to="/admin/contests" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Contest Management</span>
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-200 font-medium">Contest Passes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Crown className="w-8 h-8 text-amber-500" />
            <span>Contest Pass & Revenue Management</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage hosting capacity tiers, monitor purchases, inspect revenue, and manually grant or revoke user passes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-800 shadow-xs transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setGrantModal({ open: true, userId: '', userSearch: '', planId: plans[0]?._id || '', reason: '' })}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Manually Grant Pass</span>
          </button>

          <button
            onClick={() => setPlanModal({
              open: true,
              isEdit: false,
              planId: null,
              name: '',
              slug: '',
              price: 299,
              participantLimit: 25,
              validityDays: 30,
              isActive: true,
              description: ''
            })}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-gray-950 dark:from-amber-400 dark:to-yellow-500 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Pass Plan</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Total Purchases</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white block">{summary.totalPurchases}</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">All payment orders generated</span>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Completed Activations</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">{summary.completedPurchases}</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">Successfully verified payments</span>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-1 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Total Pass Revenue</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono block">₹{summary.totalRevenue}</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">Processed through payment gateway</span>
          </div>
        </div>
      )}

      {/* Available Plans Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" />
          <span>Configured Contest Pass Plans</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div key={p._id} className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl space-y-3 relative group">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{p.name}</h4>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {p.price === 0 ? 'Free' : `₹${p.price}`}
                  </span>
                </div>
                <button
                  onClick={() => setPlanModal({
                    open: true,
                    isEdit: true,
                    planId: p._id,
                    name: p.name,
                    slug: p.slug,
                    price: p.price,
                    participantLimit: p.participantLimit,
                    validityDays: p.validityDays,
                    isActive: p.isActive,
                    description: p.description
                  })}
                  className="p-1.5 text-gray-400 hover:text-amber-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Plan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pt-1 border-t border-gray-200 dark:border-gray-800/80">
                <p>Limit: <strong className="text-gray-800 dark:text-gray-200">{p.participantLimit >= 999999 ? 'Unlimited' : `${p.participantLimit} Users`}</strong></p>
                <p>Validity: <strong className="text-gray-800 dark:text-gray-200">{p.validityDays ? `${p.validityDays} Days` : 'Lifetime'}</strong></p>
                <p>Status: <span className={p.isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>{p.isActive ? 'Active' : 'Disabled'}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchases & Transactions Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <span>All Contest Pass Purchases</span>
          </h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search user, order ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:border-amber-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>

        {purchases.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-8">No purchase records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 uppercase font-black tracking-wider border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Order / Payment ID</th>
                  <th className="py-3 px-4">Purchased Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {purchases.map((p) => (
                  <tr key={p._id} className="hover:bg-amber-50/40 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                      <div>
                        <span>{p.user?.name || 'User'}</span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-normal">@{p.user?.username || 'user'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-200">
                      {p.planSnapshot?.name || p.plan?.name || 'Contest Pass'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                      ₹{p.amount}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                      <div>{p.paymentOrderId}</div>
                      {p.paymentId && <div className="text-gray-400 text-[10px]">{p.paymentId}</div>}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {p.purchasedAt ? new Date(p.purchasedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        p.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                        p.status === 'revoked' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400' :
                        'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.status === 'completed' && (
                        <button
                          onClick={() => handleRevokePass(p._id)}
                          className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Grant Pass Modal */}
      {grantModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Manually Grant Contest Pass</span>
              </h3>
              <button
                onClick={() => setGrantModal({ ...grantModal, open: false })}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteGrant} className="space-y-4">
              {/* User Search */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Select User
                </label>
                <input
                  type="text"
                  value={grantModal.userSearch}
                  onChange={(e) => setGrantModal({ ...grantModal, userSearch: e.target.value })}
                  placeholder="Type username or name..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs"
                />

                {userSearchResults.length > 0 && (
                  <div className="mt-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl max-h-40 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                    {userSearchResults.map((u) => (
                      <div
                        key={u._id}
                        onClick={() => setGrantModal({ ...grantModal, userId: u._id, userSearch: `${u.name} (@${u.username})` })}
                        className="p-2 hover:bg-amber-50 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center text-xs"
                      >
                        <span className="text-gray-900 dark:text-white font-bold">{u.name} (@{u.username})</span>
                        {grantModal.userId === u._id && <CheckCircle className="w-4 h-4 text-amber-500" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Plan Picker */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Pass Plan
                </label>
                <select
                  value={grantModal.planId}
                  onChange={(e) => setGrantModal({ ...grantModal, planId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs"
                >
                  {plans.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.participantLimit >= 999999 ? 'Unlimited' : `${p.participantLimit} Users`})
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Audit Reason
                </label>
                <input
                  type="text"
                  value={grantModal.reason}
                  onChange={(e) => setGrantModal({ ...grantModal, reason: e.target.value })}
                  placeholder="e.g., Campus ambassador complimentary upgrade"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGrantModal({ ...grantModal, open: false })}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-gray-950 dark:from-amber-400 dark:to-yellow-500 font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Grant Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Plan Modal */}
      {planModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <span>{planModal.isEdit ? 'Edit Contest Pass Plan' : 'Create New Pass Plan'}</span>
              </h3>
              <button
                onClick={() => setPlanModal({ ...planModal, open: false })}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={planModal.name}
                  onChange={(e) => setPlanModal({ ...planModal, name: e.target.value })}
                  placeholder="e.g. Master Tournament Pass"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs"
                  required
                />
              </div>

              {!planModal.isEdit && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Slug / Plan Code
                  </label>
                  <input
                    type="text"
                    value={planModal.slug}
                    onChange={(e) => setPlanModal({ ...planModal, slug: e.target.value })}
                    placeholder="e.g. master-tournament"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={planModal.price}
                    onChange={(e) => setPlanModal({ ...planModal, price: Number(e.target.value) })}
                    min={0}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Participant Limit
                  </label>
                  <input
                    type="number"
                    value={planModal.participantLimit}
                    onChange={(e) => setPlanModal({ ...planModal, participantLimit: Number(e.target.value) })}
                    min={5}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    value={planModal.validityDays}
                    onChange={(e) => setPlanModal({ ...planModal, validityDays: Number(e.target.value) })}
                    min={1}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={planModal.description}
                  onChange={(e) => setPlanModal({ ...planModal, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActivePlan"
                  checked={planModal.isActive}
                  onChange={(e) => setPlanModal({ ...planModal, isActive: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isActivePlan" className="text-xs text-gray-700 dark:text-gray-300 font-bold cursor-pointer">
                  Enable and show plan on checkout page
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPlanModal({ ...planModal, open: false })}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-gray-950 dark:from-amber-400 dark:to-yellow-500 font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  {planModal.isEdit ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
