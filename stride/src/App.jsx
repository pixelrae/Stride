import React, { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// STRIDE — Professional, Trustworthy & User-Centric Interface
// Non-Orange Palette: Premium Deep Slate, Emerald Green, Warm Sand & Deep Blue
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#F8F9FA",          // Clean light grey-slate base
  surface: "#FFFFFF",     // Crisp white for primary content surfaces
  card: "#FFFFFF",
  border: "#E5E7EB",      // Subdued accessible lines
  borderMed: "#D1D5DB",
  
  // Brand Refresh (Non-Orange)
  primary: "#0F766E",     // Teal — primary identity, authoritative and calming
  primaryDim: "rgba(15, 118, 110, 0.08)",
  primaryLight: "#F0FDF4",
  
  success: "#166534",     // Emerald Green — financial security and growth
  successDim: "rgba(22, 101, 52, 0.08)",
  successLight: "#ECFDF5",
  
  accent: "#1E40AF",      // Deep Blue — institutional trust and compliance
  accentDim: "rgba(30, 64, 175, 0.08)",
  accentLight: "#EFF6FF",
  
  warning: "#B45309",     // Soft Amber — indicators
  warningDim: "rgba(180, 83, 9, 0.08)",
  warningLight: "#FEF3C7",

  textDark: "#111827",    // High contrast near-black headers
  textMid: "#374151",     // Clean corporate readable body copy
  textMuted: "#6B7280",   // Captions and labels
  white: "#FFFFFF",
};

// ─── Formatting & Mock Data Utilities ─────────────────────────────────────────
const formatZAR = (amount) => `R ${Number(amount).toFixed(2)}`;
const formatForeign = (amount, currency) => `${currency} ${Number(amount).toFixed(2)}`;
const generateUID = () => Math.random().toString(36).substring(2, 8).toUpperCase();
const getFormattedDate = () => new Date().toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });

const USER_PROFILE = {
  name: "Nomsa Dlamini",
  initials: "ND",
  walletAddress: "$stride.pay/nomsa.dlamini",
  phone: "+27 72 000 0001",
  balance: 1240.50,
  totalEarned: 18600,
  totalSent: 4200,
  payslips: 24,
};

// ─── Identifiable Custom Logo ────────────────────────────────────────────────
function StrideLogo({ size = 32, color = COLORS.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 26C10 18 14 16 18 12C22 8 24 4 28 4" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 18C8 13.5 12 12.5 16 9.5C20 6.5 21.5 4.5 24.5 2.5" stroke={COLORS.success} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <circle cx="28" cy="4" r="3" fill={COLORS.success} />
      <circle cx="6" cy="26" r="3" fill={color} />
    </svg>
  );
}

// ─── QR Code Component ───────────────────────────────────────────────────────
function CustomQRCode({ data, size = 180 }) {
  const G = 17, cell = size / G;
  let hash = 5381;
  for (let i = 0; i < data.length; i++) hash = ((hash << 5) + hash + data.charCodeAt(i)) | 0;
  const bits = [], finder = new Map();
  let seed = hash;
  for (let i = 0; i < G * G; i++) { 
    seed = ((seed * 1664525) + 1013904223) | 0; 
    bits.push((seed >>> 16) & 1); 
  }
  const addFinder = (r0, c0) => {
    for (let r = r0; r < r0 + 7; r++) for (let c = c0; c < c0 + 7; c++) {
      const out = r === r0 || r === r0 + 6 || c === c0 || c === c0 + 6;
      const inn = r >= r0 + 2 && r <= r0 + 4 && c >= c0 + 2 && c <= c0 + 4;
      finder.set(`${r},${c}`, out || inn);
    }
  };
  addFinder(0, 0); addFinder(0, G - 7); addFinder(G - 7, 0);
  const rects = [];
  for (let r = 0; r < G; r++) for (let c = 0; c < G; c++) {
    const key = `${r},${c}`;
    const on = finder.has(key) ? finder.get(key) : bits[r * G + c] === 1;
    if (on) rects.push(<rect key={key} x={c * cell} y={r * cell} width={cell - 0.5} height={cell - 0.5} fill={COLORS.primary} rx={1} />);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: COLORS.primaryLight, borderRadius: 16, display: "block" }}>
      {rects}
    </svg>
  );
}

// ─── Shared UI Building Blocks ───────────────────────────────────────────────
const Avatar = ({ initials, size = 48, type = "primary" }) => {
  const themes = {
    primary: { bg: COLORS.primaryLight, border: COLORS.primary, color: COLORS.primary },
    success: { bg: COLORS.successLight, border: COLORS.success, color: COLORS.success },
    accent: { bg: COLORS.accentLight, border: COLORS.accent, color: COLORS.accent },
  };
  const current = themes[type] || themes.primary;
  return (
    <div style={{ 
      width: size, height: size, borderRadius: "50%", 
      background: current.bg, border: `2px solid ${current.border}`, 
      display: "flex", alignItems: "center", justifyContent: "center", 
      fontWeight: 700, color: current.color, fontSize: size * 0.38, flexShrink: 0 
    }}> 
      {initials} 
    </div>
  );
};

const StatusBadge = ({ type = "success", children }) => {
  const mapping = {
    success: { text: COLORS.success, bg: COLORS.successLight },
    accent: { text: COLORS.accent, bg: COLORS.accentLight },
    warning: { text: COLORS.warning, bg: COLORS.warningLight },
  };
  const style = mapping[type] || mapping.success;
  return (
    <span style={{ background: style.bg, color: style.text, borderRadius: 24, padding: "6px 14px", fontSize: 14, fontWeight: 700, display: "inline-block" }}>
      {children}
    </span>
  );
};

const BaseCard = ({ children, style = {} }) => (
  <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", boxSizing: "border-box", ...style }}>
    {children}
  </div>
);

const FormInput = ({ value, onChange, placeholder, type = "text", label }) => (
  <div style={{ marginBottom: 20 }}> 
    {label && <label style={{ fontSize: 14, color: COLORS.textMuted, display: "block", marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</label>} 
    <input value={value} onChange={onChange} type={type} placeholder={placeholder} style={{ width: "100%", background: COLORS.bg, border: `2px solid ${COLORS.border}`, borderRadius: 12, padding: "16px", color: COLORS.textDark, fontSize: 16, boxSizing: "border-box", outline: "none", fontFamily: "inherit", minHeight: 54 }} /> 
  </div>
);

const ActionButton = ({ onClick, children, variant = "primary", disabled = false, full = false }) => {
  const base = { 
    border: "none", borderRadius: 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.15s ease", fontSize: 16, padding: "16px 24px", minHeight: 56, width: full ? "100%" : "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, boxSizing: "border-box"
  };
  const variations = {
    primary: { background: COLORS.primary, color: COLORS.white, boxShadow: "0 4px 12px rgba(15,118,110,0.15)" },
    secondary: { background: "transparent", color: COLORS.textMid, border: `2px solid ${COLORS.borderMed}` },
    success: { background: COLORS.successLight, color: COLORS.success, border: `2px solid ${COLORS.success}44` },
    accent: { background: COLORS.accentLight, color: COLORS.accent, border: `2px solid ${COLORS.accent}44` },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variations[variant] }}>{children}</button>;
};

const DataRow = ({ label, value, highlightColor }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16, marginBottom: 12 }}> 
    <span style={{ color: COLORS.textMuted }}>{label}</span> 
    <span style={{ fontWeight: 700, color: highlightColor || COLORS.textDark }}>{value}</span> 
  </div>
);

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 14, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontWeight: 700 }}>
    {children}
  </div>
);

// ─── Modal Layout ────────────────────────────────────────────────────────────
const SlideModal = ({ children, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}> 
    <BaseCard style={{ maxWidth: 440, width: "100%", maxHeight: "85vh", overflowY: "auto", borderRadius: 24 }}> 
      {children} 
      <div style={{ marginTop: 20 }}><ActionButton onClick={onClose} variant="secondary" full>Dismiss</ActionButton></div> 
    </BaseCard> 
  </div>
);

const InformationQRModal = ({ title, subtitle, data, details, onClose }) => (
  <SlideModal onClose={onClose}>
    <SectionLabel>Interledger Secure Point</SectionLabel>
    <div style={{ fontWeight: 900, fontSize: 24, color: COLORS.textDark, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 15, color: COLORS.textMuted, marginBottom: 20 }}>{subtitle}</div>
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
      <CustomQRCode data={data} size={190} />
    </div>
    <BaseCard style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, padding: "16px" }}>
      {details.map(([k, v]) => <DataRow key={k} label={k} value={v} />)}
    </BaseCard>
  </SlideModal>
);

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD SUB-VIEW
// ─────────────────────────────────────────────────────────────────────────────
function DashboardOverview({ onNavigate, user }) {
  const tools = [
    { id: "pay", icon: "📥", label: "Get Paid", sub: "Collect wages & statements", info: "Generate fast payment links", type: "primary", color: COLORS.primary, bg: COLORS.primaryLight },
    { id: "work", icon: "🪪", label: "Work Profile", sub: "Digital worker identities", info: "Verified employer logbooks", type: "accent", color: COLORS.accent, bg: COLORS.accentLight },
    { id: "save", icon: "🛡️", label: "Save Together", sub: "Stokvel transparency", info: "Co-signed target micro-pots", type: "success", color: COLORS.success, bg: COLORS.successLight },
    { id: "send", icon: "🌍", label: "Send Money", sub: "Global zero-friction fees", info: "Instant border ledger routing", type: "warning", color: COLORS.warning, bg: COLORS.warningLight },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Dynamic Premium Non-Orange Balance Shield */}
      <BaseCard style={{ 
        background: "linear-gradient(135deg, #0F766E, #115E59)", 
        border: "none", color: COLORS.white, padding: "32px", borderRadius: 24,
        boxShadow: "0 10px 25px rgba(15,118,110,0.25)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20 }}>
            {user.initials}
          </div>
          <div>
            <div style={{尊fontWeight: 800, fontSize: 20 }}>{user.name}</div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 2, wordBreak: "break-all" }}>{user.walletAddress}</div>
          </div>
        </div>
        
        <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700 }}>
          Money Available
        </div>
        <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-1px" }}>{formatZAR(user.balance)}</div>
      </BaseCard>

      {/* Quick Stats Grid Container */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { label: "Earned", value: formatZAR(user.totalEarned), color: COLORS.success },
          { label: "Sent Home", value: formatZAR(user.totalSent), color: COLORS.accent },
          { label: "Payslips", value: user.payslips, color: COLORS.primary },
        ].map(stat => (
          <BaseCard key={stat.label} style={{ padding: "16px 12px", textAlign: "center", borderRadius: 16 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>{stat.label}</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: stat.color }}>{stat.value}</div>
          </BaseCard>
        ))}
      </div>

      {/* Grid of Interactive Modules */}
      <SectionLabel>What would you like to do today?</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {tools.map(tool => (
          <BaseCard key={tool.id} style={{ 
            cursor: "pointer", background: tool.bg, border: `1px solid ${tool.color}25`, 
            padding: "24px", minHeight: 180, display: "flex", flexDirection: "column", 
            justifyContent: "space-between", borderRadius: 20 
          }} onClick={() => onNavigate(tool.id)}>
            <div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{tool.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: tool.color, marginBottom: 6 }}>{tool.label}</div>
              <div style={{ fontSize: 14, color: COLORS.textMid, fontWeight: 600, lineHeight: 1.4 }}>{tool.sub}</div>
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, borderTop: `1px solid ${tool.color}15`, paddingTop: 8, marginTop: 8, fontWeight: 600 }}>
              ➔ {tool.info}
            </div>
          </BaseCard>
        ))}
      </div>

      {/* Explainer Block */}
      <BaseCard style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", gap: 14 }}>
          <span style={{ fontSize: 24 }}>🛡️</span>
          <div>
            <SectionLabel>Unified Network System</SectionLabel>
            <div style={{ fontSize: 15, color: COLORS.textMid, lineHeight: 1.6 }}>
              Stride uses decentralized <span style={{ color: COLORS.primary, fontWeight: 700 }}>Open Payments</span> web standard protocols. Verify credentials, access liquidity pipelines, and log tamper-proof payroll fields without high bank costs.
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GET PAID VIEW
// ─────────────────────────────────────────────────────────────────────────────
function PayContainer({ user }) {
  const [currentTab, setCurrentTab] = useState("receive");
  const [employer, setEmployer] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isQrActive, setIsQrActive] = useState(false);
  const [ledgerHistory] = useState([
    { id: "PS-884", employer: "Thandi's Household", amount: 2800, date: "01 Jun 2026", desc: "Monthly domestic settlement" },
    { id: "PS-703", employer: "Khumalo Family", amount: 1400, date: "15 Jun 2026", desc: "Gardening contract" },
  ]);

  const rawPayload = JSON.stringify({ interledgerAddress: user.walletAddress, targetSource: employer, amount, memo, timestamp: getFormattedDate() });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {isQrActive && (
        <InformationQRModal 
          title="Inbound Invoice Token" subtitle={user.walletAddress} data={rawPayload}
          details={[
            ["Network Address", user.walletAddress],
            ["Payer Identity", employer || "Open Request"],
            ["Invoice Sum", amount ? formatZAR(amount) : "Variable Amount"],
            ["Reference Memo", memo || "N/A"]
          ]}
          onClose={() => setIsQrActive(false)} 
        />
      )}

      {/* Styled Segment Tab Toggle */}
      <div style={{ display: "flex", background: COLORS.border, borderRadius: 16, padding: 4 }}>
        {window.innerWidth > 400 ? null : ""}
        <button onClick={() => setCurrentTab("receive")} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", cursor: "pointer", background: currentTab === "receive" ? COLORS.white : "transparent", color: currentTab === "receive" ? COLORS.primary : COLORS.textMid, fontWeight: 800, fontSize: 15, boxShadow: currentTab === "receive" ? "0 2px 8px rgba(0,0,0,0.05)" : "none" }}>
          Request Payment
        </button>
        <button onClick={() => setCurrentTab("history")} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", cursor: "pointer", background: currentTab === "history" ? COLORS.white : "transparent", color: currentTab === "history" ? COLORS.primary : COLORS.textMid, fontWeight: 800, fontSize: 15, boxShadow: currentTab === "history" ? "0 2px 8px rgba(0,0,0,0.05)" : "none" }}>
          My Payslips ({ledgerHistory.length})
        </button>
      </div>

      {currentTab === "receive" ? (
        <>
          <BaseCard>
            <SectionLabel>Setup Billing Link</SectionLabel>
            <FormInput label="Client/Employer Entity" value={employer} onChange={e => setEmployer(e.target.value)} placeholder="e.g. Thandi's Household" />
            <FormInput label="Requested Amount (ZAR)" value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="0.00 (Leave blank for open entries)" />
            <FormInput label="Statement Description" value={memo} onChange={e => setMemo(e.target.value)} placeholder="e.g. Monthly domestic maintenance" />
            <div style={{ marginTop: 8 }}>
              <ActionButton onClick={() => setIsQrActive(true)} disabled={!employer.trim()} full>
                Compile QR & Payment Pointer
              </ActionButton>
            </div>
          </BaseCard>
          
          <BaseCard style={{ background: COLORS.primaryLight, border: `1.5px solid ${COLORS.primary}22` }}>
            <SectionLabel>Your Direct Deposit Handle</SectionLabel>
            <div style={{ fontWeight: 800, color: COLORS.primary, fontSize: 18, wordBreak: "break-all", marginBottom: 8 }}>{user.walletAddress}</div>
            <div style={{ fontSize: 14, color: COLORS.textMid, lineHeight: 1.5 }}>
              Provide this address pointer to routing institutions or web clients. Payment streams clear instantly into your portfolio ledger.
            </div>
          </BaseCard>
        </>
      ) : (
        <>
          <BaseCard style={{ background: COLORS.successLight, border: `1px solid ${COLORS.success}22`, textAlign: "center" }}>
            <SectionLabel>Aggregated Total Records</SectionLabel>
            <div style={{ fontWeight: 900, fontSize: 36, color: COLORS.success, margin: "4px 0" }}>
              {formatZAR(ledgerHistory.reduce((acc, current) => acc + current.amount, 0))}
            </div>
            <div style={{ fontSize: 14, color: COLORS.textMid, fontWeight: 600 }}>
              Cryptographically verified over live Open Settlement Nodes
            </div>
          </BaseCard>

          {ledgerHistory.map(item => (
            <BaseCard key={item.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.textDark }}>{item.employer}</div>
                  <div style={{ fontSize: 14, color: COLORS.textMid, margin: "2px 0" }}>{item.desc}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 700 }}>{item.date} • Reference ID: {item.id}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 900, color: COLORS.success, fontSize: 18, marginBottom: 4 }}>{formatZAR(item.amount)}</div>
                  <StatusBadge type="success">Settled</StatusBadge>
                </div>
              </div>
            </BaseCard>
          ))}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORK PROFILE MODULE
// ─────────────────────────────────────────────────────────────────────────────
function WorkProfileContainer({ user }) {
  const [tab, setTab] = useState("profile");
  const [showQR, setShowQR] = useState(false);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [rate, setRate] = useState("");
  const [schedule, setSchedule] = useState("");

  const [activeContracts, setActiveContracts] = useState([
    { id: "CON-1", title: "Lead Domestic Consultant", client: "Khumalo Family", rate: 700, date: "Every Monday", status: "active" },
    { id: "CON-2", title: "Landscape Infrastructure", client: "Pietersen Home", rate: 400, date: "Every Friday", status: "active" },
  ]);
  const [upcomingContracts, setUpcomingContracts] = useState([
    { id: "CON-3", title: "Comprehensive House Deep-Clean", client: "Mokoena Home", rate: 500, date: "28 Jun 2026", status: "upcoming" },
  ]);

  const identificationPayload = JSON.stringify({ verifiedUser: user.name, pointer: user.walletAddress, comms: user.phone });

  const handleCreateJob = (isUpcoming) => {
    const freshJob = { id: "CON-" + generateUID(), title, client, rate: Number(rate) || 0, date: schedule, status: isUpcoming ? "upcoming" : "active" };
    isUpcoming ? setUpcomingContracts(prev => [freshJob, ...prev]) : setActiveContracts(prev => [freshJob, ...prev]);
    setTitle(""); setClient(""); setRate(""); setSchedule("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {showQR && (
        <InformationQRModal 
          title="Verified Worker Identity" subtitle="Instant hiring & contract deployment badge" data={identificationPayload}
          details={[["Full Legal Name", user.name], ["Interledger Pointer", user.walletAddress], ["Contact Line", user.phone], ["Skill Frameworks", "General Logistics · Estate Care · Custodial"]]}
          onClose={() => setShowQR(false)} 
        />
      )}

      <div style={{ display: "flex", background: COLORS.border, borderRadius: 16, padding: 4 }}>
        {["profile", "log", "ledger"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
            background: tab === t ? COLORS.white : "transparent", color: tab === t ? COLORS.accent : COLORS.textMid,
            fontWeight: 800, fontSize: 14, textTransform: "capitalize", boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.05)" : "none"
          }}>{t === "log" ? "Add Job" : t === "ledger" ? "All Schedules" : "My Badge"}</button>
        ))}
      </div>

      {tab === "profile" && (
        <>
          <BaseCard style={{ background: COLORS.accentLight, border: `2px solid ${COLORS.accent}20`, borderRadius: 24, padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <Avatar initials={user.initials} size={60} type="accent" />
              <div>
                <div style={{ fontWeight: 900, fontSize: 20, color: COLORS.textDark }}>{user.name}</div>
                <div style={{ fontSize: 14, color: COLORS.accent, fontWeight: 700, margin: "2px 0" }}>{user.walletAddress}</div>
                <div style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: 600 }}>{user.phone}</div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {["Domestic Management", "Horticulture", "Deep Custodial", "Hospitality Logistics"].map(tag => (
                <span key={tag} style={{ background: COLORS.white, border: `1px solid ${COLORS.borderMed}`, padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700, color: COLORS.textMid }}>{tag}</span>
              ))}
            </div>
            
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
              <DataRow label="Active Logged Mandates" value={String(activeContracts.length + upcomingContracts.length)} />
              <DataRow label="Total Audited Yield" value={formatZAR(user.totalEarned)} highlightColor={COLORS.success} />
            </div>
          </BaseCard>
          <ActionButton onClick={() => setShowQR(true)} variant="accent" full>Broadcast Dynamic ID Card</ActionButton>
        </>
      )}

      {tab === "log" && (
        <BaseCard>
          <SectionLabel>Register Framework Contract</SectionLabel>
          <FormInput label="Job Classification" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Custodial Generalist" />
          <FormInput label="Payer/Client Entity" value={client} onChange={e => setClient(e.target.value)} placeholder="e.g. Mokoena Residence" />
          <FormInput label="Contract Rate (ZAR)" value={rate} onChange={e => setRate(e.target.value)} type="number" placeholder="0.00" />
          <FormInput label="Schedule Interval / Deadline" value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="e.g. Every Alternate Tuesday" />
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            <ActionButton onClick={() => handleCreateJob(false)} disabled={!title.trim()} variant="primary" full>Activate Contract Immediately</ActionButton>
            <ActionButton onClick={() => handleCreateJob(true)} disabled={!title.trim()} variant="secondary" full>Log as Future Backlog</ActionButton>
          </div>
        </BaseCard>
      )}

      {tab === "ledger" && (
        <>
          <SectionLabel>Live Operational Frameworks</SectionLabel>
          {[...activeContracts, ...upcomingContracts].map(job => (
            <BaseCard key={job.id} style={{ marginBottom: 12, borderLeft: `4px solid ${job.status === "active" ? COLORS.success : COLORS.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.textDark }}>{job.title}</div>
                  <div style={{ fontSize: 14, color: COLORS.textMid }}>{job.client}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4, fontWeight: 600 }}>🗓️ {job.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.textDark, marginBottom: 4 }}>{formatZAR(job.rate)}</div>
                  <StatusBadge type={job.status === "active" ? "success" : "accent"}>{job.status}</StatusBadge>
                </div>
              </div>
            </BaseCard>
          ))}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVE TOGETHER MODULE (STOKVEL)
// ─────────────────────────────────────────────────────────────────────────────
function SaveTogetherContainer() {
  const [tab, setTab] = useState("dashboard");
  const [payoutTarget, setPayoutTarget] = useState("user-1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const [poolMembers, setPoolMembers] = useState([
    { id: "user-1", name: "Nomsa D.", initials: "ND", contributed: true, stake: 500 },
    { id: "user-2", name: "Zanele M.", initials: "ZM", contributed: true, stake: 500 },
    { id: "user-3", name: "Thabo K.", initials: "TK", contributed: false, stake: 500 },
    { id: "user-4", name: "Lindiwe S.", initials: "LS", contributed: true, stake: 500 },
    { id: "user-5", name: "Sipho N.", initials: "SN", contributed: false, stake: 500 },
  ]);

  const collectivePot = poolMembers.reduce((acc, curr) => acc + (curr.contributed ? curr.stake : 0), 0);
  const contributionCount = poolMembers.filter(m => m.contributed).length;

  const triggerDisbursement = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", background: COLORS.border, borderRadius: 16, padding: 4 }}>
        {window.innerWidth > 400 ? null : ""}
        {/* Toggle options */}
        {[["dashboard", "Overview"], ["roster", "Members Pool"], ["disburse", "Payout Strategy"]].map(([viewId, labelText]) => (
          <button key={viewId} onClick={() => setTab(viewId)} style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
            background: tab === viewId ? COLORS.white : "transparent", color: tab === viewId ? COLORS.success : COLORS.textMid,
            fontWeight: 800, fontSize: 14, boxShadow: tab === viewId ? "0 2px 8px rgba(0,0,0,0.05)" : "none"
          }}>{labelText}</button>
        ))}
      </div>

      {tab === "dashboard" && (
        <>
          <BaseCard style={{ background: COLORS.successLight, border: `2px solid ${COLORS.success}20`, padding: "28px" }}>
            <SectionLabel>Active Capital Pool Status</SectionLabel>
            <div style={{ fontWeight: 900, fontSize: 40, color: COLORS.success, marginBottom: 4 }}>{formatZAR(collectivePot)}</div>
            <div style={{ fontSize: 15, color: COLORS.textMid, marginBottom: 16, fontWeight: 600 }}>
              {contributionCount} of {poolMembers.length} co-signers deposited cleared stakes.
            </div>
            <div style={{ height: 10, background: "rgba(255,255,255,0.8)", border: `1px solid ${COLORS.border}`, borderRadius: 5, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(contributionCount / poolMembers.length) * 100}%`, background: COLORS.success, borderRadius: 5, transition: "width 0.4s ease" }} />
            </div>
          </BaseCard>

          <BaseCard>
            <SectionLabel>Consensus Charter Rules</SectionLabel>
            <DataRow label="Target Group Matrix" value="5 Active Accounts" />
            <DataRow label="Recurrent Contribution" value="R 500.00 Fixed" />
            <DataRow label="Maximum Matched Target" value="R 2,500.00" />
            <DataRow label="Disbursement Protocol" value="Automated Round-Robin" />
          </BaseCard>
        </>
      )}

      {tab === "roster" && (
        <>
          <SectionLabel>Individual Participant Matrix</SectionLabel>
          {poolMembers.map(member => (
            <BaseCard key={member.id} style={{ marginBottom: 4, border: `1px solid ${member.contributed ? COLORS.success : COLORS.border}55` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ 
                  width: 44, height: 44, borderRadius: "50%", background: member.contributed ? COLORS.successLight : COLORS.bg, border: `2px solid ${member.contributed ? COLORS.success : COLORS.borderMed}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: member.contributed ? COLORS.success : COLORS.textMuted, fontSize: 15 
                }}>{member.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.textDark }}>{member.name}</div>
                  <div style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: 600 }}>{formatZAR(member.stake)} Base Layer Stake</div>
                </div>
                <div>
                  {member.contributed ? (
                    <StatusBadge type="success">Cleared</StatusBadge>
                  ) : (
                    <ActionButton variant="success" onClick={() => setPoolMembers(p => p.map(x => x.id === member.id ? { ...x, contributed: true } : x))}>
                      Clear Contribution
                    </ActionButton>
                  )}
                </div>
              </div>
            </BaseCard>
          ))}
        </>
      )}

      {tab === "disburse" && (
        <BaseCard>
          <SectionLabel>Execute Circular Settlement</SectionLabel>
          <div style={{ fontSize: 15, color: COLORS.textMid, marginBottom: 20, fontWeight: 500 }}>
            Liquidity Allocation Ready: <strong style={{ color: COLORS.success }}>{formatZAR(collectivePot)}</strong>
          </div>

          <label style={{ fontSize: 14, color: COLORS.textMuted, display: "block", marginBottom: 8, fontWeight: 700 }}>Select Valid Member Entity</label>
          <select value={payoutTarget} onChange={e => setPayoutTarget(e.target.value)} style={{ width: "100%", background: COLORS.bg, border: `2px solid ${COLORS.border}`, borderRadius: 12, padding: "16px", color: COLORS.textDark, fontSize: 16, marginBottom: 24, outline: "none", fontFamily: "inherit", minHeight: 54 }}>
            {poolMembers.filter(m => m.contributed).map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {!isDone ? (
            <ActionButton onClick={triggerDisbursement} disabled={isProcessing || collectivePot === 0} variant="primary" full>
              {isProcessing ? "Processing Vault Routing..." : `Release Pool Assets to Selected Payer`}
            </ActionButton>
          ) : (
            <div style={{ background: COLORS.successLight, border: `1px solid ${COLORS.success}44`, borderRadius: 16, padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <div style={{ fontWeight: 800, color: COLORS.success, fontSize: 18 }}>Disbursement Chain Execution Complete</div>
              <div style={{ fontSize: 14, color: COLORS.textMid, marginTop: 4, fontWeight: 600 }}>
                {formatZAR(collectivePot)} assigned over multi-hop settlement channels. SMS broadcast notifications triggered.
              </div>
            </div>
          )}
        </BaseCard>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REMITTANCE & DISPATCH CHANNELS (SEND MONEY)
// ─────────────────────────────────────────────────────────────────────────────
const CHANNELS = [
  { country: "Zimbabwe", currency: "USD", flag: "🇿🇼", conversion: 0.053, baseFee: 0.005 },
  { country: "Mozambique", currency: "MZN", flag: "🇲🇿", conversion: 19.2, baseFee: 0.004 },
  { country: "Lesotho", currency: "LSL", flag: "🇱🇸", conversion: 1.0, baseFee: 0.003 },
  { country: "Zambia", currency: "ZMW", flag: "🇿🇲", conversion: 0.27, baseFee: 0.005 },
];

function SendMoneyContainer() {
  const [inputZAR, setInputZAR] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(CHANNELS[0]);
  const [destinationWallet, setDestinationWallet] = useState("");
  const [processState, setProcessState] = useState("form"); // "form" | "sending" | "success"

  const zarVal = parseFloat(inputZAR) || 0;
  const computedFee = zarVal * selectedRoute.baseFee;
  const netReceived = (zarVal - computedFee) * selectedRoute.conversion;

  const triggerLiquidityRoute = () => {
    setProcessState("sending");
    setTimeout(() => {
      setProcessState("success");
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {processState === "form" && (
        <>
          <BaseCard>
            <SectionLabel>Cross-Border Liquidity Transfer</SectionLabel>
            <FormInput label="Principal Gross Amount (ZAR)" value={inputZAR} onChange={e => setInputZAR(e.target.value)} type="number" placeholder="0.00" />
            
            <label style={{ fontSize: 14, color: COLORS.textMuted, display: "block", marginBottom: 10, fontWeight: 700, textTransform: "uppercase" }}>Target Destination Corridor</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {CHANNELS.map(route => {
                const isActive = selectedRoute.country === route.country;
                return (
                  <div key={route.country} onClick={() => setSelectedRoute(route)} style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "16px", borderRadius: 14, cursor: "pointer",
                    background: isActive ? COLORS.primaryLight : COLORS.white, border: `2px solid ${isActive ? COLORS.primary : COLORS.border}`, transition: "all 0.1s ease"
                  }}>
                    <span style={{ fontSize: 28 }}>{route.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.textDark }}>{route.country}</div>
                      <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 600 }}>Native Asset: {route.currency}</div>
                    </div>
                    {isActive && <div style={{ color: COLORS.primary, strokeWidth: 3, fontWeight: 900 }}>✓</div>}
                  </div>
                );
              })}
            </div>

            <FormInput label="Destination Account Handle / Mobile Number" value={destinationWallet} onChange={e => setDestinationWallet(e.target.value)} placeholder="e.g. +263 71 234 5678" />
          </BaseCard>

          {zarVal > 0 && (
            <BaseCard style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
              <SectionLabel>Clearing House Valuation Breakdown</SectionLabel>
              <DataRow label="Conversion Standard Rate" value={`1 ZAR = ${selectedRoute.conversion} ${selectedRoute.currency}`} />
              <DataRow label="Network Settlement Fee" value={formatZAR(computedFee)} highlightColor={COLORS.success} />
              <div style={{ height: 1, background: COLORS.border, margin: "12px 0" }} />
              <DataRow label="Net Receiver Assets Delivered" value={formatForeign(netReceived, selectedRoute.currency)} highlightColor={COLORS.primary} />
            </BaseCard>
          )}

          <ActionButton onClick={triggerLiquidityRoute} disabled={zarVal <= 0 || !destinationWallet.trim()} full>
            Authorize Financial Ledger Transfer
          </ActionButton>
        </>
      )}

      {processState === "sending" && (
        <BaseCard style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⚡</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: COLORS.textDark }}>Syncing Real-Time Exchange Settlement Channels</div>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 8, fontWeight: 600 }}>
            Streaming transactional nodes down Interledger multi-currency validation pipelines...
          </div>
        </BaseCard>
      )}

      {processState === "success" && (
        <BaseCard style={{ padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>✨</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: COLORS.success, marginBottom: 6 }}>Assets Dispatched Successfully</div>
          <div style={{ fontSize: 15, color: COLORS.textMid, lineHeight: 1.6, fontWeight: 600 }}>
            The target account balances are adjusting over open payment protocols. Verification ledger entries have locked.
          </div>
          
          <div style={{ background: COLORS.bg, borderRadius: 14, padding: "16px", margin: "24px 0", border: `1px solid ${COLORS.border}` }}>
            <DataRow label="Ledger Hash Key" value={`TXN-${generateUID()}`} />
            <DataRow label="Gross Exchanged Value" value={formatZAR(zarVal)} />
            <DataRow label="Target Destination" value={`${selectedRoute.flag} ${selectedRoute.country}`} />
          </div>

          <ActionButton onClick={() => { setInputZAR(""); setDestinationWallet(""); setProcessState("form"); }} variant="success" full>
            Execute Another Remittance Entry
          </ActionButton>
        </BaseCard>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE SYSTEM APP SHELL WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeView, setActiveView] = useState("home");
  const [currentUser] = useState(USER_PROFILE);

  const navigationMatrix = [
    { id: "home", text: "Home" },
    { id: "pay", text: "Get Paid" },
    { id: "work", text: "Work Profile" },
    { id: "save", text: "Save Together" },
    { id: "send", text: "Send" },
  ];

  return (
    <div style={{ 
      background: COLORS.bg, minHeight: "100vh", color: COLORS.textDark, 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      boxSizing: "border-box", display: "flex", flexDirection: "column"
    }}>
      {/* Top Professional Sticky Navigation Header Bar */}
      <header style={{ 
        background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, 
        padding: "16px 24px", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 6px rgba(0,0,0,0.01)"
      }}>
        {/* Dynamic Desktop/Mobile responsive container layout framework */}
        <div style={{ maxWidth: 1024, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setActiveView("home")}>
            <StrideLogo size={36} />
            <span style={{ fontWeight: 900, fontSize: 24, color: COLORS.textDark, letterSpacing: "-0.5px" }}>Stride</span>
          </div>
          
          {/* Responsive Nav Links visible naturally on Desktop */}
          <div className="desktop-nav-links" style={{ display: "flex", gap: 8 }}>
            {navigationMatrix.map(item => {
              const isActive = activeView === item.id;
              return (
                <button key={item.id} onClick={() => setActiveView(item.id)} style={{
                  background: isActive ? COLORS.primaryDim : "transparent", border: "none", borderRadius: 10,
                  padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  color: isActive ? COLORS.primary : COLORS.textMid, fontWeight: isActive ? 800 : 600, fontSize: 14,
                  transition: "all 0.1s ease"
                }}>
                  <span>{item.icon}</span>
                  <span className="nav-text-label">{item.text}</span>
                </button>
              );
            })}
          </div>

          <Avatar initials={currentUser.initials} size={40} type={activeView === "save" ? "success" : activeView === "work" ? "accent" : "primary"} />
        </div>
      </header>

      {/* Main View Display Wrapper */}
      <main style={{ 
        flex: 1, width: "100%", maxWidth: 1024, margin: "0 auto", 
        padding: "32px 16px 120px 16px", boxSizing: "border-box" 
      }}>
        {activeView === "home" && <DashboardOverview user={currentUser} onNavigate={setActiveView} />}
        {activeView === "pay" && <PayContainer user={currentUser} />}
        {activeView === "work" && <WorkProfileContainer user={currentUser} />}
        {activeView === "save" && <SaveTogetherContainer />}
        {activeView === "send" && <SendMoneyContainer />}
      </main>

      {/* Embedded Client Responsive Layout Styles Helper */}
      <style>{`
        /* Desktop navigation adjustments vs mobile responsive navigation sticky bar */
        @media (max-width: 768px) {
          .desktop-nav-links {
            display: none !important;
          }
          .mobile-bottom-bar {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-bottom-bar {
            display: none !important;
          }
        }
      `}</style>

      {/* Mobile Sticky Tab bar (Automatically unmounts via pure CSS on Wide Desktop viewports) */}
      <nav className="mobile-bottom-bar" style={{ 
        position: "fixed", bottom: 0, left: 0, right: 0, background: COLORS.surface, 
        borderTop: `1px solid ${COLORS.border}`, boxShadow: "0 -2px 12px rgba(0,0,0,0.04)",
        zIndex: 150, height: 80, display: "none", alignItems: "center", justifyContent: "space-around"
      }}>
        {navigationMatrix.map(item => {
          const isActive = activeView === item.id;
          return (
            <button key={item.id} onClick={() => setActiveView(item.id)} style={{
              background: "transparent", border: "none", display: "flex", flexDirection: "column", 
              alignItems: "center", justifyContent: "center", cursor: "pointer", flex: 1, height: "100%", gap: 4
            }}>
              <span style={{ fontSize: 24, transform: isActive ? "scale(1.12)" : "scale(1)", transition: "transform 0.15s" }}>{item.icon}</span>
              <span style={{ fontSize: 12, fontWeight: isActive ? 800 : 600, color: isActive ? COLORS.primary : COLORS.textMuted }}>{item.text}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
