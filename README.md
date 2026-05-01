**jse.link** es una aplicación web "Full Stack" de alto rendimiento diseñada para la gestión y optimización de enlaces. El proyecto utiliza una arquitectura moderna basada en micro-caché para redirecciones instantáneas y un sistema de cuotas para garantizar la estabilidad del servicio. Diseñado como una pieza clave de portafolio para demostrar habilidades en arquitectura de sistemas y despliegue.

## 🚀 Características

  * **Redirección Ultrarrápida**: Uso de **Redis** como capa de caché para resolver enlaces en milisegundos.
  * **Gestión de Enlaces**: Panel intuitivo para crear, gestionar y monitorear enlaces acortados.
  * **Seguridad y Control**: Implementación de Rate Limiting para prevenir abusos en la creación de links.
  * **Arquitectura Resiliente**: Diseño con "Graceful Degradation" que permite al sistema seguir funcionando vía MongoDB si Redis no está disponible.

## 🛠️ Stack Tecnológico

### Backend

  * **Node.js** con **TypeScript**: Entorno de ejecución robusto y tipado.
  * **Express**: Framework web para la construcción de la API REST.
  * **MongoDB Atlas**: Base de datos NoSQL para la persistencia de datos a largo plazo.
  * **Redis**: Almacenamiento en memoria para caché de redirecciones y control de tráfico.

### Frontend

  * **Next.js 16** con **TypeScript**.
  * **Fetch API**: Comunicación asíncrona optimizada con el backend mediante una arquitectura de servicios.
  * **Tailwind CSS**: Diseño moderno y responsivo.

-----

## 📦 Despliegue Local (Llave en mano)

El proyecto está completamente dockerizado para que puedas ejecutar tanto el backend como el servicio de caché sin configurar dependencias locales en tu sistema o WSL.

### Requisitos Previos

  * Tener instalado **Docker** y **Docker Desktop** (con integración WSL2 si usas Windows).
  * Una instancia de **MongoDB** (Local o Atlas).

### Pasos para Ejecutar

1.  **Clonar el repositorio**:

    ```bash
    git clone https://github.com/Jose4lb3rt0/jse.link
    cd jse.link
    ```

2.  **Configurar Variables de Entorno**:
    Crea un archivo llamado `.env` en la carpeta backend (basándote en `.env.example`):

    ```env
    PORT=5000
    MONGODB_URI=tu_uri_de_mongodb
    REDIS_URL=redis://cache:6379
    API_KEY=tu_clave_secreta
    ALLOWED_ORIGINS=http://localhost:3000
    ```

3.  **Lanzar con Docker Compose**:

    ```bash
    docker-compose up --build
    ```

4.  **Acceder a la aplicación**:

      * **Frontend (Next.js)**: `http://localhost:3000`
      * **Backend (API)**: `http://localhost:5000`
      * **API Docs**: `http://localhost:5000/docs`
    
## 🌐 Despliegue en Producción

El proyecto está optimizado para trabajar en entornos distribuidos:
* **Frontend**: Desplegado en **Vercel**.
* **Backend**: Alojado en **Railway** con soporte para dominios personalizados.
* **DNS & Seguridad**: Gestionado a través de **Cloudflare** para protección contra ataques y optimización de carga.