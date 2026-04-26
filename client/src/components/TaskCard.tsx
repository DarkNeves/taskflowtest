/*
 * TaskCard — Organic Dashboard Design
 * Card com borda lateral colorida por prioridade, sombra difusa, hover com elevação.
 * Cores: alta=#C1292E, media=#E8A838, baixa=#2EC4B6
 */
import { motion } from "framer-motion";
import { Check, Undo2, Trash2, Calendar, Clock } from "lucide-react";
import type { Task } from "@/hooks/useTaskStore";

const PRIO_COLORS: Record<string, { border: string; bg: string; text: string; label: string }> = {
  alta: { border: "border-l-[#C1292E]", bg: "bg-[#FEE2E2]", text: "text-[#C1292E]", label: "Alta" },
  media: { border: "border-l-[#E8A838]", bg: "bg-[#FEF9C3]", text: "text-[#92400E]", label: "Média" },
  baixa: { border: "border-l-[#2EC4B6]", bg: "bg-[#D0F5E0]", text: "text-[#0D3B2E]", label: "Baixa" },
};

function fmtDate(str: string) {
  const [y, m, d] = str.split("-");
  return `${d}/${m}/${y}`;
}

function deadlineInfo(data: string, hora: string) {
  const now = new Date();
  const d = new Date(data + (hora ? "T" + hora : "T23:59"));
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / 86400000);

  if (diffMs < 0)
    return {
      label: `Atrasado! ${fmtDate(data)}${hora ? " às " + hora : ""}`,
      cls: "text-[#C1292E] font-semibold",
    };
  if (diffDays === 0)
    return {
      label: hora ? `Hoje às ${hora}` : "Hoje!",
      cls: "text-[#D97706] font-semibold",
    };
  if (diffDays <= 2)
    return {
      label: `${diffDays}d · ${hora || fmtDate(data)}`,
      cls: "text-[#D97706]",
    };
  return {
    label: hora ? `${fmtDate(data)} às ${hora}` : fmtDate(data),
    cls: "text-muted-foreground",
  };
}

interface Props {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  const prio = PRIO_COLORS[task.prio] || PRIO_COLORS.media;
  const dl = deadlineInfo(task.data, task.hora);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
      className={`
        group relative bg-card rounded-2xl border border-border overflow-hidden
        border-l-4 ${prio.border}
        shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        hover:-translate-y-0.5 transition-all duration-300
        p-4 sm:p-5 flex items-start gap-3 sm:gap-4
        ${task.done ? "opacity-60 bg-muted/30 grayscale-[0.5]" : ""}
      `}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span
            className={`font-display font-bold text-[0.95rem] leading-snug transition-colors duration-300 ${
              task.done ? "line-through text-muted-foreground opacity-70" : "text-foreground"
            }`}
          >
            {task.nome}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${prio.bg} ${prio.text}`}
          >
            {prio.label}
          </span>
          {task.ownerName && (
            <span
              className="inline-flex items-center gap-1 text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: task.ownerColor || "#2EC4B6" }}
            >
              {task.ownerName}
            </span>
          )}
        </div>

        {task.desc && (
          <p className="text-[0.82rem] text-muted-foreground leading-relaxed mb-2.5 line-clamp-2">
            {task.desc}
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-[0.76rem] font-medium ${task.done ? "text-muted-foreground" : dl.cls}`}>
            <Calendar className="w-3 h-3" />
            {task.done ? fmtDate(task.data) + (task.hora ? " às " + task.hora : "") : dl.label}
          </span>
          {task.hora && !task.done && (
            <span className="inline-flex items-center gap-1 text-[0.76rem] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {task.hora}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2 shrink-0 self-start sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={() => onToggle(task.id)}
          title={task.done ? "Reabrir" : "Concluir"}
          className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full border bg-card flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm ${
            task.done 
              ? "border-success text-success bg-success-light hover:bg-success/20" 
              : "border-border text-muted-foreground hover:bg-success-light hover:border-success hover:text-success"
          }`}
        >
          {task.done ? <Undo2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          title="Excluir"
          className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-danger-light hover:border-danger hover:text-danger hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
        >
          <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
