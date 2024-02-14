E-commerce Backend
Este es un proyecto de backend para un e-commerce que ofrece funcionalidades como autenticación de usuarios, gestión de productos, carrito de compras y finalización de compras. El proyecto está desarrollado en Node.js y utiliza Express.js como framework web.

Funcionalidades
Autenticación de usuarios:

Los usuarios pueden registrarse e iniciar sesión con su email y contraseña.
También se ofrece la opción de iniciar sesión con Google OAuth2.
Recuperación de contraseña mediante envío de correo electrónico con un enlace para restablecerla.

Gestión de productos:

Los administradores y usuarios pueden agregar nuevos productos con imágenes.
Se pueden modificar y eliminar productos existentes.
Los administradores puden modificar el rol de los usuario a PREMIUM.

Carrito de compras:

Los usuarios pueden agregar productos al carrito y gestionar las unidades a comprar.

Finalización de compras:

Los usuarios pueden finalizar la compra, generando una orden que incluye los productos seleccionados y la información de envío.

Requisitos previos
Node.js instalado en tu sistema.

Instala las dependencias usando npm:

npm install

Uso

Inicia el servidor:
npm start

Accede a la aplicación en tu navegador:
http://localhost:8080/

Tecnologías utilizadas
Node.js
Express.js
MongoDB
Mongoose
Handlebars (para las vistas)
Passport.js (para la autenticación)
Multer (para la gestión de archivos)
Socket.io (para la comunicación en tiempo real)
Nodemailer (para el envío de correos electrónicos)
JWT (para la generación de tokens de autenticación)
