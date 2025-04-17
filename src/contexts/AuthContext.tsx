import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Define the options type for signIn
type SignInOptions = {
  redirectTo?: string;
};

// Define the context type
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isProfileComplete: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string, options?: SignInOptions) => Promise<void>;
  signOut: () => Promise<void>;
  setProfileComplete: (complete: boolean) => void;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isProfileComplete: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  setProfileComplete: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkProfileCompletion(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          checkProfileCompletion(session.user.id);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Check if user has completed their profile
  const checkProfileCompletion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_profile_complete')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      setIsProfileComplete(data?.is_profile_complete || false);
    } catch (error) {
      console.error('Error checking profile completion:', error);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created successfully",
        description: "Please check your email for verification"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message
      });
      throw error;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string, options?: SignInOptions) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        ...(options?.redirectTo ? { options: { redirectTo: options.redirectTo } } : {})
      });
      
      if (error) throw error;
      
      toast({
        title: "Login Successful",
        description: "Welcome back!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message
      });
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully"
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message
      });
    }
  };

  // Update profile completion status
  const setProfileComplete = (complete: boolean) => {
    setIsProfileComplete(complete);
  };

  const value = {
    session,
    user,
    loading,
    isProfileComplete,
    signUp,
    signIn,
    signOut,
    setProfileComplete
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
