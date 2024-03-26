# Stock App

## Listado de Entidades

### empresas **(ED)**

- empresa_id **(PK)**
- nombre **(UQ)**
- usuarios
- fecha
- email **(UQ)**
- telefono **(UQ)**

### usuarios **(ED)**

- usuario_id **(PK)**
- nombre **(UQ)**
- apellidos
- password
- email **(UQ)**
- telefono
- activo
- fecha_creacion
- empresa_id **(FK)**
- rol_id **(FK)**

### roles **(EC)**

- rol_id **(PK)**
- nombre
- descripcion

### permisos **(EC)**

- permiso_id **(PK)**
- nombre
- descripcion

### roles_por_usuario **(EP)**

- rolesxu_id **(PK)**
- usuario_id **(FK)**
- rol_id **(FK)**

### permisos_por_roles **(EP)**

- permisosxr_id **(PK)**
- rol_id **(FK)**
- permiso_id **(FK)**

### productos

- producto_id **(PK)**
- nombre
- precio
- modelo
- proveedor_id **(FK)**
- stock
- descripcion

### proveedores

- proveedor_id **(PK)**
- nombre
- pais_id **(FK)**

### paises

- pais_id **(PK)**
- nombre

## Relaciones

- Un **usuario** posee **permisos** (_1 a M_)
- Un **usuario** posee **roles** (_1 a M_)
- Un **usuario** maneja **productos** (_1 a M_)
- Los **roles** se aplican como **roles_por_usuario** (_M a M_)
- Los **permisos** se aplican en base a **permisos_por_roles** (_M a M_ )
- Un **producto** proviene de un **proveedor** (_1 a 1_)
- Un **proveedor** es de un **pais** (_1 a 1_)
- Un **usuario** pertenece a una **empresa** (_1 a 1_)

## Reglas del Negocio

### Usuarios

- Crear un usuario.
- Leer un usuario.
- Leer todos los usuarios.
- Borrar un usuario.
- Modificar un usuario.
- Validar que el nombre del usuario no exista en la base de datos.
- Validar que el email del usuario no exista en la base de datos.
- Habilitar un usuario.
- Inhabilitar un usuario.
- Cambiar nombre de usuario o contraseña si es requerido por el usuario.

### Roles

- CRUD
- Verificar que no exista ninguno de los roles en la base de datos.

### Permisos

- CRUD
- Verificar que no exista ninguno de los permisos en la base de datos.

### Productos

- CRUD
- Aumentar o disminuir stock.

### Proveedores

- CRUD
- Verificar que no exista

### Paises

- CRUD
- Verificar que no exista

### Empresas

- CRUD
- Obtener la lista de usuarios de una empresa

- Empresas ✔ **Falta obtener usuarios**
- Paises ✔
- Productos ✔
- Proveedores ✔
