import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  PlusCircle,
  MinusCircle,
  Settings,
  Users,
  History,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import HaveliCoinIcon from '../../components/common/HaveliCoinIcon';
import axiosInstance from '../../components/helper/axiosInstance';
import toast from '@/components/common/CoderHaveliToast';

const HaveliCoinsContent = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);

  // Config form state
  const [configForm, setConfigForm] = useState({
    potdRewardCoins: 1,
    streakBonusCoins: 25,
    contestSolveCoins: 1,
    contestTop1BonusCoins: 20,
    contestTop2BonusCoins: 10,
    contestTop3BonusCoins: 5,
    personalPotdPrice: 50,
    personalPotdDurationDays: 30
  });

  // Selected user for credit/debit modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAction, setAdjustAction] = useState('credit');
  const [adjustAmount, setAdjustAmount] = useState('10');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const fetchOverview = useCallback(async (searchQuery = '') => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/admin/coins/overview${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);
      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        setOverview(data);
        if (data.config) {
          setConfigForm({
            potdRewardCoins: data.config.potdRewardCoins ?? 1,
            streakBonusCoins: data.config.streakBonusCoins ?? 25,
            contestSolveCoins: data.config.contestSolveCoins ?? 1,
            contestTop1BonusCoins: data.config.contestTop1BonusCoins ?? 20,
            contestTop2BonusCoins: data.config.contestTop2BonusCoins ?? 10,
            contestTop3BonusCoins: data.config.contestTop3BonusCoins ?? 5,
            personalPotdPrice: data.config.personalPotdPrice ?? 50,
            personalPotdDurationDays: data.config.personalPotdDurationDays ?? 30
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch Haveli Coins overview:', err);
      toast.error(err.response?.data?.message || 'Failed to load Haveli Coins data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOverview(search);
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      setSavingConfig(true);
      const res = await axiosInstance.put('/admin/coins/config', configForm);
      if (res.data?.success) {
        toast.success('Haveli Coin settings saved!');
        fetchOverview(search);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleAdjustCoins = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const amt = parseInt(adjustAmount, 10);
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid positive coin amount');
      return;
    }
    try {
      setAdjusting(true);
      const res = await axiosInstance.post('/admin/coins/adjust', {
        userId: selectedUser._id,
        amount: amt,
        action: adjustAction,
        reason: adjustReason.trim() || (adjustAction === 'credit' ? 'Admin coin grant' : 'Admin coin deduction')
      });
      if (res.data?.success) {
        toast.success(res.data.message || 'Coins updated');
        setSelectedUser(null);
        setAdjustAmount('10');
        setAdjustReason('');
        fetchOverview(search);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to adjust coins');
    } finally {
      setAdjusting(false);
    }
  };

  const stats = overview?.stats || {};
  const users = overview?.users || [];
  const transactions = overview?.transactions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-amber-500/15">
              <HaveliCoinIcon size={28} />
            </span>
            Haveli Coins & Personal AajKaSawal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage user Haveli Coin balances, POTD reward rates, and Personal AajKaSawal plan pricing.
          </p>
        </div>

        <button
          onClick={() => fetchOverview(search)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Coins in Circulation</span>
            <HaveliCoinIcon size={22} />
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
            {stats.totalCoinsInCirculation ?? 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Active Personal Plans</span>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
            {stats.activePersonalPlans ?? 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>POTD Solve Reward</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
            +{configForm.potdRewardCoins} Coins
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Personal Plan Price</span>
            <Settings className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
            {configForm.personalPotdPrice} Coins / {configForm.personalPotdDurationDays}d
          </div>
        </div>
      </div>

      {/* Coin & Plan Configuration */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-amber-500" />
          Coin Rewards & Personal AajKaSawal Settings
        </h2>
        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              POTD Reward (Coins)
            </label>
            <input
              type="number"
              min="0"
              value={configForm.potdRewardCoins}
              onChange={(e) => setConfigForm({ ...configForm, potdRewardCoins: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              7-Day Streak Bonus (Coins)
            </label>
            <input
              type="number"
              min="0"
              value={configForm.streakBonusCoins}
              onChange={(e) => setConfigForm({ ...configForm, streakBonusCoins: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Personal Plan Price (Coins)
            </label>
            <input
              type="number"
              min="0"
              value={configForm.personalPotdPrice}
              onChange={(e) => setConfigForm({ ...configForm, personalPotdPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Plan Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              value={configForm.personalPotdDurationDays}
              onChange={(e) => setConfigForm({ ...configForm, personalPotdDurationDays: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Contest Solve Reward (Coins)
            </label>
            <input
              type="number"
              min="0"
              value={configForm.contestSolveCoins}
              onChange={(e) => setConfigForm({ ...configForm, contestSolveCoins: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Contest Rank #1 Bonus
            </label>
            <input
              type="number"
              min="0"
              value={configForm.contestTop1BonusCoins}
              onChange={(e) => setConfigForm({ ...configForm, contestTop1BonusCoins: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Contest Rank #2 Bonus
            </label>
            <input
              type="number"
              min="0"
              value={configForm.contestTop2BonusCoins}
              onChange={(e) => setConfigForm({ ...configForm, contestTop2BonusCoins: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Contest Rank #3 Bonus
            </label>
            <input
              type="number"
              min="0"
              value={configForm.contestTop3BonusCoins}
              onChange={(e) => setConfigForm({ ...configForm, contestTop3BonusCoins: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={savingConfig}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-sm cursor-pointer disabled:opacity-50"
            >
              {savingConfig ? 'Saving...' : 'Save Coin Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* User Coin Balances & Credit/Debit */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Manage User Haveli Coins
          </h2>
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white w-60"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-gray-900 dark:bg-amber-500 text-white dark:text-gray-950 text-sm font-bold cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Haveli Coins</th>
                <th className="py-3 px-3">Personal AajKaSawal</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => {
                const isPlanActive =
                  u.personalAajKaSawal?.isActive &&
                  (!u.personalAajKaSawal?.expiresAt || new Date(u.personalAajKaSawal.expiresAt) > new Date());
                return (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-gray-800/40">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900 dark:text-white">{u.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs">
                        <HaveliCoinIcon size={16} />
                        {u.haveliCoins ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {isPlanActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                          <Sparkles className="w-3 h-3" />
                          Active {u.personalAajKaSawal?.selectedTopic ? `(${u.personalAajKaSawal.selectedTopic})` : '(No topic)'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Standard POTD</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setAdjustAction('credit');
                            setAdjustAmount('10');
                            setAdjustReason('');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setAdjustAction('debit');
                            setAdjustAmount('10');
                            setAdjustReason('');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold cursor-pointer"
                        >
                          <MinusCircle className="w-3.5 h-3.5" />
                          Deduct
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Coin Transactions */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-blue-500" />
          Recent Coin Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Balance After</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-gray-800/40">
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-gray-900 dark:text-white">{tx.userId?.name || 'User'}</div>
                    <div className="text-xs text-gray-400">{tx.userId?.email}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`font-bold ${tx.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-gray-200">
                    {tx.balanceAfter}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300 text-xs max-w-xs truncate">
                    {tx.reason}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No coin transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit / Debit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
              {adjustAction === 'credit' ? (
                <PlusCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <MinusCircle className="w-5 h-5 text-rose-500" />
              )}
              {adjustAction === 'credit' ? 'Add Haveli Coins' : 'Deduct Haveli Coins'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {selectedUser.name} ({selectedUser.email}) • Current Balance:{' '}
              <strong className="text-amber-500">{selectedUser.haveliCoins ?? 0} Coins</strong>
            </p>

            <form onSubmit={handleAdjustCoins} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Amount (Haveli Coins)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Reason / Note
                </label>
                <input
                  type="text"
                  placeholder={adjustAction === 'credit' ? 'e.g. Contest winner bonus' : 'e.g. Adjustment'}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className={`px-4 py-2 rounded-xl text-sm font-bold text-white cursor-pointer disabled:opacity-50 ${
                    adjustAction === 'credit' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {adjusting ? 'Processing...' : adjustAction === 'credit' ? 'Credit Coins' : 'Deduct Coins'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HaveliCoinsContent;

