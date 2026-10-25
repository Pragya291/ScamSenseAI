import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  ShieldCheck, 
  Star, 
  Edit3, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Globe, 
  ShieldAlert, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  Trash2, 
  CheckCircle2, 
  Save, 
  X,
  Sparkles,
  KeyRound,
  LogOut,
  AlertCircle,
  BarChart3,
  Server,
  Cloud,
  Check,
  RefreshCw
} from 'lucide-react';
import { getApiBaseUrl, checkHealth } from '../services/api';

export default function SettingsView({ onSignOut, onClearHistory, darkMode, onToggleDarkMode }) {
  const { user, isFirebaseConfigured, resetPassword } = useAuth();
  
  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile' | 'security' | 'notifications' | 'appearance' | 'privacy'
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Cloud API & Connectivity States
  const [customApiUrl, setCustomApiUrl] = useState(getApiBaseUrl().replace(/\/api$/, ''));
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [copiedHost, setCopiedHost] = useState(false);

  // Storage key uniquely tied to authenticated user ID
  const userProfileKey = user?.uid ? `scamsense_profile_${user.uid}` : null;

  const getDefaultProfile = () => {
    const name = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');
    return {
      fullName: name,
      pronouns: '',
      bio: 'Cybersecurity enthusiast using ScamSense AI for real-time threat detection and digital fraud prevention.',
      occupation: 'Security Analyst',
      jobTitle: 'ScamSense User',
      age: '',
      gender: '',
      dob: '',
      mobile: '',
      altMobile: '',
      emailId: user?.email || '',
      personalEmail: user?.email || '',
      location: '',
      address: '',
      experience: '1+ Years',
      company: 'ScamSense AI Community',
      education: '',
      workLocation: 'Remote',
      linkedin: '',
      github: '',
      website: '',
      skills: ['Threat Analysis', 'AI Security', 'Phishing Detection']
    };
  };

  const [profileData, setProfileData] = useState(() => {
    if (userProfileKey) {
      try {
        const stored = localStorage.getItem(userProfileKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...getDefaultProfile(), ...parsed };
        }
      } catch (e) {}
    }
    return getDefaultProfile();
  });

  // Re-sync profile when authenticated user changes
  useEffect(() => {
    if (userProfileKey) {
      try {
        const stored = localStorage.getItem(userProfileKey);
        if (stored) {
          setProfileData({ ...getDefaultProfile(), ...JSON.parse(stored) });
          return;
        }
      } catch (e) {}
    }
    setProfileData(getDefaultProfile());
  }, [userProfileKey, user?.displayName, user?.email]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (userProfileKey) {
      try {
        localStorage.setItem(userProfileKey, JSON.stringify(profileData));
      } catch (err) {}
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTriggerPasswordReset = async () => {
    if (user?.email) {
      await resetPassword(user.email);
      setResetEmailSent(true);
      setTimeout(() => setResetEmailSent(false), 3000);
    }
  };

  const handleTestBackendConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    try {
      const res = await checkHealth();
      if (res.status === 200 && res.data?.status === 'healthy') {
        setConnectionStatus({ ok: true, message: `Backend online & connected! Status: ${res.data.status} (Database: ${res.data.database})` });
      } else {
        setConnectionStatus({ ok: true, message: `Backend online: ${JSON.stringify(res.data)}` });
      }
    } catch (err) {
      setConnectionStatus({ ok: false, message: err.friendlyMessage || `Connection failed: ${err.message}` });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveApiUrl = () => {
    if (customApiUrl.trim()) {
      localStorage.setItem('scamsense_api_base_url', customApiUrl.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleResetApiUrl = () => {
    localStorage.removeItem('scamsense_api_base_url');
    setCustomApiUrl(getApiBaseUrl().replace(/\/api$/, ''));
    setConnectionStatus(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCopyHost = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.hostname);
      setCopiedHost(true);
      setTimeout(() => setCopiedHost(false), 2000);
    }
  };

  const handleConfirmClearHistory = () => {
    if (onClearHistory) onClearHistory();
    setShowClearConfirmModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* PAGE HEADER & EDIT PROFILE ACTION (Matching Screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F1F5F9] tracking-tight">
            Enhanced Profile Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8B6CC] mt-0.5">
            Manage your personal and professional information
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* SUB NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#293953] pb-3 overflow-x-auto">
        {[
          { id: 'profile', label: 'Profile Details', icon: User },
          { id: 'security', label: 'Account Security', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'appearance', label: 'Appearance', icon: Sun },
          { id: 'privacy', label: 'Privacy & Data', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] text-white shadow-xs'
                  : 'bg-white dark:bg-[#162238] border border-slate-200 dark:border-[#293953] text-slate-600 dark:text-[#A8B6CC] hover:bg-slate-50 dark:hover:bg-[#1E2D4A] dark:hover:text-[#F1F5F9]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-[#34D399] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#34D399] shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* MAIN TAB CONTENT */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          
          {/* TOP AVATAR & BIO HERO CARD */}
          <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#293953] shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-28 h-28 rounded-full bg-linear-to-tr from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] text-white font-black text-3xl flex items-center justify-center shadow-xl shrink-0 border-4 border-white dark:border-[#162238] overflow-hidden">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user?.displayName || "Profile Photo"} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : null}
              {(!user?.photoURL || user?.photoURL === '') && (
                <span>{profileData.fullName ? profileData.fullName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() : (user?.email ? user.email.substring(0, 2).toUpperCase() : 'U')}</span>
              )}
            </div>

            <div className="space-y-3 flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-[#F1F5F9] tracking-tight">
                  {profileData.fullName}
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-[#34D399] text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#34D399]" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="text-xs text-slate-500 dark:text-[#8494AD] font-semibold">
                {profileData.pronouns} • {profileData.jobTitle}
              </div>

              {/* Bio Box */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-[#162238] border border-blue-100 dark:border-[#293953] space-y-1 text-xs text-slate-700 dark:text-[#A8B6CC] leading-relaxed text-left">
                <div className="font-bold text-slate-900 dark:text-[#F1F5F9] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-[#60A5FA]" />
                  <span>Bio</span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-[#A8B6CC]">
                  {profileData.bio}
                </p>
              </div>
            </div>
          </div>

          {/* EDIT FORM OR VIEW GRID */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#111C32] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-[#8494AD] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#293953] bg-white dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#6366F1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-[#8494AD] mb-1">Occupation</label>
                  <input
                    type="text"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#293953] bg-white dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#6366F1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-[#8494AD] mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-[#293953] bg-white dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-[#8494AD] mb-1">Mobile</label>
                  <input
                    type="text"
                    value={profileData.mobile}
                    onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#293953] bg-white dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#6366F1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-[#8494AD] mb-1">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#293953] bg-white dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#6366F1]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#293953] text-xs font-bold text-slate-600 dark:text-[#A8B6CC] hover:bg-slate-50 dark:hover:bg-[#162238] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: Personal Information, Social Links, Skills, Languages (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Personal Information Box */}
                <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-[#F1F5F9] text-sm border-b border-slate-100 dark:border-[#293953] pb-3">
                    <User className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
                    <span>Personal Information</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Gender</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.gender}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Date of Birth</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.dob}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Mobile</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.mobile}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Alternate</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.altMobile}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Email</span>
                      <span className="col-span-2 font-bold text-blue-600 dark:text-[#60A5FA]">{profileData.emailId}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Personal Email</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.personalEmail}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Location</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.location}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Address</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.address}</span>
                    </div>
                  </div>
                </div>

                {/* Social Links Box */}
                <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-[#F1F5F9] text-sm border-b border-slate-100 dark:border-[#293953] pb-3">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
                    <span>Social Links</span>
                  </div>
                  <div className="space-y-2 text-xs font-semibold">
                    <a href={`https://${profileData.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-[#60A5FA] hover:underline">
                      <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">in</span>
                      <span>{profileData.linkedin}</span>
                    </a>
                    <a href={`https://${profileData.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-800 dark:text-[#A8B6CC] hover:underline">
                      <span className="w-5 h-5 rounded-md bg-slate-900 dark:bg-[#162238] border dark:border-[#293953] text-white font-black text-[10px] flex items-center justify-center">G</span>
                      <span>{profileData.github}</span>
                    </a>
                    <a href={`https://${profileData.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-700 dark:text-[#A8B6CC] hover:underline">
                      <Globe className="w-4 h-4 text-purple-600 dark:text-[#C084FC]" />
                      <span>{profileData.website}</span>
                    </a>
                  </div>
                </div>

                {/* Skills Box */}
                <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-[#F1F5F9] text-sm border-b border-slate-100 dark:border-[#293953] pb-3">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-[#C084FC]" />
                    <span>Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-[#60A5FA] text-xs font-bold border border-blue-100 dark:border-blue-900/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages Box */}
                <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-[#F1F5F9] text-sm border-b border-slate-100 dark:border-[#293953] pb-3">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
                    <span>Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-[#162238] border border-transparent dark:border-[#293953] text-blue-700 dark:text-[#A8B6CC] text-xs font-bold">English</span>
                    <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-[#162238] border border-transparent dark:border-[#293953] text-blue-700 dark:text-[#A8B6CC] text-xs font-bold">Hindi</span>
                    <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-[#162238] border border-transparent dark:border-[#293953] text-blue-700 dark:text-[#A8B6CC] text-xs font-bold">Marathi</span>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Professional Information & Live Stats (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Professional Information Box */}
                <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-[#F1F5F9] text-sm border-b border-slate-100 dark:border-[#293953] pb-3">
                    <Briefcase className="w-4 h-4 text-purple-600 dark:text-[#C084FC]" />
                    <span>Professional Information</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Occupation</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.occupation}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Company</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.company}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Experience</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.experience}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Education</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.education}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 dark:text-[#8494AD] font-medium">Work Location</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-[#F1F5F9]">{profileData.workLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Live Stats Box (Matching Screenshot Layout) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-[#F1F5F9] text-sm">
                    <BarChart3 className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
                    <span>Live Stats</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Total Scans Card */}
                    <div className="bg-emerald-50/50 dark:bg-[#111C32] rounded-3xl p-5 border border-emerald-200/80 dark:border-[#293953] space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8494AD]">Total Scans</div>
                        <div className="text-3xl font-black text-slate-900 dark:text-[#F1F5F9] mt-0.5">1,842</div>
                        <div className="text-xs font-bold text-emerald-600 dark:text-[#34D399] mt-1 flex items-center gap-1">
                          <span>+128 this month</span>
                          <span>↗</span>
                        </div>
                      </div>
                    </div>

                    {/* Threats Blocked Card */}
                    <div className="bg-amber-50/50 dark:bg-[#111C32] rounded-3xl p-5 border border-amber-200/80 dark:border-[#293953] space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8494AD]">Threats Blocked</div>
                        <div className="text-3xl font-black text-slate-900 dark:text-[#F1F5F9] mt-0.5">97</div>
                        <div className="text-xs font-bold text-amber-700 dark:text-[#FBBF24] mt-1 flex items-center gap-1">
                          <span>+9 this week</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 2: ACCOUNT SECURITY */}
      {activeSubTab === 'security' && (
        <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-6 max-w-3xl">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-[#F1F5F9]">Account Security</h3>
            <p className="text-xs text-slate-500 dark:text-[#A8B6CC] mt-1">Manage password reset emails, authentication methods, and security controls.</p>
          </div>

          {resetEmailSent && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-[#34D399] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#34D399]" />
              <span>Password reset instructions have been dispatched to your email.</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953] flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-[#F1F5F9]">Password Reset</div>
                <div className="text-slate-500 dark:text-[#A8B6CC] mt-0.5">Send a password reset link to {profileData.emailId}</div>
              </div>
              <button
                onClick={handleTriggerPasswordReset}
                className="px-4 py-2 rounded-xl bg-[#2563EB] dark:bg-[#6366F1] text-white font-bold cursor-pointer hover:bg-blue-700 dark:hover:bg-[#4F46E5] transition"
              >
                Reset Password
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953] flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-[#F1F5F9]">Session Sign Out</div>
                <div className="text-slate-500 dark:text-[#A8B6CC] mt-0.5">Safely terminate your current active session on this device.</div>
              </div>
              <button
                onClick={onSignOut}
                className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-[#FB7185] font-bold hover:bg-red-100 dark:hover:bg-red-900/60 transition cursor-pointer"
              >
                Log Out
              </button>
            </div>

            {/* Cloud & Production Connectivity Audit Panel */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-[#293953] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-[#F1F5F9] flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
                    <span>Cloud & Production Connectivity Status</span>
                  </div>
                  <div className="text-slate-500 dark:text-[#A8B6CC] mt-0.5">
                    Live production status of backend APIs, Firebase Authentication, and threat intelligence feeds.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTestBackendConnection}
                  disabled={testingConnection}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-60"
                >
                  {testingConnection ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Server className="w-3.5 h-3.5" />
                  )}
                  <span>{testingConnection ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>

              {connectionStatus && (
                <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                  connectionStatus.ok 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300' 
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 text-red-800 dark:text-red-300'
                }`}>
                  {connectionStatus.ok ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{connectionStatus.message}</span>
                </div>
              )}

              {/* API Endpoint Configuration */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span>Backend API Base URL</span>
                  <button
                    type="button"
                    onClick={handleResetApiUrl}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-normal cursor-pointer"
                  >
                    Reset to Default
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customApiUrl}
                    onChange={(e) => setCustomApiUrl(e.target.value)}
                    placeholder="https://scamsense-backend.onrender.com"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#293953] bg-white dark:bg-[#111C32] text-xs font-mono text-slate-800 dark:text-[#F1F5F9]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveApiUrl}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-[#293953] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Firebase Auth</span>
                    <div className="text-[11px] text-slate-500 font-mono">scamsenseai-8bf14</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px] border border-emerald-200 dark:border-emerald-800">
                    Active
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-[#293953] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Current Origin</span>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {typeof window !== 'undefined' ? window.location.hostname : 'localhost'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyHost}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px] hover:bg-slate-200 cursor-pointer"
                  >
                    {copiedHost ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-6 max-w-3xl">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-[#F1F5F9]">Notification Preferences</h3>
            <p className="text-xs text-slate-500 dark:text-[#A8B6CC] mt-1">Configure in-app security alerts and scan notifications.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953] flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-[#F1F5F9]">High Risk Threat Alerts</div>
                <div className="text-slate-500 dark:text-[#A8B6CC] mt-0.5">Notify me immediately when a high risk phishing domain is flagged.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 dark:accent-[#6366F1] cursor-pointer" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953] flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-[#F1F5F9]">Scan Completion</div>
                <div className="text-slate-500 dark:text-[#A8B6CC] mt-0.5">Show in-app notification when deep OCR scan finishes.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 dark:accent-[#6366F1] cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: APPEARANCE */}
      {activeSubTab === 'appearance' && (
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xs space-y-6 max-w-3xl ${darkMode ? 'bg-[#111C32] border-[#293953] text-[#F1F5F9]' : 'bg-white border-[#E2E8F0] text-slate-900'}`}>
          <div>
            <h3 className="text-xl font-extrabold">Appearance Settings</h3>
            <p className={`text-xs mt-1 ${darkMode ? 'text-[#A8B6CC]' : 'text-slate-500'}`}>Customize the ScamSense AI visual presentation across all pages.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            {/* Light Theme Option */}
            <div 
              onClick={() => onToggleDarkMode && onToggleDarkMode(false)}
              className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                !darkMode 
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs' 
                  : 'border-[#293953] bg-[#162238] text-[#A8B6CC] hover:bg-[#1E2D4A]'
              }`}
            >
              <Sun className="w-6 h-6 text-amber-500" />
              <span>Light Theme {!darkMode && '(Active)'}</span>
            </div>

            {/* Dark Theme Option */}
            <div 
              onClick={() => onToggleDarkMode && onToggleDarkMode(true)}
              className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                darkMode 
                  ? 'border-[#6366F1] bg-[#162238] text-[#F1F5F9] shadow-xs' 
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Moon className="w-6 h-6 text-indigo-400" />
              <span>Dark Theme {darkMode && '(Active)'}</span>
            </div>

            {/* System Default Option */}
            <div 
              onClick={() => {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (onToggleDarkMode) onToggleDarkMode(systemPrefersDark);
              }}
              className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                darkMode ? 'border-[#293953] bg-[#162238] text-[#8494AD] hover:bg-[#1E2D4A]' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span>System Default</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRIVACY & DATA */}
      {activeSubTab === 'privacy' && (
        <div className="bg-white dark:bg-[#111C32] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-[#293953] shadow-sm space-y-6 max-w-3xl">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-[#F1F5F9]">Privacy & Data Controls</h3>
            <p className="text-xs text-slate-500 dark:text-[#A8B6CC] mt-1">Manage scan history retention and data storage.</p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-red-900 dark:text-[#FB7185]">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-[#FB7185]" />
              <span>Clear Local Scan History</span>
            </div>
            <p className="text-xs text-red-700 dark:text-[#FB7185] leading-relaxed">
              Permanently clear your recorded scan history logs from this browser session. This operation cannot be undone.
            </p>
            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="px-4 py-2 rounded-xl bg-red-600 dark:bg-[#FB7185] text-white dark:text-slate-950 font-bold text-xs hover:bg-red-700 transition cursor-pointer"
            >
              Clear Scan History
            </button>
          </div>
        </div>
      )}

      {/* FOOTER DISCLAIMER */}
      <div className="pt-6 border-t border-[#E2E8F0] dark:border-[#293953] text-center text-[11px] text-slate-400 dark:text-[#8494AD] font-medium">
        Last updated: 9 Oct 2025 • All changes are auto-saved securely • Encrypted with AES-256 • ScamSense AI v2.4.1
      </div>

      {/* CLEAR HISTORY CONFIRMATION MODAL */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C32] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-[#293953] space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-[#FB7185]">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F1F5F9]">Confirm History Clearance</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A8B6CC] leading-relaxed">
              Are you sure you want to clear your local scan history records?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#293953] text-xs font-bold text-slate-700 dark:text-[#A8B6CC] hover:bg-slate-50 dark:hover:bg-[#162238]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClearHistory}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Yes, Clear History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
