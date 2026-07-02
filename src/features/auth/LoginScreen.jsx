import { useState } from 'react';
import { G, Ic } from '../../ui/kit';
import { useAuth } from './useAuth';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password || busy) return;
    setBusy(true);
    setError(null);
    const { error: err } = await signIn(email.trim(), password);
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : err.message);
      setBusy(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 14px', borderRadius: 11, border: 'none',
    background: 'rgba(255,255,255,0.12)', color: 'white', fontSize: 15, outline: 'none',
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 26px', background: `linear-gradient(160deg, ${G.dark}, #0A2E0A)`, paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ic n="tractor" s={28} c={G.light} />
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>AgriCertif</div>
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 34 }}>Outil commercial concessionnaire</div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" style={inputStyle} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" style={inputStyle} />
        {error && <div style={{ fontSize: 13, fontWeight: 600, color: '#FF9E8F', padding: '2px 4px' }}>{error}</div>}
        <button type="submit" disabled={busy} style={{ marginTop: 8, padding: '14px 0', borderRadius: 12, border: 'none', background: busy ? G.muted : G.primary, color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 26, lineHeight: 1.5 }}>
        Pas de compte ? Contactez votre administrateur pour obtenir vos identifiants.
      </div>
    </div>
  );
}
