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
  AlertCircle
} from 'lucide-react';

export default function SettingsView({ onSignOut, onClearHistory }) {
  const { user, isFirebaseConfigured, resetPassword, signOutUser } = useAuth();
  
  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile' | 'security' | 'notifications' | 'appearance' | 'privacy'
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Profile Form States (Initialized from reference screenshot 3)
  const [profileData, setProfileData] = useState({
    fullName: user?.displayName || 'Pragya Mishra',
    pronouns: 'she/her',
    bio: 'Cybersecurity enthusiast focused on AI-powered fraud detection. Building safer internet for everyone. Open Innovation hackathon participant — Team PJSR (Programming Just Solves Real-Problem). Passionate about Detect, Explain, Protect. Experienced in building 4-in-1 scam detection with Gemini AI + Safe Browsing + VirusTotal.',
    occupation: 'Cybersecurity Analyst',
    jobTitle: 'Threat Intelligence Researcher at ScamSense AI',
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
    company: 'ScamSense AI (Team PJSR)',
    education: 'B.Tech Cybersecurity, Mumbai University 2020',
    linkedin: 'linkedin.com/in/pragyamishra',
    github: 'github.com/pragya-mishra',
    website: 'pragyamishra.dev',
    skills: ['Threat Analysis', 'AI/ML', 'React', 'Python', 'Firebase', 'Gemini AI', 'English', 'Hindi', 'Marathi']
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
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* PAGE HEADER & USER PILL (Matching Reference Screenshot 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Settings —
            </h1>
            <span className="text-sm font-semibold text-slate-500">
              Manage your profile, preferences and security
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Update your personal information, preferences, and security settings to keep your account safe and secure.
          </p>
        </div>

        {/* User Pill on Top Right */}
        <div className="flex items-center gap-3 bg-white p-2 px-3 rounded-2xl border border-[#E2E8F0] shadow-2xs self-start sm:self-auto">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">{profileData.fullName}</div>
            <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold">
              <span className="text-blue-600">#2563EB</span>
              <span className="text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200">Free Plan</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#2563EB] to-[#7C3AED] text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {profileData.fullName.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>

      {/* SUB NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 overflow-x-auto">
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
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
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
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* MAIN TAB CONTENT */}

      {/* TAB 1: PROFILE DETAILS (Matching Reference Screenshot 3 Right Side) */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Profile Details Card (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
            
            {/* Card Header & Edit Profile Action */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Profile Details
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-xs font-bold text-[#2563EB] flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
              </button>
            </div>

            {/* Editable or View Mode Profile Section */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
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
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bio / External Description</label>
                  <textarea
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={profileData.jobTitle}
                      onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Mobile</label>
                    <input
                      type="text"
                      value={profileData.mobile}
                      onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                
                {/* User Banner Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="w-24 h-24 rounded-full bg-linear-to-tr from-[#2563EB] to-[#7C3AED] text-white font-black text-2xl flex items-center justify-center shadow-xl shrink-0 border-4 border-white">
                    PM
                  </div>

                  <div className="space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Verified</span>
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-purple-600" />
                        <span>Pro</span>
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {profileData.fullName}
                    </h3>
                    <div className="text-xs text-slate-400 font-medium">
                      {profileData.pronouns}
                    </div>
                  </div>
                </div>

                {/* Bio / External Description Box */}
                <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/80 space-y-1 text-xs text-slate-700 leading-relaxed">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Bio / External Description</span>
                  </div>
                  <p className="text-[11.5px] text-slate-600">
                    {profileData.bio}
                  </p>
                </div>

                {/* Profile Information Key-Value Grid (Matching Reference Screenshot 3) */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Profile Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs border-t border-slate-100 pt-3">
                    
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Occupation</span>
                      <span className="font-bold text-slate-800">{profileData.occupation}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Job Title</span>
                      <span className="font-bold text-slate-800">{profileData.jobTitle}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Age</span>
                      <span className="font-bold text-slate-800">{profileData.age}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Gender</span>
                      <span className="font-bold text-slate-800">{profileData.gender}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Date of Birth</span>
                      <span className="font-bold text-slate-800">{profileData.dob}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Mobile</span>
                      <span className="font-bold text-slate-800">{profileData.mobile}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Alternate Mobile</span>
                      <span className="font-bold text-slate-800">{profileData.altMobile}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Email ID</span>
                      <span className="font-bold text-slate-800">{profileData.emailId}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Personal Email</span>
                      <span className="font-bold text-slate-800">{profileData.personalEmail}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Location</span>
                      <span className="font-bold text-slate-800">{profileData.location}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Address</span>
                      <span className="font-bold text-slate-800">{profileData.address}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Work Experience</span>
                      <span className="font-bold text-slate-800">{profileData.experience}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Company</span>
                      <span className="font-bold text-slate-800">{profileData.company}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Education</span>
                      <span className="font-bold text-slate-800">{profileData.education}</span>
                    </div>

                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Social Links
                  </h4>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
                    <a href={`https://${profileData.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-600">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <span>{profileData.linkedin}</span>
                    </a>
                    <a href={`https://${profileData.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-900">
                      <Github className="w-4 h-4 text-slate-800" />
                      <span>{profileData.github}</span>
                    </a>
                    <a href={`https://${profileData.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-purple-600">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span>{profileData.website}</span>
                    </a>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Summary Cards in Settings (4 cols - Matching Reference Screenshot 3) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Total Scans Summary Card */}
            <div className="bg-emerald-50/40 rounded-3xl p-6 border border-emerald-200/80 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Scans</div>
                <div className="text-3xl font-black text-slate-900 mt-0.5 tracking-tight">1,842</div>
                <div className="text-xs font-bold text-emerald-600 mt-1">+128 this month</div>
              </div>
            </div>

            {/* Threats Blocked Summary Card */}
            <div className="bg-amber-50/40 rounded-3xl p-6 border border-amber-200/80 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Threats Blocked</div>
                <div className="text-3xl font-black text-slate-900 mt-0.5 tracking-tight">97</div>
                <div className="text-xs font-bold text-amber-700 mt-1">+9 this week</div>
              </div>
            </div>

            {/* Account Quick Status */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xs space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Account Status</div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Auth Provider</span>
                  <span className="font-bold text-slate-800">{isFirebaseConfigured ? 'Firebase OAuth' : 'Demonstration Auth'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Encryption</span>
                  <span className="font-bold text-emerald-600">AES-256 Active</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ACCOUNT SECURITY */}
      {activeSubTab === 'security' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6 max-w-3xl">
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
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6 max-w-3xl">
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
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6 max-w-3xl">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Appearance Settings</h3>
            <p className="text-xs text-slate-500 mt-1">Customize the ScamSense AI visual presentation.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-bold">
            <div className="p-5 rounded-2xl border-2 border-blue-600 bg-blue-50/50 flex flex-col items-center justify-center gap-2 cursor-pointer">
              <Sun className="w-6 h-6 text-blue-600" />
              <span>Light Theme (Active)</span>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 flex flex-col items-center justify-center gap-2 cursor-pointer opacity-75">
              <Moon className="w-6 h-6" />
              <span>Dark Theme</span>
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

      {/* FOOTER DISCLAIMER (Matching Reference Screenshot 3) */}
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
