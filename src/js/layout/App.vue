<script setup>
    import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
<nav class="navbar navbar-expand-lg bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link" active-class="active">Главная</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/about" class="nav-link" active-class="active">О компании</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</nav>
<div class="container">
 <RouterView />
</div>
</template>