<script setup>
import { ref, onMounted } from 'vue';

const message = ref('chargement...');
const health = ref(null);

onMounted(async () => {
  try {
    const r = await fetch('/api/hello');
    const data = await r.json();
    message.value = data.message + ' (v' + data.version + ')';
  } catch (e) {
    message.value = 'Erreur backend: ' + e.message;
  }
  try {
    const r = await fetch('/api/health');
    health.value = await r.json();
  } catch {
    health.value = { status: 'down' };
  }
});
</script>

<template>
  <main>
    <h1>CI/CD Demo</h1>
    <p>{{ message }}</p>
    <pre v-if="health">{{ health }}</pre>
  </main>
</template>

<style>
body { font-family: system-ui, sans-serif; margin: 2rem; }
pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; }
</style>
