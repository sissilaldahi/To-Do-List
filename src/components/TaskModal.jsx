import { useState, useEffect } from 'react';
import { createTask } from '../services/api';

function TaskModal({ isOpen, onClose, onTaskAdded }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('taskly_categories');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'General' },
            { id: 2, name: 'Work' },
            { id: 3, name: 'Personal' },
            { id: 4, name: 'Study' },
            { id: 5, name: 'Health' }
        ];
    });

    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatName, setEditCatName] = useState('');

    // Save categories to localStorage whenever updated
    useEffect(() => {
        localStorage.setItem('taskly_categories', JSON.stringify(categories));
    }, [categories]);

    if (!isOpen) return null;

    const user = JSON.parse(localStorage.getItem('user'));

    // Category Handlers
    const handleAddCategory = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const trimmed = newCategoryName.trim();
        if (!trimmed) return;

        // Check for duplicates
        if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
            setNewCategoryName('');
            setIsAddingCategory(false);
            setCategory(trimmed);
            return;
        }

        const newCat = { id: Date.now(), name: trimmed };
        setCategories([...categories, newCat]);
        setCategory(trimmed); // Auto-select new category
        setNewCategoryName('');
        setIsAddingCategory(false);
    };

    const handleDeleteCategory = (id, nameToDelete) => {
        if (categories.length <= 1) {
            alert('You must keep at least one category.');
            return;
        }
        const updated = categories.filter(c => c.id !== id);
        setCategories(updated);
        if (category === nameToDelete) {
            setCategory(updated[0].name);
        }
    };

    const handleSaveCatEdit = (id) => {
        const trimmed = editCatName.trim();
        if (!trimmed) return;

        setCategories(categories.map(c => {
            if (c.id === id) {
                if (category === c.name) setCategory(trimmed);
                return { ...c, name: trimmed };
            }
            return c;
        }));
        setEditingCatId(null);
        setEditCatName('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Task title is required.');
            return;
        }
        if (!user?.id) {
            setError('User not logged in. Please log in again.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const taskData = {
                user_id: user.id,
                title: title.trim(),
                description: description.trim(),
                category,
                priority,
                due_date: dueDate || new Date().toISOString().split('T')[0],
                is_completed: 0
            };

            await createTask(taskData);

            setTitle('');
            setDescription('');
            setCategory('General');
            setPriority('Medium');
            setDueDate('');

            if (onTaskAdded) onTaskAdded();
            onClose();
        } catch (err) {
            console.error('Error creating task:', err);
            setError('Failed to create task. Please check your backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: '#ffffff',
                padding: '30px',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '520px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                boxSizing: 'border-box',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--text-main, #2c3e35)' }}>Create New Task</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9ca3af' }}
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <div style={{ background: '#fef2f2', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-main, #2c3e35)', marginBottom: '6px' }}>Task Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Finish quarterly report"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color, #dcd6cd)', fontSize: '14px', boxSizing: 'border-box' }}
                            required
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main, #2c3e35)' }}>Category</label>
                            <span style={{ fontSize: '11px', color: '#6b7280' }}>Select, edit, or add custom</span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color, #dcd6cd)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={() => setIsAddingCategory(!isAddingCategory)}
                                style={{
                                    padding: '9px 14px',
                                    background: '#709775',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    fontSize: '15px'
                                }}
                                title="Add new category"
                            >
                                {isAddingCategory ? '✕' : '+'}
                            </button>
                        </div>

                        {isAddingCategory && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', background: 'rgba(112, 151, 117, 0.08)', padding: '10px', borderRadius: '8px', border: '1px dashed #709775' }}>
                                <input
                                    type="text"
                                    placeholder="New category name..."
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #dcd6cd', fontSize: '13px', outline: 'none' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    style={{ padding: '8px 14px', background: '#52796f', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Add
                                </button>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                            {categories.map((cat) => (
                                <div key={cat.id} style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', border: '1px solid #e5e7eb' }}>
                                    {editingCatId === cat.id ? (
                                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                value={editCatName}
                                                onChange={(e) => setEditCatName(e.target.value)}
                                                style={{ padding: '2px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #ccc', width: '70px' }}
                                            />
                                            <span onClick={() => handleSaveCatEdit(cat.id)} style={{ cursor: 'pointer', color: '#10b981', fontWeight: 'bold' }}>✓</span>
                                        </div>
                                    ) : (
                                        <span style={{ marginRight: '6px', color: '#374151', fontWeight: '600' }}>{cat.name}</span>
                                    )}

                                    {editingCatId !== cat.id && (
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <span
                                                onClick={() => { setEditingCatId(cat.id); setEditCatName(cat.name); }}
                                                style={{ cursor: 'pointer', opacity: 0.7 }}
                                                title="Edit category"
                                            >
                                                ✏️
                                            </span>
                                            <span
                                                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                                style={{ cursor: 'pointer', opacity: 0.7 }}
                                                title="Delete category"
                                            >
                                                🗑️
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-main, #2c3e35)', marginBottom: '6px' }}>Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color, #dcd6cd)', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-main, #2c3e35)', marginBottom: '6px' }}>Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color, #dcd6cd)', fontSize: '14px', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-main, #2c3e35)', marginBottom: '6px' }}>Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details about this task..."
                            rows="3"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color, #dcd6cd)', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color, #dcd6cd)', background: '#f3f4f6', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary, #709775)', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                        >
                            {loading ? 'Creating...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;