<template>
  <main v-if="playlist">
    <SiteHeader />
    <div class="detail-layout">
      <aside class="playlist-identity">
        <RouterLink to="/" class="back-link">← Totes les històries</RouterLink>
        <PlaylistCover :playlist="playlist" />
        <a class="spotify-button desktop-spotify" :href="playlist.spotifyUrl" target="_blank" rel="noreferrer"><span class="spotify-dot">▶</span> Escoltar a Spotify</a>
        <div class="identity-meta"><span>{{ playlist.songCount }} cançons</span><span>{{ playlist.chapters.length }} capítols</span></div>
      </aside>

      <article class="story">
        <header class="story-lead">
          <p class="eyebrow">Soroll de fons · Vol. {{ String(playlist.volume).padStart(3, '0') }}</p>
          <h1>{{ playlist.title }}</h1>
          <p class="story-kicker">{{ playlist.kicker }}</p>
          <p class="description">{{ playlist.description }}</p>
          <nav class="chapter-nav" aria-label="Capítols">
            <a v-for="chapter in playlist.chapters" :key="chapter.id" :href="`#${chapter.id}`"><span>{{ chapter.number }}</span>{{ chapter.title }}</a>
          </nav>
        </header>

        <section v-for="chapter in playlist.chapters" :id="chapter.id" :key="chapter.id" class="chapter">
          <header class="chapter-header"><span>{{ chapter.number }}</span><div><h2>{{ chapter.title }}</h2><p>{{ chapter.subtitle }}</p></div></header>
          <ol class="track-list" :start="chapter.songs[0]?.number">
            <li v-for="song in chapter.songs" :key="song.number" class="track">
              <span class="track-number">{{ String(song.number).padStart(2, '0') }}</span>
              <div><p class="track-title"><strong>{{ song.artist }}</strong> — {{ song.title }}</p><p>{{ song.text }}</p></div>
            </li>
          </ol>
          <a href="#top" class="chapter-top">Tornar a l'índex ↑</a>
        </section>
      </article>
    </div>
    <a class="spotify-button mobile-spotify" :href="playlist.spotifyUrl" target="_blank" rel="noreferrer"><span class="spotify-dot">▶</span> Escoltar a Spotify</a>
  </main>
  <main v-else class="not-found"><SiteHeader /><h1>Aquesta història no existeix.</h1><RouterLink to="/">Tornar a l'arxiu</RouterLink></main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'
import PlaylistCover from '../components/PlaylistCover.vue'
import { getPlaylist } from '../content/playlists'

const route = useRoute()
const playlist = computed(() => getPlaylist(route.params.slug))
</script>
