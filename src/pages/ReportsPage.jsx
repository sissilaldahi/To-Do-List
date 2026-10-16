import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTasks } from '../services/api';

function ReportsPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state directly from URL searchParams without an Effect
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPriority, setSelectedPriority] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedMonth, setSelectedMonth] = useState(() => searchParams.get('month') || 'All');
    const [selectedYear, setSelectedYear] = useState(() => searchParams.get('year') || 'All');

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchAllTasks = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const response = await getTasks(user.id);
            const sortedTasks = (response.data || []).sort((a, b) => {
                const dateA = new Date(a.created_at || a.due_date || 0);
                const dateB = new Date(b.created_at || b.due_date || 0);
                return dateA - dateB;
            });
            setTasks(sortedTasks);
        } catch (error) {
            console.error('Error fetching tasks for report:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchAllTasks();
    }, [fetchAllTasks]);

    useEffect(() => {
        const m = searchParams.get('month');
        const y = searchParams.get('year');
        if (m) setSelectedMonth(m);
        else setSelectedMonth('All');
        if (y) setSelectedYear(y);
        else setSelectedYear('All');
    }, [searchParams]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
            const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;

            const isDone = Number(task.is_completed) === 1;
            const matchesStatus = selectedStatus === 'All' ||
                (selectedStatus === 'Completed' && isDone) ||
                (selectedStatus === 'Pending' && !isDone);

            let matchesMonth = true;
            let matchesYear = true;

            if (task.due_date) {
                const [taskYear, taskMonth] = task.due_date.split(/[T ]/)[0].split('-');
                if (selectedMonth !== 'All') {
                    matchesMonth = taskMonth === selectedMonth;
                }
                if (selectedYear !== 'All') {
                    matchesYear = taskYear === selectedYear;
                }
            } else {
                if (selectedMonth !== 'All' || selectedYear !== 'All') {
                    matchesMonth = false;
                    matchesYear = false;
                }
            }

            return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesMonth && matchesYear;
        });
    }, [tasks, searchQuery, selectedCategory, selectedPriority, selectedStatus, selectedMonth, selectedYear]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => Number(t.is_completed) === 1).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            Urgent: { bg: '#fee2e2', color: '#ef4444' },
            High: { bg: '#fef3c7', color: '#d97706' },
            Medium: { bg: '#e0e7ff', color: '#4f46e5' },
            Low: { bg: '#d1fae5', color: '#059669' },
        };
        const style = colors[priority] || colors.Medium;
        return (
            <span style={{ background: style.bg, color: style.color, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                {priority || 'Medium'}
            </span>
        );
    };

    const handleClearDateFilter = () => {
        setSelectedMonth('All');
        setSelectedYear('All');
        searchParams.delete('month');
        searchParams.delete('year');
        setSearchParams(searchParams);
    };

    const getMonthName = (mNum) => {
        const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return names[parseInt(mNum, 10) - 1] || '';
    };

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main, #2c3e35)', margin: '0 0 4px 0' }}>
                        {selectedMonth !== 'All' && selectedYear !== 'All'
                            ? `Task Report: ${getMonthName(selectedMonth)} ${selectedYear}`
                            : 'Complete Task Activity Report'}
                    </h2>
                    <p style={{ color: 'var(--text-muted, #718076)', fontSize: '14px', margin: 0 }}>
                        Full historical audit trail of all tasks filtered by your criteria.
                    </p>
                </div>
                {(selectedMonth !== 'All' || selectedYear !== 'All') && (
                    <button
                        onClick={handleClearDateFilter}
                        style={{ padding: '8px 14px', background: '#709775', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                    >
                        Reset Date Filters
                    </button>
                )}
            </div>


            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Total Tasks Logged</span>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', margin: '8px 0 0 0', color: 'var(--text-main)' }}>{totalTasks}</h3>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <span style={{ color: '#059669', fontSize: '13px', fontWeight: '600' }}>Completed</span>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', margin: '8px 0 0 0', color: '#059669' }}>{completedTasks}</h3>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <span style={{ color: '#d97706', fontSize: '13px', fontWeight: '600' }}>Pending</span>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', margin: '8px 0 0 0', color: '#d97706' }}>{pendingTasks}</h3>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <span style={{ color: '#4f46e5', fontSize: '13px', fontWeight: '600' }}>Overall Success Rate</span>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', margin: '8px 0 0 0', color: '#4f46e5' }}>{completionRate}%</h3>
                </div>
            </div>

            <div style={{ background: '#fff', padding: '20px 24px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Search Task</label>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ flex: '1 1 130px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Month</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => {
                            setSelectedMonth(e.target.value);
                            if (e.target.value === 'All') searchParams.delete('month');
                            else searchParams.set('month', e.target.value);
                            setSearchParams(searchParams);
                        }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                    >
                        <option value="All">All Months</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>

                <div style={{ flex: '1 1 120px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Year</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            if (e.target.value === 'All') searchParams.delete('year');
                            else searchParams.set('year', e.target.value);
                            setSearchParams(searchParams);
                        }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                    >
                        <option value="All">All Years</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                    </select>
                </div>

                <div style={{ flex: '1 1 140px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                    >
                        <option value="All">All Categories</option>
                        <option value="General">General</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Study">Study</option>
                        <option value="Health">Health</option>
                    </select>
                </div>

                <div style={{ flex: '1 1 130px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Priority</label>
                    <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                    >
                        <option value="All">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>

                <div style={{ flex: '1 1 130px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Status</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>


            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>Historical Task Ledger</h3>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Showing {filteredTasks.length} of {totalTasks} records</span>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading historical data...</div>
                ) : filteredTasks.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks match your selected filter criteria.</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    <th style={{ padding: '14px 20px' }}>Task Title</th>
                                    <th style={{ padding: '14px 20px' }}>Category</th>
                                    <th style={{ padding: '14px 20px' }}>Start Date</th>
                                    <th style={{ padding: '14px 20px' }}>End / Due Date & Time</th>
                                    <th style={{ padding: '14px 20px' }}>Priority</th>
                                    <th style={{ padding: '14px 20px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map((task, index) => {
                                    const isDone = Number(task.is_completed) === 1;
                                    return (
                                        <tr key={task.id || index} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.1s' }}>
                                            <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--text-main)' }}>{task.title}</td>
                                            <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{task.category || 'General'}</td>
                                            <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                                {formatDateOnly(task.created_at || task.start_date || task.due_date)}
                                            </td>
                                            <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                                {formatDateTime(task.completed_at || task.due_date)}
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>{getPriorityBadge(task.priority)}</td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    background: isDone ? '#d1fae5' : '#fef3c7',
                                                    color: isDone ? '#059669' : '#d97706'
                                                }}>
                                                    {isDone ? 'Completed' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReportsPage;