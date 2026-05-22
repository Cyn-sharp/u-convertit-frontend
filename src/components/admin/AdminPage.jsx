import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ── Tool config ── */
const TOOL_CONFIG = {
  paraphraser: { name: 'Paraphraser', color: '#8B0E0E' },
  humanizer:   { name: 'Humanizer',   color: '#3b82f6' },
  ocr:         { name: 'OCR',         color: '#22c55e' },
  quiz_maker:  { name: 'Quiz Maker',  color: '#f59e0b' },
  pdf_convert: { name: 'PDF Convert', color: '#a855f7' },
};

/* ── Nav items ── */
const NAV = [
  { label: 'Dashboard',     section: 'Overview' },
  { label: 'Analytics',     section: 'Overview' },
  { label: 'Users',         section: 'Management' },
  { label: 'Activity Logs', section: 'Management' },
];

/* ── Icon helpers ── */
const IconGrid = () => (
  <svg className="sb-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);
const IconChart = () => (
  <svg className="sb-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/>
  </svg>
);
const IconUsers = () => (
  <svg className="sb-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="9" cy="7" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
    <circle cx="18" cy="8" r="2"/><path d="M18 14c2.2 0 4 1.6 4 3.6"/>
  </svg>
);
const IconLogs = () => (
  <svg className="sb-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const NAV_ICONS = {
  Dashboard:      <IconGrid />,
  Analytics:      <IconChart />,
  Users:          <IconUsers />,
  'Activity Logs':<IconLogs />,
};

/* ══════════════════════════════════════════
   🎨 SKELETON COMPONENTS
══════════════════════════════════════════ */

function SkeletonBox({ width = '100%', height = '16px', borderRadius = '6px', style = {} }) {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      background: 'linear-gradient(90deg, #f0f0f0 0%, #e4e4e4 50%, #f0f0f0 100%)',
      backgroundSize: '200% 100%',
      animation: 'skeletonShimmer 1.5s ease-in-out infinite',
      flexShrink: 0,
      ...style,
    }} />
  );
}

// ── Matches StatCards layout ──
function SkeletonStatCards() {
  return (
    <div className="stats-row">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="stat" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* label */}
          <SkeletonBox width="100px" height="13px" style={{ marginBottom: '12px' }} />
          {/* value */}
          <SkeletonBox width="70px" height="28px" style={{ marginBottom: '12px' }} />
          {/* sub line */}
          <SkeletonBox width="120px" height="12px" />
          {/* icon circle */}
          <div style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '36px', height: '36px', borderRadius: '8px',
            background: '#f0f0f0',
          }} />
        </div>
      ))}
    </div>
  );
}

// ── Matches ChartPanel layout ──
function SkeletonChartPanel() {
  return (
    <div className="panel">
      {/* Panel header */}
      <div className="ph">
        <SkeletonBox width="160px" height="18px" />
        <div style={{ display: 'flex', gap: '6px' }}>
          <SkeletonBox width="64px" height="28px" borderRadius="6px" />
          <SkeletonBox width="64px" height="28px" borderRadius="6px" />
        </div>
      </div>

      {/* Bar chart */}
      <div className="bar-chart" style={{ alignItems: 'flex-end' }}>
        {[60, 85, 45, 95, 70, 55, 100].map((h, i) => (
          <div key={i} className="bc-col">
            <SkeletonBox
              width="100%"
              height={`${h}px`}
              borderRadius="4px 4px 0 0"
              style={{ marginBottom: '6px' }}
            />
            <SkeletonBox width="28px" height="11px" borderRadius="4px" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Matches DonutPanel layout ──
function SkeletonDonutPanel() {
  return (
    <div className="panel">
      <div className="ph">
        <SkeletonBox width="130px" height="18px" />
      </div>

      <div className="donut-area">
        {/* Donut circle placeholder */}
        <div style={{
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'conic-gradient(#e4e4e4 0deg, #f0f0f0 360deg)',
          flexShrink: 0,
          animation: 'skeletonShimmer 1.5s ease-in-out infinite',
        }} />

        {/* Legend rows */}
        <div className="donut-legend" style={{ flex: 1 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="leg-row">
              <div className="leg-l">
                <SkeletonBox width="12px" height="12px" borderRadius="3px" style={{ flexShrink: 0 }} />
                <SkeletonBox width={`${60 + i * 10}px`} height="13px" style={{ marginLeft: '8px' }} />
              </div>
              <SkeletonBox width="30px" height="13px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Matches table panels (Users / Activity Logs) ──
function SkeletonTablePanel({ cols = 6, rows = 6, hasSearch = true }) {
  return (
    <div className="panel">
      {/* Panel header */}
      <div className="ph">
        <SkeletonBox width="160px" height="18px" />
        <SkeletonBox width="60px" height="22px" borderRadius="999px" />
      </div>

      {/* Search / filter row */}
      {hasSearch && (
        <div className="tbl-ctrl">
          <SkeletonBox height="36px" borderRadius="8px" style={{ flex: 1 }} />
          <SkeletonBox width="130px" height="36px" borderRadius="8px" />
        </div>
      )}

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} style={{ padding: '10px 12px' }}>
                <SkeletonBox width={i === 0 ? '80px' : '60px'} height="12px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri}>
              {Array.from({ length: cols }).map((_, ci) => (
                <td key={ci} style={{ padding: '12px 12px' }}>
                  {ci === 0 ? (
                    // First col = avatar + name/email
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <SkeletonBox
                        width="32px" height="32px"
                        borderRadius="50%"
                        style={{ flexShrink: 0 }}
                      />
                      <div>
                        <SkeletonBox width="90px" height="13px" style={{ marginBottom: '5px' }} />
                        <SkeletonBox width="120px" height="11px" />
                      </div>
                    </div>
                  ) : ci === 1 ? (
                    // Status badge
                    <SkeletonBox width="55px" height="20px" borderRadius="999px" />
                  ) : (
                    <SkeletonBox
                      width={`${50 + Math.random() * 40}px`}
                      height="13px"
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Full Dashboard skeleton ──
function SkeletonDashboard() {
  return (
    <>
      <SkeletonStatCards />
      <div className="two-col">
        <SkeletonChartPanel />
        <SkeletonDonutPanel />
      </div>
      <SkeletonTablePanel cols={6} rows={6} hasSearch />
    </>
  );
}

// ── Per-page skeleton switcher ──
function AdminSkeleton({ page }) {
  switch (page) {
    case 'Analytics':
      return (
        <>
          <SkeletonStatCards />
          <SkeletonChartPanel />
          <SkeletonDonutPanel />
        </>
      );
    case 'Users':
      return <SkeletonTablePanel cols={6} rows={8} hasSearch />;
    case 'Activity Logs':
      return <SkeletonTablePanel cols={7} rows={8} hasSearch={false} />;
    case 'Dashboard':
    default:
      return <SkeletonDashboard />;
  }
}

/* ══════════════════════════════════════════
   SUB-COMPONENTS  (unchanged)
══════════════════════════════════════════ */

function StatCards({ stats }) {
  const cards = [
    {
      l: 'Total Users', v: stats.total_users.toLocaleString(),
      c: `+${stats.today_signups} today`, up: true, p: 'registered users',
      bg: '#fff1f1', ic: '#8B0E0E',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <circle cx="9" cy="7" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
      </svg>
    },
    {
      l: 'Total Conversions', v: stats.total_conversions.toLocaleString(),
      c: `${stats.today_conversions} today`, up: true, p: 'all tool uses',
      bg: '#f0faf0', ic: '#16a34a',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <polyline points="3 17 9 11 13 15 21 7"/>
      </svg>
    },
    {
      l: 'Avg. Response', v: `${stats.avg_duration_sec}s`,
      c: `${stats.week_conversions} this week`, up: true, p: 'average processing time',
      bg: '#eff6ff', ic: '#3b82f6',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    },
    {
      l: 'Avg. Quiz Score', v: `${stats.avg_quiz_score}%`,
      c: `${stats.total_quizzes_taken} attempts`, up: true, p: 'across all quizzes',
      bg: '#fef9ee', ic: '#f59e0b',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h.01M9 12h.01M9 15h.01M13 9h3M13 12h3M13 15h3" strokeLinecap="round"/>
      </svg>
    },
  ];

  return (
    <div className="stats-row">
      {cards.map((x, i) => (
        <div key={i} className="stat">
          <div className="stat-label">{x.l}</div>
          <div className="stat-val">{x.v}</div>
          <div className="stat-sub">
            <span className={`stat-chg ${x.up ? 'up' : 'dn'}`}>{x.c}</span>
            <span className="stat-per">{x.p}</span>
          </div>
          <div className="stat-icon-wrap" style={{ background: x.bg }}>
            <span style={{ color: x.ic }}>{x.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartPanel({ dailyUsage, monthlyUsage }) {
  const [period, setPeriod] = useState('weekly');

  const getData = () => {
    if (period === 'weekly')  return Object.entries(dailyUsage).map(([l, v]) => ({ l, v }));
    if (period === 'monthly') return Object.entries(monthlyUsage).map(([l, v]) => ({ l, v }));
    return Object.entries(dailyUsage).map(([l, v]) => ({ l, v }));
  };

  const data = getData();
  const max  = Math.max(...data.map(d => d.v), 1);

  return (
    <div className="panel">
      <div className="ph">
        <div className="ptitle">Usage Analytics</div>
        <div className="tabs">
          {['weekly', 'monthly'].map(p => (
            <button key={p} className={`tab${period === p ? ' on' : ''}`} onClick={() => setPeriod(p)}>
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="bar-chart">
        {data.map((d, i) => (
          <div key={i} className="bc-col">
            <div
              className="bc-bar"
              title={`${d.v.toLocaleString()} uses`}
              style={{
                height: `${Math.max(4, (d.v / max) * 120)}px`,
                background:   i === data.length - 1 ? '#8B0E0E' : '#e0e0ee',
                borderTop: `2px solid ${i === data.length - 1 ? '#c51d1d' : '#c8c8dc'}`,
              }}
            />
            <div className="bc-lbl">{d.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutPanel({ toolCounts }) {
  const tools = Object.entries(toolCounts).map(([name, count]) => ({
    id: name,
    name:  TOOL_CONFIG[name]?.name  || name,
    color: TOOL_CONFIG[name]?.color || '#888',
    total: count,
  }));

  const total = tools.reduce((s, t) => s + t.total, 0) || 1;
  const r = 50, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  let off = 0;
  const slices = tools.map(t => {
    const d = (t.total / total) * circ;
    const s = { ...t, d, off };
    off += d;
    return s;
  });

  return (
    <div className="panel">
      <div className="ph"><div className="ptitle">Tool Breakdown</div></div>
      <div className="donut-area">
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8e8f0" strokeWidth="14" />
          {slices.map(s => (
            <circle key={s.id} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth="14"
              strokeDasharray={`${s.d} ${circ - s.d}`}
              strokeDashoffset={-s.off}
            />
          ))}
        </svg>
        <div className="donut-legend">
          {tools.map(t => (
            <div key={t.id} className="leg-row">
              <div className="leg-l">
                <div className="leg-sq" style={{ background: t.color }} />
                <span className="leg-n">{t.name}</span>
              </div>
              <span className="leg-v">{t.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersPanel({ users }) {
  const [search, setSearch]         = useState('');
  const [filterTool, setFilterTool] = useState('');

  const filtered = users.filter(u => {
    const ms = !search ||
      (u.full_name || '').toLowerCase().includes(search) ||
      (u.email     || '').toLowerCase().includes(search);
    const mf = !filterTool || u.most_used_tool === filterTool;
    return ms && mf;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const toolNames = [...new Set(users.map(u => u.most_used_tool).filter(Boolean))];

  return (
    <div className="panel">
      <div className="ph">
        <div className="ptitle">Registered Users</div>
        <span className="chip chip-r">{users.length} total</span>
      </div>
      <div className="tbl-ctrl">
        <input className="tbl-search" placeholder="Search name or email…"
          value={search} onChange={e => setSearch(e.target.value.toLowerCase())} />
        <select className="tbl-sel" value={filterTool} onChange={e => setFilterTool(e.target.value)}>
          <option value="">All Tools</option>
          {toolNames.map(t => (
            <option key={t} value={t}>{TOOL_CONFIG[t]?.name || t}</option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            {['User','Status','Most Used Tool','Total Uses','Quizzes','Joined'].map(h =>
              <th key={h}>{h}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filtered.map((u, i) => (
            <tr key={i}>
              <td>
                <div className="u-cell">
                  <div className="u-av">{(u.full_name || '?')[0].toUpperCase()}</div>
                  <div>
                    <div className="u-name">{u.full_name || 'Unknown'}</div>
                    <div className="u-email">{u.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className={`bdg ${u.status === 'active' ? 'bdg-on' : 'bdg-off'}`}>
                  {u.status}
                </span>
              </td>
              <td>
                <span className="tool-tag">
                  {TOOL_CONFIG[u.most_used_tool]?.name || u.most_used_tool || 'None'}
                </span>
              </td>
              <td><span className="mono">{u.total_uses}</span></td>
              <td><span className="mono">{u.quiz_count}</span></td>
              <td style={{ fontSize: '12px', color: '#bbb' }}>{formatDate(u.created_at)}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ActivityLogs({ logs }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="panel">
      <div className="ph">
        <div className="ptitle">Recent Activity</div>
        <span className="chip chip-r">{logs.length} entries</span>
      </div>
      <table>
        <thead>
          <tr>
            {['User','Tool','Input','Output','Duration','Status','Time'].map(h =>
              <th key={h}>{h}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td>
                <div className="u-cell">
                  <div className="u-av">{(log.user_name || '?')[0].toUpperCase()}</div>
                  <div>
                    <div className="u-name">{log.user_name}</div>
                    <div className="u-email">{log.user_email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className="tool-tag">
                  {TOOL_CONFIG[log.tool_name]?.name || log.tool_name}
                </span>
              </td>
              <td><span className="mono">{(log.input_size  || 0).toLocaleString()}</span></td>
              <td><span className="mono">{(log.output_size || 0).toLocaleString()}</span></td>
              <td><span className="mono">{log.duration_ms}ms</span></td>
              <td>
                <span className={`bdg ${log.status === 'success' ? 'bdg-on' : 'bdg-off'}`}>
                  {log.status}
                </span>
              </td>
              <td style={{ fontSize: '12px', color: '#bbb' }}>{formatDate(log.created_at)}</td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                No activity yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN ADMIN PAGE
══════════════════════════════════════════ */
const SIDEBAR_MIN     = 60;
const SIDEBAR_MAX     = 420;
const SIDEBAR_DEFAULT = 288;

export default function AdminPage() {
  const navigate = useNavigate();
  const [page, setPage]     = useState('Dashboard');
  const [clock, setClock]   = useState('');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total_users: 0, total_conversions: 0,
    today_conversions: 0, today_signups: 0,
    week_conversions: 0, avg_duration_sec: 0,
    total_quizzes_generated: 0, total_quizzes_taken: 0,
    avg_quiz_score: 0,
  });
  const [toolCounts,    setToolCounts]    = useState({});
  const [dailyUsage,    setDailyUsage]    = useState({});
  const [monthlyUsage,  setMonthlyUsage]  = useState({});
  const [users,         setUsers]         = useState([]);
  const [recentLogs,    setRecentLogs]    = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [showNotifs,    setShowNotifs]    = useState(false);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const notifRef = useRef(null);
  const [navLoading, setNavLoading] = useState(false);
  const NAV_SKELETON_MS = 900;

  const [sidebarW, setSidebarW] = useState(SIDEBAR_DEFAULT);
  const isDragging  = useRef(false);
  const dragStartX  = useRef(0);
  const dragStartW  = useRef(0);
  const collapsed   = sidebarW <= SIDEBAR_MIN + 10;

  const onDragStart = (e) => {
    isDragging.current  = true;
    dragStartX.current  = e.clientX;
    dragStartW.current  = sidebarW;
    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';
  };
    
  useEffect(() => {
    if (loading) return;

    // ✅ wrap in setTimeout so setState is never called synchronously
    const startId = setTimeout(() => setNavLoading(true), 0);
    const endId   = setTimeout(() => setNavLoading(false), NAV_SKELETON_MS);

    return () => {
      clearTimeout(startId);
      clearTimeout(endId);
    };
  }, [page, loading]);
  
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      const next  = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, dragStartW.current + delta));
      setSidebarW(next);
    };
    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      setSidebarW(w => w < SIDEBAR_MIN + 30 ? SIDEBAR_MIN : w);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  const onHandleDblClick = () =>
    setSidebarW(w => (w <= SIDEBAR_MIN + 10 ? SIDEBAR_DEFAULT : SIDEBAR_MIN));

  // ── Fetch admin data (with minimum skeleton time) ──
  useEffect(() => {
    async function fetchAdminData() {
      // same pattern as Profile.jsx — min 2.5s so it never flashes
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 2500));

      try {
        const [res] = await Promise.all([
          fetch(`${API_BASE}/api/admin/stats`),
          minLoadTime,
        ]);
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
          setToolCounts(data.tool_counts);
          setDailyUsage(data.daily_usage);
          setMonthlyUsage(data.monthly_usage);
          setUsers(data.users);
          setRecentLogs(data.recent_logs);
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
        await minLoadTime;
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Notifications ──
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res  = await fetch(`${API_BASE}/api/admin/notifications?limit=15`);
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          const recent = data.notifications.filter(n =>
            n.timestamp && new Date(n.timestamp) > oneHourAgo
          );
          setUnreadCount(recent.length);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Click outside notif dropdown ──
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Clock ──
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-PH', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    try {
      const { supabase } = await import('../../lib/supabase');
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
    sessionStorage.removeItem('adminUser');
    navigate('/login');
  };

  const adminRaw = sessionStorage.getItem('adminUser');
  const admin    = adminRaw
    ? JSON.parse(adminRaw)
    : { name: 'Admin', role: 'Super Administrator' };
  const initials = admin.name ? admin.name[0].toUpperCase() : 'A';

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const diffMs  = Date.now() - new Date(timestamp);
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr  = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr  / 24);
    if (diffSec < 60)  return 'just now';
    if (diffMin < 60)  return `${diffMin}m ago`;
    if (diffHr  < 24)  return `${diffHr}h ago`;
    if (diffDay <  7)  return `${diffDay}d ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // ── Content renderer ──
  const renderContent = () => {
    // ← skeleton instead of plain text
    if (loading) return <AdminSkeleton page={page} />;

    switch (page) {
      case 'Dashboard':
        return (
          <>
            <StatCards stats={stats} />
            <div className="two-col">
              <ChartPanel dailyUsage={dailyUsage} monthlyUsage={monthlyUsage} />
              <DonutPanel toolCounts={toolCounts} />
            </div>
            <UsersPanel users={users} />
          </>
        );
      case 'Analytics':
        return (
          <>
            <StatCards stats={stats} />
            <ChartPanel dailyUsage={dailyUsage} monthlyUsage={monthlyUsage} />
            <DonutPanel toolCounts={toolCounts} />
          </>
        );
      case 'Users':
        return <UsersPanel users={users} />;
      case 'Activity Logs':
        return <ActivityLogs logs={recentLogs} />;
      default:
        return <div style={{ padding: '48px', color: '#ccc' }}>Section coming soon.</div>;
    }
  };

  const sections = [...new Set(NAV.map(n => n.section))];

  return (
    <div className="adm-shell">
      {/* ── Sidebar ── */}
      <aside
        className={`sidebar${collapsed ? ' sb-collapsed' : ''}`}
        style={{ width: sidebarW, minWidth: sidebarW, maxWidth: sidebarW }}
      >
        <div className="sb-logo">
          <div className="sb-brand">
            <div className="logo-circle">
              <img src="/logo.png" alt="U" className="logo-img" />
            </div>
            {!collapsed && (
              <div className="brand-wrap">
                <span className="brand">U-ConvertIT</span>
                <span className="unlimited-pill">ADMIN</span>
              </div>
            )}
          </div>
          {!collapsed && <div className="sb-sub">Control Panel</div>}
        </div>

        <nav className="sb-nav">
          {sections.map(sec => (
            <div key={sec} className="sb-section-group">
              {!collapsed && <div className="sb-sec">{sec}</div>}
              {NAV.filter(n => n.section === sec).map(n => (
                <button
                  key={n.label}
                  className={`sb-item${page === n.label ? ' on' : ''}`}
                  onClick={() => setPage(n.label)}
                  title={collapsed ? n.label : undefined}
                >
                  <span className="sb-dot" />
                  {NAV_ICONS[n.label]}
                  {!collapsed && <span className="sb-item-label">{n.label}</span>}
                  {page === n.label && !collapsed && <span className="sb-active-bar" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sb-foot">
          <div className="sb-av" title={collapsed ? admin.name : undefined}>{initials}</div>
          {!collapsed && (
            <div className="sb-user-info">
              <div className="sb-aname">{admin.name}</div>
              <div className="sb-arole">{admin.role}</div>
            </div>
          )}
          {!collapsed && (
            <button className="sb-logout" onClick={handleLogout} title="Logout">
              <IconLogout />
            </button>
          )}
        </div>

        <div
          className="sb-resize-handle"
          onMouseDown={onDragStart}
          onDoubleClick={onHandleDblClick}
          title="Drag to resize · Double-click to toggle"
        >
          <div className="sb-resize-grip" />
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="adm-main">
        <div className="topbar">
          <div className="tb-left" />
          <div className="tb-right">
            <div className="tb-live">
              <div className="live-dot" />
              {/* Show 0 gracefully while loading */}
              <span className="tb-live-txt">{stats.total_users} users</span>
            </div>
            <div className="tb-clock">{clock}</div>

            {/* ── Notification Bell ── */}
            <div className="tb-bell-wrapper" ref={notifRef} style={{ position: 'relative' }}>
              <div
                className="tb-bell"
                onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) setUnreadCount(0); }}
                style={{ cursor: 'pointer' }}
              >
                <IconBell />
                {unreadCount > 0 && <div className="tb-badge">{unreadCount}</div>}
              </div>

              {showNotifs && (
                <div style={{
                  position: 'absolute', top: '40px', right: '0',
                  width: '380px', maxHeight: '500px',
                  background: 'white', borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden', zIndex: 1000,
                }}>
                  <div style={{
                    padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
                    background: '#fafafa', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                      🔔 Notifications
                    </h3>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {notifications.length} recent
                    </span>
                  </div>

                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                        No recent activity
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '12px 20px',
                            borderBottom: i < notifications.length - 1 ? '1px solid #f3f4f6' : 'none',
                            display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                          <div style={{
                            fontSize: '24px', flexShrink: 0,
                            width: '40px', height: '40px',
                            background: '#f3f4f6', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {n.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                              {n.title}
                            </div>
                            <div style={{
                              fontSize: '13px', color: '#4b5563', marginBottom: '4px',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {n.message}
                            </div>
                            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                              {formatTimeAgo(n.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{
                    padding: '12px 20px', borderTop: '1px solid #f3f4f6',
                    background: '#fafafa', textAlign: 'center',
                  }}>
                    <button
                      onClick={() => { setPage('Activity Logs'); setShowNotifs(false); }}
                      style={{
                        background: 'none', border: 'none',
                        color: '#8B0E0E', fontSize: '13px',
                        fontWeight: '600', cursor: 'pointer',
                      }}
                    >
                      View all activity →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="adm-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}