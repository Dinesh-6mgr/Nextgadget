import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login, clearError } from '../redux/slices/authSlice';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();

  const redirect = new URLSearchParams(search).get('redirect') || '/';

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    return () => {
      dispatch(clearError());
    };
  }, [userInfo, navigate, dispatch, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark pt-20">
      <div className="max-w-md w-full">
        <div className="card-dark p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-textSecondary">Login to access your premium gadget collection</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full bg-[#0A0F1C] border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary transition-all text-textMain"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-textSecondary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full bg-[#0A0F1C] border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary transition-all text-textMain"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-textSecondary" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-glow flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Login Now'}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-textSecondary">
            Don't have an account?{' '}
            <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'} className="text-secondary font-bold hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
