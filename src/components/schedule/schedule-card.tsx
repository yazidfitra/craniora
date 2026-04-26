import { Clock, MapPin, Trash2, User, StickyNote, ExternalLink, Users } from "lucide-react";
import type { Schedule } from "@/types/schedule";
import { CATEGORY_COLORS } from "@/types/schedule";

interface ScheduleCardProps {
  schedule: Schedule;
  isActive?: boolean;
  onDelete: (id: string) => void;
}

export default function ScheduleCard({
  schedule,
  isActive,
  onDelete,
}: ScheduleCardProps) {
  const formatTime = (time: string) => time.slice(0, 5);
  const categoryStyle = CATEGORY_COLORS[schedule.category || "KP"] || CATEGORY_COLORS.KP;
  const isPleno = schedule.category === "Pleno";
  const lecturers = schedule.lecturer?.split(";").map((l) => l.trim()).filter(Boolean) || [];

  return (
    <div className={`relative pl-6 border-l-4 ${isActive ? "border-primary-container" : "border-slate-200"}`}>
      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ring-4 ring-white ${isActive ? "bg-primary-container" : "bg-slate-200"}`} />

      <div className={`bg-white rounded-xl p-6 shadow-sm border border-primary-50 hover:shadow-md transition-all ${isActive ? "shadow-[0_4px_20px_rgba(0,27,70,0.05)]" : "opacity-90"}`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider ${isActive ? "bg-success/10 text-success" : "bg-primary-50 text-primary-400"}`}>
                {isActive ? "Sedang Berlangsung" : "Mendatang"}
              </span>
              {schedule.category && (
                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${categoryStyle}`}>
                  {schedule.category}
                </span>
              )}
            </div>
            <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container">
              {schedule.subject}
            </h3>
          </div>
          <div className="text-right">
            <div className={`flex items-center justify-end font-semibold ${isActive ? "text-primary-container" : "text-secondary"}`}>
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-base">{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
            </div>
            {schedule.room && (
              <p className="text-secondary text-sm flex items-center justify-end gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> {schedule.room}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        {schedule.notes && (
          <div className="mb-4 px-4 py-3 bg-secondary-100 rounded-lg flex items-start gap-3">
            <StickyNote className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
            <p className="text-sm text-on-surface whitespace-pre-line">{schedule.notes}</p>
          </div>
        )}

        {/* Material Link */}
        {schedule.material_url && (
          <div className="mb-4">
            <a href={schedule.material_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-lg hover:bg-primary-fixed transition-colors group">
              <ExternalLink className="w-4 h-4 text-primary-400 shrink-0" />
              <span className="text-sm text-primary-container font-medium truncate flex-1">{schedule.material_name || "Link Materi Dosen"}</span>
              <span className="text-[10px] text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">Buka</span>
            </a>
          </div>
        )}

        {/* Lecturers */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
          {lecturers.length > 0 && (
            <>
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                {isPleno ? <Users className="w-5 h-5 text-primary-400" /> : <User className="w-5 h-5 text-primary-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-secondary font-medium tracking-wide">
                  {isPleno ? `Narasumber (${lecturers.length})` : "Dosen Pengampu"}
                </p>
                {isPleno ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {lecturers.map((l, i) => (
                      <span key={i} className="text-sm text-primary-container font-semibold bg-primary-50 px-2 py-0.5 rounded">
                        {l}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-primary-container font-semibold">{lecturers[0]}</p>
                )}
              </div>
            </>
          )}
          {lecturers.length === 0 && <div className="flex-1" />}
          <button onClick={() => onDelete(schedule.id)} className="flex items-center justify-center w-10 h-10 rounded-full bg-error/5 text-error hover:bg-error hover:text-white transition-all" title="Hapus jadwal">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
