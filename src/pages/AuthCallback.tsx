
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data.session) {
          // User is authenticated
          toast({
            title: "Successfully authenticated",
            description: "Welcome to Outsmash!"
          });
          
          // Check if profile is complete
          const { data: profileData } = await supabase
            .from('profiles')
            .select('is_profile_complete')
            .eq('id', data.session.user.id)
            .single();

          if (profileData?.is_profile_complete) {
            navigate('/dashboard');
          } else {
            navigate('/profile-setup');
          }
        } else {
          // No session, redirect to login
          toast({
            variant: "destructive",
            title: "Authentication failed",
            description: "Please try logging in again."
          });
          navigate('/login');
        }
      } catch (error: any) {
        console.error('Authentication error:', error);
        setError(error.message || 'An error occurred during authentication');
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: error.message || 'An error occurred during authentication'
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-foreground">Authenticating...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-destructive text-lg mb-4">Authentication Error</div>
        <p className="text-muted-foreground">{error}</p>
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
