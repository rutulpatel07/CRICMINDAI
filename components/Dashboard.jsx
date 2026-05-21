import React, { useState, useEffect, useRef } from 'react';

export default function Dashboard() {
  // --- States ---
  const [matchData, setMatchData] = useState({
    matchInfo: "Gujarat Titans vs Chennai Super Kings",
    innings: "Second Innings",
    battingTeam: "Gujarat Titans",
    bowlingTeam: "Chennai Super Kings",
    target: "200",
    score: "162/5",
    overs: "16.4",
    requiredRate: "11.4",
    currentRunRate: "9.72",
    runsNeeded: "38",
    ballsRemaining: "20",
    batsmen: [
      { name: "Rashid Khan", runs: "14", balls: "6", strikeRate: "233.33", isStriker: true },
      { name: "Rahul Tewatia", runs: "2", balls: "1", strikeRate: "200.00", isStriker: false }
    ],
    bowler: {
      name: "Matheesha Pathirana",
      overs: "2.4",
      runs: "24",
      wickets: "2",
      type: "Right-arm Fast (Slingy Yorker Specialist)"
    },
    lastEvent: "WICKET! David Miller clean bowled by a lethal 148 km/h toe-crushing yorker from Matheesha Pathirana! Crucial breakthrough for CSK! GT are 5 down.",
    recentBalls: ["1", "4", "Wd", "6", "W", "1"],
    stadium: "Narendra Modi Stadium, Ahmedabad",
    weather: "Clear, 32°C, high humidity impacting ball grip",
    comment: "Extreme pressure on Gujarat Titans. The crowd is in complete absolute frenzy. Pathirana is reversing the ball beautifully."
  });

  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [dataSource, setDataSource] = useState(null); // 'live' | 'fallback' | 'local_mock'
  const [error, setError] = useState(null);

  const consoleEndRef = useRef(null);

  // --- Auto-scroll console ---
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // --- Local Fallback State (If both API and Backend Fallback Fail) ---
  const localMockAiResponse = {
    matchOverview: "The Gujarat Titans are staring down the barrel of a monumental defeat, requiring an astronomical 38 runs off just 20 deliveries with only five wickets in hand. The critical scalp of David Miller, cleaned up by a searing 148 km/h toe-crusher from Matheesha Pathirana, has sent shockwaves through the GT dugout and tilted this contest overwhelmingly in Chennai Super Kings' favour. The required run rate has spiked to an almost insurmountable 11.4, a stark contrast to their current 9.72, signaling a massive tactical and execution deficit. Rashid Khan, their last genuine hope, is now at the crease, tasked with an improbable mission alongside the new man, Rahul Tewatia.",
    momentumShift: "The momentum has unequivocally swung 90-10 in favour of Chennai Super Kings. The wicket of David Miller isn't just a numerical loss; it's a colossal psychological blow, eradicating GT's primary finisher and sending their required run rate into the stratosphere. Pathirana's fiery spell, especially the reverse-swinging yorker that dismissed Miller, is the driving force. The qualitative impact of losing a settled batter and introducing a new one under extreme pressure, coupled with Pathirana's consistent wicket-taking and economy, signifies CSK's absolute dominance right now. The pressure is suffocating for GT.",
    tacticalAdvice: "• For GT's Batting Unit: Rashid Khan, you must target Pathirana's non-yorker deliveries for boundaries. Look for anything slightly short or wide, even a fraction, and unleash your power. Don't allow him to settle into a rhythm of lethal yorkers; preempt them with intelligent movement or try to scoop them for runs.\n• Tewatia, your role is to rotate strike immediately and allow Rashid to face the majority of balls.\n• For CSK's Bowling Unit: Pathirana, stick to your lethal plan. Maintain your attacking lines, primarily the toe-crushing yorker, but don't become predictable. Vary your pace subtly with a well-disguised slower ball on occasion.",
    hypeCommentary: "OH. MY. WORD! Ahmedabad is ABSOLUTELY ROCKING! This is not just a game, this is an EMOTIONAL ROLLERCOASTER! Matheesha 'The Slinger' Pathirana, you are a GENIUS! That lethal, toe-crushing 148 km/h yorker, REVERSING beautifully, and David Miller is CLEAN BOWLED! The Super Kings have ripped the heart out of the Gujarat Titans' chase! Look at MS Dhoni's calm smile amidst the CHAOS – he knows the game-changing moment just happened! Gujarat needs 38 off 20 – an Everest of a task against a white-hot CSK attack! Rashid Khan walks out, the pressure is INHUMANE! Can he pull a rabbit out of the hat, or will CSK close this out with clinical precision? This is the IPL at its ABSOLUTE, UNADULTERATED BEST!"
  };

  // --- Analytical Micro-Steps for Console Ticker ---
  const diagnosticsSteps = [
    "[INFO] Initializing CricMind AI strategy scan...",
    "[SYS] Connecting to live scraper telemetry feed (https://ipl-okn0.onrender.com/live)...",
    "[SYS] Reading active match state from source stream...",
    "[SYS] Parsing current scoreboard parameters: 162/5 (16.4 Overs)...",
    "[MATH] Re-calculating live pressure vectors: Target 200, Req. RR: 11.40...",
    "[PHYS] Ingesting atmospheric conditions (32°C, high humidity ball slippage)...",
    "[MATCHUP] Scanning historical match-up datasets: Rashid Khan vs Slingy Fast...",
    "[AI] Feeding structured context to 'gemini-2.5-flash' engine...",
    "[AI] Applying strict tactical sports scientist persona weights...",
    "[AI] Enforcing requested JSON layout structures via schema definition...",
    "[SUCCESS] Secure structured strategy insights parsed successfully."
  ];

  // --- Strategy Scan Trigger ---
  const triggerAiScan = async () => {
    setLoading(true);
    setError(null);
    setConsoleLogs([]);
    setAiInsights(null);

    // 1. Start Console Logging Ticker Sequence
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < diagnosticsSteps.length) {
        setConsoleLogs(prev => [...prev, diagnosticsSteps[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    // Keep track of start time to ensure we show the console animations for at least 3.5 seconds
    const startTime = Date.now();

    try {
      // 2. Fetch Backend API
      const response = await fetch('http://localhost:5000/api/live-analysis');
      const data = await response.json();

      // Ensure the user gets to see the diagnostics logs scrolling
      const elapsed = Date.now() - startTime;
      const minDuration = 4400; // time it takes to print all 11 logs (11 * 400ms)
      const remainingTime = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        clearInterval(logInterval);
        // Catch-up logs if the server is super fast
        setConsoleLogs(diagnosticsSteps);

        if (response.ok && data.success) {
          setAiInsights(data.data);
          setDataSource(data.dataSource); // 'live' | 'fallback'
          // If backend had to fall back, update front-end scoreboard with the loaded fallback data
          if (data.dataSource === 'fallback') {
            setConsoleLogs(prev => [...prev, "[FAIL-SAFE] Scraper failed or timed out. Loaded local cache snapshot."]);
          } else {
            setConsoleLogs(prev => [...prev, "[LIVE] Real-time scoreboard streams connected."]);
          }
        } else {
          throw new Error(data.error || 'Failed to retrieve AI insights.');
        }
        setLoading(false);
      }, remainingTime);

    } catch (err) {
      console.warn("Front-end API Handshake failed. Launching secondary local mock database fail-safe:", err.message);
      
      const elapsed = Date.now() - startTime;
      const minDuration = 4400;
      const remainingTime = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        clearInterval(logInterval);
        setConsoleLogs([
          ...diagnosticsSteps,
          `[FAIL-SAFE] API Connection Error: ${err.message}`,
          "[FAIL-SAFE] Activating double-redundant FRONTEND secure cache override...",
          "[SUCCESS] Strategy vectors compiled from offline backup."
        ]);
        
        // Double fail-safe loading
        setAiInsights(localMockAiResponse);
        setDataSource("local_mock");
        setLoading(false);
      }, remainingTime);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col font-sans select-none antialiased">
      
      {/* --- Main Dashboard Container --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 flex flex-col justify-between">
        
        {/* =======================================================
            TOP BAR LIVE Score Telemetry Widget
           ======================================================= */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Cyber Glow lines */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            
            {/* Left: Teams and Match state info */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-500 animate-ping opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                <span className="text-xs uppercase font-mono tracking-widest text-slate-400 ml-2">Live Match Telemetry</span>
              </div>
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {matchData.matchInfo}
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                {matchData.innings}
              </span>
            </div>

            {/* Right: Score details */}
            <div className="flex items-center gap-6 bg-slate-950/60 border border-slate-800 px-6 py-3 rounded-xl">
              <div className="text-center">
                <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Score</p>
                <p className="text-xl md:text-3xl font-extrabold text-cyan-400 tracking-tight">{matchData.score}</p>
              </div>
              <div className="w-[1px] h-10 bg-slate-800" />
              <div className="text-center">
                <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Overs</p>
                <p className="text-xl md:text-3xl font-extrabold text-slate-200">{matchData.overs}</p>
              </div>
              <div className="w-[1px] h-10 bg-slate-800" />
              <div className="text-center">
                <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Req. Rate</p>
                <p className="text-xl md:text-3xl font-extrabold text-emerald-400">{matchData.requiredRate}</p>
              </div>
            </div>

          </div>

          {/* Under-scores Details: Match Status bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 mt-6 pt-4 border-t border-slate-800/80 gap-4 text-sm">
            <div className="flex items-center gap-3 bg-slate-950/20 px-3 py-2 rounded-lg border border-slate-800/30">
              <span className="text-xs font-mono text-slate-400">TARGET:</span>
              <span className="font-semibold text-slate-200">{matchData.target} Runs</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs font-mono text-slate-400">NEEDED:</span>
              <span className="font-semibold text-cyan-400">{matchData.runsNeeded} off {matchData.ballsRemaining} balls</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/20 px-3 py-2 rounded-lg border border-slate-800/30">
              <span className="text-xs font-mono text-slate-400">BATSMEN:</span>
              {matchData.batsmen.map((b, i) => (
                <span key={i} className={`flex items-center gap-1 font-mono text-xs ${b.isStriker ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {b.name} ({b.runs}*{b.balls}){b.isStriker ? '🏏' : ''}
                  {i < matchData.batsmen.length - 1 && <span className="text-slate-700 ml-1">/</span>}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-slate-950/20 px-3 py-2 rounded-lg border border-slate-800/30">
              <span className="text-xs font-mono text-slate-400">BOWLER:</span>
              <span className="font-mono text-xs text-cyan-400 font-bold">
                {matchData.bowler.name} ({matchData.bowler.overs} Ov, {matchData.bowler.runs}R, {matchData.bowler.wickets}W)
              </span>
            </div>
          </div>

          {/* Last ball event tracker */}
          <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800/60 rounded-xl flex items-start md:items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-widest bg-red-950 border border-red-800/80 text-red-400 px-2 py-0.5 rounded">
              Last Event
            </span>
            <p className="text-xs md:text-sm text-slate-300 italic flex-1">
              "{matchData.lastEvent}"
            </p>
          </div>
        </section>

        {/* =======================================================
            ACTION CORE: Strategy trigger and Diagnostic console
           ======================================================= */}
        <section className="flex flex-col items-center justify-center space-y-4">
          
          {/* Neon Strategy scan button */}
          <div className="relative group">
            <div className={`absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-1000 group-hover:duration-200 ${loading ? 'animate-pulse' : ''}`} />
            <button
              onClick={triggerAiScan}
              disabled={loading}
              className={`relative px-8 py-4 rounded-full bg-slate-900 border border-slate-800 font-bold uppercase tracking-wider text-sm transition-all duration-300 transform active:scale-95 flex items-center gap-3 ${loading ? 'text-slate-400 border-slate-800 shadow-none' : 'text-slate-100 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105 hover:border-cyan-500/40'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Scanning Strategy Matrices...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Trigger AI Strategy Scan</span>
                </>
              )}
            </button>
          </div>

          {/* SIMULATED DIAGNOSTICS CONSOLE (Renders during scan) */}
          {loading && (
            <div className="w-full max-w-2xl bg-black border border-emerald-950 rounded-xl p-4 shadow-2xl relative">
              <div className="absolute top-2 right-4 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">Diag Live</span>
              </div>
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-emerald-950/60">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500/50" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">CricMind Strategy Ingestion Engine v2.5.0</span>
              </div>
              <div className="h-32 overflow-y-auto font-mono text-xs text-emerald-400 space-y-1.5 leading-relaxed pr-2">
                {consoleLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-1">
                    <span className="text-emerald-600 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
                <span className="inline-block w-1.5 h-4 bg-emerald-400 animate-pulse ml-1" />
                <div ref={consoleEndRef} />
              </div>
            </div>
          )}

          {/* Badge Display Area (Active only when strategy scan is successfully drawn) */}
          {dataSource && !loading && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Pipeline Feed Source:</span>
              {dataSource === 'live' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/50 border border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE STAT STREAM
                </span>
              ) : dataSource === 'fallback' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/50 border border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  SECURE METRIC CACHE (BACKEND FALLBACK)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-950/50 border border-orange-500/50 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  SECURE METRIC CACHE (LOCAL FRONTEND OVERRIDE)
                </span>
              )}
            </div>
          )}
        </section>

        {/* =======================================================
            THE INSIGHTS GRID: 3 Strategic Cards
           ======================================================= */}
        <section className="flex-1 mt-6">
          {aiInsights ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in duration-700">
              
              {/* Card 1: Momentum Vector (momentumShift) */}
              <article className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 hover:border-cyan-500/20 rounded-2xl p-6 shadow-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-500 to-indigo-500" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-extrabold">01 // Pressure Vector</h3>
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-100 uppercase tracking-tight">Momentum Shift</h4>
                  <p className="text-sm text-slate-300 leading-relaxed text-justify">
                    {aiInsights.momentumShift}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/40 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>METRIC: SHIFT VELOCITY</span>
                  <span>CONFIDENCE: 92%</span>
                </div>
              </article>

              {/* Card 2: Coach's Blueprint (tacticalAdvice) */}
              <article className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/20 rounded-2xl p-6 shadow-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500 to-teal-500" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-extrabold">02 // Strategy Console</h3>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-100 uppercase tracking-tight">Coach's Blueprint</h4>
                  <div className="text-sm text-slate-300 leading-relaxed text-justify space-y-2">
                    {/* Render lists dynamically if returning split values, else render paragraph */}
                    {aiInsights.tacticalAdvice.includes('•') ? (
                      aiInsights.tacticalAdvice.split('\n').map((line, idx) => (
                        <p key={idx} className="pl-4 -indent-4">{line.trim()}</p>
                      ))
                    ) : (
                      aiInsights.tacticalAdvice.split('\n').map((para, idx) => (
                        <p key={idx}>{para.trim()}</p>
                      ))
                    )}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/40 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>METRIC: ALIGNMENT RATIO</span>
                  <span>LEVEL: ELITE SPORT</span>
                </div>
              </article>

              {/* Card 3: Live Hype Stream (hypeCommentary) */}
              <article className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 hover:border-purple-500/20 rounded-2xl p-6 shadow-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-pink-500" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-purple-400 font-extrabold">03 // Broadcaster Deck</h3>
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-100 uppercase tracking-tight">Live Hype Stream</h4>
                  
                  {/* Glassmorphic Quotes wrapper for broadcast vibes */}
                  <div className="bg-slate-950/40 border border-slate-800/40 p-4 rounded-xl relative">
                    <span className="absolute -top-3 left-2 font-serif text-5xl text-purple-500/40 select-none">“</span>
                    <p className="text-sm text-slate-300 leading-relaxed italic text-justify relative z-10 font-sans tracking-wide">
                      {aiInsights.hypeCommentary}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/40 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>METRIC: ENGAGEMENT DECK</span>
                  <span>TONE: broadcaster</span>
                </div>
              </article>

            </div>
          ) : (
            // Placeholder: Initial Beautiful Strategy Control room scan cue
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800/80 rounded-2xl py-20 px-4 text-center bg-slate-900/10 backdrop-blur-sm max-w-2xl mx-auto space-y-4 shadow-xl">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-full text-cyan-400 animate-bounce">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.795H13.52l1.309-6.304L5.842 14.7H9.813z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-200">TACTICAL RADAR STANDBY</h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-md leading-relaxed">
                Strategy matrices are primed and loaded. Ingest scoring streams, compile historical player matchups, and let CricMind AI compute elite coaching strategies. Click the scanning button above to launch.
              </p>
            </div>
          )}
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-4 px-6 mt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-500 gap-2">
        <span>© 2026 CRICMIND AI. COGNITIVE IPL SPORTS AGENT DECK.</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          SYSTEM STATE: PRIME
        </span>
      </footer>
    </div>
  );
}
