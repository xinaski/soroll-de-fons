<template>
  <figure class="cover">
    <img :src="playlist.cover" :alt="playlist.coverAlt" />
    <figcaption><span>{{ playlist.title }}</span><small>SDF · {{ String(playlist.volume).padStart(3, '0') }}</small></figcaption>
  </figure>
</template>

<script setup>
defineProps({ playlist: { type: Object, required: true } })
</script>
