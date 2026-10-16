import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TaskModal from './TaskModal';

function MainLayout() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleTaskAdded = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', margin: 0, padding: 0, background: 'var(--bg-color)' }}>
            <Sidebar
                onOpenCreateModal={() => {
                    console.log("Opening modal...");
                    setIsModalOpen(true);
                }}
            />

            <div style={{ flex: 1, minWidth: 0, padding: '32px 40px', boxSizing: 'border-box' }}>
                <Outlet key={refreshKey} />
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTaskAdded={handleTaskAdded}
            />
        </div>
    );
}

export default MainLayout;