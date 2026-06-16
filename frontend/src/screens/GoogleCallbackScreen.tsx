import { clearOAuthHash, parseGoogleCallback } from '@/lib/googleAuth';
import { selectUser, setUser } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

const GoogleCallbackScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [message, setMessage] = useState('Completing Google sign-in…');
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const finish = async () => {
      const parsed = parseGoogleCallback(window.location);

      if (!parsed) {
        if (user) {
          navigate('/', { replace: true });
          return;
        }
        setMessage('Invalid Google sign-in response.');
        toast.error('Google sign-in failed. Please try again.');
        clearOAuthHash();
        navigate('/login', { replace: true });
        return;
      }

      if (parsed.error) {
        setMessage(parsed.error);
        toast.error(parsed.error);
        clearOAuthHash();
        navigate('/login', { replace: true });
        return;
      }

      if (!parsed.user) {
        setMessage('Invalid Google sign-in response.');
        toast.error('Google sign-in failed. Please try again.');
        clearOAuthHash();
        navigate('/login', { replace: true });
        return;
      }

      dispatch(setUser({ user: parsed.user }));
      clearOAuthHash();
      toast.success('Signed in with Google!');
      navigate('/', { replace: true });
    };

    void finish();
  }, [dispatch, navigate, user]);

  if (user != null) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <p className="text-slate-400">{message}</p>
    </div>
  );
};

export default GoogleCallbackScreen;
