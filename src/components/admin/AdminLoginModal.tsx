import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenPortal?: () => void;
}

export const AdminLoginModal: React.FC<Props> = ({ isOpen, onClose, onOpenPortal }) => {
  const { signIn, isAdmin, signOut } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      onClose();
      if (onOpenPortal) {
        onOpenPortal();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md border border-[#e5dfd3] bg-white p-7 text-[#4c0d17] sm:rounded-3xl shadow-[0_10px_40px_rgba(76,13,23,0.1)] [&>button]:!text-[#8a7a6b] [&>button:hover]:!text-[#4c0d17]">
        <DialogHeader className="mb-2 text-center flex flex-col items-center">
          <div className="h-12 w-12 rounded-2xl bg-[#f9f5ec] border border-[#e5dfd3] flex items-center justify-center text-[#b08a47] mb-3">
            <Lock className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8a7a6b] mb-1">Admin Gateway</span>
          <DialogTitle className="font-serif text-3xl font-bold text-[#4c0d17]">
            Store Management
          </DialogTitle>
        </DialogHeader>

        {isAdmin ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 rounded-2xl border border-[#065f46]/20 bg-[#065f46]/5 p-4 text-[#065f46]">
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">You are logged in with <strong>Store Admin privileges</strong>. Ready to manage inventory and photos.</p>
            </div>
            <Button
              onClick={() => {
                onClose();
                if (onOpenPortal) onOpenPortal();
              }}
              className="w-full bg-[#4c0d17] hover:bg-[#3d1118] text-[#f9f5ec] font-bold py-6 rounded-xl cursor-pointer shadow-lg shadow-[#4c0d17]/20 transition"
            >
              Launch Store Operations Hub
            </Button>
            <Button
              variant="outline"
              onClick={signOut}
              className="w-full border-[#e5dfd3] text-[#8a7a6b] hover:text-[#4c0d17] hover:bg-[#f9f5ec] py-5 rounded-xl cursor-pointer transition"
            >
              Sign Out from Admin
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="flex items-start gap-3 rounded-2xl bg-[#f9f5ec] border border-[#e5dfd3] p-4 text-xs text-[#8a7a6b] leading-relaxed">
              <Lock className="h-4 w-4 text-[#b08a47] shrink-0 mt-0.5" />
              <span>Restricted Storefront Management. Enter authorized admin credentials to access catalog and pricing controls.</span>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="admin-email-input" className="text-[11px] font-bold uppercase tracking-wider text-[#4c0d17] ml-1">Admin Email</label>
              <input
                id="admin-email-input"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-[#e5dfd3] bg-white px-4 py-3 text-sm text-[#4c0d17] focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 focus:outline-none shadow-sm transition"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="admin-password-input" className="text-[11px] font-bold uppercase tracking-wider text-[#4c0d17] ml-1">Password</label>
              <input
                id="admin-password-input"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#e5dfd3] bg-white px-4 py-3 text-sm text-[#4c0d17] focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 focus:outline-none shadow-sm transition"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 mt-2 text-sm bg-[#b08a47] hover:bg-[#9a773a] text-white font-bold rounded-xl shadow-lg shadow-[#b08a47]/30 transition cursor-pointer"
            >
              {isSubmitting ? 'Authenticating...' : 'Enter Admin Management Portal'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
