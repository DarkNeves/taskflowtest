import { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface Task {
  id: number;
  userId: string;
  nome: string;
  desc: string;
  data: string;
  hora: string;
  prio: "alta" | "media" | "baixa";
  done: boolean;
  doneAt?: number;
  recurrence?: "none" | "daily" | "weekly" | "monthly";
  ownerName?: string;
  ownerColor?: string;
}

function calculateNextDate(currentDate: string, recurrence?: string): string {
  const date = new Date(currentDate);
  
  switch (recurrence) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "none":
    default:
      return currentDate;
  }
  
  return date.toISOString().split("T")[0];
}

function getStorageKey(userId: string): string {
  return `tf2_tasks_${userId}`;
}

function loadTasks(userId: string): Task[] {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(userId)) || "[]");
  } catch {
    return [];
  }
}

function saveTasks(userId: string, tasks: Task[]) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(tasks));
}

const PRIO_ORDER: Record<string, number> = { alta: 0, media: 1, baixa: 2 };

export function useTaskStore() {
  const { user } = useAuth();
  const userId = user?.id || "";
  
  const [tasks, setTasks] = useState<Task[]>(userId ? loadTasks(userId) : []);

  const persist = useCallback(
    (next: Task[]) => {
      setTasks(next);
      if (userId) {
        saveTasks(userId, next);
      }
    },
    [userId]
  );

  const addTask = useCallback(
    (task: Omit<Task, "id" | "done" | "doneAt" | "userId">) => {
      if (!userId) return;
      const next = [...loadTasks(userId), { ...task, id: Date.now(), userId, done: false }];
      persist(next);
    },
    [userId, persist]
  );

  const editTask = useCallback(
    (id: number, updatedTask: Partial<Task>) => {
      if (!userId) return;
      const next = loadTasks(userId).map((t) =>
        t.id === id ? { ...t, ...updatedTask } : t
      );
      persist(next);
    },
    [userId, persist]
  );

  const toggleDone = useCallback(
    (id: number) => {
      if (!userId) return;
      const current = loadTasks(userId);
      const taskToToggle = current.find((t) => t.id === id);
      
      let next = current.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, doneAt: !t.done ? Date.now() : undefined }
          : t
      );
      
      // Se é uma tarefa com recorrência sendo marcada como concluída
      if (taskToToggle && !taskToToggle.done && taskToToggle.recurrence && taskToToggle.recurrence !== "none") {
        const newDate = calculateNextDate(taskToToggle.data, taskToToggle.recurrence);
        const newTask: Task = {
          ...taskToToggle,
          id: Date.now(),
          done: false,
          doneAt: undefined,
        };
        next.push(newTask);
      }
      
      persist(next);
    },
    [userId, persist]
  );

  const deleteTask = useCallback(
    (id: number) => {
      if (!userId) return;
      const next = loadTasks(userId).filter((t) => t.id !== id);
      persist(next);
    },
    [userId, persist]
  );

  const ativas = useMemo(() => {
    return tasks
      .filter((t) => !t.done)
      .sort((a, b) => {
        const pd = PRIO_ORDER[a.prio] - PRIO_ORDER[b.prio];
        if (pd) return pd;
        const da = new Date(a.data + (a.hora ? "T" + a.hora : "T23:59"));
        const db = new Date(b.data + (b.hora ? "T" + b.hora : "T23:59"));
        return da.getTime() - db.getTime();
      });
  }, [tasks]);

  const concluidas = useMemo(() => {
    return tasks.filter((t) => t.done).sort((a, b) => (b.doneAt || b.id) - (a.doneAt || a.id));
  }, [tasks]);

  const stats = useMemo(() => {
    const active = tasks.filter((t) => !t.done);
    const done = tasks.filter((t) => t.done);
    const total = tasks.length;
    const pct = total ? Math.round((done.length / total) * 100) : 0;

    const now = new Date();
    let atrasadas = 0;
    let proximas = 0;
    let noPrazo = 0;

    active.forEach((t) => {
      const d = new Date(t.data + (t.hora ? "T" + t.hora : "T23:59"));
      const diffMs = d.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / 86400000);
      if (diffMs < 0) atrasadas++;
      else if (diffDays <= 2) proximas++;
      else noPrazo++;
    });

    return {
      alta: active.filter((t) => t.prio === "alta").length,
      media: active.filter((t) => t.prio === "media").length,
      baixa: active.filter((t) => t.prio === "baixa").length,
      totalAtivas: active.length,
      totalConcluidas: done.length,
      total,
      pct,
      atrasadas,
      proximas,
      noPrazo,
    };
  }, [tasks]);

  return { tasks, ativas, concluidas, stats, addTask, toggleDone, deleteTask, editTask };
}
