# E-commerce Backend

Este proyecto es un backend para un e-commerce que ofrece una variedad de funcionalidades, incluyendo autenticación de usuarios, gestión de productos, carrito de compras y finalización de compras. Está desarrollado en Node.js y utiliza Express.js como framework web.

## Funcionalidades

### Autenticación de usuarios:

- Los usuarios pueden registrarse e iniciar sesión con su email y contraseña.
- También se ofrece la opción de iniciar sesión con Google OAuth2.
- Recuperación de contraseña mediante envío de correo electrónico con un enlace para restablecerla.

### Gestión de productos:

- Los administradores y usuarios pueden agregar nuevos productos con imágenes.
- Se pueden modificar y eliminar productos existentes.
- Los administradores pueden modificar el rol de los usuarios a PREMIUM.

### Carrito de compras:

- Los usuarios pueden agregar productos al carrito y gestionar las unidades a comprar.

### Finalización de compras:

- Los usuarios pueden finalizar la compra, generando una orden que incluye los productos seleccionados y la información de envío.

## Requisitos previos

- Node.js instalado en tu sistema.

## Instalación

npm install

## Uso

1. Inicia el servidor:
   npm start

2. Accede a la aplicación en tu navegador:
   e-commerce http://localhost:8080/
   Administrador http://localhost:8080/admin/user

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- Handlebars (para las vistas)
- Passport.js (para la autenticación)
- Multer (para la gestión de archivos)
- Socket.io (para la comunicación en tiempo real)
- Nodemailer (para el envío de correos electrónicos)
- JWT (para la generación de tokens de autenticación)
