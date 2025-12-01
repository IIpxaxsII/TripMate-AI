import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    // Check for existing session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
      })
      .catch((err) => {
        console.error('getSession error', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    // Set up auth state listener
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN') {
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    // cleanup
    return () => {
      mounted = false;
      if (data?.subscription && typeof data.subscription.unsubscribe === 'function') {
        data.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || ''
          }
        }
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Signup failed',
          description: error.message
        });
      } else {
        toast({
          title: 'Success!',
          description: 'Account created successfully'
        });

        // OPTIONAL: create or upsert a profile row in your `users` table
        // await supabase.from('users').upsert({
        //   id: data.user.id,
        //   email: data.user.email,
        //   full_name: fullName || ''
        // });
      }

      return { error };
    } catch (err: any) {
      console.error('signUp error', err);
      toast({
        variant: 'destructive',
        title: 'Signup error',
        description: err?.message ?? 'Unknown error'
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: error.message
        });
      }
      return { error };
    } catch (err: any) {
      console.error('signIn error', err);
      toast({
        variant: 'destructive',
        title: 'Login error',
        description: err?.message ?? 'Unknown error'
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Signout failed',
          description: error.message
        });
      }
    } catch (err: any) {
      console.error('signOut error', err);
      toast({
        variant: 'destructive',
        title: 'Signout error',
        description: err?.message ?? 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/#/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Reset failed',
          description: error.message
        });
      } else {
        toast({
          title: 'Check your email',
          description: 'Password reset link has been sent'
        });
      }

      return { error };
    } catch (err: any) {
      console.error('resetPassword error', err);
      toast({
        variant: 'destructive',
        title: 'Reset error',
        description: err?.message ?? 'Unknown error'
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Update failed',
          description: error.message
        });
      } else {
        toast({
          title: 'Success',
          description: 'Password updated successfully'
        });
      }

      return { error };
    } catch (err: any) {
      console.error('updatePassword error', err);
      toast({
        variant: 'destructive',
        title: 'Update error',
        description: err?.message ?? 'Unknown error'
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = Boolean(user);

  const value = useMemo(
    () => ({
      user,
      session,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      loading,
      isAuthenticated
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
