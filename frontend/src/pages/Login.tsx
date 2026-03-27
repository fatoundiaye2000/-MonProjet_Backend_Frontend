import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { STORAGE_KEYS } from '../config/constants';

export default function Login() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    try {
      console.log('🔐 [AUTH] Tentative de connexion');
      await login(email, password);

      console.log('🔍 [Login] localStorage après connexion:');
      console.log('  auth_token:', localStorage.getItem(STORAGE_KEYS.TOKEN));
      console.log('  user_data:',  localStorage.getItem(STORAGE_KEYS.USER));

      window.location.href = '/accueil';

    } catch (err) {
      console.error('❌ [Login] Erreur login:', err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg,#fff8f0 0%,#fef3e6 50%,#fef0d8 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans',sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Blobs décoratifs (identiques à Home) ── */}
      <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,0.18) 0%,transparent 65%)', top:-180, left:-160, animation:'blob1 9s ease-in-out infinite', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(234,88,12,0.14) 0%,transparent 65%)', top:-60, right:-80, animation:'blob2 11s ease-in-out infinite', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 65%)', bottom:-80, left:'35%', animation:'blob3 13s ease-in-out infinite', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(249,115,22,0.08) 1.5px,transparent 1.5px)', backgroundSize:'28px 28px', pointerEvents:'none' }}/>

      {/* ── Card ── */}
      <div style={{
        width:'100%', maxWidth:440, margin:'24px',
        background:'rgba(255,255,255,0.92)',
        backdropFilter:'blur(20px)',
        borderRadius:28,
        border:'2px solid rgba(249,115,22,0.15)',
        boxShadow:'0 32px 80px rgba(249,115,22,0.18), 0 0 0 1px rgba(249,115,22,0.08)',
        padding:'44px 40px 40px',
        animation:'fadeUp 0.7s ease 0.1s both',
      }}>

        {/* Logo */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:28, animation:'fadeUp 0.6s ease 0.2s both' }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#f97316,#ea580c)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:22, color:'#fff', boxShadow:'0 8px 24px rgba(249,115,22,0.50)' }}>
            CE
          </div>
        </div>

        {/* Titre */}
        <div style={{ textAlign:'center', marginBottom:32, animation:'fadeUp 0.6s ease 0.3s both' }}>
          <h1 style={{ fontSize:28, fontWeight:900, color:'#1c0a00', marginBottom:6 }}>Connexion</h1>
          <p style={{ fontSize:14, color:'#92400e', fontWeight:500 }}>Accédez à votre espace CultureEvents</p>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{ marginBottom:20, padding:'12px 16px', borderRadius:14, background:'rgba(239,68,68,0.08)', border:'2px solid rgba(239,68,68,0.25)', color:'#dc2626', fontSize:13, fontWeight:600, animation:'fadeUp 0.3s ease both' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18, animation:'fadeUp 0.6s ease 0.4s both' }}>

          {/* Email */}
          <div>
            <label htmlFor="email" style={{ display:'block', fontSize:13, fontWeight:700, color:'#78350f', marginBottom:7 }}>
              Email
            </label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16, pointerEvents:'none' }}>✉️</span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => { setEmail(e.target.value); clearError(); }}
                placeholder="Entrez votre email"
                disabled={isLoading}
                style={{ width:'100%', padding:'13px 16px 13px 42px', borderRadius:14, border:'2px solid rgba(249,115,22,0.25)', background:'rgba(255,248,240,0.8)', fontSize:14, fontFamily:"'DM Sans',sans-serif", color:'#1c0a00', outline:'none', transition:'all 0.2s', boxSizing:'border-box', opacity: isLoading ? 0.6 : 1 }}
                onFocus={e => { e.currentTarget.style.borderColor='#f97316'; e.currentTarget.style.boxShadow='0 0 0 4px rgba(249,115,22,0.12)'; e.currentTarget.style.background='#fff'; }}
                onBlur={e  => { e.currentTarget.style.borderColor='rgba(249,115,22,0.25)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.background='rgba(255,248,240,0.8)'; }}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" style={{ display:'block', fontSize:13, fontWeight:700, color:'#78350f', marginBottom:7 }}>
              Mot de passe
            </label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16, pointerEvents:'none' }}>🔒</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => { setPassword(e.target.value); clearError(); }}
                placeholder="Entrez votre mot de passe"
                disabled={isLoading}
                style={{ width:'100%', padding:'13px 44px 13px 42px', borderRadius:14, border:'2px solid rgba(249,115,22,0.25)', background:'rgba(255,248,240,0.8)', fontSize:14, fontFamily:"'DM Sans',sans-serif", color:'#1c0a00', outline:'none', transition:'all 0.2s', boxSizing:'border-box', opacity: isLoading ? 0.6 : 1 }}
                onFocus={e => { e.currentTarget.style.borderColor='#f97316'; e.currentTarget.style.boxShadow='0 0 0 4px rgba(249,115,22,0.12)'; e.currentTarget.style.background='#fff'; }}
                onBlur={e  => { e.currentTarget.style.borderColor='rgba(249,115,22,0.25)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.background='rgba(255,248,240,0.8)'; }}
              />
              {/* Bouton afficher/masquer mot de passe */}
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16, padding:0, lineHeight:1 }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Bouton connexion */}
          <button
            type="submit"
            disabled={isLoading}
            style={{ marginTop:6, width:'100%', padding:'15px', borderRadius:16, border:'none', background: isLoading ? 'linear-gradient(135deg,#fdba74,#fb923c)' : 'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', fontSize:16, fontWeight:800, fontFamily:"'DM Sans',sans-serif", cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: isLoading ? 'none' : '0 8px 28px rgba(249,115,22,0.45)', transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}
            onMouseEnter={e => { if (!isLoading) { const el=e.currentTarget; el.style.transform='translateY(-2px) scale(1.02)'; el.style.boxShadow='0 14px 40px rgba(249,115,22,0.60)'; } }}
            onMouseLeave={e => { const el=e.currentTarget; el.style.transform='translateY(0) scale(1)'; el.style.boxShadow='0 8px 28px rgba(249,115,22,0.45)'; }}
          >
            {isLoading
              ? <><span style={{ width:18, height:18, border:'3px solid rgba(255,255,255,0.4)', borderTop:'3px solid #fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }}/> Connexion en cours…</>
              : <>🔑 Se connecter</>
            }
          </button>
        </form>

        {/* Séparateur */}
        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0' }}>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,rgba(249,115,22,0.20))' }}/>
          <span style={{ fontSize:12, color:'#c2410c', fontWeight:600 }}>ou</span>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(249,115,22,0.20),transparent)' }}/>
        </div>

        {/* Lien inscription */}
        <div style={{ textAlign:'center' }}>
          <p style={{ fontSize:14, color:'#78350f' }}>
            Pas encore de compte ?{' '}
            <Link to="/register"
              style={{ fontWeight:800, color:'#f97316', textDecoration:'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='#ea580c'; (e.currentTarget as HTMLElement).style.textDecoration='underline'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='#f97316'; (e.currentTarget as HTMLElement).style.textDecoration='none'; }}>
              S'inscrire →
            </Link>
          </p>
        </div>

        {/* Retour accueil */}
        <div style={{ textAlign:'center', marginTop:16 }}>
          <Link to="/"
            style={{ fontSize:13, color:'#c2410c', fontWeight:600, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6, padding:'8px 18px', borderRadius:100, background:'rgba(249,115,22,0.08)', border:'1.5px solid rgba(249,115,22,0.20)', transition:'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(249,115,22,0.16)'; (e.currentTarget as HTMLElement).style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(249,115,22,0.08)'; (e.currentTarget as HTMLElement).style.transform='translateY(0)'; }}>
            ← Retour à l'accueil
          </Link>
        </div>

      </div>

      {/* ── Styles globaux ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes blob1  { 0%,100%{transform:translate(0,0) scale(1);}  33%{transform:translate(50px,-40px) scale(1.08);} 66%{transform:translate(-30px,30px) scale(0.94);} }
        @keyframes blob2  { 0%,100%{transform:translate(0,0) scale(1);}  40%{transform:translate(-50px,40px) scale(1.06);} 70%{transform:translate(35px,-25px) scale(0.96);} }
        @keyframes blob3  { 0%,100%{transform:translate(0,0);}           50%{transform:translate(40px,-50px) scale(1.05);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes spin   { to{transform:rotate(360deg);} }
        input::placeholder { color: #c2410c; opacity: 0.45; }
      `}</style>
    </div>
  );
}