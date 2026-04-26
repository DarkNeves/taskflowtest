/*
 * Concluidas — Organic Dashboard Design
 * Lista de tarefas concluídas com busca.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import TaskCard from "@/components/TaskCard";
import { useTaskStore, type Task } from "@/hooks/useTaskStore";

const SUCCESS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663110379201/C7RDYXEdmEZWJ6KTciu3dC/success-illustration-ci38HG89Hy4FNXQKKAGzYp.webp";

interface Props {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function Concluidas({ tasks, onToggle, onDelete }: Props) {
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar concluída..."
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={setEditingTask} />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-12 bg-card rounded-2xl border border-dashed border-border"
            >
              <img src={SUCCESS_IMG} alt="Nenhuma concluída" className="w-28 h-28 object-contain mb-4 opacity-60" />
              <p className="text-muted-foreground text-sm font-medium">
                {query ? "Nenhuma concluída encontrada." : "Nenhuma concluída ainda."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
