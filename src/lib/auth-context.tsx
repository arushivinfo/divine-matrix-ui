"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

export const USERNAME_PATTERN = /^[A-Za-z0-9_.]{3,24}$/;

interface AuthState {
  /** False until the saved session has been checked. */
  ready: boolean;
  user: User | null;
  username: string | null;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/** Turns Supabase errors into short, friendly messages. */
function friendly(message: string) {
  if (!message) return "Something went wrong. Please try again.";
  if (/invalid login credentials/i.test(message)) return "Wrong username, email or password.";
  if (/email not confirmed/i.test(message)) return "Please confirm your email first — check your inbox.";
  if (/already registered|already exists/i.test(message)) return "An account with this email already exists.";
  if (/password should be at least/i.test(message)) return "Password must be at least 6 characters.";
  if (/rate limit/i.test(message)) return "Too many attempts. Please wait a minute and try again.";
  if (/failed to fetch|fetch failed|network/i.test(message)) return "Can’t reach the server. Check your connection.";
  return message;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = supabase().auth;
    auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data } = auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (identifier: string, password: string) => {
    let email = identifier.trim();
    if (!email.includes("@")) {
      const { data, error } = await supabase().rpc("email_for_username", { name: email });
      if (error) throw new Error(friendly(error.message));
      if (!data) throw new Error("No account with that username.");
      email = data as string;
    }
    const { error } = await supabase().auth.signInWithPassword({ email, password });
    if (error) throw new Error(friendly(error.message));
  }, []);

  const signUp = useCallback(async (username: string, email: string, password: string) => {
    const { data: free, error: checkError } = await supabase().rpc("username_available", { name: username });
    if (checkError) throw new Error(friendly(checkError.message));
    if (!free) throw new Error("That username is taken. Try another.");
    const { data, error } = await supabase().auth.signUp({ email: email.trim(), password, options: { data: { username } } });
    if (error) throw new Error(friendly(error.message));
    return { needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    await supabase().auth.signOut();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      ready,
      user,
      username: (user?.user_metadata?.username as string | undefined) ?? null,
      signIn,
      signUp,
      signOut,
    }),
    [ready, user, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
