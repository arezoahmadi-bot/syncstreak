import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const css = `
  ${GOOGLE_FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080810;
    --card: #111120;
    --card2: #181830;
    --border: #ffffff12;
    --green: #00ff87;
    --cyan: #00cfff;
    --orange: #ff6b35;
    --purple: #a855f7;
    --text: #e2e2f0;
    --muted: #7070a0;
  }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  .mono { font-family: 'Space Mono', monospace; }
  
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  
  /* NAV */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: #08081099; backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
    height: 60px;
  }
  .nav-logo { font-family: 'Space Mono', monospace; font-size: 18px; font-weight: 700; color: var(--green); letter-spacing: -1px; }
  .nav-logo span { color: var(--cyan); }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab {
    padding: 6px 16px; border-radius: 8px; border: none;
    background: transparent; color: var(--muted); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    transition: all 0.2s;
  }
  .nav-tab:hover { color: var(--text); background: var(--card2); }
  .nav-tab.active { background: var(--card2); color: var(--green); border: 1px solid #00ff8733; }
  .nav-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--green), var(--cyan)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: #000; cursor: pointer; }

  /* MAIN */
  .main { flex: 1; padding: 28px 24px; max-width: 1100px; width: 100%; margin: 0 auto; }
  
  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .col-span-2 { grid-column: span 2; }
  
  /* CARD */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px;
    transition: border-color 0.2s;
  }
  .card:hover { border-color: #ffffff22; }
  .card-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
  .card-title { font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700; }
  
  /* STAT CARDS */
  .stat-value { font-family: 'Space Mono', monospace; font-size: 36px; font-weight: 700; line-height: 1; }
  .stat-sub { font-size: 13px; color: var(--muted); margin-top: 6px; }
  .accent-green { color: var(--green); }
  .accent-cyan { color: var(--cyan); }
  .accent-orange { color: var(--orange); }
  .accent-purple { color: var(--purple); }
  
  /* HABITS */
  .habit-list { display: flex; flex-direction: column; gap: 10px; }
  .habit-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border-radius: 12px;
    background: var(--card2); border: 1px solid var(--border);
    cursor: pointer; transition: all 0.2s; user-select: none;
  }
  .habit-item:hover { border-color: #ffffff22; transform: translateX(2px); }
  .habit-item.done { background: #00ff870d; border-color: #00ff8733; }
  .habit-check {
    width: 22px; height: 22px; border-radius: 7px;
    border: 2px solid var(--muted); display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.2s; font-size: 12px;
  }
  .habit-item.done .habit-check { background: var(--green); border-color: var(--green); color: #000; }
  .habit-name { font-size: 15px; font-weight: 500; flex: 1; }
  .habit-item.done .habit-name { text-decoration: line-through; color: var(--muted); }
  .habit-streak { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--orange); }
  .habit-category { font-size: 11px; padding: 3px 9px; border-radius: 20px; font-weight: 600; }
  .cat-health { background: #00ff8722; color: var(--green); }
  .cat-mind { background: #00cfff22; color: var(--cyan); }
  .cat-body { background: #ff6b3522; color: var(--orange); }
  .cat-learn { background: #a855f722; color: var(--purple); }

  /* FRIENDS LEADERBOARD */
  .friend-list { display: flex; flex-direction: column; gap: 8px; }
  .friend-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border-radius: 12px; background: var(--card2);
    border: 1px solid var(--border); transition: all 0.2s;
  }
  .friend-row:hover { border-color: #ffffff22; }
  .friend-rank { font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700; width: 24px; color: var(--muted); }
  .friend-rank.gold { color: #ffd700; }
  .friend-rank.silver { color: #c0c0c0; }
  .friend-rank.bronze { color: #cd7f32; }
  .friend-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
  .friend-name { font-size: 14px; font-weight: 600; flex: 1; }
  .friend-score { font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700; }
  .friend-bar-wrap { height: 4px; background: var(--border); border-radius: 2px; flex: 1; max-width: 80px; }
  .friend-bar { height: 100%; border-radius: 2px; transition: width 0.8s ease; }
  .you-badge { font-size: 10px; padding: 2px 7px; border-radius: 20px; background: #00ff8722; color: var(--green); font-weight: 600; }

  /* PROGRESS RING */
  .ring-grid { display: flex; gap: 16px; justify-content: space-around; padding: 8px 0; }
  .ring-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .ring-label { font-size: 12px; color: var(--muted); font-weight: 500; }
  .ring-pct { font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700; }
  
  /* AI INSIGHT */
  .ai-box {
    background: linear-gradient(135deg, #111120, #181830);
    border: 1px solid #a855f733; border-radius: 16px; padding: 20px;
    position: relative; overflow: hidden;
  }
  .ai-box::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 150px; height: 150px; border-radius: 50%;
    background: radial-gradient(circle, #a855f722, transparent);
    pointer-events: none;
  }
  .ai-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 10px; border: 1px solid #a855f755;
    background: #a855f718; color: var(--purple); font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    margin-top: 12px;
  }
  .ai-btn:hover { background: #a855f730; border-color: var(--purple); }
  .ai-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .ai-response { margin-top: 14px; font-size: 14px; line-height: 1.7; color: var(--text); border-left: 2px solid var(--purple); padding-left: 14px; }
  .ai-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid #a855f733; border-top-color: var(--purple); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* TOOLTIP */
  .custom-tooltip { background: var(--card2); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; font-size: 13px; }

  /* ADD HABIT */
  .add-btn {
    display: flex; align-items: center; gap: 8px;
    width: 100%; padding: 12px 16px; border-radius: 12px;
    background: transparent; border: 1px dashed #ffffff22;
    color: var(--muted); font-size: 14px; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    margin-top: 10px;
  }
  .add-btn:hover { border-color: var(--green); color: var(--green); background: #00ff870a; }

  /* DATE BADGE */
  .date-badge { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); background: var(--card2); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border); }

  /* SECTION HEADER */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .section-title { font-family: 'Space Mono', monospace; font-size: 15px; font-weight: 700; }
  
  /* PULSE DOT */
  .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); position: relative; }
  .pulse-dot::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid var(--green); animation: pulse 1.5s infinite; }
  @keyframes pulse { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
    .nav-tabs { display: none; }
    .main { padding: 16px; }
  }

  /* PAGE ANIM */
  .fade-in { animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* INPUT */
  .input-row { display: flex; gap: 10px; margin-top: 12px; }
  .habit-input {
    flex: 1; background: var(--card2); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px; color: var(--text);
    font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none;
  }
  .habit-input:focus { border-color: var(--green); }
  .submit-btn {
    padding: 10px 18px; border-radius: 10px; background: var(--green);
    border: none; color: #000; font-weight: 700; font-size: 14px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: opacity 0.2s;
  }
  .submit-btn:hover { opacity: 0.85; }
`;

// DATA
const FRIENDS = [
  { id: 1, name: "You", emoji: "😎", color: "#00ff87", bg: "#00ff8733", score: 82, streak: 7, isYou: true },
  { id: 2, name: "Layla", emoji: "🌙", color: "#00cfff", bg: "#00cfff33", score: 78, streak: 5 },
  { id: 3, name: "Marcus", emoji: "🔥", color: "#ff6b35", bg: "#ff6b3533", score: 71, streak: 12 },
  { id: 4, name: "Priya", emoji: "⚡", color: "#a855f7", bg: "#a855f733", score: 65, streak: 3 },
  { id: 5, name: "Theo", emoji: "🌿", color: "#ffd700", bg: "#ffd70033", score: 54, streak: 2 },
];

const WEEKLY_DATA = [
  { day: "Mon", you: 70, layla: 60, marcus: 80 },
  { day: "Tue", you: 60, layla: 75, marcus: 65 },
  { day: "Wed", you: 85, layla: 70, marcus: 90 },
  { day: "Thu", you: 75, layla: 80, marcus: 70 },
  { day: "Fri", you: 90, layla: 65, marcus: 85 },
  { day: "Sat", you: 80, layla: 90, marcus: 75 },
  { day: "Sun", you: 82, layla: 78, marcus: 71 },
];

const MONTHLY_DATA = [
  { week: "W1", score: 68 }, { week: "W2", score: 74 },
  { week: "W3", score: 71 }, { week: "W4", score: 82 },
];

const INIT_HABITS = [
  { id: 1, name: "Morning Run 🏃", category: "body", streak: 7, done: false },
  { id: 2, name: "Read 20 pages 📖", category: "learn", streak: 4, done: false },
  { id: 3, name: "Drink 2L water 💧", category: "health", streak: 12, done: true },
  { id: 4, name: "Meditate 10 min 🧘", category: "mind", streak: 3, done: false },
  { id: 5, name: "No social media 📵", category: "mind", streak: 2, done: false },
  { id: 6, name: "Workout 💪", category: "body", streak: 7, done: true },
];

const catClass = { health: "cat-health", mind: "cat-mind", body: "cat-body", learn: "cat-learn" };
const catLabel = { health: "Health", mind: "Mind", body: "Body", learn: "Learn" };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="custom-tooltip">
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, marginBottom: 6, color: "#7070a0" }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
            {p.name}: {p.value}%
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [habits, setHabits] = useState(INIT_HABITS);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [showInput, setShowInput] = useState(false);

  const doneCount = habits.filter(h => h.done).length;
  const todayPct = Math.round((doneCount / habits.length) * 100);

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h =>
      h.id === id ? { ...h, done: !h.done } : h
    ));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits(prev => [...prev, {
      id: Date.now(), name: newHabit.trim(), category: "health", streak: 0, done: false
    }]);
    setNewHabit("");
    setShowInput(false);
  };

  const getAiInsight = async () => {
    setAiLoading(true);
    setAiText("");
    try {
      const doneHabits = habits.filter(h => h.done).map(h => h.name).join(", ");
      const pendingHabits = habits.filter(h => !h.done).map(h => h.name).join(", ");
      const prompt = `You are a motivational habit coach. The user has completed ${doneCount}/${habits.length} habits today (${todayPct}%). 
Completed: ${doneHabits || "none yet"}. 
Still pending: ${pendingHabits || "all done!"}.
Their weekly score is 82% and they are ranked #1 among their friends.
Give them a short (2-3 sentence), punchy, and personalized motivational insight. Be specific, energetic, and real. No fluff.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "Keep pushing!";
      setAiText(text);
    } catch (e) {
      setAiText("You're crushing it — stay consistent and the results will follow! 🔥");
    }
    setAiLoading(false);
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const sorted = [...FRIENDS].sort((a, b) => b.score - a.score);
  const maxScore = sorted[0].score;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo mono">sync<span>.</span>streak</div>
          <div className="nav-tabs">
            {["dashboard", "habits", "friends", "charts"].map(t => (
              <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="nav-avatar">Y</div>
        </nav>

        <main className="main">
          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div className="fade-in">
              <div className="section-header">
                <div>
                  <div className="card-label">Dashboard</div>
                  <div className="section-title">Good morning, You 👋</div>
                </div>
                <div className="date-badge mono">{today}</div>
              </div>

              {/* STAT CARDS */}
              <div className="grid-3" style={{ marginBottom: 16 }}>
                <div className="card">
                  <div className="card-label">Today's Progress</div>
                  <div className="stat-value accent-green">{todayPct}%</div>
                  <div className="stat-sub">{doneCount} of {habits.length} habits done</div>
                </div>
                <div className="card">
                  <div className="card-label">Weekly Score</div>
                  <div className="stat-value accent-cyan">82%</div>
                  <div className="stat-sub">↑ 7% from last week</div>
                </div>
                <div className="card">
                  <div className="card-label">Your Rank</div>
                  <div className="stat-value accent-orange">#1</div>
                  <div className="stat-sub">Among 5 friends 🏆</div>
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: 16 }}>
                {/* TODAY'S HABITS PREVIEW */}
                <div className="card">
                  <div className="section-header">
                    <div className="card-label" style={{ marginBottom: 0 }}>Today's Habits</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div className="pulse-dot"></div>
                      <span style={{ fontSize: 12, color: "#00ff87" }}>Live</span>
                    </div>
                  </div>
                  <div className="habit-list">
                    {habits.slice(0, 4).map(h => (
                      <div key={h.id} className={`habit-item ${h.done ? "done" : ""}`} onClick={() => toggleHabit(h.id)}>
                        <div className="habit-check">{h.done ? "✓" : ""}</div>
                        <span className="habit-name">{h.name}</span>
                        <span className={`habit-category ${catClass[h.category]}`}>{catLabel[h.category]}</span>
                      </div>
                    ))}
                  </div>
                  <button className="add-btn" onClick={() => setTab("habits")}>→ See all habits</button>
                </div>

                {/* LEADERBOARD PREVIEW */}
                <div className="card">
                  <div className="card-label" style={{ marginBottom: 12 }}>Friends Leaderboard</div>
                  <div className="friend-list">
                    {sorted.map((f, i) => (
                      <div key={f.id} className="friend-row">
                        <span className={`friend-rank mono ${i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : ""}`}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                        </span>
                        <div className="friend-avatar" style={{ background: f.bg, color: f.color }}>{f.emoji}</div>
                        <span className="friend-name">{f.name} {f.isYou && <span className="you-badge">you</span>}</span>
                        <div className="friend-bar-wrap">
                          <div className="friend-bar" style={{ width: `${(f.score / maxScore) * 100}%`, background: f.color }}></div>
                        </div>
                        <span className="friend-score mono" style={{ color: f.color }}>{f.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI INSIGHT */}
              <div className="ai-box">
                <div className="card-label" style={{ color: "#a855f7" }}>✦ AI Coach Insight</div>
                <p style={{ fontSize: 14, color: "#9090b0", lineHeight: 1.6 }}>
                  Get a personalized AI analysis of your progress and what to focus on next.
                </p>
                <button className="ai-btn" onClick={getAiInsight} disabled={aiLoading}>
                  {aiLoading ? <><span className="ai-spinner"></span> Analyzing...</> : "⚡ Get My Insight"}
                </button>
                {aiText && <div className="ai-response">{aiText}</div>}
              </div>
            </div>
          )}

          {/* HABITS TAB */}
          {tab === "habits" && (
            <div className="fade-in">
              <div className="section-header">
                <div>
                  <div className="card-label">My Habits</div>
                  <div className="section-title">Daily Checklist</div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div className="date-badge mono">{doneCount}/{habits.length} done</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, color: "#00ff87" }}>{todayPct}%</div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div style={{ height: 8, background: "#ffffff10", borderRadius: 4, marginBottom: 20, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${todayPct}%`, background: "linear-gradient(90deg, #00ff87, #00cfff)", borderRadius: 4, transition: "width 0.5s ease" }}></div>
              </div>

              <div className="card">
                <div className="habit-list">
                  {habits.map(h => (
                    <div key={h.id} className={`habit-item ${h.done ? "done" : ""}`} onClick={() => toggleHabit(h.id)}>
                      <div className="habit-check">{h.done ? "✓" : ""}</div>
                      <span className="habit-name">{h.name}</span>
                      <span className={`habit-category ${catClass[h.category]}`}>{catLabel[h.category]}</span>
                      <span className="habit-streak">🔥 {h.streak}d</span>
                    </div>
                  ))}
                </div>

                {showInput ? (
                  <div className="input-row">
                    <input
                      className="habit-input"
                      placeholder="e.g. Journal 5 min 📝"
                      value={newHabit}
                      onChange={e => setNewHabit(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addHabit()}
                      autoFocus
                    />
                    <button className="submit-btn" onClick={addHabit}>Add</button>
                  </div>
                ) : (
                  <button className="add-btn" onClick={() => setShowInput(true)}>+ Add new habit</button>
                )}
              </div>
            </div>
          )}

          {/* FRIENDS TAB */}
          {tab === "friends" && (
            <div className="fade-in">
              <div className="section-header">
                <div>
                  <div className="card-label">Friends</div>
                  <div className="section-title">The Arena 🏆</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="card col-span-2">
                  <div className="card-label" style={{ marginBottom: 16 }}>Full Leaderboard</div>
                  <div className="friend-list">
                    {sorted.map((f, i) => (
                      <div key={f.id} className="friend-row" style={{ padding: "16px 20px" }}>
                        <span className={`friend-rank mono ${i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : ""}`} style={{ fontSize: 18, width: 32 }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                        </span>
                        <div className="friend-avatar" style={{ background: f.bg, color: f.color, width: 44, height: 44, fontSize: 18 }}>{f.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="friend-name" style={{ fontSize: 16 }}>{f.name}</span>
                            {f.isYou && <span className="you-badge">you</span>}
                          </div>
                          <div style={{ fontSize: 12, color: "#7070a0", marginTop: 2 }}>🔥 {f.streak} day streak</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="friend-score mono" style={{ color: f.color, fontSize: 22 }}>{f.score}%</div>
                          <div style={{ fontSize: 11, color: "#7070a0" }}>weekly score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHARTS TAB */}
          {tab === "charts" && (
            <div className="fade-in">
              <div className="section-header">
                <div>
                  <div className="card-label">Analytics</div>
                  <div className="section-title">Progress Charts</div>
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: 16 }}>
                {/* WEEKLY LINE CHART */}
                <div className="card col-span-2">
                  <div className="card-label">Weekly Comparison — You vs Friends</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={WEEKLY_DATA} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
                      <XAxis dataKey="day" tick={{ fill: "#7070a0", fontSize: 12, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#7070a0", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="you" stroke="#00ff87" strokeWidth={2.5} dot={{ fill: "#00ff87", r: 4 }} name="You" />
                      <Line type="monotone" dataKey="layla" stroke="#00cfff" strokeWidth={2} dot={{ fill: "#00cfff", r: 3 }} name="Layla" />
                      <Line type="monotone" dataKey="marcus" stroke="#ff6b35" strokeWidth={2} dot={{ fill: "#ff6b35", r: 3 }} name="Marcus" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 20, marginTop: 12, justifyContent: "center" }}>
                    {[["#00ff87", "You"], ["#00cfff", "Layla"], ["#ff6b35", "Marcus"]].map(([c, n]) => (
                      <div key={n} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9090b0" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: c }}></div> {n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* MONTHLY BAR */}
                <div className="card">
                  <div className="card-label">Monthly Trend — Your Score</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                      <XAxis dataKey="week" tick={{ fill: "#7070a0", fontSize: 12, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#7070a0", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="score" fill="#00cfff" radius={[6, 6, 0, 0]} name="Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* RADIAL OVERVIEW */}
                <div className="card">
                  <div className="card-label">Goal Progress Overview</div>
                  <div className="ring-grid" style={{ marginTop: 8 }}>
                    {[
                      { label: "Daily", pct: todayPct, color: "#00ff87" },
                      { label: "Weekly", pct: 82, color: "#00cfff" },
                      { label: "Monthly", pct: 74, color: "#a855f7" },
                    ].map(({ label, pct, color }) => (
                      <div key={label} className="ring-item">
                        <div style={{ position: "relative", width: 80, height: 80 }}>
                          <svg viewBox="0 0 80 80" width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="40" cy="40" r="32" fill="none" stroke="#ffffff10" strokeWidth="8" />
                            <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="8"
                              strokeDasharray={`${(pct / 100) * 201} 201`}
                              strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease" }} />
                          </svg>
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Mono, monospace", fontSize: 14, fontWeight: 700, color }}>
                            {pct}%
                          </div>
                        </div>
                        <span className="ring-label">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    {[{ label: "Health", pct: 85, color: "#00ff87" }, { label: "Mind", pct: 60, color: "#00cfff" }, { label: "Body", pct: 90, color: "#ff6b35" }, { label: "Learn", pct: 70, color: "#a855f7" }].map(({ label, pct, color }) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: "#7070a0", width: 44 }}>{label}</span>
                        <div style={{ flex: 1, height: 6, background: "#ffffff10", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.8s ease" }}></div>
                        </div>
                        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 12, color, width: 34, textAlign: "right" }}>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
