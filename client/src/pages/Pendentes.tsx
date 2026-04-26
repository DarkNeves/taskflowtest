/*
 * Pendentes — Organic Dashboard Design
 * Lista de tarefas ativas organizadas por período (Hoje, Amanhã, Próxima semana)
 * Cards com animação stagger.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Inbox } from "lucide-react";
import TaskCard from "@/components/TaskCard";
import { useTaskStore, type Task } from "@/hooks/useTaskStore";

const EMPTY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663110379201/C7RDYXEdmEZWJ6KTciu3dC/empty-state-illustration-iFgSNPJGFS5HVeyzy4NoSp.webp";

interface Props {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function getTaskSection(taskDate: string): "today" | "tomorrow" | "week" | "later" {
  const taskDateObj = new Date(taskDate);
  taskDateObj.setHours(0, 0, 0, 0);
  
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  if (taskDateObj.getTime() === today.getTime()) return "today";
  if (taskDateObj.getTime() === tomorrow.getTime()) return "tomorrow";
  if (taskDateObj.getTime() <= nextWeek.getTime()) return "week";
  return "later";
}

export default function Pendentes({ tasks, onToggle, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const { editTask } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTask) return;
    editTask(editingTask.id, editingTask);
    setEditingTask(null);
  };

  const filtered = tasks.filter(
    (t) =>
      t.nome.toLowerCase().includes(query.toLowerCase()) ||
      (t.desc || "").toLowerCase().includes(query.toLowerCase())
  );

  const grouped = {
    today: filtered.filter((t) => getTaskSection(t.data) === "today"),
    tomorrow: filtered.filter((t) => getTaskSection(t.data) === "tomorrow"),
    week: filtered.filter((t) => getTaskSection(t.data) === "week"),
    later: filtered.filter((t) => getTaskSection(t.data) === "later"),
  };

  const hasAnyTasks = Object.values(grouped).some((g) => g.length > 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar demanda..."
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>

      {/* Grouped task list */}
      {hasAnyTasks ? (
        <div className="flex flex-col gap-6">
          {/* Hoje */}
          {grouped.today.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-3">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                  Hoje
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {grouped.today.map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={setEditingTask} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Amanhã */}
          {grouped.tomorrow.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-3">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  Amanhã
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {grouped.tomorrow.map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={setEditingTask} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Próxima semana */}
          {grouped.week.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-3">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                  Próxima semana
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {grouped.week.map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={setEditingTask} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Depois */}
          {grouped.later.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-3">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Depois
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {grouped.later.map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={setEditingTask} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center py-12 bg-card rounded-2xl border border-dashed border-border"
        >
          <img src={EMPTY_IMG} alt="Sem tarefas" className="w-32 h-32 object-contain mb-4 opacity-70" />
          <p className="text-muted-foreground text-sm font-medium">
            {query ? "Nenhuma demanda encontrada." : "Nenhuma demanda ativa!"}
          </p>
        </motion.div>
      )}

      {/* Modal de Edição */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSaveEdit}
              className="bg-card border border-border p-6 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <h2 className="text-lg font-bold mb-4 text-foreground">Editar Demanda</h2>
              <div className="space-y-4">
                <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  Nome da demanda
                  <input type="text" value={editingTask.nome} onChange={(e) => setEditingTask({ ...editingTask, nome: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all" required />
                </label>
                <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  Descrição
                  <textarea value={editingTask.desc || ""} onChange={(e) => setEditingTask({ ...editingTask, desc: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all resize-none" rows={3} />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    Data
                    <input type="date" value={editingTask.data} onChange={(e) => setEditingTask({ ...editingTask, data: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all" required />
                  </label>
                  <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    Hora
                    <input type="time" value={editingTask.hora || ""} onChange={(e) => setEditingTask({ ...editingTask, hora: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all" />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditingTask(null)} className="px-4 py-2 font-medium text-sm text-muted-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 font-medium text-sm text-white bg-forest hover:bg-forest/90 rounded-xl transition-colors shadow-sm">
                  Salvar
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
