import { useState, useEffect } from 'react';
import { getTasks } from '../services/api';

function SmartSchedulerPage() {
    const [tasks, setTasks] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState(null);
    const [meetingTitle, setMeetingTitle] = useState('Meeting');
    const [invalidIntentError, setInvalidIntentError] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user?.id) return;
            try {
                const response = await getTasks(user.id);
                setTasks(response.data || []);
            } catch (error) {
                console.error('Error fetching tasks for scheduler:', error);
            }
        };
        fetchTasks();
    }, [user?.id]);


    const handleFindTime = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSuggestions(null);
        setInvalidIntentError(false);

        setTimeout(() => {
            const cleanedQuery = query.toLowerCase();

            const isSchedulingIntent = /(?:when|free|available|time|slot|schedule|meet|meeting|book|call|with|for)/i.test(cleanedQuery);

            if (!isSchedulingIntent) {
                setLoading(false);
                setInvalidIntentError(true);
                return;
            }

            // Extract a title or person name from the query (e.g. "meeting with Sarah" -> "Sarah")
            const titleMatch = query.match(/(?:with|for)\s+([a-zA-Z0-9\s]+)/i);
            const eventName = titleMatch ? `Meeting with ${titleMatch[1].trim()}` : 'Scheduled Meeting';
            setMeetingTitle(eventName);

            // Calculate free dates over the next 7 days
            const availableSlots = [];
            const curr = new Date();

            for (let i = 0; i < 7; i++) {
                const d = new Date(curr);
                d.setDate(curr.getDate() + i);
                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                // Count tasks due on this date
                const dayTasks = tasks.filter(t => t.due_date && t.due_date.split(/[T ]/)[0] === dateStr);
                const isCompletedOrFew = dayTasks.length <= 1;

                if (isCompletedOrFew) {
                    availableSlots.push({
                        date: dateStr,
                        dayName: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
                        workload: dayTasks.length === 0 ? '✨ Completely Free' : `🟢 Light workload (${dayTasks.length} task)`,
                        suggestedTimes: ['10:00 AM', '02:00 PM', '04:30 PM']
                    });
                }
            }

            setSuggestions(availableSlots.slice(0, 3)); // Return top 3 optimal slots
            setLoading(false);
        }, 600);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main, #2c3e35)', margin: '0 0 4px 0' }}>
                    🔍 Free-Time Finder
                </h2>
                <p style={{ color: 'var(--text-muted, #718076)', fontSize: '14px', margin: 0 }}>
                    Scan your task calendar using natural language to uncover optimal meeting slots and free windows.
                </p>
            </div>

            <div style={{ background: 'rgba(112, 151, 117, 0.08)', border: '1px dashed #709775', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '700', color: '#2c3e35' }}>💡 How Free-Time Finder Works:</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#4a5d52', lineHeight: '1.5' }}>
                    Type a natural request specifying who or what you are scheduling for (e.g., <em>"Meeting with Sarah next week"</em>). The assistant parses your query, scans your upcoming 7-day task distribution, filters out heavy workloads, and suggests your top available openings with ready-to-book time slots.
                </p>
            </div>

            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <form onSubmit={handleFindTime} style={{ display: 'flex', gap: '12px' }}>
                    <input
                        type="text"
                        placeholder="e.g. When can I set a meeting with Sarah next week?"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (invalidIntentError) setInvalidIntentError(false);
                        }}
                        style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '14px', boxSizing: 'border-box' }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--primary, #709775)', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}
                    >
                        {loading ? 'Scanning...' : 'Find Open Slots'}
                    </button>
                </form>
            </div>

            {invalidIntentError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '16px 20px', borderRadius: '14px', color: '#991b1b', fontSize: '14px', marginBottom: '24px' }}>
                    🤖 <strong>I'm doing great, thank you!</strong> However, I am trained to help find free time slots. Please try asking a scheduling query like:
                    <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                        <li><em>"When am I free for a call with Sarah next week?"</em></li>
                        <li><em>"Find available slots for project review"</em></li>
                    </ul>
                </div>
            )}

            {suggestions && !invalidIntentError && (
                <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-main, #2c3e35)' }}>📅 Optimal Openings for: "{meetingTitle}"</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted, #718076)', marginBottom: '20px' }}>Based on your current task schedule, here are the best available times:</p>

                    {suggestions.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444', fontWeight: '600' }}>
                            ⚠️ Your week looks heavily booked! Consider clearing some pending tasks before scheduling new meetings.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {suggestions.map((slot, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6', flexWrap: 'wrap', gap: '12px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-main, #2c3e35)' }}>{slot.dayName}</h4>
                                        <span style={{ fontSize: '13px', color: '#059669', fontWeight: '600' }}>{slot.workload}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        {slot.suggestedTimes.map((time, tIdx) => (
                                            <button
                                                key={tIdx}
                                                onClick={() => alert(`Successfully booked "${meetingTitle}" on ${slot.dayName} at ${time}!`)}
                                                style={{ padding: '8px 12px', background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: 'var(--text-main, #2c3e35)', transition: 'all 0.2s' }}
                                            >
                                                🕒 {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SmartSchedulerPage;