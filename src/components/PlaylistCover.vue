<template>
  <figure class="cover">
    <img :src="playlist.cover" :alt="playlist.coverAlt" />
    <figcaption><span>{{ playlist.title }}</span><small>SDF · 001</small></figcaption>
  </figure>
</template>

<script setup>
defineProps({ playlist: { type: Object, required: true } })
</script>
