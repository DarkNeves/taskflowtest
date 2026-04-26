import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Mail, Lock } from "lucide-react";

type AuthMode = "signin" | "signup";

export default function Login() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();

  const { loading, error, signIn, signUp, user } = useAuth();

  // Redirecionar se já logado
  if (user) {
    setLocation("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    if (mode === "signup") {
      if (!fullName) {
        return;
      }
      const result = await signUp(email, password, fullName);
      if (!result.error) {
        setLocation("/");
      }
    } else {
      const result = await signIn(email, password);
      if (!result.error) {
        setLocation("/");
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-background to-card">
      {/* Header with logo */}
      <header className="sticky top-0 z-50 bg-card/30 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 h-16 flex items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest to-teal flex items-center justify-center shadow-[0_2px_8px_rgba(13,59,46,0.25)]">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <span className="font-display font-extrabold text-lg tracking-normal text-foreground">
              Task<span className="text-forest">Flow</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Form container */}
          <div className="bg-card border border-border rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Header section */}
            <div className="px-6 sm:px-8 pt-8 pb-6">
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <h1 className="font-display font-extrabold text-2xl text-foreground mb-2">
                  {mode === "signin" ? "Bem-vindo!" : "Criar conta"}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {mode === "signin"
                    ? "Faça login para acessar suas tarefas"
                    : "Crie uma conta para começar a usar o TaskFlow"}
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-8">
              <motion.div
                className="space-y-4"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                animate="visible"
              >
                {/* Error alert */}
                {error && (
                  <motion.div variants={itemVariants}>
                    <Alert
                      variant="destructive"
                      className="bg-destructive/10 border-destructive/30"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Full name input (signup only) */}
                {mode === "signup" && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Nome completo
                    </label>
                    <Input
                      type="text"
                      placeholder="Seu nome"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                      className="h-11 rounded-lg border-border bg-card/50 focus:bg-card"
                    />
                  </motion.div>
                )}

                {/* Email input */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="h-11 rounded-lg border-border bg-card/50 focus:bg-card pl-10"
                    />
                  </div>
                </motion.div>

                {/* Password input */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-11 rounded-lg border-border bg-card/50 focus:bg-card pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Submit button */}
                <motion.div variants={itemVariants} className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full h-11 font-semibold rounded-lg bg-forest hover:bg-forest-light text-card transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-card border-t-card/30 animate-spin" />
                        {mode === "signin"
                          ? "Entrando..."
                          : "Criando conta..."}
                      </div>
                    ) : mode === "signin" ? (
                      "Entrar"
                    ) : (
                      "Criar conta"
                    )}
                  </Button>
                </motion.div>

                {/* Toggle button */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-center pt-4"
                >
                  <p className="text-sm text-muted-foreground">
                    {mode === "signin"
                      ? "Não tem conta? "
                      : "Já tem conta? "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode(mode === "signin" ? "signup" : "signin");
                        setFullName("");
                        setEmail("");
                        setPassword("");
                      }}
                      disabled={loading}
                      className="font-semibold text-forest hover:text-forest-light transition-colors"
                    >
                      {mode === "signin" ? "Criar conta" : "Fazer login"}
                    </button>
                  </p>
                </motion.div>
              </motion.div>
            </form>

            {/* Footer info */}
            <div className="px-6 sm:px-8 py-4 bg-muted/30 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                Seus dados são salvos de forma segura no Supabase
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
