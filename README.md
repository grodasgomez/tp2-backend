## TP 2 Backend

Implementación de un sistema de reservas de mesas en restaurantes,
donde el sistema tendrá que mantener un registro de las mesas con sus coordenadas en
cada restaurante y la capacidad de cada una de ellas.

### Construcción
- [Node.js 18](https://nodejs.org/es/)
- [Sequelize 6](https://sequelize.org/)
- [Express 4](https://expressjs.com/es/)
### Requisitos
- Docker
- Docker Compose
- Extensiones
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Instalación

1. Hacer una copia del archivo `.env.example` y renombrarlo a `.env`

Las variables de entorno son las siguientes:

- `DB_HOST`: Host de la base de datos. Puede valer
  -  `localhost`: Si se está ejecutando el servidor de aplicaciones en la máquina local
  -  `tp2-backend-db`: Si se está ejecutando el servidor de aplicaciones en un contenedor de Docker
- `DB_NAME`: Nombre de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_PORT`: Puerto de la base de datos
- `DB_SYNC_MODE`: Modo de sincronización de la base de datos de Sequelize. Puede valer
  -  `alter`: Crea las tablas y las modifica si es necesario
  -  `force`: Borra todas las las tablas y las vuelve a crear

- `DOCKER_APP_PORT`: Puerto al acceder al contenedor de la aplicación desde la máquina local


### Ejecución

1. Ejecutar `docker-compose up` para levantar los contenedores de la aplicación y la base de datos


### Estructura de carpetas y archivos

- `errors`: Contiene los errores personalizados de la aplicación
- `handlers`: Contiene las funciones que manejan las peticiones HTTP
- `routes`: Contiene las rutas de la aplicación
- `utils`: Contiene funciones auxiliares
- `.eslintrc.js`: Configuración de ESLint para mostrar errores de sintaxis, estilos y buenas prácticas

### Importación de endpoints en Postman

1. Abrir Postman
2. Hacer click en `Import`
3. Abrir el archivo `postman_collection.json` que se encuentra en la raíz del proyecto
4. Listo!

