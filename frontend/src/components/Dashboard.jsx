import React, { useState, useEffect, useRef } from 'react';

/* ── Design tokens ───────────────────────────────────────────────── */
const T = {
  // backgrounds
  bg:       '#EEF2FA',
  bgCard:   '#FFFFFF',
  bgMuted:  '#F4F6FB',
  bgDark:   '#0F1C2E',   // header
  // borders
  border:   '#DDE3F0',
  borderMd: '#C5CDE0',
  // brand
  orange:   '#FF6B00',
  orangeLt: '#FFF0E6',
  orangeMd: '#FFD4B3',
  blue:     '#1A56DB',
  blueLt:   '#EBF0FF',
  gold:     '#E8A000',
  goldLt:   '#FFF8E6',
  // status
  green:    '#0D9E6E',
  greenLt:  '#E6FAF5',
  red:      '#DC2626',
  redLt:    '#FEF2F2',
  yellow:   '#D97706',
  yellowLt: '#FFFBEB',
  purple:   '#7C3AED',
  purpleLt: '#F5F3FF',
  // text
  txtDark:  '#0F1C2E',
  txtMid:   '#3D5170',
  txtMute:  '#7A8FAB',
  txtWhite: '#F8FAFF',
};

/* ── Fallback AI ─────────────────────────────────────────────────── */
const FALLBACK_INSIGHTS = {
  momentumShift: "Gujarat Titans are firmly in control at 122/0 after 11.2 overs — a 10.76 CRR with both openers set signals batting dominance. Shubman Gill at SR 190 is imposing extraordinary pressure on CSK's entire bowling lineup.",
  tacticalAdvice: "CSK must bring a spinner into the attack immediately — Gill's aggression against pace makes wrist-spin the only viable containment option. Set a 7-2 field with long-on/long-off to cut off the slog and force singles.",
  hypeCommentary: "ONE HUNDRED AND TWENTY-TWO without loss! Shubman Gill is ON FIRE — Ahmedabad is erupting and Chennai Super Kings look completely shellshocked. This is a batting MASTERCLASS!"
};

const STEPS = [
  "[INFO] Initializing CricMind AI strategy scan...",
  "[SYS] Reading livescore.json match state...",
  "[SYS] Parsing innings, partnerships, bowling figures...",
  "[MATH] Calculating pressure vectors and win probability...",
  "[MATCHUP] Cross-referencing batter/bowler matchup data...",
  "[AI] Feeding structured context to gemini-2.5-flash...",
  "[AI] Applying elite tactical sports scientist persona...",
  "[AI] Enforcing JSON schema via responseSchema definition...",
  "[SUCCESS] Strategy insights compiled successfully."
];

/* ── Tiny helpers ────────────────────────────────────────────────── */
const Label = ({ children, color = T.orange, bg = T.orangeLt }) => (
  <span style={{
    fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: 2,
    textTransform: 'uppercase', padding: '2px 8px', borderRadius: 20,
    background: bg, color, fontWeight: 600, border: `1px solid ${color}30`,
  }}>{children}</span>
);

const SectionHead = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
    <div style={{ width: 3, height: 14, background: T.orange, borderRadius: 2 }} />
    <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 3, color: T.txtMute, textTransform: 'uppercase' }}>{children}</span>
  </div>
);

const Divider = () => <div style={{ height: 1, background: T.border, margin: '12px 0' }} />;

/* ── Win Probability Bar ────────────────────────────────────────── */
function WinBar({ gt, csk }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.blue, display: 'inline-block' }} />
          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 14, color: T.blue }}>GT &nbsp;{gt}%</span>
        </div>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: T.txtMute }}>Win Probability</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 14, color: T.orange }}>{csk}%&nbsp; CSK</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.orange, display: 'inline-block' }} />
        </div>
      </div>
      <div style={{ height: 10, borderRadius: 5, background: T.border, overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: `${gt}%`, background: `linear-gradient(90deg, #1A56DB, #3B82F6)`, transition: 'width 1.2s ease' }} />
        <div style={{ flex: 1, background: `linear-gradient(90deg, #FF8C42, #FF6B00)` }} />
      </div>
    </div>
  );
}

/* ── Batter Card ─────────────────────────────────────────────────── */
function BatterCard({ player, isStriker }) {
  const sr = parseFloat(player.strikeRate);
  const srColor = sr >= 170 ? T.red : sr >= 130 ? T.orange : sr >= 100 ? T.green : T.txtMute;
  return (
    <div className="batter-card" style={{
      padding: '12px 16px', borderRadius: 10,
      background: isStriker ? `linear-gradient(135deg, ${T.goldLt}, ${T.bgCard})` : T.bgMuted,
      border: `1px solid ${isStriker ? T.gold : T.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      boxShadow: isStriker ? '0 2px 12px rgba(232,160,0,0.12)' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: isStriker ? `linear-gradient(135deg, ${T.gold}, ${T.orange})` : T.border,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 14,
          color: isStriker ? '#fff' : T.txtMute,
          flexShrink: 0,
        }}>{(player.playerName || '?').charAt(0)}</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 16, color: T.txtDark }}>{player.playerName}</span>
            {player.isCaptain && <Label color={T.blue} bg={T.blueLt}>C</Label>}
            {isStriker && <Label color={T.orange} bg={T.orangeLt}>ON STRIKE</Label>}
          </div>
          {player.fours !== undefined && (
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: T.txtMute }}>
              {player.fours}×4 &nbsp;·&nbsp; {player.sixes}×6
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 26, color: T.txtDark, lineHeight: 1 }}>
          {player.runs}<span style={{ fontSize: 14, color: T.txtMute, fontWeight: 500 }}>({player.ballsFaced})</span>
        </div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: srColor, marginTop: 2 }}>SR {player.strikeRate}</div>
      </div>
    </div>
  );
}

/* ── Bowler Row ──────────────────────────────────────────────────── */
function BowlerRow({ bowler, isCurrent }) {
  const eco = parseFloat(bowler.economyRate);
  const ecoColor = eco > 12 ? T.red : eco > 9 ? T.orange : eco > 7 ? T.yellow : T.green;
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 8,
      background: isCurrent ? T.bgCard : T.bgMuted,
      border: `1px solid ${isCurrent ? T.orange + '60' : T.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isCurrent && <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.orange, animation: 'blink 1s infinite' }} />}
        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: 15, color: isCurrent ? T.txtDark : T.txtMute }}>{bowler.playerName}</span>
        {isCurrent && <Label color={T.orange} bg={T.orangeLt}>Bowling</Label>}
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: T.txtMid }}>{bowler.overs} ov &nbsp;·&nbsp; {bowler.wickets}W &nbsp;·&nbsp; {bowler.runsGiven}R</span>
        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 16, color: ecoColor }}>eco {eco.toFixed(1)}</span>
      </div>
    </div>
  );
}

/* ── Situation Badge ─────────────────────────────────────────────── */
function SituationBadge({ wp, runRate, score }) {
  const gt = wp?.gujaratTitans ?? 50;
  const csk = wp?.chennaiSuperKings ?? 50;
  const gap = Math.abs(gt - csk);
  const crr = runRate?.current ?? 0;

  let emoji, text, color, bg;
  if (gap < 10)       { emoji = '⚖️'; text = 'NAIL-BITER';  color = T.purple; bg = T.purpleLt; }
  else if (gap < 25)  { emoji = '🎯'; text = 'GAME ON';     color = T.blue;   bg = T.blueLt; }
  else if (gap < 45)  { emoji = '📈'; text = 'ADVANTAGE';   color = T.yellow; bg = T.yellowLt; }
  else                { emoji = '💥'; text = 'DOMINANT';    color = T.red;    bg = T.redLt; }
  if (crr > 11 && (score?.wickets ?? 0) <= 2) { emoji = '🔥'; text = 'ON FIRE'; color = T.orange; bg = T.orangeLt; }

  const desc = {
    'NAIL-BITER': 'Too close to call — edge of your seat stuff',
    'GAME ON': 'Competitive match, momentum still shifting',
    'ADVANTAGE': `${gt > csk ? 'GT' : 'CSK'} holding the edge right now`,
    'DOMINANT': `${gt > csk ? 'GT' : 'CSK'} in complete command`,
    'ON FIRE': 'Explosive batting — bowlers taking a beating',
  }[text];

  return (
    <div style={{
      padding: '14px 20px', borderRadius: 12,
      background: `linear-gradient(135deg, ${bg}, ${T.bgCard})`,
      border: `1.5px solid ${color}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 28 }}>{emoji}</span>
        <div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 22, color, letterSpacing: 1 }}>{text}</div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: T.txtMid, marginTop: 1 }}>{desc}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Label color={T.blue} bg={T.blueLt}>GT {gt}%</Label>
        <Label color={T.orange} bg={T.orangeLt}>CSK {csk}%</Label>
      </div>
    </div>
  );
}

/* ── Pressure Meter ──────────────────────────────────────────────── */
function PressureMeter({ score, runRate }) {
  const wickets = score?.wickets ?? 0;
  const crr = runRate?.current ?? 10;
  const rrr = runRate?.required ?? null;
  const innings = rrr ? 2 : 1;

  let pressure;
  if (innings === 1) {
    pressure = Math.min(100, Math.round(30 + ((crr - 8.5) / 8.5) * 35 + wickets * 5));
  } else {
    pressure = Math.min(100, Math.round(40 + (rrr - crr) * 8 + wickets * 6));
  }
  pressure = Math.max(5, pressure);

  const { color, bg, label, desc } =
    pressure >= 80 ? { color: T.red,    bg: T.redLt,    label: 'CRITICAL',  desc: 'Batters under extreme pressure' } :
    pressure >= 60 ? { color: T.orange, bg: T.orangeLt, label: 'HIGH',      desc: 'Bowling side pressing hard' } :
    pressure >= 40 ? { color: T.yellow, bg: T.yellowLt, label: 'MODERATE',  desc: 'Balanced — next over matters' } :
                     { color: T.green,  bg: T.greenLt,  label: 'LOW',       desc: 'Batters completely in control' };

  const R = 48, cx = 60, cy = 60;
  const toRad = d => (d * Math.PI) / 180;
  const start = -210, arc = 240;
  const bgEx  = cx + R * Math.cos(toRad(start + arc));
  const bgEy  = cy + R * Math.sin(toRad(start + arc));
  const bgSx  = cx + R * Math.cos(toRad(start));
  const bgSy  = cy + R * Math.sin(toRad(start));
  const fgAng = start + (pressure / 100) * arc;
  const fgEx  = cx + R * Math.cos(toRad(fgAng));
  const fgEy  = cy + R * Math.sin(toRad(fgAng));
  const lgBg  = arc > 180 ? 1 : 0;
  const lgFg  = (pressure / 100) * arc > 180 ? 1 : 0;

  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <SectionHead>Match Pressure Index</SectionHead>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg width={120} height={80} viewBox="0 0 120 80">
          <path d={`M${bgSx} ${bgSy} A${R} ${R} 0 ${lgBg} 1 ${bgEx} ${bgEy}`} fill="none" stroke={T.border} strokeWidth={9} strokeLinecap="round" />
          <path d={`M${bgSx} ${bgSy} A${R} ${R} 0 ${lgFg} 1 ${fgEx} ${fgEy}`} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color}60)`, transition: 'all 1s ease' }} />
          <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 24, fill: color }}>{pressure}</text>
          <text x={cx} y={cx + 20} textAnchor="middle" style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, fill: T.txtMute, letterSpacing: 2 }}>/100</text>
        </svg>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: bg, border: `1px solid ${color}30`, marginBottom: 6 }}>
            <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 16, color, letterSpacing: 1 }}>{label}</span>
          </div>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: T.txtMid, lineHeight: 1.5 }}>{desc}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Plain English ───────────────────────────────────────────────── */
function PlainEnglish({ score, runRate, partnership, innings }) {
  const runs    = score?.runs ?? 0;
  const wickets = score?.wickets ?? 0;
  const overs   = parseFloat(score?.overs ?? 0);
  const crr     = runRate?.current ?? 0;
  const rrr     = runRate?.required ?? null;
  const balls   = score?.balls ?? Math.round(overs * 6);
  const ballsLeft = 120 - balls;
  const partRuns  = partnership?.totalPartnershipRuns ?? 0;

  const lines = [];
  if (innings === 1 || !rrr) {
    const proj = Math.round(runs + (ballsLeft / 6) * crr);
    lines.push({ icon: '🎯', text: `At this pace, GT could post around ${proj} total`, color: T.blue });
    lines.push({ icon: '🔥', text: `${partRuns} runs in this partnership without a wicket falling`, color: T.orange });
    if (crr > 10) lines.push({ icon: '⚡', text: `Scoring a boundary roughly every ${Math.max(2, Math.round(6 / (crr / 6)))} balls — blazing pace`, color: T.red });
    else lines.push({ icon: '📊', text: `Run rate of ${crr} — comfortably above T20 par`, color: T.green });
  } else {
    const gap = rrr - crr;
    if (gap > 3) lines.push({ icon: '🚨', text: `Need a six almost every over — an extremely difficult ask`, color: T.red });
    else if (gap > 1.5) lines.push({ icon: '⚠️', text: `Need a boundary every other ball to stay in chase`, color: T.orange });
    else if (gap < 0) lines.push({ icon: '✅', text: `Ahead of the required rate — in the driver's seat`, color: T.green });
    else lines.push({ icon: '⚖️', text: `Right on the edge — any wicket could decide this match`, color: T.yellow });
    lines.push({ icon: '🏏', text: `${wickets} wickets gone, ${10 - wickets} batters still to come`, color: T.blue });
  }

  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <SectionHead>What's Happening — Plain English</SectionHead>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 8, background: T.bgMuted, border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{l.icon}</span>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: T.txtDark, lineHeight: 1.5, fontWeight: 500 }}>{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Milestone Tracker ───────────────────────────────────────────── */
function MilestoneTracker({ striker, nonStriker, score }) {
  const runs = score?.runs ?? 0;
  const milestones = [];

  [striker, nonStriker].forEach((p, idx) => {
    if (!p) return;
    const r = p.runs;
    const next = r < 50 ? 50 : r < 100 ? 100 : 150;
    milestones.push({
      name: p.playerName.split(' ').pop(),
      current: r, target: next, needed: next - r,
      color: idx === 0 ? T.orange : T.blue,
      pct: Math.min(100, (r / next) * 100),
    });
  });

  const nextTeam = [100, 150, 200, 250, 300].find(t => t > runs);
  if (nextTeam) milestones.push({
    name: 'Team', current: runs, target: nextTeam, needed: nextTeam - runs,
    color: T.purple, pct: Math.min(100, (runs / nextTeam) * 100),
  });

  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px' }}>
      <SectionHead>Next Milestones</SectionHead>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {milestones.map((m, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: T.txtDark }}>{m.name}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: T.txtMute }}>→ {m.target}</span>
              </div>
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: m.color }}>{m.needed} more</span>
            </div>
            <div style={{ height: 7, borderRadius: 4, background: T.border, overflow: 'hidden' }}>
              <div style={{ width: `${m.pct}%`, height: '100%', background: `linear-gradient(90deg, ${m.color}80, ${m.color})`, borderRadius: 4, transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: T.txtMute }}>{m.current}</span>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: T.txtMute }}>{m.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Economy Chart ───────────────────────────────────────────────── */
function EcoChart({ bowlingCard }) {
  if (!bowlingCard) return null;
  const entries = Object.entries(bowlingCard).map(([k, v]) => ({
    name: k.replace(/([A-Z])/g, ' $1').split(' ').pop(),
    economy: v.economy, overs: v.overs, wickets: v.wickets,
  }));
  if (!entries.length) return null;
  const maxEco = Math.max(...entries.map(e => e.economy), 15);

  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px' }}>
      <SectionHead>Bowling Economy — This Innings</SectionHead>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map((e, i) => {
          const pct = (e.economy / maxEco) * 100;
          const col = e.economy > 12 ? T.red : e.economy > 9 ? T.orange : e.economy > 7 ? T.yellow : T.green;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: T.txtMid, minWidth: 72, textAlign: 'right' }}>{e.name}</span>
              <div style={{ flex: 1, height: 22, background: T.bgMuted, borderRadius: 4, overflow: 'hidden', position: 'relative', border: `1px solid ${T.border}` }}>
                <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${col}30, ${col}70)`, borderRight: `2px solid ${col}`, transition: 'width 1s ease' }} />
                <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 13, color: col }}>{e.economy.toFixed(1)}</span>
              </div>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: T.txtMute, minWidth: 30 }}>{e.overs}ov</span>
              {e.wickets > 0 && <Label color={T.green} bg={T.greenLt}>{e.wickets}W</Label>}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
        {[[T.green, '≤7 Good'], [T.yellow, '7–9 Fair'], [T.orange, '9–12 Costly'], [T.red, '>12 Expensive']].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: T.txtMute }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── AI Insight Card ─────────────────────────────────────────────── */
function InsightCard({ idx, label, title, icon, text }) {
  const styles = [
    { accent: T.orange, bg: T.orangeLt, border: T.orange + '30' },
    { accent: T.blue,   bg: T.blueLt,   border: T.blue + '30' },
    { accent: T.purple, bg: T.purpleLt, border: T.purple + '30' },
  ];
  const s = styles[idx];
  return (
    <div className="insight-card" style={{
      background: T.bgCard, borderRadius: 12,
      border: `1px solid ${T.border}`,
      borderTop: `3px solid ${s.accent}`,
      padding: '22px', overflow: 'hidden',
      animation: `floatUp 0.5s ease-out ${idx * 0.12}s both`,
      display: 'flex', flexDirection: 'column', gap: 14,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Label color={s.accent} bg={s.bg}>{label}</Label>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 20, color: T.txtDark, marginTop: 6, letterSpacing: 0.3 }}>{title}</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
      </div>
      <Divider />
      {idx === 2 ? (
        <div style={{ background: T.bgMuted, border: `1px solid ${T.border}`, borderRadius: 8, padding: '14px 16px', position: 'relative' }}>
          <span style={{ position: 'absolute', top: -12, left: 12, fontFamily: 'Georgia,serif', fontSize: 48, color: `${s.accent}25`, lineHeight: 1, userSelect: 'none' }}>"</span>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.7, color: T.txtMid, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>{text}</p>
        </div>
      ) : (
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.75, color: T.txtMid }}>{text}</p>
      )}
    </div>
  );
}

/* ── BallDots ────────────────────────────────────────────────────── */
function BallDots({ overs }) {
  const balls = Math.round((parseFloat(overs || 0) % 1) * 10);
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} style={{
          width: 10, height: 10, borderRadius: '50%',
          background: i < balls ? T.orange : T.border,
          border: `1.5px solid ${i < balls ? T.orange : T.borderMd}`,
        }} />
      ))}
    </div>
  );
}

/* ═══ MAIN DASHBOARD ════════════════════════════════════════════════ */
export default function Dashboard() {
  const [liveData, setLiveData]         = useState(null);
  const [lastRefresh, setLastRefresh]   = useState(null);
  const [aiInsights, setAiInsights]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [consoleLogs, setConsoleLogs]   = useState([]);
  const [showConsole, setShowConsole]   = useState(false);
  const [dataSource, setDataSource]     = useState(null);
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab]       = useState('match');
  const consoleEnd = useRef(null);
  const fileRef    = useRef(null);

  const fetchLive = async () => {
    try {
      const res  = await fetch('http://localhost:5000/api/livescore');
      const json = await res.json();
      setLiveData(json);
      setLastRefresh(new Date());
    } catch {}
  };
  useEffect(() => { fetchLive(); const iv = setInterval(fetchLive, 60000); return () => clearInterval(iv); }, []);

  const scroll = () => consoleEnd.current?.scrollIntoView({ behavior: 'smooth' });

  const runConsole = (extra = []) => new Promise(resolve => {
    const all = [...STEPS, ...extra];
    let i = 0;
    setShowConsole(true); setConsoleLogs([]);
    const iv = setInterval(() => {
      if (i < all.length) { const entry = all[i++]; setConsoleLogs(p => { const n = [...p, entry]; setTimeout(scroll, 40); return n; }); }
      else { clearInterval(iv); resolve(); }
    }, 360);
  });

  const triggerScan = async () => {
    setLoading(true); setAiInsights(null); setDataSource(null);
    try {
      // Run animation and API call in parallel — whichever finishes first waits for the other
      const apiCall = fetch('http://localhost:5000/api/scan', { method: 'POST' })
        .then(r => r.json())
        .catch(() => null);
      await Promise.all([runConsole(), new Promise(r => setTimeout(r, 3400))]);
      let json = await apiCall;
      let result;
      if (!json || json.success === false) {
        result = { insights: FALLBACK_INSIGHTS, dataSource: 'local_mock' };
      } else {
        result = json;
      }
      setConsoleLogs(p => [...p, result.dataSource === 'local_mock' ? '[FAIL-SAFE] Using local fallback insights.' : '[LIVE] Gemini analysis complete.']);
      setAiInsights(result.insights);
      setDataSource(result.dataSource);
    } catch (e) {
      console.error('Scan error:', e);
      setAiInsights(FALLBACK_INSIGHTS);
      setDataSource('local_mock');
    } finally {
      setLoading(false);
    }
  };

  const handleImg = e => { const f = e.target.files[0]; if (!f) return; setImageFile(f); setImagePreview(URL.createObjectURL(f)); };

  const triggerVision = () => {
    if (!imageFile) return;
    setLoading(true); setAiInsights(null); setDataSource(null);
    const rd = new FileReader();
    rd.onload = async ev => {
      try {
        const b64  = ev.target.result.split(',')[1];
        const mime = imageFile.type || 'image/jpeg';
        const apiCall = fetch('http://localhost:5000/api/scan-image', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Image: b64, mimeType: mime })
        }).then(r => r.json()).catch(() => null);
        await Promise.all([
          runConsole(['[VISION] Decoding scorecard image pixels...', '[VISION] Gemini reading match state from image...']),
          new Promise(r => setTimeout(r, 3800))
        ]);
        const json = await apiCall;
        const result = (!json || json.success === false)
          ? { insights: FALLBACK_INSIGHTS, dataSource: 'local_mock' }
          : json;
        setConsoleLogs(p => [...p, '[SUCCESS] Vision analysis complete.']);
        setAiInsights(result.insights);
        setDataSource(result.dataSource);
      } catch (e) {
        console.error('Vision error:', e);
        setAiInsights(FALLBACK_INSIGHTS);
        setDataSource('local_mock');
      } finally {
        setLoading(false);
      }
    };
    rd.readAsDataURL(imageFile);
  };

  /* derived — support both currentPartnership and currentBatsmen key names */
  const d       = liveData;
  const score   = d?.liveScore?.score;
  const wp      = d?.liveScore?.winProbability;
  const rr      = d?.liveScore?.runRate;
  const batsmen = d?.currentBatsmen || d?.currentPartnership;
  const striker = batsmen?.striker;
  const nonStr  = batsmen?.nonStriker;
  const bowler  = d?.bowlingStatus?.currentBowler;
  const prevBwl = d?.bowlingStatus?.previousBowler;
  const gtXI    = d?.playingXIs?.gujaratTitans;
  const cskXI   = d?.playingXIs?.chennaiSuperKings;
  const innings = d?.liveScore?.currentInnings;
  const battingT = d?.liveScore?.battingTeam || 'Gujarat Titans';
  const recentDismissals = d?.recentDismissals;

  const sourceMeta = {
    livescore:  { color: T.green,  label: '● LIVESCORE LIVE' },
    local_mock: { color: T.orange, label: '○ LOCAL FALLBACK' },
    vision:     { color: T.blue,   label: '● VISION ANALYSIS' },
  }[dataSource];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.txtDark, fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes spin      { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes cardIn    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        @keyframes floatUp   { 0%{opacity:0;transform:translateY(30px)} 70%{opacity:1;transform:translateY(-3px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes barGrow   { from{width:0!important} to{} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 4px 20px rgba(255,107,0,.35)} 50%{box-shadow:0 4px 32px rgba(255,107,0,.6)} }
        @keyframes headerIn  { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
        .stat-box { transition: transform .15s, box-shadow .15s; }
        .stat-box:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.10) !important; }
        .batter-card { transition: box-shadow .2s, border-color .2s; }
        .batter-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; }
        .insight-card { transition: transform .2s, box-shadow .2s; }
        .insight-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,0,0,0.10) !important; }
        .tab-btn { transition: all .18s; }
        button { cursor: pointer; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header style={{
        background: T.bgDark, color: T.txtWhite,
        padding: '0 28px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${T.orange}, ${T.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏏</div>
          <div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: '#fff' }}>
              CRICMIND <span style={{ color: T.orange }}>AI</span>
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 3 }}>TACTICAL CONTROL ROOM</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {lastRefresh && (
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              Updated {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'blink 1s infinite', display: 'inline-block' }} />
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: '#FCA5A5', letterSpacing: 2 }}>LIVE · IPL 2026</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── SCOREBOARD CARD ────────────────────────────────────── */}
        <div style={{ background: T.bgCard, borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', animation: 'cardIn .5s ease-out both' }}>

          {/* orange top stripe */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${T.orange}, ${T.gold} 50%, ${T.orange})` }} />

          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* match title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
                  <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 26, color: T.txtDark, letterSpacing: 0.3, textTransform: 'uppercase' }}>
                    {d?.matchInfo?.teams?.home || 'Gujarat Titans'}
                    <span style={{ fontWeight: 400, color: T.txtMute, fontSize: 18, margin: '0 10px' }}>vs</span>
                    {d?.matchInfo?.teams?.away || 'Chennai Super Kings'}
                  </span>
                  <Label color={T.orange} bg={T.orangeLt}>Batting: {battingT.split(' ').map(w => w[0]).join('')}</Label>
                  <Label color={T.blue} bg={T.blueLt}>{innings === 1 ? '1st' : '2nd'} Innings</Label>
                </div>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: T.txtMute }}>
                  {d?.matchInfo?.series} &nbsp;·&nbsp; Match {d?.matchInfo?.matchNumber} &nbsp;·&nbsp; {d?.matchInfo?.venue?.stadium}, {d?.matchInfo?.venue?.city} &nbsp;·&nbsp; Toss: {d?.matchInfo?.toss?.wonBy?.split(' ').slice(-2).join(' ')} chose to {d?.matchInfo?.toss?.decision}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <BallDots overs={score?.overs} />
                <Label color={T.green} bg={T.greenLt}>{d?.matchInfo?.matchStatus || 'In Progress'}</Label>
              </div>
            </div>

            <Divider />

                {/* big stats row */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'stretch' }}>
              {[
                { label: 'Score', value: `${score?.runs ?? 0}/${score?.wickets ?? 0}`, accent: T.orange, large: true },
                { label: 'Overs', value: score?.overs ?? 0, accent: T.txtDark, large: true },
                { label: 'CRR', value: rr?.current?.toFixed ? rr.current.toFixed(2) : rr?.current ?? '—', accent: T.green },
                { label: 'Balls', value: score?.balls ?? 0, accent: T.txtMute },
                { label: 'Partnership', value: batsmen ? `${batsmen.totalPartnershipRuns ?? 0}(${batsmen.ballsTotal ?? 0})` : '—', accent: T.purple },
                ...(rr?.required ? [
                  { label: 'RRR', value: rr.required.toFixed(2), accent: rr.required > rr.current + 2 ? T.red : rr.required > rr.current ? T.orange : T.green },
                ] : []),
              ].map((s, i) => (
                <div key={i} className="stat-box" style={{
                  padding: s.large ? '14px 22px' : '10px 16px',
                  background: T.bgMuted, borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  borderBottom: `3px solid ${s.accent}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  animation: `floatUp .5s ease-out ${i * 0.06}s both`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: s.large ? 38 : 24, color: s.accent, lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: T.txtMute, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* win probability + situation */}
            {wp && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <WinBar gt={wp.gujaratTitans} csk={wp.chennaiSuperKings} />
                <SituationBadge wp={wp} runRate={rr} score={score} />
              </div>
            )}

            {/* batters + bowling + dismissals */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
              {/* BATTING */}
              {(striker || nonStr) && (
                <div style={{ animation: 'scaleIn .4s ease-out .1s both' }}>
                  <SectionHead>Batting — At Crease</SectionHead>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {striker && <BatterCard player={striker} isStriker />}
                    {nonStr  && <BatterCard player={nonStr}  isStriker={false} />}
                  </div>
                  {/* partnership summary */}
                  {batsmen?.totalPartnershipRuns !== undefined && (
                    <div style={{ marginTop: 8, padding: '8px 14px', borderRadius: 8, background: T.bgMuted, border: `1px solid ${T.border}`, display: 'flex', gap: 16 }}>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: T.txtMute }}>Partnership</span>
                      <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 14, color: T.purple }}>
                        {batsmen.totalPartnershipRuns}({batsmen.ballsTotal}) runs
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* BOWLING */}
              {(bowler || prevBwl) && (
                <div style={{ animation: 'scaleIn .4s ease-out .2s both' }}>
                  <SectionHead>Bowling</SectionHead>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {bowler  && <BowlerRow bowler={bowler}  isCurrent />}
                    {prevBwl && <BowlerRow bowler={prevBwl} isCurrent={false} />}
                  </div>
                </div>
              )}

              {/* RECENT DISMISSALS */}
              {recentDismissals?.length > 0 && (
                <div style={{ animation: 'scaleIn .4s ease-out .3s both' }}>
                  <SectionHead>Recent Dismissals</SectionHead>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {recentDismissals.map((d, i) => (
                      <div key={i} style={{ padding: '10px 14px', borderRadius: 8, background: T.redLt, border: `1px solid ${T.red}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: T.txtDark }}>{d.playerName}</span>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: T.txtMute, marginTop: 2 }}>
                            {d.dismissalType} b {d.bowler} &nbsp;·&nbsp; Over {d.over}
                          </div>
                        </div>
                        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 20, color: T.red }}>
                          {d.runs}<span style={{ fontSize: 12, color: T.txtMute }}>({d.ballsFaced})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── TABS ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 4, background: T.bgCard, borderRadius: 10, padding: 4, border: `1px solid ${T.border}`, width: 'fit-content' }}>
          {[['match', '📊 Match Centre'], ['xi', '👥 Playing XIs']].map(([id, lbl]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              padding: '8px 20px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 1,
              background: activeTab === id ? T.bgDark : 'transparent',
              color: activeTab === id ? '#fff' : T.txtMute,
              transition: 'all 0.2s',
            }}>{lbl}</button>
          ))}
        </div>

        {/* ── PLAYING XIs ──────────────────────────────────────────── */}
        {activeTab === 'xi' && gtXI && cskXI && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
            {[['Gujarat Titans', gtXI, T.blue], ['Chennai Super Kings', cskXI, T.orange]].map(([name, xi, col]) => (
              <div key={name} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderTop: `3px solid ${col}`, borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 18, color: col, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>{name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {xi.players.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 6, background: i % 2 === 0 ? T.bgMuted : 'transparent' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: T.txtMute, minWidth: 18 }}>{i + 1}</span>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: T.txtDark }}>{p}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {p === xi.captain      && <Label color={T.gold}   bg={T.goldLt}   >C</Label>}
                        {p === xi.wicketKeeper  && <Label color={T.blue}   bg={T.blueLt}   >WK</Label>}
                        {p === xi.impactPlayer  && <Label color={T.purple} bg={T.purpleLt} >IMP</Label>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MATCH CENTRE ─────────────────────────────────────────── */}
        {activeTab === 'match' && (
          <>
            {/* Tier 1 panels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
              <PlainEnglish score={score} runRate={rr} partnership={batsmen} innings={innings} />
              <PressureMeter score={score} runRate={rr} />
              <MilestoneTracker striker={striker} nonStriker={nonStr} score={score} />
            </div>
            <EcoChart bowlingCard={d?.bowlingCard} />

            {/* ── AI SCAN ZONE ─────────────────────────────────────── */}
            <div style={{ background: T.bgCard, borderRadius: 16, border: `1.5px solid ${T.orange}30`, overflow: 'hidden', boxShadow: '0 4px 24px rgba(255,107,0,0.08)' }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${T.orange}, ${T.gold}, ${T.blue})` }} />
              <div style={{ padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

                {/* hero heading */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 26, color: T.txtDark, letterSpacing: 0.5, marginBottom: 4 }}>
                    ⚡ AI Tactical Analysis
                  </div>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: T.txtMute, maxWidth: 500 }}>
                    Gemini 2.5 Flash reads the match state and generates momentum analysis, coach-level tactical advice, and broadcast commentary — instantly.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {/* primary CTA */}
                  <button onClick={triggerScan} disabled={loading} style={{
                    padding: '14px 36px', borderRadius: 10,
                    background: loading ? T.border : `linear-gradient(135deg, ${T.orange}, ${T.gold})`,
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 16,
                    color: loading ? T.txtMute : '#fff', letterSpacing: 1.5, textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', gap: 10,
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(255,107,0,0.35)',
                    transition: 'all 0.2s', animation: loading ? 'none' : 'pulseGlow 2s infinite',
                  }}>
                    {loading
                      ? <><svg style={{ animation: 'spin 1s linear infinite', width: 18, height: 18 }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={T.orange} strokeWidth="2" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" stroke={T.orange} strokeWidth="2" strokeLinecap="round" /></svg> Scanning...</>
                      : <> ⚡ Trigger AI Strategy Scan</>
                    }
                  </button>

                  {/* vision upload */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: T.blueLt, border: `1.5px dashed ${T.blue}50` }}>
                    <input type="file" accept="image/*" ref={fileRef} onChange={handleImg} style={{ display: 'none' }} />
                    <button onClick={() => fileRef.current?.click()} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 13, color: T.blue, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      📷 {imageFile ? imageFile.name.slice(0, 22) + '…' : 'Upload Scorecard'}
                    </button>
                    {imageFile && (
                      <button onClick={triggerVision} disabled={loading} style={{
                        padding: '6px 14px', borderRadius: 7, border: `1px solid ${T.blue}`,
                        background: T.bgCard, cursor: 'pointer',
                        fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 13,
                        color: T.blue, letterSpacing: 1,
                      }}>👁 ANALYZE</button>
                    )}
                    {imagePreview && <img src={imagePreview} alt="" style={{ height: 30, borderRadius: 4, border: `1px solid ${T.border}` }} />}
                  </div>
                </div>

                {/* source badge */}
                {sourceMeta && !loading && (
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: sourceMeta.color, letterSpacing: 2, background: T.bgMuted, padding: '4px 14px', borderRadius: 20, border: `1px solid ${T.border}` }}>
                    {sourceMeta.label}
                  </span>
                )}

                {/* diagnostics console */}
                {showConsole && (
                  <div style={{ width: '100%', maxWidth: 620, background: T.bgDark, borderRadius: 10, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.08)` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                      {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginLeft: 6 }}>CRICMIND INGESTION ENGINE v2.5.0</span>
                      {loading && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#28C840', animation: 'blink 0.8s infinite', display: 'inline-block' }} />}
                    </div>
                    <div style={{ height: 130, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {consoleLogs.map((log, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, animation: 'slideUp 0.2s ease-out both' }}>
                          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: '#28C840', flexShrink: 0 }}>›</span>
                          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color:
                            log.includes('[SUCCESS]') ? '#28C840' :
                            log.includes('[AI]') ? '#A78BFA' :
                            log.includes('[FAIL') ? '#FB923C' :
                            log.includes('[VISION]') ? '#38BDF8' : 'rgba(255,255,255,0.55)',
                          }}>{log}</span>
                        </div>
                      ))}
                      {loading && <span style={{ display: 'inline-block', width: 7, height: 13, background: '#28C840', animation: 'blink 0.8s infinite', marginLeft: 16 }} />}
                      <div ref={consoleEnd} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── AI INSIGHTS GRID ──────────────────────────────────── */}
            {aiInsights ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
                <InsightCard idx={0} label="Pressure Vector" title="Momentum Shift"   icon="📈" text={aiInsights.momentumShift} />
                <InsightCard idx={1} label="Strategy Console" title="Coach's Blueprint" icon="📋" text={aiInsights.tacticalAdvice} />
                <InsightCard idx={2} label="Broadcaster Deck" title="Live Hype Stream" icon="🎙️" text={aiInsights.hypeCommentary} />
              </div>
            ) : !loading && (
              <div style={{ textAlign: 'center', padding: '40px 24px', background: T.bgCard, borderRadius: 16, border: `1px dashed ${T.borderMd}` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏏</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 20, color: T.txtDark, marginBottom: 8 }}>Tactical Radar Standby</div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: T.txtMute, maxWidth: 380, margin: '0 auto' }}>
                  Hit <strong style={{ color: T.orange }}>Trigger AI Strategy Scan</strong> to get Gemini's tactical read — or upload a scorecard image for vision analysis.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${T.border}`, background: T.bgCard, padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: T.txtMute }}>© 2026 CricMind AI · Cognitive IPL Sports Agent Deck</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: T.txtMute }}>Powered by</span>
          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 13, color: T.orange, letterSpacing: 1 }}>GEMINI 2.5 FLASH</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, display: 'inline-block', boxShadow: `0 0 6px ${T.green}` }} />
        </div>
      </footer>
    </div>
  );
}
