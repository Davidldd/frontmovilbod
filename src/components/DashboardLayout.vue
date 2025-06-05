<template>
  <div class="dashboard-layout">
    <!-- Navigation Bar -->
    <nav class="navbar navbar-dark bg-dark fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#"><i class="bi bi-minecart-loaded"></i> MovilBod</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item">
                <a class="nav-link" href="/dashboard"><i class="bi bi-graph-down"></i> Dashboard</a>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-shop-window"></i> Productos
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li><a class="dropdown-item" href="catalog/products">Catálogo completo</a></li>
                  <li><a class="dropdown-item" href="catalog/categories">Categorías y atributos</a></li>
                  <li><a class="dropdown-item" href="catalog/products/new">Nuevo producto</a></li>
                </ul>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-shuffle"></i> Movimientos
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li><a class="dropdown-item" href="/inventory/input">Registro de entradas</a></li>
                  <li><a class="dropdown-item" href="/inventory/output">Registro de salidas</a></li>
                  <li><a class="dropdown-item" href="/inventory/transfer">Traslados entre almacenes</a></li>
                  <li><a class="dropdown-item" href="/inventory/adjustment">Ajustes de inventario</a></li>
                </ul>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-buildings"></i> Almacenes
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li><a class="dropdown-item" href="#">Ubicaciones físicas</a></li>
                  <li><a class="dropdown-item" href="#">Balance entre sucursales</a></li>
                  <li><a class="dropdown-item" href="#">Mapa de almacén</a></li>
                </ul>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-clock"></i> Historial
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li><a class="dropdown-item" href="#">Trazabilidad por producto</a></li>
                  <li><a class="dropdown-item" href="#">Auditoría de cambios</a></li>
                  <li><a class="dropdown-item" href="#">Consulta general</a></li>
                </ul>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-buildings"></i> Proveedores
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li><a class="dropdown-item" href="#">Listado de proveedores</a></li>
                  <li><a class="dropdown-item" href="#">Órdenes de compra</a></li>
                  <li><a class="dropdown-item" href="#">Recepciones</a></li>
                </ul>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-book"></i> Reportes
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li><a class="dropdown-item" href="#">Stock actual</a></li>
                  <li><a class="dropdown-item" href="#">Rotación de inventario</a></li>
                  <li><a class="dropdown-item" href="#">Movimientos por periodo</a></li>
                </ul>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-bar-chart-line"></i> Herramientas
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li><a class="dropdown-item" href="#">Inventario físico</a></li>
                  <li><a class="dropdown-item" href="#">Importación masiva</a></li>
                  <li><a class="dropdown-item" href="#">Calendario de auditorías</a></li>
                </ul>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-handbag"></i> Integraciones
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li><a class="dropdown-item" href="#">Punto de Venta (POS)</a></li>
                  <li><a class="dropdown-item" href="#">Canales de e-commerce</a></li>
                  <li><a class="dropdown-item" href="#">Conectores API</a></li>
                </ul>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-person-gear"></i> Configuración
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li><a class="dropdown-item" href="#"> Usuarios y permisos</a></li>
                  <li><a class="dropdown-item" href="#"> Parámetros del sistema</a></li>
                  <li><a class="dropdown-item" href="#"> Plantillas de documentos</a></li>
                  <li><a class="dropdown-item" href="#"> Personalización campos</a></li>
                </ul>
              </li>

            </ul>
            <form class="d-flex mt-3" role="search">
              <button class="btn btn-success" type="submit"> Cerrar Sesion</button>
            </form>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content">
      <div class="content-wrapper">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
// No necesita lógica adicional por ahora
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  margin-top: 56px; /* Height of fixed navbar */
  flex: 1;
  background-color: #f8f9fa;
}

.content-wrapper {
  padding: 20px;
  min-height: calc(100vh - 56px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 15px;
  }
}

@media (max-width: 576px) {
  .content-wrapper {
    padding: 10px;
  }
}

/* Ensure proper spacing for modals */
.modal {
  z-index: 1055;
}

.offcanvas {
  z-index: 1050;
}
</style>