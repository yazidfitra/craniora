"use client";

import { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Users,
  History,
  User,
  RotateCcw,
  X,
  Save,
  FolderOpen,
} from "lucide-react";

interface SpinResult {
  name: string;
  label: string;
  time: string;
  color: string;
}

interface Session {
  id: string;
  label: string;
  participants: string[];
}

const COLORS = [
  "#fecaca", "#fed7aa", "#fef08a", "#bbf7d0",
  "#bfdbfe", "#ddd6fe", "#fbcfe8", "#e2e8f0",
  "#fca5a5", "#fdba74", "#fde047", "#86efac",
  "#93c5fd", "#c4b5fd", "#f9a8d4", "#cbd5e1",
];

const TEXT_COLORS = [
  "#991b1b", "#9a3412", "#854d0e", "#166534",
  "#1e40af", "#5b21b6", "#9d174d", "#334155",
  "#991b1b", "#9a3412", "#854d0e", "#166534",
  "#1e40af", "#5b21b6", "#9d174d", "#334155",
];

export default function DrawStrawPage() {
  const [participants, setParticipants] = useState<string[]>(["Peserta 1", "Peserta 2", "Peserta 3"]);
  const [newName, setNewName] = useState("");
  const [sessionLabel, setSessionLabel] = useState("Pilih Giliran");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const addParticipant = () => {
    const name = newName.trim();
    if (!name || participants.includes(name)) return;
    setParticipants((prev) => [...prev, name]);
    setNewName("");
  };

  const removeParticipant = (idx: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== idx));
  };

  // Session management
  const saveSession = () => {
    if (!sessionLabel.trim() || participants.length === 0) return;
    const newSession: Session = {
      id: Date.now().toString(),
      label: sessionLabel,
      participants: [...participants],
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const loadSession = (session: Session) => {
    setSessionLabel(session.label);
    setParticipants([...session.participants]);
    setWinner(null);
    setShowSessions(false);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const spin = () => {
    if (participants.length < 2 || spinning) return;
    setSpinning(true);
    setWinner(null);

    const extraSpins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + extraSpins * 360 + randomAngle;
    setRotation(totalRotation);

    setTimeout(() => {
      const segmentAngle = 360 / participants.length;
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const winnerIndex = Math.floor(normalizedAngle / segmentAngle);
      const selected = participants[winnerIndex % participants.length];

      setWinner(selected);
      setHistory((prev) => [
        {
          name: selected,
          label: sessionLabel,
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          color: COLORS[winnerIndex % COLORS.length],
        },
        ...prev.slice(0, 19),
      ]);
      setSpinning(false);
    }, 4000);
  };

  const reset = () => {
    setWinner(null);
    setRotation(0);
  };

  // SVG wheel rendering
  const renderWheel = () => {
    const size = 300;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 4;
    const n = participants.length;

    if (n === 0) {
      return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          <circle cx={cx} cy={cy} r={r} fill="#e2e8f0" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-sm" fill="#94a3b8">
            Tambah peserta
          </text>
        </svg>
      );
    }

    const segAngle = 360 / n;
    const segments = participants.map((name, i) => {
      const startAngle = (segAngle * i - 90) * (Math.PI / 180);
      const endAngle = (segAngle * (i + 1) - 90) * (Math.PI / 180);
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = segAngle > 180 ? 1 : 0;
      const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;

      // Label position: middle of segment, 60% from center
      const midAngle = (segAngle * i + segAngle / 2 - 90) * (Math.PI / 180);
      const labelR = r * 0.62;
      const lx = cx + labelR * Math.cos(midAngle);
      const ly = cy + labelR * Math.sin(midAngle);
      const textRotation = segAngle * i + segAngle / 2;

      const displayName = name.length > 10 ? name.slice(0, 10) + ".." : name;

      return (
        <g key={i}>
          <path d={d} fill={COLORS[i % COLORS.length]} stroke="white" strokeWidth="2" />
          <text
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textRotation}, ${lx}, ${ly})`}
            fill={TEXT_COLORS[i % TEXT_COLORS.length]}
            fontSize={n > 8 ? "9" : n > 5 ? "11" : "13"}
            fontWeight="700"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {displayName}
          </text>
        </g>
      );
    });

    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {segments}
        {/* Center circle */}
        <circle cx={cx} cy={cy} r="20" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
        <circle cx={cx} cy={cy} r="7" fill="#001b46" />
      </svg>
    );
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 py-8 pb-24">
      {/* Wheel Section */}
      <section className="flex flex-col items-center mb-12">
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-8 border-secondary-100 shadow-2xl" />

          {/* The wheel (SVG) */}
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
            }}
          >
            {renderWheel()}
          </div>

          {/* Indicator arrow */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-primary-container drop-shadow-md" />
        </div>

        {/* Winner */}
        {winner && (
          <div className="mt-6 bg-success/10 border border-success/30 rounded-xl px-6 py-4 text-center">
            <p className="text-xs text-success font-bold uppercase tracking-wider mb-1">Terpilih!</p>
            <p className="font-[var(--font-heading)] text-2xl font-bold text-primary-container">{winner}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={spin}
            disabled={spinning || participants.length < 2}
            className="px-10 py-4 bg-primary-container text-white font-[var(--font-heading)] text-xl font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {spinning ? "Spinning..." : "SPIN"}
          </button>
          {winner && (
            <button onClick={reset} className="px-4 py-4 border-2 border-primary-container text-primary-container rounded-xl hover:bg-primary-50 transition-all">
              <RotateCcw className="w-6 h-6" />
            </button>
          )}
        </div>
      </section>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        {/* Participants */}
        <aside className="md:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container flex items-center gap-2">
              <Users className="w-5 h-5" /> Peserta
            </h2>
            <span className="text-xs text-secondary">{participants.length} orang</span>
          </div>

          <div className="bg-surface-card border border-primary-50 rounded-xl p-4 flex flex-col gap-3">
            {participants.map((name, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: COLORS[idx % COLORS.length] + "40" }}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="font-medium text-primary-container text-sm">{name}</span>
                </div>
                <button onClick={() => removeParticipant(idx)} className="p-1 text-slate-400 hover:text-error transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2.5 bg-secondary-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                placeholder="Nama peserta..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addParticipant()}
              />
              <button onClick={addParticipant} className="px-3 py-2.5 bg-primary-container text-white rounded-lg hover:bg-primary-400 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Session Info */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-primary-50 p-6 shadow-sm">
            <span className="text-xs text-primary-400 uppercase tracking-widest font-bold mb-1 block">Sesi Aktif</span>
            <input
              className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container bg-transparent border-none outline-none focus:ring-0 w-full mb-2"
              value={sessionLabel}
              onChange={(e) => setSessionLabel(e.target.value)}
              placeholder="Nama sesi..."
            />
            <p className="text-on-surface-variant text-sm max-w-md mb-6">
              Putar roda untuk memilih peserta secara acak.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-success rounded-full" /> {participants.length} Peserta
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-on-surface-variant rounded-full text-sm font-medium">
                <History className="w-4 h-4" /> {history.length} Spin
              </div>
            </div>
          </div>

          {/* Session Actions */}
          <div className="flex gap-3">
            <button
              onClick={saveSession}
              disabled={!sessionLabel.trim() || participants.length === 0}
              className="flex items-center gap-2 px-5 py-3 bg-primary-container text-white rounded-xl text-sm font-bold hover:bg-primary-400 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Simpan Sesi
            </button>
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="flex items-center gap-2 px-5 py-3 border-2 border-primary-container text-primary-container rounded-xl text-sm font-bold hover:bg-primary-50 transition-all"
            >
              <FolderOpen className="w-4 h-4" /> Sesi Tersimpan ({sessions.length})
            </button>
          </div>

          {/* Saved Sessions List */}
          {showSessions && (
            <div className="bg-surface-card border border-primary-50 rounded-xl p-4 space-y-3">
              <h3 className="font-[var(--font-heading)] text-base font-semibold text-primary-container mb-2">Sesi Tersimpan</h3>
              {sessions.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">Belum ada sesi tersimpan.</p>
              ) : (
                sessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-secondary-100 rounded-lg">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => loadSession(s)}>
                      <p className="font-semibold text-primary-container text-sm truncate">{s.label}</p>
                      <p className="text-xs text-secondary">{s.participants.length} peserta: {s.participants.slice(0, 3).join(", ")}{s.participants.length > 3 ? "..." : ""}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button onClick={() => loadSession(s)} className="text-xs text-primary-400 font-bold hover:underline">Muat</button>
                      <button onClick={() => deleteSession(s.id)} className="p-1 text-slate-400 hover:text-error transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <section className="border-t border-primary-50 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container flex items-center gap-2">
              <History className="w-5 h-5" /> Riwayat Spin
            </h2>
            <button onClick={() => setHistory([])} className="text-xs text-error font-bold hover:underline">Hapus Semua</button>
          </div>
          <div className="space-y-4">
            {history.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between py-4 border-b border-primary-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: h.color }}>
                    <User className="w-5 h-5" style={{ color: TEXT_COLORS[idx % TEXT_COLORS.length] }} />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-primary-container">{h.name}</p>
                    <p className="text-xs text-on-surface-variant">{h.label}</p>
                  </div>
                </div>
                <span className="text-sm text-outline">{h.time}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
