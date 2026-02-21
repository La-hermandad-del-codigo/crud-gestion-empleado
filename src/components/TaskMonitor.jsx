import { useEffect, useRef } from 'react';

const STATUS_CONFIG = {
    pending: { label: 'Ejecutando', icon: '⏳', className: 'status-pending' },
    success: { label: 'Exitoso', icon: '✅', className: 'status-success' },
    error: { label: 'Error', icon: '❌', className: 'status-error' },
};

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

export default function TaskMonitor({ tasks, onClear }) {
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = 0;
        }
    }, [tasks]);

    const pendingCount = tasks.filter((t) => t.status === 'pending').length;
    const successCount = tasks.filter((t) => t.status === 'success').length;
    const errorCount = tasks.filter((t) => t.status === 'error').length;

    return (
        <div className="task-monitor">
            <div className="task-monitor-header">
                <h2>
                    <span className="monitor-icon">📡</span>
                    Monitor de Tareas
                </h2>
                {tasks.length > 0 && (
                    <button className="btn-clear" onClick={onClear} title="Limpiar tareas">
                        Limpiar
                    </button>
                )}
            </div>

            <div className="task-stats">
                <span className="stat stat-pending">
                    ⏳ {pendingCount}
                </span>
                <span className="stat stat-success">
                    ✅ {successCount}
                </span>
                <span className="stat stat-error">
                    ❌ {errorCount}
                </span>
            </div>

            {tasks.length === 0 ? (
                <div className="task-empty">
                    <p>No hay tareas en ejecución</p>
                    <span className="task-empty-hint">
                        Realiza una operación CRUD para ver las tareas paralelas aquí
                    </span>
                </div>
            ) : (
                <ul className="task-list" ref={listRef}>
                    {tasks.map((task) => {
                        const config = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
                        return (
                            <li
                                key={task.id}
                                className={`task-item ${config.className} ${task.isGroup ? 'task-group' : ''}`}
                            >
                                <div className="task-item-header">
                                    <span className="task-icon">{config.icon}</span>
                                    <span className="task-name">{task.task}</span>
                                    <span className="task-time">{formatTime(task.timestamp)}</span>
                                </div>

                                {task.status === 'pending' && (
                                    <div className="task-progress-bar">
                                        <div className="task-progress-fill" />
                                    </div>
                                )}

                                {task.result && task.status === 'success' && (
                                    <div className="task-result">
                                        {typeof task.result === 'object'
                                            ? JSON.stringify(task.result)
                                            : task.result}
                                    </div>
                                )}

                                {task.error && (
                                    <div className="task-error-msg">{task.error}</div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
