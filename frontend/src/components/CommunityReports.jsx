import React, { useState, useEffect } from 'react';
import { getReports, createReport, upvoteReport } from '../services/api';
import { Users, Plus, ThumbsUp, Eye, MessageCircle, AlertCircle, RefreshCw, X, ShieldAlert } from 'lucide-react';

export function CommunityReports({ user }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [scamType, setScamType] = useState('sms');
  const [scamCategory, setScamCategory] = useState('phishing');
  const [description, setDescription] = useState('');
  const [senderInfo, setSenderInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReports();
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReport({
        title,
        scam_type: scamType,
        scam_category: scamCategory,
        description,
        sender_info: senderInfo
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setSenderInfo('');
      fetchReports();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const res = await upvoteReport(id);
      setReports(reports.map(r => r.id === id ? { ...r, upvotes: res.data.upvotes } : r));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Community Scam Feed & Reports</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Crowdsourced threat intelligence and community verified scam alerts.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center space-x-2 text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Scam Report</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-cyan-400" />
          <p>Loading community reports...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {report.scam_category} • {report.scam_type}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    Score: {report.risk_score}/100
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{report.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{report.description}</p>
                {report.sender_info && (
                  <p className="text-xs font-mono text-cyan-400 bg-slate-950 p-2 rounded-lg border border-slate-800 truncate">
                    Sender: {report.sender_info}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleUpvote(report.id)}
                    className="flex items-center space-x-1.5 hover:text-cyan-400 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 text-cyan-500" />
                    <span>{report.upvotes} Confirmations</span>
                  </button>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span>{report.views_count} Views</span>
                  </span>
                </div>
                <span className="text-slate-500">{new Date(report.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Submitting New Report */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Report a New Scam</span>
            </h2>

            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fake Bank Account Suspension SMS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Scam Type</label>
                  <select
                    value={scamType}
                    onChange={(e) => setScamType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="sms">SMS / Text</option>
                    <option value="email">Email</option>
                    <option value="url">Website / Link</option>
                    <option value="phone">Phone Call</option>
                    <option value="crypto">Crypto Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={scamCategory}
                    onChange={(e) => setScamCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="phishing">Phishing</option>
                    <option value="smishing">Smishing</option>
                    <option value="vishing">Vishing</option>
                    <option value="crypto">Crypto Fraud</option>
                    <option value="investment">Investment Scam</option>
                    <option value="tech_support">Tech Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Sender Info (Domain/Phone/Email)</label>
                <input
                  type="text"
                  value={senderInfo}
                  onChange={(e) => setSenderInfo(e.target.value)}
                  placeholder="e.g. fake-chase-login.xyz or +19005550199"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description & Evidence</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the scam message details, what they demanded, and how it happened..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
              >
                {submitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <span>Publish Report</span>}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
