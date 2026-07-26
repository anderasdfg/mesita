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
- **LocalStorage** para persistencia de datos

## 📦 Instalación

```bash
npm install
```

## 🏃 Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

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
