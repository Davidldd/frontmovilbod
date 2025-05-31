<template>
  <router-view></router-view>
</template>

<style>
:root {
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --accent-color: #20c997;
  --success-color: #198754;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --light-color: #f8f9fa;
  --dark-color: #212529;
}

body {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
  transform: translateY(-2px);
}

.link-hover:hover {
  text-decoration: underline !important;
  color: var(--primary-color) !important;
}

.auth-card {
  transition: all 0.3s ease;
  max-width: 450px;
  width: 100%;
}

.auth-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.form-floating label {
  color: var(--secondary-color);
}

.form-floating>.form-control:focus~label {
  color: var(--primary-color);
}

.brand-title {
  color: var(--primary-color);
  font-weight: bold;
}

.auth-subtitle {
  color: var(--secondary-color);
}

.inventory-bg {
  background-image: url('https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  background-size: cover;
  background-position: center;
  position: relative;
}

.inventory-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 576px) {
  .auth-card {
    border-radius: 0;
    box-shadow: none;
  }
}
</style>