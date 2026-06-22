import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../supabaseClient";

// Mock auth helpers using localStorage
const getMockUser = () => {
  try {
    const stored = localStorage.getItem("mock_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};
const setMockUser = (user) => {
  localStorage.setItem("mock_user", JSON.stringify(user));
};
const clearMockUser = () => {
  localStorage.removeItem("mock_user");
};

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async (email, password) => {},
  signup: async (email, password, fullName) => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialise session on mount
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const mock = getMockUser();
      if (mock) setUser(mock);
      setLoading(false);
      return;
    }
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Error getting session", error);
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (!isSupabaseConfigured) {
      const mock = getMockUser();
      if (mock && mock.email === email && mock.password === password) {
        setUser(mock);
        return;
      }
      throw new Error("Invalid credentials for mock auth");
    }
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error);
      throw error;
    }
    // Supabase v2 returns user via data.session?.user or data.user
    const loggedInUser = data?.session?.user ?? data?.user;
    setUser(loggedInUser);
  };

  const signup = async (email, password, fullName) => {
    if (!isSupabaseConfigured) {
      const mockUser = { id: Date.now().toString(), email, password, full_name: fullName };
      setMockUser(mockUser);
      setUser(mockUser);
      return;
    }
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) {
      console.error('Signup error:', error);
      throw error;
    }
    const signedUpUser = data?.session?.user ?? data?.user;

    // Insert the new user into the public.users table so they appear in the DB
    if (signedUpUser) {
      const { error: insertError } = await supabase.from('users').insert({
        id: signedUpUser.id,
        email: email,
        full_name: fullName,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
        response_time: 'פחות משעה',
        location: 'לא צוין',
        joined_at: new Date().toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })
      });
      if (insertError) {
        console.error('Error inserting into public.users:', insertError);
      }
    }

    setUser(signedUpUser);
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      clearMockUser();
      setUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
