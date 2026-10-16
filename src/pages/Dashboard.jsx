import { useState, useEffect } from 'react';
import { getTasks } from '../services/api';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user?.id) return;
            try {
                const response = await getTasks(user.id);
                setTasks(response.data || []);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [user?.id]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => Number(t.is_completed) === 1).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const overdueTasks = tasks.filter(task => {
        if (!task.due_date || Number(task.is_completed) === 1) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDateOnly = task.due_date.split(/[T ]/)[0];
        const taskDate = new Date(taskDateOnly);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate < today;
    }).length;

    const completedPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const overduePercent = totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0;
    const pendingPercent = totalTasks > 0 ? Math.max(0, 100 - completedPercent - overduePercent) : 0;

    const getWeeklyActivityData = () => {
        const curr = new Date();
        const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
        const days = [
            { name: 'Mon', fullName: 'Monday', pastelBg: '#fbc3b1' },
            { name: 'Tue', fullName: 'Tuesday', pastelBg: '#f7d6bd' },
            { name: 'Wed', fullName: 'Wednesday', pastelBg: '#e3d2c3' },
            { name: 'Thu', fullName: 'Thursday', pastelBg: '#d1e8e2' },
            { name: 'Fri', fullName: 'Friday', pastelBg: '#cbeaa6' },
            { name: 'Sat', fullName: 'Saturday', pastelBg: '#fceade' },
            { name: 'Sun', fullName: 'Sunday', pastelBg: '#f4ebd0' },
        ];

        return days.map((day, index) => {
            const d = new Date(curr);
            d.setDate(first + index);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            const count = tasks.filter(t => {
                if (!t.due_date) return false;
                return t.due_date.split(/[T ]/)[0] === dateStr;
            }).length;

            return { ...day, count };
        });
    };

    const weeklyData = getWeeklyActivityData();

    const getProductivityPersona = () => {
        if (totalTasks === 0) {
            return {
                title: "🌱 Fresh Slate",
                description: "You have no tasks logged yet. Add your first weekly objectives to begin tracking your momentum!",
                color: "#6b7280",
                bg: "#f3f4f6"
            };
        }
        if (completionRate >= 80) {
            return {
                title: "🔥 Hyper-Focused & Crushing It",
                description: "Phenomenal momentum! You are clearing tasks with high efficiency and maintaining stellar consistency.",
                color: "#059669",
                bg: "#d1fae5"
            };
        }
        if (completionRate >= 50 && overdueTasks === 0) {
            return {
                title: "⚖️ Steady & Balanced",
                description: "Great consistency! You are making steady progress through your workload with zero overdue bottlenecks.",
                color: "#4f46e5",
                bg: "#e0e7ff"
            };
        }
        if (overdueTasks > 3) {
            return {
                title: "⚠️ Overloaded / At Risk",
                description: "You have accumulated multiple overdue tasks. Consider rescheduling or breaking down major objectives to catch up.",
                color: "#ef4444",
                bg: "#fee2e2"
            };
        }
        return {
            title: "⚡ Building Momentum",
            description: "You're getting started! Focus on knocking out high-priority items to boost your completion velocity.",
            color: "#d97706",
            bg: "#fef3c7"
        };
    };

    const persona = getProductivityPersona();

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1f2937', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>Dashboard Overview</h2>
                <p style={{ color: '#4b5563', fontSize: '14px', margin: 0, fontWeight: '500' }}>Welcome back! Here is a summary of your productivity and task statistics.</p>
            </div>


            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Tasks</span>
                    <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', margin: '8px 0 0 0' }}>{totalTasks}</h3>
                </div>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Completed</span>
                    <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#10b981', margin: '8px 0 0 0' }}>{completedTasks}</h3>
                </div>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Overdue</span>
                    <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#ef4444', margin: '8px 0 0 0' }}>{overdueTasks}</h3>
                </div>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Completion Rate</span>
                    <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary, #709775)', margin: '8px 0 0 0' }}>{completionRate}%</h3>
                </div>
            </div>

            <div style={{ background: 'rgba(112, 151, 117, 0.08)', border: '1px dashed #709775', borderRadius: '14px', padding: '14px 20px', marginBottom: '14px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: '#2c3e35' }}>💡 How Smart Productivity Persona Works:</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#4a5d52', lineHeight: '1.5' }}>
                    Your productivity tier is evaluated dynamically in real time based on your <strong>completion rate percentage</strong> and <strong>overdue task bottlenecks</strong>:
                    <br />
                    • <strong>Hyper-Focused (80%+ Completion):</strong> High task velocity and execution efficiency.
                    <br />
                    • <strong>Steady & Balanced (50%+ Completion, 0 Overdue):</strong> Consistent workflow with zero pending delays.
                    <br />
                    • <strong>Overloaded (&gt;3 Overdue):</strong> Flagged when overdue items accumulate so you can re-prioritize.
                </p>
            </div>

            <div style={{ background: '#fff', padding: '24px 28px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', maxWidth: '800px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: persona.bg, color: persona.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
                        {completionRate >= 80 ? '🔥' : overdueTasks > 3 ? '⚠️' : totalTasks === 0 ? '📝' : '💡'}
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'var(--text-main, #2c3e35)' }}>Client Status: {persona.title}</h4>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted, #718076)', lineHeight: '1.5' }}>{persona.description}</p>
                    </div>
                </div>
                <div style={{ padding: '10px 18px', background: persona.bg, color: persona.color, borderRadius: '10px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.3px' }}>
                    {completionRate >= 80 ? 'High Performer' : overdueTasks > 3 ? 'Needs Attention' : 'Active Track'}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>

                <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>Workflow Health</h3>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Proportion of completed, pending, & overdue items.</p>
                            </div>
                        </div>

                        <div style={{ height: '16px', background: '#f3f4f6', borderRadius: '8px', overflow: 'hidden', display: 'flex', marginBottom: '24px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                            <div style={{ width: `${completedPercent}%`, background: '#10b981', transition: 'width 0.6s ease' }} title={`Completed: ${completedTasks}`} />
                            <div style={{ width: `${pendingPercent}%`, background: '#6366f1', transition: 'width 0.6s ease' }} title={`Pending: ${pendingTasks - overdueTasks}`} />
                            <div style={{ width: `${overduePercent}%`, background: '#ef4444', transition: 'width 0.6s ease' }} title={`Overdue: ${overdueTasks}`} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #f3f4f6', paddingTop: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Done: <strong>{completedTasks}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pending: <strong>{pendingTasks - overdueTasks}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Overdue: <strong>{overdueTasks}</strong></span>
                        </div>
                    </div>
                </div>

                <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>🌸 Weekly Rhythm & Busy Days</h3>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Task load distribution across the current week.</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '130px', padding: '10px 10px 0 10px', borderBottom: '2px dashed #f3f4f6' }}>
                        {weeklyData.map((day) => {
                            const dotSize = Math.max(14, Math.min(42, 14 + day.count * 6));
                            return (
                                <div key={day.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, position: 'relative' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', background: '#f9fafb', padding: '2px 6px', borderRadius: '6px', border: '1px solid #f3f4f6' }}>
                                        {day.count}
                                    </span>
                                    <div
                                        style={{
                                            width: `${dotSize}px`,
                                            height: `${dotSize}px`,
                                            borderRadius: '50%',
                                            background: day.pastelBg,
                                            border: '3px solid #ffffff',
                                            boxShadow: day.count > 0 ? `0 4px 12px ${day.pastelBg}88` : 'none',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        title={`${day.fullName}: ${day.count} tasks`}
                                    />
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>
                                        {day.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', padding: '0 4px' }}>
                        <span>✨ Soft bubble sizes reflect your daily workload</span>
                        <span>Pastel Edition</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;