import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import QuizHistory from './QuizHistory';
import Paraphraser from './tools/Paraphraser';
import Humanizer from './tools/Humanizer';
import OCR from './tools/OCR';
import QuizMaker from './tools/QuizMaker';
import ConvertPDF from './tools/ConvertPDF';
import { logout } from '../../services/authService';
import '../../styles/dashboard.css';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const tools = [
  {
    id: 'paraphraser',
    label: 'Paraphraser',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'humanizer',
    label: 'Humanizer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'ocr',
    label: 'OCR',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round"/>
        <rect x="9" y="9" width="6" height="6" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'quizmaker',
    label: 'Quiz Maker',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h.01M9 12h.01M9 15h.01M13 9h3M13 12h3M13 15h3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'convertpdf',
    label: 'Convert PDF',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2v6h6M9 13h6M9 17h4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const PROFILE_ID = 'profile';
const QUIZ_HISTORY_ID = 'quizhistory';

const toolComponents = {
  paraphraser: <Paraphraser />,
  humanizer: <Humanizer />,
  ocr: <OCR />,
  quizmaker: <QuizMaker />,
  convertpdf: <ConvertPDF />,
  [PROFILE_ID]: <Profile />,
  [QUIZ_HISTORY_ID]: <QuizHistory />,
};

function Dashboard() {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('paraphraser');
  const [showDropdown, setShowDropdown] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userName, setUserName] = useState('');
  const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 12px',
    border: 'none',
    background: 'transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    textAlign: 'left',
    transition: 'background 0.15s',
  };

  // ── Fetch user profile (for avatar) on mount ──
  useEffect(() => {
    async function fetchUserAvatar() {
      try {
        const { supabase } = await import('../../lib/supabase');
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const res = await fetch(`${API_BASE}/api/profile/${user.id}`);
        const data = await res.json();

        if (data.success) {
          setUserAvatar(data.profile.avatar_url || null);
          setUserName(data.profile.full_name || user.email);
        }
      } catch (err) {
        console.error('Failed to fetch user avatar:', err);
      }
    }

    fetchUserAvatar();
  }, [activeTool]); // refetch when switching to/from profile (in case avatar changed)

  const isProfile = activeTool === PROFILE_ID;
  const isQuizHistory = activeTool === QUIZ_HISTORY_ID;
  const current = tools.find(t => t.id === activeTool);
  const topbarTitle = isProfile
    ? 'My Profile'
    : isQuizHistory
    ? 'Quiz History'
    : `${current?.label} Tool`;

  const handleLogout = async (e) => {
    e.preventDefault();
    
    await logout();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-topbar">
        <div className="topbar-left">
          <div className="logo-circle">
            <img src="/logo.png" alt="U" className="logo-img" />
          </div>
          <div className="brand-wrap">
            <span className="brand">U-ConvertIT</span>
          </div>
        </div>

        <div className="topbar-title">{topbarTitle}</div>

        <div className="user-menu">
          <button
            className="user-btn"
            onClick={() => setShowDropdown(prev => !prev)}
            title={userName}
            style={{
              padding: '4px',
              borderRadius: '50%',
              overflow: 'hidden',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f3f4f6',
              border: '2px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#8B1515'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={24} height={24}>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
            )}
          </button>
          {showDropdown && (
            <>
              {/* Backdrop to close dropdown when clicking outside */}
              <div
                onClick={() => setShowDropdown(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 99,
                }}
              />

              <div
                className="dropdown"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: '240px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                  overflow: 'hidden',
                  zIndex: 100,
                  animation: 'dropdownFade 0.15s ease-out',
                  border: '1px solid #e5e7eb',
                }}
              >
                {/* User Info Header */}
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #8B1515 0%, #5a0d0d 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}>
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} width={22} height={22}>
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {userName || 'User'}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      opacity: 0.9,
                    }}>
                      View account
                    </p>
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '6px' }}>
                  <button
                    style={dropdownItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => { setActiveTool(PROFILE_ID); setShowDropdown(false); }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
                    </svg>
                    <span>My Profile</span>
                  </button>

                  <button
                    style={dropdownItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => { setActiveTool(QUIZ_HISTORY_ID); setShowDropdown(false); }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
                      <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Quiz History</span>
                  </button>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    background: '#e5e7eb',
                    margin: '6px 0',
                  }} />

                  <button
                    style={{
                      ...dropdownItemStyle,
                      color: '#dc2626',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={handleLogout}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="dashboard-main">
        {/* ── Sidebar ── */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav" style={{ flex: 1 }}>
            {tools.map(tool => (
              <button
                key={tool.id}
                className={`sidebar-item ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => setActiveTool(tool.id)}
              >
                <span className="sidebar-icon">{tool.icon}</span>
                <span className="sidebar-label">{tool.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="dashboard-body">
          <div className="tool-area">
            {toolComponents[activeTool]}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;