import React, { useState, useEffect } from 'react';
import { getAnalyticsSummary } from '../services/api';
import { BarChart3, ShieldAlert, ShieldCheck, Database, RefreshCw, Activity, PieChart } from 'lucide-react';

export function AnalyticsDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAnalyticsSummary();
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-cyan-400" />
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <span>Platform Threat Analytics</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Real-time scam statistics, detection rates, and threat vector breakdown.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Scans</span>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">{summary.total_scans}</div>
          <p className="text-xs text-slate-500">Multimodal scans executed</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Scams Blocked</span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400">{summary.total_scams_detected}</div>
          <p className="text-xs text-slate-500">High risk threats intercepted</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Scam Detection Rate</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{summary.scam_detection_rate}%</div>
          <p className="text-xs text-slate-500">Intervention accuracy</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Blacklisted Entities</span>
            <Database className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{summary.blacklisted_entities_count}</div>
          <p className="text-xs text-slate-500">Active threat database entries</p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <PieChart className="w-5 h-5 text-cyan-400" />
          <span>Threat Vector Distribution</span>
        </h3>

        <div className="space-y-4">
          {summary.category_breakdown.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-200 font-medium capitalize">{item.category}</span>
                <span className="text-slate-400 font-mono text-xs">{item.count} reports ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
