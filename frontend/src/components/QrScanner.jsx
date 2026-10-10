import React, { useState } from 'react';
import { scanQr } from '../services/api';
import { QrCode, Upload, RefreshCw, AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle2, FileImage } from 'lucide-react';

export function QrScanner() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setError(null);
    setResult(null);
  };

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await scanQr(formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to decode QR code. Please ensure image contains a clear QR matrix.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <QrCode className="w-3.5 h-3.5" />
            <span>Local OpenCV Image Decoder & Security Inspection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            QR Code Threat Scanner
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Upload any QR code image (quishing attacks, fake restaurant menus, payment posters). We decode the QR matrix locally and inspect the destination payload for malicious intent.
          </p>
        </div>
      </div>

      {/* Dropzone & Form */}
      <form onSubmit={handleScan} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Upload QR Code Image <span className="text-rose-400">*</span>
          </label>
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-8 text-center transition-colors bg-slate-950/60 cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {previewUrl ? (
              <div className="flex flex-col items-center space-y-3">
                <img src={previewUrl} alt="QR Preview" className="w-40 h-40 object-contain rounded-xl border border-slate-700 shadow-md" />
                <span className="text-xs text-cyan-400 font-mono font-medium">{file.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3 py-4">
                <div className="p-4 bg-slate-800/80 rounded-2xl text-cyan-400">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-200 font-semibold text-base">Click to upload or drag & drop QR image</p>
                  <p className="text-slate-500 text-xs mt-1">Supports PNG, JPG, JPEG, WEBP (Max 10MB)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Decoding QR Matrix & Inspecting Payload...</span>
            </>
          ) : (
            <>
              <QrCode className="w-5 h-5" />
              <span>Decode & Analyze QR Code</span>
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 p-5 rounded-2xl flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${
                result.risk_level === 'High Risk'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : result.risk_level === 'Suspicious'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                {result.risk_level}
              </span>
              <h2 className="text-xl font-bold text-white">QR Code Assessment</h2>
              <p className="text-sm text-slate-400 mt-1">{result.explanation}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-xs text-slate-400 font-semibold uppercase">Risk Score</div>
              <div className="text-3xl font-black text-cyan-400 mt-0.5">{result.risk_score}<span className="text-sm text-slate-500">/100</span></div>
            </div>
          </div>

          {result.recommended_actions && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Safety Advice</h3>
              <ul className="space-y-1.5">
                {result.recommended_actions.map((act, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
