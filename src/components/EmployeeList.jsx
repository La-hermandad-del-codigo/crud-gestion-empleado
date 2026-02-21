export default function EmployeeList({
    employees,
    onEdit,
    onDelete,
    operationStates,
    activeRowId,
}) {
    const isDeleting = operationStates?.delete?.status === 'loading';

    const formatSalary = (val) =>
        new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(val);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="employee-list-container">
            <div className="list-header">
                <h2>
                    <span className="list-icon">👥</span>
                    Empleados
                    <span className="badge-count">{employees.length}</span>
                </h2>
            </div>

            {employees.length === 0 ? (
                <div className="list-empty">
                    <p>No hay empleados registrados</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Departamento</th>
                                <th>Cargo</th>
                                <th>Salario</th>
                                <th>Ingreso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => {
                                const isRowActive = activeRowId === emp.id;
                                return (
                                    <tr
                                        key={emp.id}
                                        className={isRowActive ? 'row-active' : ''}
                                    >
                                        <td className="td-name">{emp.nombre}</td>
                                        <td className="td-email">{emp.email}</td>
                                        <td>
                                            <span className="dept-badge">{emp.departamento}</span>
                                        </td>
                                        <td>{emp.cargo}</td>
                                        <td className="td-salary">{formatSalary(emp.salario)}</td>
                                        <td className="td-date">{formatDate(emp.fechaIngreso)}</td>
                                        <td className="td-actions">
                                            <button
                                                className="btn-action btn-edit"
                                                onClick={() => onEdit(emp)}
                                                disabled={isRowActive}
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-action btn-delete"
                                                onClick={() => onDelete(emp.id)}
                                                disabled={isDeleting && isRowActive}
                                                title="Eliminar"
                                            >
                                                {isDeleting && isRowActive ? (
                                                    <span className="spinner-sm" />
                                                ) : (
                                                    '🗑️'
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
