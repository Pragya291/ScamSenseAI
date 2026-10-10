import React, { useState, useEffect } from 'react';
import { getScanHistory, deleteScanHistory } from '../services/api';
import { History, Trash2, ShieldAlert, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';

export function ScanHistory({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getScanHistory();
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch scan history. Make sure you are signed in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteScanHistory(id);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Your Scan History</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Backed by Firebase Firestore / Cloud Storage</p>
        </div>
        <button onClick={fetchHistory} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-cyan-400" />
          <p>Loading scan records...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-rose-400 text-center text-sm">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center text-slate-400 space-y-2">
          <p className="font-semibold text-base text-slate-200">No scan history recorded yet.</p>
          <p className="text-xs text-slate-500">Scans performed while logged in will automatically save here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-xs uppercase tracking-wider font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                    {item.scan_type}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    item.risk_level === 'High Risk'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : item.risk_level === 'Suspicious'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {item.risk_level} ({item.risk_score}/100)
                  </span>
                </div>
                <p className="text-slate-200 font-mono text-sm truncate">{item.input_content}</p>
                <p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                title="Delete Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
