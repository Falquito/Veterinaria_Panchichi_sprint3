# 🐾 Veterinaria Panchichi

Sistema de gestión para una veterinaria, desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**.  
Permite administrar productos, proveedores, depósitos, órdenes de compra y remitos.

---

## 🧰 Tecnologías utilizadas

- Node.js  
- NestJS  
- TypeScript  
- TypeORM  
- PostgreSQL  

---

## 📁 Estructura del proyecto
```bash
Veterinaria_Panchichi/
├── client/ # Frontend (si aplica)
├── server/ # Backend con NestJS
│ ├── src/
│ │ ├── categorias #Cada uno con sus dto,entities,controladores, servicios y modulos
│ │ ├── compra
│ │ ├── depositos
│ │ ├── facturas
│ │ ├── movimientos
│ │ ├── orden-de-compra
│ │ ├── productos
│ │ ├── proveedores
│ │ ├── providers
│ │ ├── entities/ # Entidades TypeORM
│ │ ├── app.module.ts
│ │ └── main.ts
│ ├── .env # Variables de entorno
│ └── ...
├── .gitignore
└── README.md
```

---

## ⚙️ Configuración inicial

1. Clonar el repositorio:  

   ```bash
   git clone https://github.com/Falquito/Veterinaria_Panchichi.git
   cd Veterinaria_Panchichi
   ```
2. Instalar dependencias (backend y frontend si aplica):
   ```bash
   cd server
   npm install
   ```
🚀 Ejecutar la aplicación

Modo desarrollo:
```bash
cd server
npm run start:dev
```

Si hay cliente (React/Angular):
```bash
cd client
npm run start
```

