/*
 * VisaoGeral — Organic Dashboard Design
 * Apenas gráficos e insights. Sem lista de tarefas.
 * Cards com sombra difusa, gradientes naturais, tipografia Syne.
 */
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { AlertTriangle, Clock, CheckCircle2, TrendingUp, Leaf } from "lucide-react";

interface Stats {
  alta: number;
  media: number;
  baixa: number;
  totalAtivas: number;
  totalConcluidas: number;
  total: number;
  pct: number;
  atrasadas: number;
  proximas: number;
  noPrazo: number;
}

const INSIGHTS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663110379201/C7RDYXEdmEZWJ6KTciu3dC/insights-bg-GFfHLzzodQZS9S9KzLQaVz.webp";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } } as const,
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
};

export default function VisaoGeral({ stats }: { stats: Stats }) {
  const prioData = [
    { name: "Alta", value: stats.alta, color: "#C1292E" },
    { name: "Média", value: stats.media, color: "#E8A838" },
    { name: "Baixa", value: stats.baixa, color: "#2EC4B6" },
  ].filter((d) => d.value > 0);

  const statusData = [
    { name: "Atrasadas", value: stats.atrasadas, color: "#C1292E" },
    { name: "Próximas", value: stats.proximas, color: "#E8A838" },
    { name: "No prazo", value: stats.noPrazo, color: "#2EC4B6" },
  ];

  const barData = [
    { name: "Alta", quantidade: stats.alta, fill: "#C1292E" },
    { name: "Média", quantidade: stats.media, fill: "#E8A838" },
    { name: "Baixa", quantidade: stats.baixa, fill: "#2EC4B6" },
  ];

  const hasData = stats.total > 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Hero insight card */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      >
        <img
          src={INSIGHTS_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 p-6 sm:p-8 bg-gradient-to-r from-[#0D3B2E]/80 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-display font-bold text-xl tracking-normal text-white">Visão Geral</h2>
          </div>
          <p className="text-white/80 text-sm max-w-md leading-relaxed">
            Acompanhe o progresso das suas demandas com gráficos e insights em tempo real.
          </p>
          <div className="mt-5 flex items-center gap-6 flex-wrap">
            <div>
              <div className="font-display font-extrabold text-3xl text-white">{stats.pct}%</div>
              <div className="text-white/60 text-xs font-medium mt-0.5">Concluído</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <div className="font-display font-extrabold text-3xl text-white">{stats.totalAtivas}</div>
              <div className="text-white/60 text-xs font-medium mt-0.5">Pendentes</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <div className="font-display font-extrabold text-3xl text-white">{stats.totalConcluidas}</div>
              <div className="text-white/60 text-xs font-medium mt-0.5">Concluídas</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        variants={itemVariants}
        className="bg-card rounded-2xl border border-border p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-display font-bold text-sm text-foreground">Progresso geral</span>
          <span className="text-sm font-semibold text-forest">
            {stats.pct}% ({stats.totalConcluidas}/{stats.total})
          </span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-forest to-teal"
            initial={{ width: 0 }}
            animate={{ width: `${stats.pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Status insight cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-xl bg-danger-light flex items-center justify-center mb-2">
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>
          <div className="font-display font-extrabold text-2xl text-danger">{stats.atrasadas}</div>
          <div className="text-[0.7rem] font-medium text-muted-foreground mt-0.5">Atrasadas</div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-xl bg-amber-light flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-amber" />
          </div>
          <div className="font-display font-extrabold text-2xl text-amber">{stats.proximas}</div>
          <div className="text-[0.7rem] font-medium text-muted-foreground mt-0.5">Próximas</div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4 text-teal" />
          </div>
          <div className="font-display font-extrabold text-2xl text-teal">{stats.noPrazo}</div>
          <div className="text-[0.7rem] font-medium text-muted-foreground mt-0.5">No prazo</div>
        </div>
      </motion.div>

      {/* Charts row */}
      {hasData ? (
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pie chart — prioridade */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <h3 className="font-display font-bold text-sm text-foreground mb-4">
              Distribuição por Prioridade
            </h3>
            {prioData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={prioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {prioData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      fontSize: "0.82rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                Sem dados
              </div>
            )}
            <div className="flex justify-center gap-4 mt-2">
              {[
                { label: "Alta", color: "#C1292E" },
                { label: "Média", color: "#E8A838" },
                { label: "Baixa", color: "#2EC4B6" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Bar chart — status de prazo */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <h3 className="font-display font-bold text-sm text-foreground mb-4">
              Status de Prazo
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    fontSize: "0.82rem",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl border border-dashed border-border p-10 flex flex-col items-center text-center"
        >
          <Leaf className="w-10 h-10 text-teal mb-3 opacity-50" />
          <p className="text-muted-foreground text-sm font-medium">
            Adicione demandas para ver gráficos e insights aqui.
          </p>
        </motion.div>
      )}

      {/* Priority breakdown */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Alta", count: stats.alta, icon: "text-[#C1292E]", bg: "bg-[#FEE2E2]", dot: "#C1292E" },
          { label: "Média", count: stats.media, icon: "text-[#92400E]", bg: "bg-[#FEF9C3]", dot: "#E8A838" },
          { label: "Baixa", count: stats.baixa, icon: "text-[#0D3B2E]", bg: "bg-[#D0F5E0]", dot: "#2EC4B6" },
        ].map((p) => (
          <div
            key={p.label}
            className="bg-card rounded-2xl border border-border p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.dot }} />
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {p.label}
              </span>
            </div>
            <div className={`font-display font-extrabold text-2xl ${p.icon}`}>{p.count}</div>
            <div className="text-[0.72rem] text-muted-foreground mt-0.5">ativas</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
