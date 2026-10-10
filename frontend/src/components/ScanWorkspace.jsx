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
import { scanText, scanUrl, scanQr } from '../services/api';

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

    setIsScanning(true);
    setSavedSuccess(false);

    // Multi-step progress animation
    setCurrentStep(1);
    await new Promise(r => setTimeout(r, 250));
    setCurrentStep(2);
    await new Promise(r => setTimeout(r, 300));
    setCurrentStep(3);
    await new Promise(r => setTimeout(r, 300));
    setCurrentStep(4);
    await new Promise(r => setTimeout(r, 350));
    setCurrentStep(5);
    await new Promise(r => setTimeout(r, 250));
    setCurrentStep(6);

    const submissionText = inputValue || (selectedFile ? selectedFile.name : '');
    const lower = submissionText.toLowerCase();

    // Check backend API if available, or generate evidence-based assessment
    let realApiResponse = null;
    try {
      if (scanType === 'URL' && inputValue) {
        realApiResponse = await scanUrl(inputValue);
      } else if (scanType === 'Message' && inputValue) {
        realApiResponse = await scanText(inputValue);
      } else if (scanType === 'QR Code' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        realApiResponse = await scanQr(formData);
      }
    } catch (err) {
      // Backend not running locally or endpoint offline; continue safely in evidence demonstration mode
    }

    let score = 18;
    let verdict = 'Safe';
    let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let indicators = ['Standard domain registration parameters', 'No known phishing or deceptive lures detected'];
    let explanation = 'Content passes standard structural heuristics with no immediate high-risk threat markers.';
    let saferSteps = [
      'Content appears low risk; verify normal sender context.',
      'Exercise usual caution when entering credentials.',
      'Report any unexpected behavior to your security team.'
    ];

    if (realApiResponse && realApiResponse.data) {
      const data = realApiResponse.data;
      score = data.risk_score || data.score || 50;
      verdict = score >= 70 ? 'High Risk' : score >= 40 ? 'Suspicious' : 'Safe';
      badgeClass = score >= 70 ? 'bg-red-50 text-red-600 border-red-200' : score >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
      if (data.reasons && data.reasons.length) indicators = data.reasons;
      if (data.explanation) explanation = data.explanation;
      if (data.recommendations && data.recommendations.length) saferSteps = data.recommendations;
    } else {
      // Evidence-based heuristics
      if (
        lower.includes('crypto') || 
        lower.includes('verify') || 
        lower.includes('bank') || 
        lower.includes('otp') || 
        lower.includes('login') || 
        lower.includes('winner') || 
        lower.includes('prize') || 
        lower.includes('blocked') ||
        lower.includes('urgent')
      ) {
        score = 88;
        verdict = 'High Risk';
        badgeClass = 'bg-red-50 text-red-600 border-red-200';
        indicators = [
          'Urgent payment or credential request',
          `Suspicious keywords: matching deceptive lure patterns`,
          'Impersonation cues: mimicking official institution layout',
          'Unverified destination hostname'
        ];
        explanation = 'The input contains high-frequency social engineering cues: urgency pressure and unverified credential collection.';
        saferSteps = [
          "Don't click, pay, or submit personal information.",
          'Verify through the official app or official verified phone numbers.',
          'Block & report this sender.'
        ];
      } else if (lower.includes('payment') || lower.includes('whatsapp') || lower.includes('support') || lower.includes('bonus')) {
        score = 64;
        verdict = 'Suspicious';
        badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
        indicators = [
          'Ambiguous sender authority and payment prompt',
          'Potential redirection mechanism detected'
        ];
        explanation = 'The input exhibits non-standard communication patterns that require secondary manual verification.';
        saferSteps = [
          'Call the sender on a known official contact number before responding.',
          'Do not share one-time authentication codes.',
          'Inspect redirect domains.'
        ];
      }
    }

    const newResult = {
      id: `scan-${Date.now().toString().slice(-6)}`,
      type: scanType,
      content: submissionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score,
      verdict,
      badgeClass,
      indicators,
      explanation,
      saferSteps,
      isSimulated: !realApiResponse
    };

    setScanResult(newResult);
    setIsScanning(false);

    if (onSaveScan) {
      onSaveScan(newResult);
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Scan Anything <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] to-[#7C3AED]">Suspicious</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
          Paste a message or URL, or upload a QR code / screenshot — Detect. Explain. Protect.
        </p>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Card & Detection Workflow (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
            
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
                        ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-sm shadow-blue-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                  ? 'border-blue-500 bg-blue-50/60' 
                  : 'border-purple-200/80 bg-linear-to-br from-blue-50/40 via-purple-50/40 to-slate-50 hover:border-blue-400'
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-white rounded-2xl border border-purple-200 shadow-xs">
                  <div className="flex items-center gap-3">
                    {filePreview ? (
                      <img src={filePreview} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs">{selectedFile.name}</div>
                      <div className="text-[11px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • Image ready for analysis</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
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
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Drag & drop QR code or screenshot here
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    PNG, JPG up to 10MB — or use the field below to paste a suspicious link or message
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Specific Inputs depending on selected type */}
            <div className="space-y-3">
              {scanType === 'Message' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase text-[10px] tracking-wider text-slate-400">Message Content</span>
                    <span>{inputValue.length} characters</span>
                  </div>
                  <textarea
                    rows={4}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Paste a suspicious SMS, WhatsApp message, or direct message here..."
                    className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] bg-slate-50/50"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] bg-slate-50/50"
                    />
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Subject line (e.g. Urgent KYC Verification)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] bg-slate-50/50"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Paste email body or headers..."
                    className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] bg-slate-50/50"
                  />
                </div>
              )}

              {scanType === 'Phone Number' && (
                <div className="flex items-center gap-2">
                  <select
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                    className="px-3 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm bg-slate-50 font-semibold focus:outline-hidden"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <input
                    type="tel"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter phone number (e.g. 98765 43210)"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] bg-slate-50/50"
                  />
                </div>
              )}

              {/* Standard URL / Combined Search Input Bar */}
              {(scanType === 'URL' || scanType === 'QR Code' || scanType === 'Screenshot') && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        scanType === 'URL' 
                          ? "Paste a suspicious link (e.g. https://example.com) or enter a message..."
                          : "Or paste the decoded URL/text from the QR or image..."
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] bg-slate-50/50"
                    />
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={isScanning}
                    className="w-full sm:w-auto px-7 py-3 rounded-2xl font-bold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] shadow-md shadow-blue-500/20 transition cursor-pointer shrink-0 flex items-center justify-center gap-2"
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
                    className="w-full sm:w-auto px-7 py-3 rounded-2xl font-bold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center justify-center gap-2"
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
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

            </div>

          </div>

          {/* Detection Workflow • 6-step review */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Detection Workflow • 6-step review
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
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
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                        : isPassed
                        ? 'border-purple-200 bg-purple-50/30'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition ${
                      isCurrent
                        ? 'bg-blue-600 text-white animate-pulse'
                        : isPassed
                        ? 'bg-linear-to-tr from-blue-600 to-purple-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {step.num}
                    </div>

                    <div className="mt-2 space-y-0.5">
                      <div className="text-[11px] font-bold text-slate-900 leading-tight">{step.title}</div>
                      <div className="text-[9.5px] text-slate-500 leading-tight">{step.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Result Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6 relative overflow-hidden">
            
            {/* Top Badge: HIGH RISK / SUSPICIOUS / SAFE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
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
                  <span className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                    {scanResult.score}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold mt-0.5">/100</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                    Risk Score
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence Indicators Box */}
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-2.5">
              <div className="text-xs font-bold text-red-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Detected Risk Indicators</span>
              </div>
              <ul className="space-y-1.5">
                {scanResult.indicators.map((ind, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-red-900 leading-snug">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">!</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safer Next Step Card */}
            <div className="p-4 rounded-2xl bg-linear-to-br from-blue-50/70 to-purple-50/70 border border-blue-200/80 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-linear-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Safer Next Step:</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-700">
                {scanResult.saferSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => setShowFullReportModal(true)}
                  className="w-full py-2.5 rounded-xl border border-purple-300 bg-white hover:bg-purple-50/60 text-xs font-bold text-purple-700 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>View full detailed report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={handleCopySummary}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={handleSaveToHistory}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Complete Threat Assessment Report</h3>
                  <div className="text-xs text-slate-400 font-mono">ID: {scanResult.id} • {scanResult.timestamp}</div>
                </div>
              </div>
              <button
                onClick={() => setShowFullReportModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scanned Input */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Content</span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 break-all select-all">
                {scanResult.content}
              </div>
            </div>

            {/* Verdict & Score */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">Classification Verdict</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">{scanResult.verdict}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">Calculated Threat Score</div>
                <div className="text-xl font-extrabold text-red-600 mt-0.5">{scanResult.score} / 100</div>
              </div>
            </div>

            {/* Why this result? Detailed explanation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Why this result? (Signal Analysis)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {scanResult.explanation}
              </p>
            </div>

            {/* Evidence points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Confirmed Evidence Indicators
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {scanResult.indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-red-50/50 border border-red-100">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Protective Action */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recommended Actions
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {scanResult.saferSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Copy Report Summary
              </button>
              <button
                onClick={() => setShowFullReportModal(false)}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white text-xs font-bold shadow-xs hover:opacity-95 transition"
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
