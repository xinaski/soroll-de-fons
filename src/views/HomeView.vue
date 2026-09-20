<template>
  <main>
    <SiteHeader />
    <section class="home-intro">
      <p class="eyebrow">Playlists narratives</p>
      <h1>Cançons que passen coses.</h1>
      <p>No són llistes per posar de fons. Són nits, records i petites derrotes explicades en l'ordre exacte en què haurien de sonar.</p>
    </section>

    <section class="archive" aria-labelledby="archive-title">
      <div class="section-rule"><h2 id="archive-title">Històries</h2><span>{{ publishedCount }} publicades</span></div>
      <div class="playlist-grid" :class="{ 'playlist-grid--single': playlists.length === 1 }">
        <article v-for="(playlist, index) in playlists" :key="playlist.slug" class="playlist-card" :class="{ 'playlist-card--featured': index === 0 }">
          <RouterLink :to="`/playlists/${playlist.slug}`" class="cover-link" :aria-label="`Llegir ${playlist.title}`"><PlaylistCover :playlist="playlist" /></RouterLink>
          <div class="card-copy">
            <p class="eyebrow">Vol. {{ String(index + 1).padStart(3, '0') }} · {{ playlist.songCount }} cançons</p>
            <h3><RouterLink :to="`/playlists/${playlist.slug}`">{{ playlist.title }}</RouterLink></h3>
            <p class="kicker">{{ playlist.kicker }}</p>
            <div class="tags"><span v-for="tag in playlist.tags" :key="tag">{{ tag }}</span></div>
            <RouterLink class="text-link" :to="`/playlists/${playlist.slug}`">Entrar en la història <span aria-hidden="true">↗</span></RouterLink>
          </div>
        </article>
      </div>
    </section>

    <footer><span>Soroll de fons © 2026</span><span>Fet per llegir amb els auriculars posats.</span></footer>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import SiteHeader from '../components/SiteHeader.vue'
import PlaylistCover from '../components/PlaylistCover.vue'
import { playlists } from '../content/playlists'

const publishedCount = computed(() => String(playlists.length).padStart(2, '0'))
</script>
