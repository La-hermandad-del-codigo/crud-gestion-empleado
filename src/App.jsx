import { useState, useCallback, useEffect } from 'react';
import useEmployeeCRUD from './hooks/useEmployeeCRUD';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';

export default function App() {
  const {
    employees,
    operationStates,
    activeRowId,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    loadEmployees,
  } = useEmployeeCRUD();

  const [editingEmployee, setEditingEmployee] = useState(null);

  // Simulate initial load
  useEffect(() => {
    loadEmployees();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(
    async (data, editId) => {
      if (editId) {
        const result = await updateEmployee(editId, data);
        if (result.success) setEditingEmployee(null);
        return result;
      }
      return createEmployee(data);
    },
    [createEmployee, updateEmployee]
  );

  const handleEdit = useCallback((employee) => {
    setEditingEmployee(employee);
    document.querySelector('.employee-form-container')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (editingEmployee?.id === id) {
        setEditingEmployee(null);
      }
      return deleteEmployee(id);
    },
    [deleteEmployee, editingEmployee]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingEmployee(null);
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>
              <span className="logo-icon">🏢</span>
              Gestión de Empleados
            </h1>
            <p className="subtitle">
              CRUD con simulación de tareas asíncronas paralelas
            </p>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="app-main">
        <div className="main-content">
          <EmployeeForm
            onSubmit={handleSubmit}
            editingEmployee={editingEmployee}
            onCancelEdit={handleCancelEdit}
            operationState={
              editingEmployee
                ? operationStates.update
                : operationStates.create
            }
          />
          <EmployeeList
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            operationStates={operationStates}
            activeRowId={activeRowId}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Tareas paralelas simuladas con <code>Promise.allSettled</code> •
          React + Vite • localStorage
        </p>
      </footer>
    </div>
  );
}
