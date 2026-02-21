import { useState, useEffect } from 'react';

const DEPARTMENTS = [
    'Ingeniería', 'Marketing', 'Ventas', 'RRHH',
    'Finanzas', 'Operaciones', 'Legal', 'Soporte',
];

const emptyForm = {
    nombre: '',
    email: '',
    departamento: 'Ingeniería',
    cargo: '',
    salario: '',
    fechaIngreso: '',
};

export default function EmployeeForm({
    onSubmit,
    editingEmployee,
    onCancelEdit,
    operationState,
}) {
    const [form, setForm] = useState(emptyForm);
    const isEditing = !!editingEmployee;

    useEffect(() => {
        if (editingEmployee) {
            setForm({
                nombre: editingEmployee.nombre,
                email: editingEmployee.email,
                departamento: editingEmployee.departamento,
                cargo: editingEmployee.cargo,
                salario: editingEmployee.salario,
                fechaIngreso: editingEmployee.fechaIngreso,
            });
        } else {
            setForm(emptyForm);
        }
    }, [editingEmployee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form, salario: Number(form.salario) };
        const result = await onSubmit(data, editingEmployee?.id);
        if (result?.success && !isEditing) {
            setForm(emptyForm);
        }
    };

    const isLoading = operationState?.status === 'loading';

    return (
        <div className="employee-form-container">
            <h2>
                <span className="form-icon">{isEditing ? '✏️' : '➕'}</span>
                {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
            </h2>

            <form onSubmit={handleSubmit} className="employee-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre completo</label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Ana García"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="ana@empresa.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="departamento">Departamento</label>
                        <select
                            id="departamento"
                            name="departamento"
                            value={form.departamento}
                            onChange={handleChange}
                        >
                            {DEPARTMENTS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cargo">Cargo</label>
                        <input
                            id="cargo"
                            name="cargo"
                            type="text"
                            value={form.cargo}
                            onChange={handleChange}
                            placeholder="Ej: Desarrollador Senior"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="salario">Salario (USD)</label>
                        <input
                            id="salario"
                            name="salario"
                            type="number"
                            min="1"
                            value={form.salario}
                            onChange={handleChange}
                            placeholder="3500"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaIngreso">Fecha de ingreso</label>
                        <input
                            id="fechaIngreso"
                            name="fechaIngreso"
                            type="date"
                            value={form.fechaIngreso}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {operationState?.status === 'error' && (
                    <div className="form-error">
                        <span className="error-icon">⚠️</span>
                        {operationState.error}
                    </div>
                )}

                {operationState?.status === 'success' && (
                    <div className="form-success">
                        <span className="success-icon">✅</span>
                        {isEditing ? 'Empleado actualizado exitosamente' : 'Empleado creado exitosamente'}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading && <span className="spinner" />}
                        {isLoading
                            ? 'Procesando...'
                            : isEditing
                                ? 'Actualizar'
                                : 'Crear Empleado'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                onCancelEdit();
                                setForm(emptyForm);
                            }}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
