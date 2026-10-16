import { useState } from 'react';

function MonthView({ tasks = [], onDayClick, onTaskClick, getPriorityColor }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDayModal, setSelectedDayModal] = useState(null); // Stores date & tasks for floating modal

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11

    // Month names for header
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Navigation handlers
    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Calculate days for the month grid
    const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week the month starts on (0=Sun)
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // Build the days array for rendering
    const daysArray = [];

    // Padding for days from the previous month to align the grid correctly
    for (let i = 0; i < firstDayIndex; i++) {
        daysArray.push({ empty: true });
    }

    // Actual days of the month
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const dateString = `${year}-${formattedMonth}-${formattedDay}`;

        // Find tasks matching this date
        const dayTasks = tasks.filter(task => {
            if (!task.due_date) return false;
            return task.due_date.split(/[T ]/)[0] === dateString;
        });

        daysArray.push({
            dayNumber: day,
            dateString,
            tasks: dayTasks,
            empty: false
        });
    }

    return (
        <div className="month-view-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            
            <div className="month-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#2c3e35', fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
                    {monthNames[month]} {year}
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="custom-btn light-btn" onClick={handlePrevMonth} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #dcd6cd', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>&larr; Prev</button>
                    <button className="custom-btn light-btn" onClick={() => setCurrentDate(new Date())} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #dcd6cd', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>Today</button>
                    <button className="custom-btn light-btn" onClick={handleNextMonth} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #dcd6cd', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>Next &rarr;</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontWeight: '700', marginBottom: '10px', color: '#556b5f', fontSize: '13px' }}>
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                {daysArray.map((item, index) => {
                    if (item.empty) {
                        return <div key={`empty-${index}`} style={{ minHeight: '120px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}></div>;
                    }

                    const isToday =
                        item.dayNumber === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear();

                    // Max 3 tasks shown directly in the cell
                    const visibleTasks = item.tasks.slice(0, 3);
                    const remainingCount = item.tasks.length - 3;

                    return (
                        <div
                            key={item.dateString}
                            onClick={() => onDayClick && onDayClick(item.dateString)}
                            style={{
                                background: isToday ? 'rgba(204, 213, 174, 0.35)' : 'rgba(255, 255, 255, 0.85)',
                                border: isToday ? '2px solid #709775' : '1px solid rgba(220, 215, 205, 0.6)',
                                borderRadius: '14px',
                                padding: '10px',
                                minHeight: '125px',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                        >

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '800', fontSize: '15px', color: isToday ? '#2c3e35' : '#4a5d52' }}>
                                    {item.dayNumber}
                                </span>
                                {item.tasks.length > 0 && (
                                    <span style={{ background: '#709775', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 7px', borderRadius: '10px' }}>
                                        {item.tasks.length}
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', flex: 1 }}>
                                {visibleTasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            if (onTaskClick) onTaskClick(task);
                                        }}
                                        style={{
                                            background: Number(task.is_completed) === 1 ? '#e2e8f0' : '#fefae0',
                                            borderLeft: `3px solid ${getPriorityColor ? getPriorityColor(task.priority) : '#709775'}`,
                                            padding: '3px 6px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            borderRadius: '4px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textDecoration: Number(task.is_completed) === 1 ? 'line-through' : 'none',
                                            color: Number(task.is_completed) === 1 ? '#94a3b8' : '#2d3748'
                                        }}
                                        title={task.title}
                                    >
                                        {task.title}
                                    </div>
                                ))}
                            </div>

                            {remainingCount > 0 && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        setSelectedDayModal({ dateString: item.dateString, dayNumber: item.dayNumber, tasks: item.tasks });
                                    }}
                                    style={{
                                        marginTop: '4px',
                                        background: 'rgba(112, 151, 117, 0.15)',
                                        color: '#2c3e35',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '4px 6px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        width: '100%',
                                        textAlign: 'center',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    + {remainingCount} View More
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedDayModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1100
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        padding: '28px',
                        width: '440px',
                        maxWidth: '90%',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.8)',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#2c3e35' }}>
                                    Tasks for {monthNames[month]} {selectedDayModal.dayNumber}, {year}
                                </h3>
                                <span style={{ fontSize: '12px', color: '#718076' }}>{selectedDayModal.tasks.length} total tasks scheduled</span>
                            </div>
                            <button
                                onClick={() => setSelectedDayModal(null)}
                                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9ca3af' }}
                            >
                                &times;
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                            {selectedDayModal.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    onClick={() => {
                                        setSelectedDayModal(null);
                                        if (onTaskClick) onTaskClick(task);
                                    }}
                                    style={{
                                        display: 'flex',
                                        justify: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 14px',
                                        background: '#f8faf8',
                                        borderRadius: '10px',
                                        border: '1px solid #e5e7eb',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: getPriorityColor ? getPriorityColor(task.priority) : '#709775'
                                        }} />
                                        <div>
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                color: Number(task.is_completed) === 1 ? '#9ca3af' : '#2c3e35',
                                                textDecoration: Number(task.is_completed) === 1 ? 'line-through' : 'none'
                                            }}>
                                                {task.title}
                                            </span>
                                            {task.category && (
                                                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                                    Category: {task.category}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#e5e7eb', fontWeight: '600', color: '#374151' }}>
                                        {task.priority || 'Medium'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                            <button
                                onClick={() => setSelectedDayModal(null)}
                                style={{ padding: '8px 18px', background: '#709775', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MonthView;