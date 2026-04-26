"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Target,
  Award,
  Clock,
  Brain,
  Plus,
  Trash2,
  Check,
  Circle,
  Trophy,
  Medal,
  Settings,
  X,
} from "lucide-react";

type TimerMode = "focus" | "short" | "long";

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

interface LeaderboardEntry {
  user_id: string;
  name: string;
  minutes: number;
  count: number;
}

export default function PomodoroPage() {
  // Timer settings (customizable)
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [showSettings, setShowSettings] = useState(false);

  const getDuration = useCallback((m: TimerMode) => {
    if (m === "focus") return focusDuration * 60;
    if (m === "short") return shortBreakDuration * 60;
    return longBreakDuration * 60;
  }, [focusDuration, shortBreakDuration, longBreakDuration]);

  // Timer state
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [running, setRunning] = useState(false);

  // Task & Todo
  const [currentFocus, setCurrentFocus] = useState("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Stats
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Load settings & todos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("craniora_pomodoro_settings");
    if (saved) {
      const s = JSON.parse(saved);
      if (s.focus) setFocusDuration(s.focus);
      if (s.short) setShortBreakDuration(s.short);
      if (s.long) setLongBreakDuration(s.long);
      if (s.goal) setDailyGoal(s.goal);
      setTimeLeft((s.focus || 25) * 60);
    }
    const savedTodos = localStorage.getItem("craniora_pomodoro_todos");
    if (savedTodos) setTodos(JSON.parse(savedTodos));
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("craniora_pomodoro_todos", JSON.stringify(todos));
  }, [todos]);

  // Fetch leaderboard & today stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/pomodoro");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard);
        setCurrentUserId(data.currentUserId);
        setPomodoroCount(data.today.count);
        setTotalMinutes(data.today.minutes);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Save completed pomodoro to server
  const saveSession = useCallback(async (minutes: number) => {
    await fetch("/api/pomodoro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration_minutes: minutes, task: currentFocus }),
    });
    fetchStats();
  }, [currentFocus, fetchStats]);

  // Timer logic
  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && running) {
      setRunning(false);

      // Play notification sound
      try {
        const sound = new Audio(mode === "focus" ? "/work.mp3" : "/break.mp3");
        sound.play().catch(() => {});
      } catch { /* ignore */ }

      // Browser notification
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification("Pomodoro selesai!", { body: mode === "focus" ? "Waktunya istirahat!" : "Waktunya fokus lagi!" });
      }

      if (mode === "focus") {
        saveSession(focusDuration);
        const newCount = pomodoroCount + 1;
        if (newCount % 4 === 0) {
          switchMode("long");
        } else {
          switchMode("short");
        }
      } else {
        switchMode("focus");
      }
    }
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timeLeft]);

  const switchMode = (newMode: TimerMode) => {
    setRunning(false);
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
  };

  const toggleTimer = () => {
    if (!running && typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setRunning(!running);
  };

  const resetTimer = () => { setRunning(false); setTimeLeft(getDuration(mode)); };
  const skipToNext = () => {
    if (mode === "focus") switchMode(pomodoroCount % 4 === 3 ? "long" : "short");
    else switchMode("focus");
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const progress = 1 - timeLeft / getDuration(mode);
  const circumference = 2 * Math.PI * 45;
  const strokeOffset = circumference * (1 - progress);
  const goalProgress = Math.min((pomodoroCount / dailyGoal) * 100, 100);

  // Todo functions
  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now().toString(), text: newTodo.trim(), done: false }]);
    setNewTodo("");
  };
  const toggleTodo = (id: string) => setTodos((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const removeTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  // Save settings
  const saveSettings = () => {
    localStorage.setItem("craniora_pomodoro_settings", JSON.stringify({
      focus: focusDuration, short: shortBreakDuration, long: longBreakDuration, goal: dailyGoal,
    }));
    setTimeLeft(getDuration(mode));
    setShowSettings(false);
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <main className="max-w-[1280px] mx-auto px-6 pt-8 pb-32">
      <div className="flex flex-col items-center gap-8">
        {/* Mode Selector */}
        <div className="flex bg-secondary-container p-1 rounded-xl w-full max-w-md">
          {(["focus", "short", "long"] as const).map((m) => (
            <button key={m} onClick={() => switchMode(m)} className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${mode === m ? "bg-primary-container text-white shadow-sm" : "text-on-secondary-container hover:bg-white/50"}`}>
              {m === "focus" ? "Focus" : m === "short" ? "Short Break" : "Long Break"}
            </button>
          ))}
        </div>

        {/* Timer */}
        <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-secondary-100" />
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
              className={`transition-all duration-1000 ${mode === "focus" ? "text-primary-container" : mode === "short" ? "text-success" : "text-info"}`}
              strokeDasharray={circumference} strokeDashoffset={strokeOffset} />
          </svg>
          <div className="flex flex-col items-center">
            <span className="font-[var(--font-heading)] text-[64px] md:text-[80px] text-primary-container tracking-tighter leading-none">{formatTime(timeLeft)}</span>
            <span className="text-xs text-secondary font-medium tracking-[0.2em] uppercase mt-2">{mode === "focus" ? "Focus" : mode === "short" ? "Break" : "Long Break"}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button onClick={resetTimer} className="w-12 h-12 flex items-center justify-center rounded-full border border-primary-50 text-primary-container hover:bg-primary-50 transition-colors active:scale-90">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={toggleTimer} className={`w-20 h-20 flex items-center justify-center rounded-full text-white shadow-lg active:scale-95 transition-all ${mode === "focus" ? "bg-primary-container" : mode === "short" ? "bg-success" : "bg-info"}`}>
            {running ? <Pause className="w-10 h-10" fill="currentColor" /> : <Play className="w-10 h-10 ml-1" fill="currentColor" />}
          </button>
          <button onClick={skipToNext} className="w-12 h-12 flex items-center justify-center rounded-full border border-primary-50 text-primary-container hover:bg-primary-50 transition-colors active:scale-90">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Settings button */}
        <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 text-xs text-primary-400 font-semibold hover:underline">
          <Settings className="w-4 h-4" /> Atur Durasi & Target
        </button>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-4">
          {/* Current Focus */}
          <div className="bg-surface-card border border-primary-50 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-primary-container" />
              <h3 className="font-[var(--font-heading)] text-base font-semibold text-primary-container">Current Focus</h3>
            </div>
            <input className="w-full bg-secondary-100 border-none rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-primary-400 outline-none placeholder:text-slate-400" placeholder="Apa yang sedang kamu pelajari?" value={currentFocus} onChange={(e) => setCurrentFocus(e.target.value)} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-primary-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
              <Award className="w-8 h-8 text-primary-container shrink-0" />
              <div>
                <p className="text-[10px] text-secondary font-semibold uppercase">Pomodoros</p>
                <p className="font-[var(--font-heading)] text-2xl font-semibold text-primary-container">{pomodoroCount.toString().padStart(2, "0")}</p>
              </div>
            </div>
            <div className="bg-white border border-primary-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary-container shrink-0" />
              <div>
                <p className="text-[10px] text-secondary font-semibold uppercase">Menit</p>
                <p className="font-[var(--font-heading)] text-2xl font-semibold text-primary-container">{totalMinutes}</p>
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="bg-surface-card border border-primary-50 p-4 rounded-xl shadow-sm md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-[var(--font-heading)] text-base font-semibold text-primary-container flex items-center gap-2">
                <Check className="w-5 h-5" /> To-Do List
              </h3>
              <span className="text-xs text-secondary">{todos.filter((t) => t.done).length}/{todos.length}</span>
            </div>
            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
              {todos.map((todo) => (
                <div key={todo.id} className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${todo.done ? "bg-success/5" : "bg-secondary-100"}`}>
                  <button onClick={() => toggleTodo(todo.id)} className="shrink-0">
                    {todo.done ? <Check className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-slate-300" />}
                  </button>
                  <span className={`flex-1 text-sm ${todo.done ? "line-through text-slate-400" : "text-primary-container"}`}>{todo.text}</span>
                  <button onClick={() => removeTodo(todo.id)} className="p-1 text-slate-400 hover:text-error shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              {todos.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Belum ada task. Tambahkan di bawah.</p>}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 px-3 py-2.5 bg-secondary-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-400 outline-none" placeholder="Tambah task..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} />
              <button onClick={addTodo} className="px-3 py-2.5 bg-primary-container text-white rounded-lg hover:bg-primary-400 transition-colors"><Plus className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Daily Goal */}
          <div className="bg-primary-container p-6 rounded-xl md:col-span-2 text-white overflow-hidden relative">
            <div className="z-10 relative">
              <h4 className="font-[var(--font-heading)] text-xl font-semibold mb-1">Target Hari Ini</h4>
              <p className="text-sm opacity-80 mb-4">
                {pomodoroCount >= dailyGoal ? "Target tercapai! Kerja bagus!" : `${pomodoroCount} dari ${dailyGoal} pomodoro (${Math.round(goalProgress)}%)`}
              </p>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-all duration-500" style={{ width: `${goalProgress}%` }} />
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10"><Brain className="w-32 h-32" /></div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white border border-primary-50 p-6 rounded-xl shadow-sm md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container flex items-center gap-2">
                <Trophy className="w-5 h-5" /> Study Leaderboard
              </h3>
              <span className="text-xs text-secondary font-semibold uppercase tracking-wider">All Time</span>
            </div>
            {leaderboard.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Belum ada data. Selesaikan pomodoro pertamamu!</p>
            ) : (
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, idx) => {
                  const rank = idx + 1;
                  const isMe = entry.user_id === currentUserId;
                  return (
                    <div key={entry.user_id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${rank === 1 ? "bg-yellow-50" : isMe ? "bg-primary-50/50" : "hover:bg-secondary-100"}`}>
                      <div className="flex items-center gap-4">
                        <span className="w-6 text-center">
                          {rank === 1 ? <Trophy className="w-5 h-5 text-yellow-500 mx-auto" /> : rank === 2 ? <Medal className="w-5 h-5 text-slate-400 mx-auto" /> : rank === 3 ? <Medal className="w-5 h-5 text-amber-600 mx-auto" /> : <span className="text-sm font-bold text-slate-400">{rank}</span>}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center text-white text-xs font-bold">{getInitials(entry.name)}</div>
                        <div>
                          <p className="font-semibold text-primary-container text-sm">
                            {entry.name} {isMe && <span className="text-[10px] bg-primary-400 text-white px-1.5 py-0.5 rounded-full ml-1">Kamu</span>}
                          </p>
                          <p className="text-[10px] text-secondary">{entry.count} pomodoro</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-container">{entry.minutes}</p>
                        <p className="text-[10px] text-secondary uppercase">Menit</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container">Pengaturan Timer</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-secondary uppercase font-bold tracking-wider">Focus (menit)</label>
                <input type="number" min="1" max="120" className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 outline-none" value={focusDuration} onChange={(e) => setFocusDuration(parseInt(e.target.value) || 25)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-secondary uppercase font-bold tracking-wider">Short Break (menit)</label>
                <input type="number" min="1" max="30" className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 outline-none" value={shortBreakDuration} onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 5)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-secondary uppercase font-bold tracking-wider">Long Break (menit)</label>
                <input type="number" min="1" max="60" className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 outline-none" value={longBreakDuration} onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 15)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-secondary uppercase font-bold tracking-wider">Target Harian (pomodoro)</label>
                <input type="number" min="1" max="20" className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 outline-none" value={dailyGoal} onChange={(e) => setDailyGoal(parseInt(e.target.value) || 8)} />
              </div>
              <button onClick={saveSettings} className="w-full bg-primary-container text-white py-3 rounded-xl font-bold hover:bg-primary-400 transition-all">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
