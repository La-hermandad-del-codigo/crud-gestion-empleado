/**
 * Seed data — initial employees for the simulation
 */

let nextId = 7;
export const getNextId = () => nextId++;

export const initialEmployees = [
    {
        id: 1,
        nombre: 'Ana García',
        email: 'ana.garcia@empresa.com',
        departamento: 'Ingeniería',
        cargo: 'Desarrolladora Senior',
        salario: 4500,
        fechaIngreso: '2022-03-15',
    },
    {
        id: 2,
        nombre: 'Carlos López',
        email: 'carlos.lopez@empresa.com',
        departamento: 'Marketing',
        cargo: 'Coordinador de Campañas',
        salario: 3200,
        fechaIngreso: '2023-01-10',
    },
    {
        id: 3,
        nombre: 'María Torres',
        email: 'maria.torres@empresa.com',
        departamento: 'RRHH',
        cargo: 'Especialista en Reclutamiento',
        salario: 3000,
        fechaIngreso: '2021-08-22',
    },
    {
        id: 4,
        nombre: 'Pedro Ramírez',
        email: 'pedro.ramirez@empresa.com',
        departamento: 'Ventas',
        cargo: 'Ejecutivo de Cuentas',
        salario: 3800,
        fechaIngreso: '2022-11-05',
    },
    {
        id: 5,
        nombre: 'Laura Mendoza',
        email: 'laura.mendoza@empresa.com',
        departamento: 'Finanzas',
        cargo: 'Analista Financiera',
        salario: 4000,
        fechaIngreso: '2023-06-18',
    },
    {
        id: 6,
        nombre: 'Jorge Fernández',
        email: 'jorge.fernandez@empresa.com',
        departamento: 'Operaciones',
        cargo: 'Gerente de Logística',
        salario: 5200,
        fechaIngreso: '2020-02-28',
    },
];
