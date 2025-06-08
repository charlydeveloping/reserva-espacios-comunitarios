<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Set page title and meta
useHead({
  titleTemplate: '%s - Reserva de Espacios Comunitarios',
  meta: [
    { name: 'description', content: 'Sistema de gestión de reservas para espacios comunitarios' },
    { name: 'keywords', content: 'reservas, espacios comunitarios, gestión, calendario' }
  ]
})
</script>
