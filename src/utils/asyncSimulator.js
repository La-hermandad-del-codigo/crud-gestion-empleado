/**
 * Async Simulation Engine
 * Simulates backend operations with artificial delays and configurable failure rates.
 */

const randomDelay = (min = 400, max = 1500) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let taskIdCounter = 0;

/**
 * Wraps a sync validation function into an async simulated task.
 * @param {string} name - Display name of the task
 * @param {Function} fn - The actual validation/logic function (sync, returns value or throws)
 * @param {number} failRate - Probability of random failure (0 to 1)
 * @param {Function} onUpdate - Callback to report task status changes
 * @returns {Promise<{task: string, status: string, result: any, error: string|null}>}
 */
export async function simulateTask(name, fn, failRate = 0.1, onUpdate) {
    const taskId = ++taskIdCounter;
    const taskEntry = {
        id: taskId,
        task: name,
        status: 'pending',
        result: null,
        error: null,
        timestamp: Date.now(),
    };

    if (onUpdate) onUpdate({ ...taskEntry });

    await delay(randomDelay());

    // Random failure based on failRate
    if (Math.random() < failRate) {
        taskEntry.status = 'error';
        taskEntry.error = `[Simulated] ${name} falló aleatoriamente (tasa: ${(failRate * 100).toFixed(0)}%)`;
        if (onUpdate) onUpdate({ ...taskEntry });
        throw new Error(taskEntry.error);
    }

    try {
        const result = fn();
        taskEntry.status = 'success';
        taskEntry.result = result;
        if (onUpdate) onUpdate({ ...taskEntry });
        return taskEntry;
    } catch (err) {
        taskEntry.status = 'error';
        taskEntry.error = err.message;
        if (onUpdate) onUpdate({ ...taskEntry });
        throw err;
    }
}

// ─── CREATE helpers ──────────────────────────────────────────

export function validateEmployee(data, failRate, onUpdate) {
    return simulateTask(
        'Validar empleado',
        () => {
            const required = ['nombre', 'email', 'departamento', 'cargo', 'salario', 'fechaIngreso'];
            const missing = required.filter((f) => !data[f] || String(data[f]).trim() === '');
            if (missing.length > 0) {
                throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`);
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                throw new Error('Formato de email inválido');
            }
            if (Number(data.salario) <= 0) {
                throw new Error('El salario debe ser mayor a 0');
            }
            return 'Validación exitosa';
        },
        failRate,
        onUpdate
    );
}

export function checkDuplicateEmail(email, existingEmployees, failRate, onUpdate) {
    return simulateTask(
        'Verificar email duplicado',
        () => {
            const duplicate = existingEmployees.find(
                (e) => e.email.toLowerCase() === email.toLowerCase()
            );
            if (duplicate) {
                throw new Error(`El email "${email}" ya está registrado`);
            }
            return 'Email disponible';
        },
        failRate,
        onUpdate
    );
}

export function assignDepartment(dept, failRate, onUpdate) {
    return simulateTask(
        'Asignar departamento',
        () => {
            const validDepts = [
                'Ingeniería', 'Marketing', 'Ventas', 'RRHH',
                'Finanzas', 'Operaciones', 'Legal', 'Soporte',
            ];
            if (!validDepts.includes(dept)) {
                return `Departamento "${dept}" asignado (nuevo)`;
            }
            return `Departamento "${dept}" asignado correctamente`;
        },
        failRate,
        onUpdate
    );
}

// ─── UPDATE helpers ──────────────────────────────────────────

export function validateUpdate(data, failRate, onUpdate) {
    return simulateTask(
        'Validar actualización',
        () => {
            const required = ['nombre', 'email', 'departamento', 'cargo', 'salario'];
            const missing = required.filter((f) => !data[f] || String(data[f]).trim() === '');
            if (missing.length > 0) {
                throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`);
            }
            return 'Actualización válida';
        },
        failRate,
        onUpdate
    );
}

export function auditChange(oldData, newData, failRate, onUpdate) {
    return simulateTask(
        'Registrar auditoría',
        () => {
            const changes = [];
            for (const key of Object.keys(newData)) {
                if (oldData[key] !== newData[key]) {
                    changes.push(key);
                }
            }
            return `Auditoría registrada: ${changes.length} campo(s) modificado(s) [${changes.join(', ')}]`;
        },
        failRate,
        onUpdate
    );
}

// ─── DELETE helpers ──────────────────────────────────────────

export function checkDependencies(id, failRate, onUpdate) {
    return simulateTask(
        'Verificar dependencias',
        () => {
            return `Sin dependencias activas para empleado #${id}`;
        },
        failRate,
        onUpdate
    );
}

export function backupEmployee(employee, failRate, onUpdate) {
    return simulateTask(
        'Respaldo de datos',
        () => {
            return `Backup generado para ${employee.nombre} (${employee.email})`;
        },
        failRate,
        onUpdate
    );
}

// ─── LIST helpers ────────────────────────────────────────────

export function fetchPage(page, allData, pageSize, failRate, onUpdate) {
    return simulateTask(
        `Obtener página ${page}`,
        () => {
            const start = (page - 1) * pageSize;
            const items = allData.slice(start, start + pageSize);
            return { items, total: allData.length, page, pageSize };
        },
        failRate,
        onUpdate
    );
}

export function checkPermissions(failRate, onUpdate) {
    return simulateTask(
        'Verificar permisos',
        () => {
            return 'Permisos de lectura concedidos';
        },
        failRate,
        onUpdate
    );
}
