# Mesita - Sistema de Gestión de Pedidos para Restaurante

Sistema de gestión de pedidos para restaurantes con interfaz móvil para mozos y panel de caja/administración.

## 🚀 Características

- **Vista de Mesas**: Gestión visual del estado de las mesas (libre, ocupada, esperando pago)
- **Menú del Día**: Menús combinados (entrada + segundo) y platos a la carta por categorías de proteína
- **Control de Pedidos**: Panel del mozo para ver y gestionar todos los pedidos activos
- **Impresión Térmica**: 
  - Ticket de comanda (80mm) con precios para caja
  - Ticket de cocina (80mm) con letras grandes sin precios
- **Panel de Caja**: Procesamiento de pagos y cierre de mesas
- **Panel Admin**: CRUD de menús y productos

## 🛠️ Tecnologías

- **React 18** + **Vite**
- **Tailwind CSS** para estilos
- **Headless UI** para componentes accesibles
- **Lucide React** para iconos
- **Supabase** para base de datos en la nube y sincronización en tiempo real

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

1. Copia el archivo `.env.example` a `.env`
2. Ejecuta la migración SQL en Supabase (ver `SETUP_INSTRUCTIONS.md`)
3. Verifica que las tablas se crearon correctamente

## 🏃 Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📱 Acceso Multi-Dispositivo

**Caso de uso:** Hacer pedidos desde el celular, imprimir desde la laptop

- **Red Local**: Accede desde `http://TU_IP:5173` en el celular
- **Nube**: Despliega en Vercel/Netlify para acceso desde cualquier lugar

Ver `SETUP_INSTRUCTIONS.md` para instrucciones detalladas.

## 🏗️ Build

```bash
npm run build
```

## 📱 Navegación

- **Mesas**: Selecciona mesa y gestiona su estado
- **Pedido**: Control de todos los pedidos activos (panel del mozo)
- **Caja**: Procesamiento de pagos y cierre de mesas
- **Admin**: Gestión de menús y productos

## 🖨️ Impresión

El sistema está optimizado para impresoras térmicas de 80mm:
- Desde **Pedidos**: Imprimir comanda para cocina (sin precios)
- Desde **Caja**: Imprimir ticket de pago (con precios)

## 📝 Estructura de Datos

### Categorías de Platos a la Carta
- Pollo
- Carne
- Camarones
- Gallina
- Pato
- Pescado
- Bebidas

### Estados de Mesa
- Libre
- Ocupada
- Esperando Pago

## 🎨 Principios de Diseño

- Mobile-first
- SOLID y DRY
- Funciones en inglés, UI en español
- Componentes reutilizables

## 👨‍💻 Autor

Anderson Erley
