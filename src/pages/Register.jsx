import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await registerUser({ username: username.trim(), email: email.trim(), password });
            if (response.data && response.data.success) {
                navigate('/login');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100vw',
            margin: 0,
            padding: '24px',
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #fceade 0%, #e3f2ed 40%, #f4ebd0 100%)',
            overflow: 'hidden'
        }}>
            <style>
                {`
                    @keyframes floatSlow1 {
                        0% { transform: translateY(0px) rotate(0deg) scale(1); }
                        50% { transform: translateY(-25px) rotate(15deg) scale(1.05); }
                        100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    }
                    @keyframes floatSlow2 {
                        0% { transform: translateY(0px) rotate(0deg) scale(1); }
                        50% { transform: translateY(30px) rotate(-20deg) scale(0.95); }
                        100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    }
                `}
            </style>

            <div style={{ position: 'absolute', top: '10%', left: '8%', animation: 'floatSlow1 7s ease-in-out infinite', pointerEvents: 'none', opacity: 0.35 }}>
                <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
                    <path d="M50 20C55 5 75 5 80 20C95 25 95 45 80 50C95 65 75 85 60 70C50 85 30 85 25 70C10 65 10 45 25 40C10 25 30 5 45 20C50 15 50 20 50 20Z" fill="#f7aef8" />
                    <circle cx="50" cy="45" r="12" fill="#ffccd5" />
                </svg>
            </div>
            <div style={{ position: 'absolute', bottom: '12%', right: '10%', animation: 'floatSlow2 9s ease-in-out infinite', pointerEvents: 'none', opacity: 0.3 }}>
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                    <path d="M50 20C55 5 75 5 80 20C95 25 95 45 80 50C95 65 75 85 60 70C50 85 30 85 25 70C10 65 10 45 25 40C10 25 30 5 45 20C50 15 50 20 50 20Z" fill="#ffb7b2" />
                    <circle cx="50" cy="45" r="14" fill="#ffe5ec" />
                </svg>
            </div>
            <div style={{ position: 'absolute', top: '15%', right: '15%', animation: 'floatSlow1 8s ease-in-out infinite', pointerEvents: 'none', opacity: 0.25 }}>
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
                    <path d="M50 20C55 5 75 5 80 20C95 25 95 45 80 50C95 65 75 85 60 70C50 85 30 85 25 70C10 65 10 45 25 40C10 25 30 5 45 20C50 15 50 20 50 20Z" fill="#fbc4ab" />
                    <circle cx="50" cy="45" r="10" fill="#ffccd5" />
                </svg>
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                maxWidth: '960px',
                width: '100%',
                zIndex: 2,
                gap: '24px',
                alignItems: 'stretch'
            }}>

                <div style={{
                    flex: '1 1 400px',
                    padding: '40px',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 10px 30px rgba(150, 140, 130, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2c3e35', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
                        Join Taskly Today
                    </h1>
                    <p style={{ fontSize: '14px', color: '#556b5f', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                        Create your account to unlock personalized weekly planning, smart scheduling, and live productivity analytics.
                    </p>

                    <div style={{ background: 'rgba(255, 255, 255, 0.65)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#2c3e35', margin: '0 0 12px 0' }}>
                            🌱 What's Waiting For You
                        </h3>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#4a5d52', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li><strong>Secure Database:</strong> Your tasks are safely synchronized with MySQL.</li>
                            <li><strong>Productivity Coach:</strong> Real-time feedback on your weekly momentum.</li>
                            <li><strong>Custom Categories:</strong> Work, Study, Health, and Personal tracking.</li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    flex: '1 1 360px',
                    padding: '40px',
                    background: 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 20px 40px rgba(120, 110, 100, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#2c3e35', margin: '0 0 4px 0' }}>Create Account</h2>
                        <p style={{ color: '#718076', fontSize: '13px', margin: 0 }}>Sign up to start organizing your schedule.</p>
                    </div>

                    {error && (
                        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '18px', fontWeight: '600', border: '1px solid #fee2e2' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#2c3e35', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your username"
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(200, 195, 185, 0.6)', fontSize: '14px', background: 'rgba(255, 255, 255, 0.8)', boxSizing: 'border-box', outline: 'none' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#2c3e35', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(200, 195, 185, 0.6)', fontSize: '14px', background: 'rgba(255, 255, 255, 0.8)', boxSizing: 'border-box', outline: 'none' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#2c3e35', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(200, 195, 185, 0.6)', fontSize: '14px', background: 'rgba(255, 255, 255, 0.8)', boxSizing: 'border-box', outline: 'none' }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            style={{ marginTop: '8px', width: '100%', padding: '12px', background: '#709775', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(112, 151, 117, 0.3)', transition: 'background 0.2s' }}
                        >
                            Register Account
                        </button>
                    </form>

                    <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#718076', margin: '24px 0 0 0' }}>
                        Already have an account? <Link to="/login" style={{ color: '#52796f', fontWeight: '700', textDecoration: 'none' }}>Login here</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Register;