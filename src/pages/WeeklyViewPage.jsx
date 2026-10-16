import { useState, useEffect } from 'react';
import { getTasks, updateTask, deleteTask } from '../services/api';
import TaskModal from '../components/TaskModal'; 

function WeeklyViewPage() {
    const [tasks, setTasks] = useState([]);
    const [viewingTask, setViewingTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); 

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('General');

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchTasks = async () => {
        if (!user?.id) return;
        try {
            const response = await getTasks(user.id);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user?.id]);

    const formatTaskDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getTodayString = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            await updateTask({
                id: editingTask.id,
                user_id: user.id,
                title,
                description,
                due_date: dueDate,
                priority,
                category,
                is_completed: editingTask.is_completed
            });
            setEditingTask(null);
            setTitle('');
            setDescription('');
            setDueDate('');
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description || '');
        setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
        setPriority(task.priority || 'Medium');
        setCategory(task.category || 'General');
    };

    const handleToggleComplete = async (task) => {
        try {
            await updateTask({ ...task, is_completed: Number(task.is_completed) === 1 ? 0 : 1 });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'Urgent': return '#ef4444';
            case 'High': return '#f59e0b';
            case 'Medium': return '#6366f1';
            default: return '#10b981';
        }
    };

    const getCurrentWeekDays = () => {
        const curr = new Date();
        const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
        const days = [
            { name: 'Monday', color: '#f3d5b5' },
            { name: 'Tuesday', color: '#e7bc91' },
            { name: 'Wednesday', color: '#d4a373' },
            { name: 'Thursday', color: '#ccd5ae' },
            { name: 'Friday', color: '#e9edc9' },
            { name: 'Saturday', color: '#fefae0' },
            { name: 'Sunday', color: '#faedcd' },
        ];
        return days.map((day, index) => {
            const d = new Date(curr);
            d.setDate(first + index);
            return {
                ...day,
                dateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            };
        });
    };

    const daysOfWeek = getCurrentWeekDays();

    return (
        <div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0' }}>Weekly To-Do List</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Interactive day-by-day task distribution and tracking.</p>
                </div>
                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    style={{
                        padding: '10px 20px',
                        background: '#709775',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(112, 151, 117, 0.3)',
                        transition: 'background 0.2s'
                    }}
                >
                    + Add New Task
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', width: '100%' }}>
                {daysOfWeek.map((day) => {
                    const dayTasks = tasks.filter(t => {
                        if (!t.due_date) return false;
                        return t.due_date.split(/[T ]/)[0] === day.dateStr;
                    });
                    const completedCount = dayTasks.filter(t => Number(t.is_completed) === 1).length;
                    const progressPercent = dayTasks.length > 0 ? (completedCount / dayTasks.length) * 100 : 0;
                    const isToday = getTodayString() === day.dateStr;

                    return (
                        <div key={day.name} style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ backgroundColor: day.color, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>{day.name}</h3>
                                    <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: '500' }}>{formatTaskDate(day.dateStr)}</span>
                                </div>
                                {isToday && <span style={{ background: '#1f2937', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>TODAY</span>}
                            </div>

                            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
                                {dayTasks.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', margin: 'auto' }}>No tasks</div>
                                ) : (
                                    dayTasks.map((task) => (
                                        <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={Number(task.is_completed) === 1}
                                                    onChange={() => handleToggleComplete(task)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <span
                                                    onClick={() => setViewingTask(task)}
                                                    style={{
                                                        fontSize: '13px',
                                                        fontWeight: '500',
                                                        color: Number(task.is_completed) === 1 ? 'var(--text-muted)' : 'var(--text-main)',
                                                        textDecoration: Number(task.is_completed) === 1 ? 'line-through' : 'none',
                                                        cursor: 'pointer',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '110px'
                                                    }}
                                                    title={task.title}
                                                >
                                                    {task.title}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getPriorityColor(task.priority) }} title={task.priority} />
                                                <button onClick={() => openEditModal(task)} style={{ background: 'transparent', border: 'none', color: '#4b5563', fontSize: '13px', cursor: 'pointer' }} title="Edit Task">✏️</button>
                                                <button onClick={() => handleDelete(task.id)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }} title="Delete Task">×</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div style={{ padding: '12px 16px', background: '#fcfcfc', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ flex: 1, height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>{completedCount}/{dayTasks.length}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onTaskAdded={fetchTasks}
            />


            {viewingTask && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '400px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: 'var(--text-main)' }}>{viewingTask.title}</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}><strong>Description:</strong> {viewingTask.description || 'No description provided.'}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '20px', color: '#4b5563' }}>
                            <span><strong>Category:</strong> {viewingTask.category}</span>
                            <span><strong>Priority:</strong> {viewingTask.priority}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setViewingTask(null)} style={{ padding: '8px 16px', background: '#709775', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}


            {editingTask && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <form onSubmit={handleUpdateTask} style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '400px', maxWidth: '90%', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-main)' }}>Edit Task</h3>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #dcd6cd', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #dcd6cd', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Due Date</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #dcd6cd', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Priority</label>
                                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #dcd6cd' }}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #dcd6cd' }}>
                                    <option value="General">General</option>
                                    <option value="Work">Work</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Study">Study</option>
                                    <option value="Health">Health</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                            <button type="button" onClick={() => setEditingTask(null)} style={{ padding: '8px 14px', background: '#f3f4f6', border: '1px solid #dcd6cd', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                            <button type="submit" style={{ padding: '8px 14px', background: '#709775', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default WeeklyViewPage;