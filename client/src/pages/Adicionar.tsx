/*
 * Adicionar — Organic Dashboard Design
 * Formulário com fluxo rápido: Enter navega Nome → Descrição → Data → Hora → Submit
 * Cards com sombra difusa, bordas suaves, gradiente no botão.
 */
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import type { Task } from "@/hooks/useTaskStore";

interface Props {
  onAdd: (task: Omit<Task, "id" | "done" | "doneAt">) => void;
}

export default function Adicionar({ onAdd }: Props) {
  const [nome, setNome] = useState("");
  const [desc, setDesc] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [prio, setPrio] = useState<"alta" | "media" | "baixa">("media");
  const [recurrence, setRecurrence] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  const [ownerName, setOwnerName] = useState("");
  const [ownerColor, setOwnerColor] = useState("#2EC4B6");

  const nomeRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const dataRef = useRef<HTMLInputElement>(null);
  const horaRef = useRef<HTMLInputElement>(null);
  const ownerNameRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split("T")[0];

  function handleSubmit() {
    if (!nome.trim()) {
      toast.error("Digite o nome da demanda!");
      nomeRef.current?.focus();
      return;
    }
    if (!data) {
      toast.error("Informe a data de entrega!");
      dataRef.current?.focus();
      return;
    }
    onAdd({ 
      nome: nome.trim(), 
      desc: desc.trim(), 
      data, 
      hora, 
      prio, 
      recurrence,
      ownerName: ownerName.trim() || undefined,
      ownerColor: ownerName.trim() ? ownerColor : undefined,
    });
    toast.success("Demanda adicionada!");
    setNome("");
    setDesc("");
    setData("");
    setHora("");
    setPrio("media");
    setRecurrence("none");
    setOwnerName("");
    setOwnerColor("#2EC4B6");
    nomeRef.current?.focus();
  }

  function handleKeyDown(
    e: React.KeyboardEvent,
    nextRef?: React.RefObject<HTMLElement | null>,
    isLast?: boolean
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isLast) {
        handleSubmit();
      } else if (nextRef?.current) {
        nextRef.current.focus();
      }
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center">
            <ClipboardList className="w-4.5 h-4.5 text-forest" />
          </div>
          <h2 className="font-display font-bold text-base text-foreground">Dados da demanda</h2>
        </div>

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Nome da demanda *
            </label>
            <input
              ref={nomeRef}
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, descRef)}
              placeholder="Ex: Relatório mensal de vendas"
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all"
              style={{ fontFamily: "var(--font-body)" }}
              autoFocus
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Descrição
            </label>
            <textarea
              ref={descRef}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  dataRef.current?.focus();
                }
              }}
              placeholder="Descreva brevemente o que precisa ser feito..."
              rows={3}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all resize-y"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <p className="text-[0.68rem] text-muted-foreground mt-1">
              Pressione Shift+Enter para nova linha, Enter para avançar.
            </p>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Data de entrega *
              </label>
              <input
                ref={dataRef}
                type="date"
                value={data}
                min={today}
                onChange={(e) => setData(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, horaRef)}
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
            <div>
              <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Horário limite
              </label>
              <input
                ref={horaRef}
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, undefined, true)}
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Prioridade *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { value: "alta", label: "Alta", activeClasses: "border-[#C1292E] bg-[#FEE2E2] text-[#C1292E]" },
                  { value: "media", label: "Média", activeClasses: "border-[#E8A838] bg-[#FEF9C3] text-[#92400E]" },
                  { value: "baixa", label: "Baixa", activeClasses: "border-[#2EC4B6] bg-[#D0F5E0] text-[#0D3B2E]" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPrio(opt.value)}
                  className={`
                    py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all duration-150
                    ${
                      prio === opt.value
                        ? opt.activeClasses
                        : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50"
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recorrência */}
          <div>
            <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Recorrência
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { value: "none", label: "Não repetir" },
                  { value: "daily", label: "Diariamente" },
                  { value: "weekly", label: "Semanalmente" },
                  { value: "monthly", label: "Mensalmente" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRecurrence(opt.value)}
                  className={`
                    py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all duration-150
                    ${
                      recurrence === opt.value
                        ? "border-forest bg-forest/10 text-forest"
                        : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50"
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Responsável (opcional)
            </label>
            <input
              ref={ownerNameRef}
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Nome da pessoa responsável"
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none transition-all"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>

          {/* Cor do Responsável */}
          {ownerName.trim() && (
            <div>
              <label className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Cor do responsável
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {(
                  [
                    { value: "#2EC4B6", label: "Teal", bg: "bg-[#2EC4B6]" },
                    { value: "#E8A838", label: "Amber", bg: "bg-[#E8A838]" },
                    { value: "#C1292E", label: "Red", bg: "bg-[#C1292E]" },
                    { value: "#7C3AED", label: "Purple", bg: "bg-[#7C3AED]" },
                    { value: "#06B6D4", label: "Cyan", bg: "bg-[#06B6D4]" },
                    { value: "#10B981", label: "Emerald", bg: "bg-[#10B981]" },
                    { value: "#F59E0B", label: "Orange", bg: "bg-[#F59E0B]" },
                    { value: "#EC4899", label: "Pink", bg: "bg-[#EC4899]" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOwnerColor(opt.value)}
                    title={opt.label}
                    className={`
                      h-10 rounded-lg border-2 transition-all duration-150
                      ${opt.bg}
                      ${
                        ownerColor === opt.value
                          ? "border-white shadow-lg scale-110"
                          : "border-white/30 hover:border-white/60 hover:scale-105"
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-forest to-teal text-white font-display font-bold text-[0.95rem] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(13,59,46,0.25)] hover:shadow-[0_6px_22px_rgba(13,59,46,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
          >
            <Plus className="w-4.5 h-4.5" />
            Adicionar demanda
          </button>
          <p className="text-center text-[0.72rem] text-muted-foreground mt-2">
            Dica: pressione Enter para navegar entre os campos rapidamente.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
