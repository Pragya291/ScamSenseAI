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
  BarChart3
} from 'lucide-react';

export default function SettingsView({ onSignOut, onClearHistory, darkMode, onToggleDarkMode }) {
  const { user, isFirebaseConfigured, resetPassword } = useAuth();
  
  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile' | 'security' | 'notifications' | 'appearance' | 'privacy'
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Profile Form States (Matching exact screenshot values)
  const [profileData, setProfileData] = useState({
    fullName: user?.displayName || 'Pragya Mishra',
    pronouns: 'she/her',
    bio: 'Cybersecurity enthusiast focused on AI-powered fraud detection. Building safer internet for everyone. Open innovation hackathon participant — Team PJSR (Programming Just Solves Real-Problem). Passionate about Detect • Explain • Protect. Experienced in building 4-in-1 scam detection with Gemini AI + Safe Browsing + VirusTotal.',
    occupation: 'Cybersecurity Analyst',
    jobTitle: 'Threat Intelligence Researcher',
    age: '27',
    gender: 'Female',
    dob: 'March 15, 1998',
    mobile: '+91 98765 43210',
    altMobile: '+91 91234 56789',
    emailId: user?.email || 'pragya.mishra@scamsense.ai',
    personalEmail: 'pragya.mishra1998@gmail.com',
    location: 'Mumbai, Maharashtra, India',
    address: 'Andheri West, Mumbai - 400053',
    experience: '3+ Years',
    company: 'ScamSense AI • Team PJSR',
    education: 'B.Tech Cybersecurity, Mumbai University • 2020',
    workLocation: 'Remote',
    linkedin: 'linkedin.com/in/pragyamishra',
    github: 'github.com/pragya-mishra',
    website: 'pragyamishra.dev',
    skills: ['Threat Analysis', 'AI/ML', 'React', 'Python', 'Firebase', 'Gemini AI']
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
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

  const handleConfirmClearHistory = () => {
    if (onClearHistory) onClearHistory();
    setShowClearConfirmModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* PAGE HEADER & EDIT PROFILE ACTION (Matching Screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Enhanced Profile Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal and professional information
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* SUB NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
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
                  ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
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
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* MAIN TAB CONTENT */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          
          {/* TOP AVATAR & BIO HERO CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-28 h-28 rounded-full bg-linear-to-tr from-[#2563EB] to-[#7C3AED] text-white font-black text-3xl flex items-center justify-center shadow-xl shrink-0 border-4 border-white dark:border-slate-800">
              PM
            </div>

            <div className="space-y-3 flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                  {profileData.fullName}
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {profileData.pronouns} • {profileData.jobTitle}
              </div>

              {/* Bio Box */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700/80 space-y-1 text-xs text-slate-700 dark:text-slate-200 leading-relaxed text-left">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Bio</span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300">
                  {profileData.bio}
                </p>
              </div>
            </div>
          </div>

          {/* EDIT FORM OR VIEW GRID */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={profileData.mobile}
                    onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
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
                <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Personal Information</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Gender</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.gender}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Date of Birth</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.dob}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Mobile</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.mobile}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Alternate</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.altMobile}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Email</span>
                      <span className="col-span-2 font-bold text-blue-600">{profileData.emailId}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Personal Email</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.personalEmail}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Location</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.location}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Address</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.address}</span>
                    </div>
                  </div>
                </div>

                {/* Social Links Box */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Social Links</span>
                  </div>
                  <div className="space-y-2 text-xs font-semibold">
                    <a href={`https://${profileData.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">in</span>
                      <span>{profileData.linkedin}</span>
                    </a>
                    <a href={`https://${profileData.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-800 hover:underline">
                      <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-black text-[10px] flex items-center justify-center">G</span>
                      <span>{profileData.github}</span>
                    </a>
                    <a href={`https://${profileData.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-700 hover:underline">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span>{profileData.website}</span>
                    </a>
                  </div>
                </div>

                {/* Skills Box */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages Box */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold">English</span>
                    <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold">Hindi</span>
                    <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold">Marathi</span>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Professional Information & Live Stats (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Professional Information Box */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Professional Information</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Occupation</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.occupation}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Company</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.company}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Experience</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.experience}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Education</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.education}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Work Location</span>
                      <span className="col-span-2 font-bold text-slate-900">{profileData.workLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Live Stats Box (Matching Screenshot Layout) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Live Stats</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Total Scans Card */}
                    <div className="bg-emerald-50/50 rounded-3xl p-5 border border-emerald-200/80 space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Scans</div>
                        <div className="text-3xl font-black text-slate-900 mt-0.5">1,842</div>
                        <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                          <span>+128 this month</span>
                          <span>↗</span>
                        </div>
                      </div>
                    </div>

                    {/* Threats Blocked Card */}
                    <div className="bg-amber-50/50 rounded-3xl p-5 border border-amber-200/80 space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Threats Blocked</div>
                        <div className="text-3xl font-black text-slate-900 mt-0.5">97</div>
                        <div className="text-xs font-bold text-amber-700 mt-1 flex items-center gap-1">
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
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6 max-w-3xl">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Account Security</h3>
            <p className="text-xs text-slate-500 mt-1">Manage password reset emails, authentication methods, and security controls.</p>
          </div>

          {resetEmailSent && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Password reset instructions have been dispatched to your email.</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Password Reset</div>
                <div className="text-slate-500 mt-0.5">Send a password reset link to {profileData.emailId}</div>
              </div>
              <button
                onClick={handleTriggerPasswordReset}
                className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold cursor-pointer hover:bg-blue-700 transition"
              >
                Reset Password
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Session Sign Out</div>
                <div className="text-slate-500 mt-0.5">Safely terminate your current active session on this device.</div>
              </div>
              <button
                onClick={onSignOut}
                className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold hover:bg-red-100 transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6 max-w-3xl">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Notification Preferences</h3>
            <p className="text-xs text-slate-500 mt-1">Configure in-app security alerts and scan notifications.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">High Risk Threat Alerts</div>
                <div className="text-slate-500 mt-0.5">Notify me immediately when a high risk phishing domain is flagged.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 cursor-pointer" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Scan Completion</div>
                <div className="text-slate-500 mt-0.5">Show in-app notification when deep OCR scan finishes.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: APPEARANCE */}
      {activeSubTab === 'appearance' && (
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xs space-y-6 max-w-3xl ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-[#E2E8F0] text-slate-900'}`}>
          <div>
            <h3 className="text-xl font-extrabold">Appearance Settings</h3>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Customize the ScamSense AI visual presentation across all pages.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            {/* Light Theme Option */}
            <div 
              onClick={() => onToggleDarkMode && onToggleDarkMode(false)}
              className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                !darkMode 
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs' 
                  : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-700/50'
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
                  ? 'border-blue-500 bg-blue-900/40 text-blue-200 shadow-xs' 
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
                darkMode ? 'border-slate-700 bg-slate-900/50 text-slate-400 hover:bg-slate-700/50' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
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
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6 max-w-3xl">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Privacy & Data Controls</h3>
            <p className="text-xs text-slate-500 mt-1">Manage scan history retention and data storage.</p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-red-900">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Clear Local Scan History</span>
            </div>
            <p className="text-xs text-red-700 leading-relaxed">
              Permanently clear your recorded scan history logs from this browser session. This operation cannot be undone.
            </p>
            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition cursor-pointer"
            >
              Clear Scan History
            </button>
          </div>
        </div>
      )}

      {/* FOOTER DISCLAIMER */}
      <div className="pt-6 border-t border-[#E2E8F0] text-center text-[11px] text-slate-400 font-medium">
        Last updated: 9 Oct 2025 • All changes are auto-saved securely • Encrypted with AES-256 • ScamSense AI v2.4.1
      </div>

      {/* CLEAR HISTORY CONFIRMATION MODAL */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-extrabold text-slate-900">Confirm History Clearance</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to clear your local scan history records?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
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
