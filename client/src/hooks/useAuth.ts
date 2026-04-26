import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (user) {
          setState({
            user: {
              id: user.id,
              email: user.email || "",
              full_name: user.user_metadata?.full_name,
            },
            loading: false,
            error: null,
          });
        } else {
          setState({ user: null, loading: false, error: null });
        }
      } catch (err) {
        setState({
          user: null,
          loading: false,
          error: err instanceof Error ? err.message : "Auth check failed",
        });
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (user) {
        setState({
          user: {
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name,
          },
          loading: false,
          error: null,
        });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName?: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setState({
            user: {
              id: data.user.id,
              email: data.user.email || "",
              full_name: fullName,
            },
            loading: false,
            error: null,
          });
        }

        return { user: data.user, error: null };
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Sign up failed";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
        return { user: null, error: errorMsg };
      }
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setState({
            user: {
              id: data.user.id,
              email: data.user.email || "",
              full_name: data.user.user_metadata?.full_name,
            },
            loading: false,
            error: null,
          });
        }

        return { user: data.user, error: null };
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Sign in failed";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
        return { user: null, error: errorMsg };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState({ user: null, loading: false, error: null });
      return { error: null };
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Sign out failed";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg,
      }));
      return { error: errorMsg };
    }
  }, []);

  return {
    ...state,
    signUp,
    signIn,
    signOut,
  };
}
