# Sistema de Comunicación Cliente-Servidor
Este proyecto implementa un sistema de comunicación basado en una arquitectura cliente-servidor, diseñado para permitir la interacción en tiempo real entre múltiples clientes conectados a un servidor central. La solución utiliza Node.js para el backend y Electron para el frontend de los clientes, garantizando una experiencia segura, eficiente y multiplataforma.

## Características Principales
* Arquitectura Cliente-Servidor: Un servidor central gestiona la comunicación y distribuye mensajes entre los clientes conectados.
* Sockets TCP: Proporcionan una conexión persistente y bidireccional entre los clientes y el servidor.
* Seguridad: Los mensajes se cifran utilizando un algoritmo AES para garantizar la confidencialidad de la comunicación.
* Reconexión Automática: Los clientes intentan reconectarse automáticamente en caso de desconexión.
* Interfaz Gráfica Amigable: Desarrollada con Electron para facilitar la interacción de los usuarios

## Documentacion del código
### Servidor
[Documentacion Servidor](https://documentacion-servidor-saquicela.netlify.app/)

### Cliente
[Documentacion del Cliente](https://documentancion-frontend-saquicela.netlify.app/)

## Tecnologías y configariones implementadas
### Servidor
* Node.js v20
* Puerto configurado para el servidor por defecto: 8000

### Cliente
* Electron v33

## Instalacion y ejecucion
### Servidor
Navegar al directorio

```bash
cd backend
```

Instalar las dependencias

```bash
npm i
```

Iniciar el servidor
```bash
npm run dev
```

### Clientes
Navegar al directorio

```bash
cd client
cd frontend
```

Instalar las dependencias

```bash
npm i
```

Iniciar el servidor
```bash
npm run dev
```
