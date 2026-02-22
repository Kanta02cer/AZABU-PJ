import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="ri-shield-keyhole-line text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A2E]">管理者ログイン</h1>
          <p className="text-sm text-[#64748B] mt-2">AZABU+ CMS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              <i className="ri-error-warning-line mr-2"></i>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-2">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-all text-[#1A1A2E]"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-2">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-all text-[#1A1A2E]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white font-bold text-base shadow-lg shadow-[#FF6B00]/25 hover:shadow-xl hover:shadow-[#FF6B00]/35 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin"></i>
                ログイン中...
              </span>
            ) : (
              'ログイン'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-[#64748B] hover:text-[#FF6B00] transition-colors">
            <i className="ri-arrow-left-line mr-1"></i>
            サイトに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
