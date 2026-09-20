import malesIntencionsMarkdown from './males-intencions.md?raw'

function parsePlaylistMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n')
  const title = lines.find((line) => line.startsWith('# '))?.slice(2).trim() ?? ''
  const description = lines.slice(1).find((line) => line.trim() && !line.startsWith('#'))?.trim() ?? ''
  const chapters = []
  let chapter
  let song

  for (const rawLine of lines) {
    const line = rawLine.trim()
    const chapterMatch = line.match(/^## (\d{2}) — (.+)$/)
    if (chapterMatch) {
      chapter = { id: `bloc-${chapterMatch[1]}`, number: chapterMatch[1], title: chapterMatch[2], subtitle: '', songs: [] }
      chapters.push(chapter)
      song = undefined
      continue
    }
    if (chapter && line.startsWith('*') && line.endsWith('*') && !song) {
      chapter.subtitle = line.slice(1, -1)
      continue
    }
    const songMatch = line.match(/^### (\d+)\. (.+?) — (.+)$/)
    if (songMatch && chapter) {
      song = { number: Number(songMatch[1]), artist: songMatch[2], title: songMatch[3], text: '' }
      chapter.songs.push(song)
      continue
    }
    if (song && line && line !== '---') song.text += `${song.text ? ' ' : ''}${line}`
  }
  return { title, description, chapters }
}

const content = parsePlaylistMarkdown(malesIntencionsMarkdown)

export const playlists = [{
  slug: 'males-intencions',
  title: content.title,
  kicker: 'Una nit. Cinquanta cançons. Cap bona decisió.',
  description: content.description,
  cover: '/covers/males-intencions.webp',
  coverAlt: "Façana de la sala Apolo de Barcelona de nit, amb gent esperant a l'entrada",
  spotifyUrl: 'https://open.spotify.com/playlist/11nugF1ukvlv4fWqb2CTZi?si=193897c3c21d43f8',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/11nugF1ukvlv4fWqb2CTZi?utm_source=generator&theme=0',
  tags: ['Indie rock', 'Garage rock', 'Post-punk revival'],
  songCount: content.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: content.chapters,
}]

export const getPlaylist = (slug) => playlists.find((playlist) => playlist.slug === slug)
