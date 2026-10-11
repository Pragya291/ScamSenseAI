import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Link2, 
  QrCode, 
  Image as ImageIcon, 
  Mail, 
  Phone, 
  ArrowRight, 
  UploadCloud, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  RotateCcw, 
  Bookmark, 
  ChevronRight, 
  Info,
  X,
  Search
} from 'lucide-react';
import { scanText, scanUrl, scanQr, scanPhone, scanMulti, scanContent } from '../services/api';

export default function ScanWorkspace({ 
  onSaveScan, 
  initialScanType = 'URL',
  initialInputValue = '',
  onViewHistory 
}) {
  const [scanType, setScanType] = useState(initialScanType);
  const [inputValue, setInputValue] = useState(initialInputValue);
  
  // Specific fields for Email
  const [emailSender, setEmailSender] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  
  // Specific fields for Phone
  const [phoneCountry, setPhoneCountry] = useState('+91');
  
  // File upload state for QR & Screenshot
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Analysis workflow states
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Idle, 1: Input, 2: Extract, 3: Check Signals, 4: AI Analysis, 5: Risk+Evidence, 6: Next Action
  const [validationError, setValidationError] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showFullReportModal, setShowFullReportModal] = useState(false);

  // Result state
  const [scanResult, setScanResult] = useState({
    id: 'scan-demo-88',
    type: 'URL',
    content: 'https://secure-pay-verify.net/auth-login',
    timestamp: 'Just now',
    score: 88,
    verdict: 'High Risk',
    badgeClass: 'bg-red-50 text-red-600 border-red-200',
    indicators: [
      'Urgent payment request',
      'Suspicious domain: secure-pay-verify.net',
      'Impersonation cues: mimicking bank branding',
      'No HTTPS; mismatched sender email'
    ],
    explanation: 'The URL attempts to imitate a reputable banking authorization portal while hosted on an unverified domain registered only 3 days ago with high-risk keyword prefixes.',
    saferSteps: [
      "Don't click or pay yet.",
      'Verify through the official app or official website.',
      'Block & report this sender.'
    ],
    isSimulated: true
  });

  useEffect(() => {
    if (initialScanType) setScanType(initialScanType);
    if (initialInputValue) setInputValue(initialInputValue);
  }, [initialScanType, initialInputValue]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      setValidationError('File size exceeds the 10MB limit. Please upload a smaller file.');
      return;
    }
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Unsupported format. Please upload PNG, JPG, or WEBP images.');
      return;
    }

    setValidationError('');
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateInput = () => {
    setValidationError('');
    if (scanType === 'URL') {
      if (!inputValue.trim()) return 'Please enter a URL to inspect.';
      if (!inputValue.startsWith('http://') && !inputValue.startsWith('https://') && !inputValue.includes('.')) {
        return 'Please enter a valid website address (e.g. https://example.com).';
      }
    } else if (scanType === 'Message') {
      if (!inputValue.trim()) return 'Please enter message content to analyze.';
    } else if (scanType === 'Email') {
      if (!inputValue.trim() && !emailSubject.trim()) return 'Please enter email body or subject line.';
    } else if (scanType === 'Phone Number') {
      if (!inputValue.trim() || inputValue.replace(/\D/g, '').length < 7) {
        return 'Please enter a valid phone number with area code.';
      }
    } else if (scanType === 'QR Code' || scanType === 'Screenshot') {
      if (!selectedFile && !inputValue.trim()) {
        return 'Please upload an image file or provide the destination text.';
      }
    }
    return null;
  };

  const handleAnalyze = async () => {
    const error = validateInput();
    if (error) {
      setValidationError(error);
      return;
    }

    if (isScanning) return; // Prevent duplicate scan submissions

    setIsScanning(true);
    setValidationError('');
    setSavedSuccess(false);

    // Multi-step progress animation reflecting actual workflow
    setCurrentStep(1); // 01 Input
    const stepTimer1 = setTimeout(() => setCurrentStep(2), 250); // 02 Extract
    const stepTimer2 = setTimeout(() => setCurrentStep(3), 550); // 03 Check Signals
    const stepTimer3 = setTimeout(() => setCurrentStep(4), 950); // 04 AI Analysis
    const stepTimer4 = setTimeout(() => setCurrentStep(5), 1400); // 05 Risk + Evidence

    const submissionText = inputValue || (selectedFile ? selectedFile.name : '');

    try {
      let response = null;

      if (scanType === 'URL') {
        response = await scanUrl(inputValue.trim());
      } else if (scanType === 'Message') {
        response = await scanText(inputValue.trim());
      } else if (scanType === 'Email') {
        const sender = emailSender.trim() || undefined;
        response = await scanText(inputValue.trim() || emailSubject.trim(), sender);
      } else if (scanType === 'Phone Number') {
        const fullPhone = phoneCountry ? `${phoneCountry} ${inputValue.trim()}` : inputValue.trim();
        response = await scanPhone(fullPhone);
      } else if (scanType === 'QR Code' || scanType === 'Screenshot') {
        if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);
          response = await scanQr(formData);
        } else {
          response = await scanContent({ content: inputValue.trim(), scan_type: 'qr' });
        }
      } else {
        response = await scanContent({ content: submissionText });
      }

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(stepTimer4);
      setCurrentStep(6); // 06 Next Action

      if (!response || !response.data) {
        throw new Error('Empty response received from ScamSense AI server.');
      }

      const data = response.data;
      const score = Math.round(data.risk_score !== undefined ? data.risk_score : 0);
      const verdict = (data.verdict === 'SCAM' || data.verdict === 'High Risk' || data.risk_level === 'High Risk' || score >= 70) 
        ? 'High Risk' 
        : (data.verdict === 'SUSPICIOUS' || data.verdict === 'Suspicious' || data.risk_level === 'Suspicious' || score >= 35) 
        ? 'Suspicious' 
        : 'Safe';

      const badgeClass = verdict === 'High Risk'
        ? 'bg-red-50 text-red-600 border-red-200'
        : verdict === 'Suspicious'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200';

      const indicators = (data.indicators && data.indicators.length > 0)
        ? data.indicators
        : (data.red_flags && data.red_flags.length > 0)
        ? data.red_flags
        : (data.threat_indicators && data.threat_indicators.length > 0)
        ? data.threat_indicators.map(t => t.description)
        : ['Content analyzed: no anomalous threat indicators detected.'];

      const explanation = data.explanation || data.summary || data.analysis || 'Analysis successfully completed by ScamSense AI security engine.';
      
      const saferSteps = (data.recommendations && data.recommendations.length > 0)
        ? data.recommendations
        : (data.recommended_actions && data.recommended_actions.length > 0)
        ? data.recommended_actions
        : ['Exercise standard verification caution before submitting sensitive credentials.'];

      const newResult = {
        id: data.scan_id || `scan-${Date.now().toString().slice(-6)}`,
        type: scanType,
        content: submissionText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        score,
        verdict,
        badgeClass,
        indicators,
        explanation,
        saferSteps,
        securityChecks: data.security_checks || {},
        sources: data.sources || data.web_evidence || [],
        executionTime: data.execution_time_ms || 0,
        isSimulated: false
      };

      setScanResult(newResult);

      if (onSaveScan) {
        onSaveScan(newResult);
      }
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(stepTimer4);
      console.error('ScamSense AI scan error:', err);
      const msg = err.friendlyMessage || err.response?.data?.detail || 'Unable to connect to ScamSense AI server. Please try again.';
      setValidationError(msg);
      setCurrentStep(0);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopySummary = () => {
    if (!scanResult) return;
    const text = `ScamSense AI Scan Summary\nType: ${scanResult.type}\nVerdict: ${scanResult.verdict} (Score: ${scanResult.score}/100)\nContent: ${scanResult.content}\n\nEvidence:\n${scanResult.indicators.map(i => '- ' + i).join('\n')}\n\nRecommendations:\n${scanResult.saferSteps.map(s => '- ' + s).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleSaveToHistory = () => {
    if (onSaveScan && scanResult) {
      onSaveScan(scanResult);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  // 6 Steps definition
  const detectionSteps = [
    { num: '01', title: '01 Input', sub: 'Paste or upload' },
    { num: '02', title: '02 Extract', sub: 'Parse content & text' },
    { num: '03', title: '03 Check Signals', sub: 'Domain / patterns / blacklist' },
    { num: '04', title: '04 AI Analysis', sub: 'LLM risk & behavior' },
    { num: '05', title: '05 Risk + Evidence', sub: 'Score & flags' },
    { num: '06', title: '06 Next Action', sub: 'Safe recommendation' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F1F5F9] tracking-tight">
          Scan Anything <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#6366F1] dark:to-[#9333EA]">Suspicious</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A8B6CC] mt-1.5">
          Paste a message or URL, or upload a QR code / screenshot — Detect. Explain. Protect.
        </p>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Card & Detection Workflow (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-[#293953] shadow-sm space-y-6">
            
            {/* Scan Type Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'Message', label: 'Message', icon: MessageSquare },
                { id: 'URL', label: 'URL', icon: Link2 },
                { id: 'QR Code', label: 'QR Code', icon: QrCode },
                { id: 'Screenshot', label: 'Screenshot', icon: ImageIcon },
                { id: 'Email', label: 'Email', icon: Mail },
                { id: 'Phone Number', label: 'Phone Number', icon: Phone },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = scanType === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setScanType(item.id);
                      setValidationError('');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                      isActive
                        ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] text-white shadow-sm shadow-blue-500/20'
                        : 'bg-slate-100 dark:bg-[#162238] text-slate-600 dark:text-[#A8B6CC] hover:bg-slate-200 dark:hover:bg-[#1E2D4A] dark:hover:text-[#F1F5F9]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Drag & Drop Visual Area for QR / Screenshot or Quick Drop */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => {
                if (!selectedFile && fileInputRef.current) fileInputRef.current.click();
              }}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition cursor-pointer relative overflow-hidden ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30' 
                  : 'border-purple-200/80 dark:border-[#293953] bg-linear-to-br from-blue-50/40 via-purple-50/40 to-slate-50 dark:from-[#162238]/60 dark:via-[#111C32] dark:to-[#0B1120] hover:border-blue-400 dark:hover:border-[#6366F1]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-white dark:bg-[#162238] rounded-2xl border border-purple-200 dark:border-[#293953] shadow-xs">
                  <div className="flex items-center gap-3">
                    {filePreview ? (
                      <img src={filePreview} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-[#293953]" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F1F5F9] truncate max-w-xs">{selectedFile.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-[#8494AD]">{(selectedFile.size / 1024).toFixed(1)} KB • Image ready for analysis</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    title="Remove File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F1F5F9]">
                    Drag & drop QR code or screenshot here
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A8B6CC] max-w-md mx-auto leading-relaxed">
                    PNG, JPG up to 10MB — or use the field below to paste a suspicious link or message
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Specific Inputs depending on selected type */}
            <div className="space-y-3">
              {scanType === 'Message' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8494AD]">
                    <span className="font-semibold uppercase text-[10px] tracking-wider text-slate-400 dark:text-[#8494AD]">Message Content</span>
                    <span>{inputValue.length} characters</span>
                  </div>
                  <textarea
                    rows={4}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Paste a suspicious SMS, WhatsApp message, or direct message here..."
                    className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-[#293953] text-xs sm:text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#8494AD] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#6366F1] bg-slate-50/50 dark:bg-[#162238]"
                  />
                </div>
              )}

              {scanType === 'Email' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={emailSender}
                      onChange={(e) => setEmailSender(e.target.value)}
                      placeholder="Sender email (e.g. support@official-bank.xyz)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#293953] text-xs sm:text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#8494AD] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#6366F1] bg-slate-50/50 dark:bg-[#162238]"
                    />
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Subject line (e.g. Urgent KYC Verification)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#293953] text-xs sm:text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#8494AD] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#6366F1] bg-slate-50/50 dark:bg-[#162238]"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Paste email body or headers..."
                    className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-[#293953] text-xs sm:text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#8494AD] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#6366F1] bg-slate-50/50 dark:bg-[#162238]"
                  />
                </div>
              )}

              {scanType === 'Phone Number' && (
                <div className="flex items-center gap-2">
                  <select
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                    className="px-3 py-3 rounded-2xl border border-slate-300 dark:border-[#293953] text-xs sm:text-sm bg-slate-50 dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9] font-semibold focus:outline-hidden"
                  >
                    <option value="+91" className="bg-white dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9]">🇮🇳 +91</option>
                    <option value="+1" className="bg-white dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9]">🇺🇸 +1</option>
                    <option value="+44" className="bg-white dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9]">🇬🇧 +44</option>
                    <option value="+61" className="bg-white dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9]">🇦🇺 +61</option>
                    <option value="+971" className="bg-white dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9]">🇦🇪 +971</option>
                  </select>
                  <input
                    type="tel"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter phone number (e.g. 98765 43210)"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-[#293953] text-xs sm:text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#8494AD] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#6366F1] bg-slate-50/50 dark:bg-[#162238]"
                  />
                </div>
              )}

              {/* Standard URL / Combined Search Input Bar */}
              {(scanType === 'URL' || scanType === 'QR Code' || scanType === 'Screenshot') && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 dark:text-[#8494AD] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        scanType === 'URL' 
                          ? "Paste a suspicious link (e.g. https://example.com) or enter a message..."
                          : "Or paste the decoded URL/text from the QR or image..."
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-[#293953] text-xs sm:text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#8494AD] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#6366F1] bg-slate-50/50 dark:bg-[#162238]"
                    />
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={isScanning}
                    className="w-full sm:w-auto px-7 py-3 rounded-2xl font-bold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#6D28D9] shadow-md shadow-blue-500/20 transition cursor-pointer shrink-0 flex items-center justify-center gap-2"
                  >
                    {isScanning ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Analyze</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Analyze button for Message, Email, Phone */}
              {(scanType === 'Message' || scanType === 'Email' || scanType === 'Phone Number') && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleAnalyze}
                    disabled={isScanning}
                    className="w-full sm:w-auto px-7 py-3 rounded-2xl font-bold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#6D28D9] shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isScanning ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Analyze Content</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Field Validation Error */}
              {validationError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    className="px-2.5 py-1 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/80 text-red-800 dark:text-red-200 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

            </div>

          </div>

          {/* Detection Workflow • 6-step review */}
          <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-[#293953] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F1F5F9] tracking-tight">
                Detection Workflow • 6-step review
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-[#8494AD]">
                {isScanning ? `Analyzing step ${currentStep}/6...` : 'Automated AI Pipeline'}
              </span>
            </div>

            {/* Horizontal Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {detectionSteps.map((step, idx) => {
                const stepIdx = idx + 1;
                const isPassed = currentStep >= stepIdx;
                const isCurrent = isScanning && currentStep === stepIdx;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between min-h-[105px] ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 dark:border-[#6366F1] shadow-xs'
                        : isPassed
                        ? 'border-purple-200 dark:border-[#293953] bg-purple-50/30 dark:bg-[#162238]'
                        : 'border-slate-200 dark:border-[#293953]/70 bg-slate-50/50 dark:bg-[#162238]/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition ${
                      isCurrent
                        ? 'bg-blue-600 dark:bg-[#6366F1] text-white animate-pulse'
                        : isPassed
                        ? 'bg-linear-to-tr from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] text-white'
                        : 'bg-slate-200 dark:bg-[#293953] text-slate-600 dark:text-[#A8B6CC]'
                    }`}>
                      {step.num}
                    </div>

                    <div className="mt-2 space-y-0.5">
                      <div className="text-[11px] font-bold text-slate-900 dark:text-[#F1F5F9] leading-tight">{step.title}</div>
                      <div className="text-[9.5px] text-slate-500 dark:text-[#8494AD] leading-tight">{step.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Result Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-[#293953] shadow-sm space-y-6 relative overflow-hidden">
            
            {/* Top Badge: HIGH RISK / SUSPICIOUS / SAFE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F1F5F9] tracking-tight">
                  Live Result Preview
                </h3>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                scanResult.verdict === 'High Risk'
                  ? 'bg-red-500 text-white border-red-600'
                  : scanResult.verdict === 'Suspicious'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-emerald-500 text-white border-emerald-600'
              }`}>
                {scanResult.verdict}
              </span>
            </div>

            {/* Circular Risk Score Gauge */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Outer decorative gauge ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#F1F5F9"
                    className="dark:stroke-[#162238]"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#riskGaugeGrad)"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * scanResult.score) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="riskGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="50%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Score numbers */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black text-slate-900 dark:text-[#F1F5F9] tracking-tight leading-none">
                    {scanResult.score}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-[#8494AD] font-semibold mt-0.5">/100</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#A8B6CC] mt-1">
                    Risk Score
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence Indicators Box */}
            <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 space-y-2.5">
              <div className="text-xs font-bold text-red-950 dark:text-red-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Detected Risk Indicators</span>
              </div>
              <ul className="space-y-1.5">
                {scanResult.indicators.map((ind, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-red-900 dark:text-red-200 leading-snug">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">!</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safer Next Step Card */}
            <div className="p-4 rounded-2xl bg-linear-to-br from-blue-50/70 to-purple-50/70 dark:from-[#162238] dark:to-[#111C32] border border-blue-200/80 dark:border-[#293953] space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-linear-to-tr from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] text-white flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9]">Safer Next Step:</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#A8B6CC]">
                {scanResult.saferSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-[#60A5FA] font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => setShowFullReportModal(true)}
                  className="w-full py-2.5 rounded-xl border border-purple-300 dark:border-[#293953] bg-white dark:bg-[#162238] hover:bg-purple-50/60 dark:hover:bg-[#1E2D4A] text-xs font-bold text-purple-700 dark:text-[#A8B6CC] hover:dark:text-[#F1F5F9] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>View full detailed report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-[#293953] text-xs">
              <button
                onClick={handleCopySummary}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#293953] bg-slate-50 dark:bg-[#162238] hover:bg-slate-100 dark:hover:bg-[#1E2D4A] font-semibold text-slate-700 dark:text-[#A8B6CC] hover:dark:text-[#F1F5F9] flex items-center gap-1.5 cursor-pointer transition"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={handleSaveToHistory}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#293953] bg-slate-50 dark:bg-[#162238] hover:bg-slate-100 dark:hover:bg-[#1E2D4A] font-semibold text-slate-700 dark:text-[#A8B6CC] hover:dark:text-[#F1F5F9] flex items-center gap-1.5 cursor-pointer transition"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Saved!' : 'Save to History'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* FULL DETAILED REPORT MODAL */}
      {showFullReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C32] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-[#293953] space-y-6 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#293953] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#F1F5F9]">Complete Threat Assessment Report</h3>
                  <div className="text-xs text-slate-400 dark:text-[#8494AD] font-mono">ID: {scanResult.id} • {scanResult.timestamp}</div>
                </div>
              </div>
              <button
                onClick={() => setShowFullReportModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#162238] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scanned Input */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#8494AD]">Target Content</span>
              <div className="p-3 bg-slate-50 dark:bg-[#162238] rounded-xl border border-slate-200 dark:border-[#293953] font-mono text-xs text-slate-800 dark:text-[#F1F5F9] break-all select-all">
                {scanResult.content}
              </div>
            </div>

            {/* Verdict & Score */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953]">
                <div className="text-xs text-slate-500 dark:text-[#8494AD] font-semibold">Classification Verdict</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-[#F1F5F9] mt-0.5">{scanResult.verdict}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953]">
                <div className="text-xs text-slate-500 dark:text-[#8494AD] font-semibold">Calculated Threat Score</div>
                <div className="text-xl font-extrabold text-red-600 dark:text-[#FB7185] mt-0.5">{scanResult.score} / 100</div>
              </div>
            </div>

            {/* Why this result? Detailed explanation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9] uppercase tracking-wider">
                Why this result? (Signal Analysis)
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#A8B6CC] leading-relaxed bg-slate-50 dark:bg-[#162238] p-3.5 rounded-xl border border-slate-200 dark:border-[#293953]">
                {scanResult.explanation}
              </p>
            </div>

            {/* Evidence points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9] uppercase tracking-wider">
                Confirmed Evidence Indicators
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#A8B6CC]">
                {scanResult.indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-red-50/50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-900 dark:text-red-200">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Protective Action */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9] uppercase tracking-wider">
                Recommended Actions
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#A8B6CC]">
                {scanResult.saferSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#34D399] shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#293953]">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#293953] text-xs font-bold text-slate-700 dark:text-[#A8B6CC] hover:bg-slate-50 dark:hover:bg-[#162238] dark:hover:text-[#F1F5F9] transition"
              >
                Copy Report Summary
              </button>
              <button
                onClick={() => setShowFullReportModal(false)}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] text-white text-xs font-bold shadow-xs hover:opacity-95 transition"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
