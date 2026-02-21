import { useState, useCallback, useEffect } from 'react';
import {
    validateEmployee,
    checkDuplicateEmail,
    assignDepartment,
    validateUpdate,
    auditChange,
    checkDependencies,
    backupEmployee,
    fetchPage,
    checkPermissions,
} from '../utils/asyncSimulator';
import { initialEmployees, getNextId } from '../data/seedEmployees';

const IDLE = 'idle';
const LOADING = 'loading';
const SUCCESS = 'success';
const ERROR = 'error';

const STORAGE_KEY = 'crud_employees';

const opState = (status = IDLE, error = null) => ({ status, error });

/**
 * Load employees from localStorage, falling back to seed data.
 */
function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        /* ignore corrupt data */
    }
    return initialEmployees;
}

function saveToStorage(employees) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    } catch {
        /* quota exceeded — silently ignore */
    }
}

/**
 * Custom hook that encapsulates all employee CRUD logic
 * with parallel async simulated tasks and localStorage persistence.
 */
export default function useEmployeeCRUD() {
    const [employees, setEmployees] = useState(loadFromStorage);
    const [failRate, setFailRate] = useState(0.15);
    const [operationStates, setOperationStates] = useState({
        create: opState(),
        update: opState(),
        delete: opState(),
        list: opState(),
    });

    // Track which row is being operated on
    const [activeRowId, setActiveRowId] = useState(null);

    // Persist to localStorage whenever employees change
    useEffect(() => {
        saveToStorage(employees);
    }, [employees]);

    const setOpState = useCallback((op, status, error = null) => {
        setOperationStates((prev) => ({ ...prev, [op]: opState(status, error) }));
    }, []);

    // ─── CREATE ────────────────────────────────────────────────

    const createEmployee = useCallback(
        async (data) => {
            setOpState('create', LOADING);

            try {
                const results = await Promise.allSettled([
                    validateEmployee(data, failRate),
                    checkDuplicateEmail(data.email, employees, failRate),
                    assignDepartment(data.departamento, failRate),
                ]);

                const failures = results
                    .filter((r) => r.status === 'rejected')
                    .map((r) => r.reason.message);

                if (failures.length > 0) {
                    const errorMsg = failures.join(' | ');
                    setOpState('create', ERROR, errorMsg);
                    return { success: false, errors: failures };
                }

                const newEmployee = { ...data, id: getNextId() };
                setEmployees((prev) => [...prev, newEmployee]);
                setOpState('create', SUCCESS);

                setTimeout(() => setOpState('create', IDLE), 3000);
                return { success: true, employee: newEmployee };
            } catch (err) {
                setOpState('create', ERROR, err.message);
                return { success: false, errors: [err.message] };
            }
        },
        [employees, failRate, setOpState]
    );

    // ─── UPDATE ────────────────────────────────────────────────

    const updateEmployee = useCallback(
        async (id, newData) => {
            setOpState('update', LOADING);
            setActiveRowId(id);

            const oldData = employees.find((e) => e.id === id);
            if (!oldData) {
                setOpState('update', ERROR, 'Empleado no encontrado');
                setActiveRowId(null);
                return { success: false, errors: ['Empleado no encontrado'] };
            }

            try {
                const results = await Promise.allSettled([
                    validateUpdate(newData, failRate),
                    auditChange(oldData, newData, failRate),
                ]);

                const failures = results
                    .filter((r) => r.status === 'rejected')
                    .map((r) => r.reason.message);

                if (failures.length > 0) {
                    const errorMsg = failures.join(' | ');
                    setOpState('update', ERROR, errorMsg);
                    setActiveRowId(null);
                    return { success: false, errors: failures };
                }

                setEmployees((prev) =>
                    prev.map((e) => (e.id === id ? { ...e, ...newData } : e))
                );
                setOpState('update', SUCCESS);
                setActiveRowId(null);

                setTimeout(() => setOpState('update', IDLE), 3000);
                return { success: true };
            } catch (err) {
                setOpState('update', ERROR, err.message);
                setActiveRowId(null);
                return { success: false, errors: [err.message] };
            }
        },
        [employees, failRate, setOpState]
    );

    // ─── DELETE ────────────────────────────────────────────────

    const deleteEmployee = useCallback(
        async (id) => {
            setOpState('delete', LOADING);
            setActiveRowId(id);

            const employee = employees.find((e) => e.id === id);
            if (!employee) {
                setOpState('delete', ERROR, 'Empleado no encontrado');
                setActiveRowId(null);
                return { success: false, errors: ['Empleado no encontrado'] };
            }

            try {
                const results = await Promise.allSettled([
                    checkDependencies(id, failRate),
                    backupEmployee(employee, failRate),
                ]);

                const failures = results
                    .filter((r) => r.status === 'rejected')
                    .map((r) => r.reason.message);

                if (failures.length > 0) {
                    const errorMsg = failures.join(' | ');
                    setOpState('delete', ERROR, errorMsg);
                    setActiveRowId(null);
                    return { success: false, errors: failures };
                }

                setEmployees((prev) => prev.filter((e) => e.id !== id));
                setOpState('delete', SUCCESS);
                setActiveRowId(null);

                setTimeout(() => setOpState('delete', IDLE), 3000);
                return { success: true };
            } catch (err) {
                setOpState('delete', ERROR, err.message);
                setActiveRowId(null);
                return { success: false, errors: [err.message] };
            }
        },
        [employees, failRate, setOpState]
    );

    // ─── LIST (simulated pagination + permissions) ─────────────

    const loadEmployees = useCallback(
        async (page = 1, pageSize = 10) => {
            setOpState('list', LOADING);

            try {
                const results = await Promise.allSettled([
                    fetchPage(page, employees, pageSize, failRate),
                    checkPermissions(failRate),
                ]);

                const pageResult = results[0];
                const permResult = results[1];

                const failures = [];
                if (pageResult.status === 'rejected') failures.push(pageResult.reason.message);
                if (permResult.status === 'rejected') failures.push(permResult.reason.message);

                if (pageResult.status === 'rejected') {
                    const errorMsg = failures.join(' | ');
                    setOpState('list', ERROR, errorMsg);
                    return { success: false, errors: failures };
                }

                setOpState('list', SUCCESS);

                setTimeout(() => setOpState('list', IDLE), 3000);
                return { success: true, data: pageResult.value?.result, warnings: failures };
            } catch (err) {
                setOpState('list', ERROR, err.message);
                return { success: false, errors: [err.message] };
            }
        },
        [employees, failRate, setOpState]
    );

    return {
        employees,
        operationStates,
        activeRowId,
        failRate,
        setFailRate,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        loadEmployees,
    };
}
