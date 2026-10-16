import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function YearView({ tasks, getPriorityColor }) {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevYear = () => setCurrentYear(currentYear - 1);
    const handleNextYear = () => setCurrentYear(currentYear + 1);

    const handleViewMore = (monthIndex) => {
        const monthNum = String(monthIndex + 1).padStart(2, '0');
        navigate(`/reports?month=${monthNum}&year=${currentYear}`);
    };

    return (
        <div className="year-view-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="year-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ color: '#2c3e35', fontSize: '28px', fontWeight: '800', margin: 0 }}>
                    Yearly Overview: {currentYear}
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="custom-btn light-btn" onClick={handlePrevYear} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #dcd6cd', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>&larr; {currentYear - 1}</button>
                    <button className="custom-btn light-btn" onClick={() => setCurrentYear(new Date().getFullYear())} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #dcd6cd', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>This Year</button>
                    <button className="custom-btn light-btn" onClick={handleNextYear} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #dcd6cd', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>{currentYear + 1} &rarr;</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {monthNames.map((monthName, monthIndex) => {
                    // Filter tasks belonging to this specific month and year
                    const monthTasks = tasks.filter(task => {
                        if (!task.due_date) return false;
                        const taskDate = new Date(task.due_date);
                        return taskDate.getFullYear() === currentYear && taskDate.getMonth() === monthIndex;
                    });

                    const completedCount = monthTasks.filter(t => Number(t.is_completed) === 1).length;
                    const totalCount = monthTasks.length;
                    const visibleTasks = monthTasks.slice(0, 3);
                    const remainingCount = totalCount - 3;

                    return (
                        <div
                            key={monthName}
                            style={{
                                background: 'rgba(255, 255, 255, 0.85)',
                                border: '1px solid rgba(220, 215, 205, 0.6)',
                                borderRadius: '14px',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '180px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#2c3e35' }}>{monthName}</h3>
                                    <span style={{ background: totalCount > 0 ? '#709775' : '#cbd5e1', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                                        {totalCount} tasks
                                    </span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#718076', margin: '0 0 10px 0', fontWeight: '500' }}>
                                    Completed: {completedCount} / {totalCount}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                {visibleTasks.length === 0 ? (
                                    <div style={{ fontSize: '12px', color: '#a0aec0', fontStyle: 'italic', margin: 'auto 0' }}>
                                        No tasks scheduled
                                    </div>
                                ) : (
                                    visibleTasks.map(task => (
                                        <div
                                            key={task.id}
                                            style={{
                                                fontSize: '11px',
                                                background: Number(task.is_completed) === 1 ? '#e2e8f0' : '#fefae0',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                borderLeft: `3px solid ${getPriorityColor ? getPriorityColor(task.priority) : '#709775'}`,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                fontWeight: '600',
                                                color: Number(task.is_completed) === 1 ? '#94a3b8' : '#2d3748',
                                                textDecoration: Number(task.is_completed) === 1 ? 'line-through' : 'none'
                                            }}
                                            title={task.title}
                                        >
                                            {task.title}
                                        </div>
                                    ))
                                )}
                            </div>

                            {totalCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => handleViewMore(monthIndex)}
                                    style={{
                                        marginTop: '12px',
                                        background: remainingCount > 0 ? '#709775' : 'rgba(112, 151, 117, 0.15)',
                                        color: remainingCount > 0 ? '#fff' : '#2c3e35',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        width: '100%',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    {remainingCount > 0 ? `View More (+${remainingCount})` : 'View in Reports'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default YearView;