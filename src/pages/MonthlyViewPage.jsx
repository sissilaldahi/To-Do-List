import { useState, useEffect, useCallback } from 'react';
import { getTasks, updateTask } from '../services/api';
import MonthView from '../components/MonthView';

function MonthlyViewPage() {
    const [tasks, setTasks] = useState([]);
    const [viewingTask, setViewingTask] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchTasks = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await getTasks(user.id);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const getPriorityColor = (p) => {
        switch (p) {
            case 'Urgent': return '#ef4444';
            case 'High': return '#f59e0b';
            case 'Medium': return '#6366f1';
            default: return '#10b981';
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0' }}>Monthly Overview</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Inspect and track tasks across the entire calendar month.</p>
            </div>
            <MonthView tasks={tasks} onTaskClick={setViewingTask} getPriorityColor={getPriorityColor} />
        </div>
    );
}

export default MonthlyViewPage;