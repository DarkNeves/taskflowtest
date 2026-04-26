/*
 * Home — TaskFlow Organic Dashboard
 * Layout principal com header, navegação por abas e conteúdo.
 * Abas: Visão Geral | Nova Demanda | Pendentes | Concluídas
 * Responsive: Horizontal scrollable tabs com scroll automático em mobile
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Plus, ListTodo, CheckCircle, LogOut } from "lucide-react";
import { useTaskStore } from "@/hooks/useTaskStore";
import { useAuth } from "@/contexts/AuthContext";
import VisaoGeral from "./VisaoGeral";
import Adicionar from "./Adicionar";
import Pendentes from "./Pendentes";
import Concluidas from "./Concluidas";

const HERO_PATTERN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663110379201/C7RDYXEdmEZWJ6KTciu3dC/hero-pattern-joJgGxnUM959eVSmk6xN3s.webp";

type TabId = "visao" | "adicionar" | "pendentes" | "concluidas";

const TABS: { id: TabId; label: string; shortLabel?: string; icon: React.ReactNode; hasBadge?: boolean }[] = [
  { id: "visao", label: "Visão Geral", shortLabel: "Geral", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "adicionar", label: "Nova Demanda", shortLabel: "Adicionar", icon: <Plus className="w-4 h-4" /> },
  { id: "pendentes", label: "Pendentes", shortLabel: "Pend.", icon: <ListTodo className="w-4 h-4" />, hasBadge: true },
  { id: "concluidas", label: "Concluídas", shortLabel: "Conc.", icon: <CheckCircle className="w-4 h-4" />, hasBadge: true },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("visao");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { ativas, concluidas, stats, addTask, toggleDone, deleteTask } = useTaskStore();
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await signOut();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest to-teal flex items-center justify-center shadow-[0_2px_8px_rgba(13,59,46,0.25)]">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <span className="font-display font-extrabold text-lg tracking-normal text-foreground">
              Task<span className="text-forest">Flow</span>
            </span>
          </div>

          {/* Header pills + User menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {[
                { count: stats.alta, color: "bg-[#C1292E]", label: "Alta" },
                { count: stats.media, color: "bg-[#E8A838]", label: "Média" },
                { count: stats.baixa, color: "bg-[#2EC4B6]", label: "Baixa" },
              ].map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1 text-[0.75rem] font-medium text-muted-foreground"
                >
                  <span className={`w-2 h-2 rounded-full ${p.color}`} />
                  <span>{p.count}</span>
                  <span className="hidden md:inline">{p.label}</span>
                </div>
              ))}
            </div>

            {/* User menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm font-medium text-foreground"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-forest to-teal flex items-center justify-center text-white text-xs font-bold">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline text-xs max-w-[100px] truncate">
                  {user?.email || "User"}
                </span>
              </motion.button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                      <p className="text-xs text-muted-foreground">Conectado como</p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="sticky top-16 z-40 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-[860px] mx-auto px-3 sm:px-6">
          {/* Scrollable container */}
          <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide gap-2 py-3 sm:py-3.5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const badgeCount =
                tab.id === "pendentes"
                  ? stats.totalAtivas
                  : tab.id === "concluidas"
                  ? stats.totalConcluidas
                  : 0;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  layout
                  className={`
                    relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full
                    font-display font-semibold text-xs sm:text-sm
                    whitespace-nowrap shrink-0
                    transition-all duration-200 ease-out
                    border-2
                    ${
                      isActive
                        ? "bg-forest/10 border-forest text-forest shadow-[0_4px_12px_rgba(13,59,46,0.15)]"
                        : "bg-card border-border text-muted-foreground hover:border-forest/30 hover:text-foreground hover:bg-muted/50"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.hasBadge && badgeCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`
                        text-[0.65rem] sm:text-[0.7rem] font-bold px-1.5 sm:px-2 py-0.5 rounded-full min-w-[20px] text-center
                        ${
                          isActive
                            ? "bg-forest text-white shadow-[0_2px_6px_rgba(13,59,46,0.25)]"
                            : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {badgeCount}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]">
        <img src={HERO_PATTERN} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 max-w-[860px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16">
        {/* Section header */}
        <div className="mb-6">
          <h1 className="font-display font-extrabold text-2xl tracking-normal text-foreground mb-1">
            {activeTab === "visao" && "Visão Geral"}
            {activeTab === "pendentes" && "Pendentes"}
            {activeTab === "adicionar" && "Nova Demanda"}
            {activeTab === "concluidas" && "Concluídas"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {activeTab === "visao" && "Gráficos e insights das suas demandas."}
            {activeTab === "pendentes" && "Demandas ativas ordenadas por prioridade e prazo."}
            {activeTab === "adicionar" && "Preencha os campos e adicione à sua lista."}
            {activeTab === "concluidas" && "Todas as demandas já finalizadas."}
          </p>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "visao" && (
            <motion.div key="visao" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <VisaoGeral stats={stats} />
            </motion.div>
          )}
          {activeTab === "pendentes" && (
            <motion.div key="pendentes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Pendentes tasks={ativas} onToggle={toggleDone} onDelete={deleteTask} />
            </motion.div>
          )}
          {activeTab === "adicionar" && (
            <motion.div key="adicionar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Adicionar onAdd={addTask} />
            </motion.div>
          )}
          {activeTab === "concluidas" && (
            <motion.div key="concluidas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Concluidas tasks={concluidas} onToggle={toggleDone} onDelete={deleteTask} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
