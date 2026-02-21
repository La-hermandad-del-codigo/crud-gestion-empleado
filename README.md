# 🏢 Gestión de Empleados — CRUD Async

Sistema de gestión de empleados frontend construido con **React + Vite** que demuestra el manejo de **operaciones asíncronas paralelas**, control de errores y sincronización de tareas — todo simulado sin backend real.

## ✨ Características principales

- **CRUD completo** — Crear, leer, actualizar y eliminar empleados
- **Simulación asíncrona** — Cada operación CRUD ejecuta múltiples tareas en paralelo usando `Promise.allSettled`
- **Persistencia local** — Los datos se guardan automáticamente en `localStorage`
- **Manejo de errores parciales** — Los fallos en tareas individuales no rompen el flujo completo
- **Estados granulares** — Cada operación tiene su propio estado (`idle` / `loading` / `success` / `error`)
- **Sin dependencias externas** — Solo React puro, sin Redux, Zustand ni backend

## 🚀 Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/La-hermandad-del-codigo/crud-gestion-empleado.git
cd crud-gestion-empleado

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

## 🗂️ Estructura del proyecto

```
src/
├── components/
│   ├── EmployeeForm.jsx    # Formulario crear/editar empleado
│   └── EmployeeList.jsx    # Tabla con acciones por fila
├── data/
│   └── seedEmployees.js    # Datos iniciales de ejemplo
├── hooks/
│   └── useEmployeeCRUD.js  # Custom hook con toda la lógica async
├── utils/
│   └── asyncSimulator.js   # Motor de simulación de tareas
├── App.jsx                 # Componente raíz
├── index.css               # Estilos (dark theme)
└── main.jsx                # Punto de entrada
```

## ⚙️ Lógica asíncrona por operación

Cada operación CRUD ejecuta tareas independientes en paralelo antes de confirmar el resultado:

| Operación     | Tareas paralelas                                                  |
|---------------|-------------------------------------------------------------------|
| **Crear**     | `validateEmployee` + `checkDuplicateEmail` + `assignDepartment`   |
| **Actualizar**| `validateUpdate` + `auditChange`                                  |
| **Eliminar**  | `checkDependencies` + `backupEmployee`                            |
| **Listar**    | `fetchPage` + `checkPermissions`                                  |

Todas las tareas usan `Promise.allSettled` para capturar resultados parciales sin cancelar las demás.

## 🧩 Componentes

### `useEmployeeCRUD` (Custom Hook)
Encapsula toda la lógica CRUD. Maneja:
- Lista de empleados en memoria como fuente de verdad
- Persistencia automática en `localStorage`
- Estados por operación (`idle` → `loading` → `success` | `error`)
- Ejecución paralela de tareas con `Promise.allSettled`

### `asyncSimulator.js`
Motor de simulación que envuelve funciones síncronas en promesas con:
- **Delays artificiales** aleatorios (400–1500ms)
- **Tasa de fallo** configurable por tarea (probabilidad 0–1)
- Validaciones reales de campos, email duplicado, etc.

### `EmployeeForm`
Formulario con soporte para modo **crear** y **editar**. Muestra mensajes de éxito/error inline según el estado de la operación.

### `EmployeeList`
Tabla de empleados con botones de **editar** y **eliminar** por fila. Muestra estado de carga individual por fila activa.

## 📋 Modelo de datos

```js
{
  id,              // Identificador único (auto-generado)
  nombre,          // Nombre completo
  email,           // Correo electrónico
  departamento,    // Área de la empresa
  cargo,           // Puesto del empleado
  salario,         // Salario en USD
  fechaIngreso     // Fecha de ingreso (YYYY-MM-DD)
}
```

## 🛠️ Stack técnico

| Tecnología | Uso |
|---|---|
| React 19 | UI con hooks (`useState`, `useEffect`, `useCallback`) |
| Vite 7 | Build tool y dev server |
| JavaScript | Sin TypeScript |
| CSS puro | Dark theme con custom properties |
| localStorage | Persistencia de datos |

## 📌 Conceptos demostrados

- ✔ `Promise.allSettled` para tareas paralelas independientes
- ✔ Errores parciales que no rompen el flujo
- ✔ Estados de carga granulares por operación
- ✔ Custom hooks para encapsular lógica compleja
- ✔ Simulación de latencia sin backend real
- ✔ Persistencia local con `localStorage`
