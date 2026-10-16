import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ onOpenCreateModal }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Weekly View', path: '/weekly', icon: '📅' },
        { name: 'Monthly View', path: '/monthly', icon: '🗓️' },
        { name: 'Yearly Planner', path: '/yearly', icon: '📆' },
        { name: 'Reports', path: '/reports', icon: '📈' },
        { name: 'Smart Scheduler', path: '/scheduler', icon: '🤖' },
    ];

    return (
        <div className="dashboard-sidebar" style={{
            width: isCollapsed ? '70px' : '260px',
            minHeight: '100vh',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#ffffff',
            padding: isCollapsed ? '24px 12px' : '24px 20px',
            borderRight: '1px solid var(--border-color)',
            boxSizing: 'border-box',
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            transition: 'width 0.3s ease, padding 0.3s ease'
        }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {!isCollapsed && (
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-main)' }}>Taskly</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0', lineHeight: '1.4' }}>Manage your plan</p>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        style={{
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--text-main)',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            margin: isCollapsed ? '0 auto' : '0',
                            flexShrink: 0
                        }}
                    >
                        {isCollapsed ? '→' : '←'}
                    </button>
                </div>

                {!isCollapsed && (
                    <>
                        <button
                            type="button"
                            className="primary-btn"
                            onClick={onOpenCreateModal}
                            style={{ width: '100%', textAlign: 'center', padding: '10px 14px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                        >
                            + Add New Task
                        </button>

                        <div style={{ height: '1px', background: 'var(--border-color)', margin: '2px 0' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Navigation</span>
                            {navItems.map((item) => {
                                const isPageActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px 14px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: isPageActive ? 'var(--primary-light, #f0fdf4)' : 'transparent',
                                            color: isPageActive ? 'var(--primary, #10b981)' : 'var(--text-main)',
                                            fontWeight: isPageActive ? '700' : '500',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '16px' }}>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <div style={{ borderTop: !isCollapsed ? '1px solid var(--border-color)' : 'none', paddingTop: '16px' }}>
                <button
                    type="button"
                    onClick={handleLogout}
                    title="Logout"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 14px',
                        background: '#fef2f2',
                        color: '#ef4444',
                        border: '1px solid #fee2e2',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                    }}
                >
                    <span style={{ fontSize: '15px' }}>🚪</span>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}

export default Sidebar;