import malesIntencionsMarkdown from './males-intencions.md?raw'
import diumengeComunaMarkdown from './diumenge-a-la-comuna.md?raw'
import sortidaEquivocadaMarkdown from './la-sortida-equivocada.md?raw'

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

function cleanMarkdown(text) {
  return text.replace(/^\*\*(.+)\*\*$/, '$1').replace(/^\*(.+)\*$/, '$1').trim()
}

function parseStoryMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n')
  const title = lines.find((line) => line.startsWith('# '))?.slice(2).trim() ?? ''
  const descriptionStart = lines.findIndex((line) => line.trim() === '## Descripció')
  const tagsStart = lines.findIndex((line) => line.trim() === '## Etiquetes')
  const description = lines
    .slice(descriptionStart + 1, tagsStart)
    .map(cleanMarkdown)
    .filter(Boolean)
    .join(' ')
  const tags = lines
    .slice(tagsStart + 1)
    .find((line) => line.trim() && line.trim() !== '---')
    ?.split('·')
    .map((tag) => tag.trim())
    .filter(Boolean) ?? []

  const chapters = []
  let chapter
  let song

  for (const rawLine of lines.slice(tagsStart + 1)) {
    const line = rawLine.trim()
    const chapterMatch = line.match(/^# (Pròleg|Bloc [IVX]+|Epíleg)(?: — (.+))?$/)
    if (chapterMatch) {
      const number = String(chapters.length + 1).padStart(2, '0')
      chapter = {
        id: `bloc-${number}`,
        number,
        title: chapterMatch[2] ?? chapterMatch[1],
        subtitle: '',
        songs: [],
      }
      chapters.push(chapter)
      song = undefined
      continue
    }

    const songMatch = line.match(/^## (\d+)\. (.+?) — (.+)$/)
    if (songMatch && chapter) {
      song = {
        number: Number(songMatch[1]),
        artist: songMatch[3],
        title: songMatch[2],
        text: '',
      }
      chapter.songs.push(song)
      continue
    }

    if (!chapter || !line || line === '---') continue
    const cleaned = cleanMarkdown(line)
    if (song) song.text += `${song.text ? ' ' : ''}${cleaned}`
    else chapter.subtitle += `${chapter.subtitle ? ' ' : ''}${cleaned}`
  }

  return { title, description, tags, chapters }
}

const content = parsePlaylistMarkdown(malesIntencionsMarkdown)
const diumengeComuna = parseStoryMarkdown(diumengeComunaMarkdown)
const sortidaEquivocada = parseStoryMarkdown(sortidaEquivocadaMarkdown)

export const playlists = [{
  volume: 1,
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
}, {
  volume: 2,
  slug: 'diumenge-a-la-comuna',
  title: diumengeComuna.title,
  kicker: 'Només hi anàvem a passar la tarda. Ningú no ens havia dit res de dilluns.',
  description: diumengeComuna.description,
  cover: '/covers/diumenge-a-la-comuna.webp',
  coverAlt: "Una festa psicodèlica diürna davant d'una masia, envoltada de muntanyes",
  spotifyUrl: 'https://open.spotify.com/playlist/4XsDs3YTwBfFsHM3Dthhkj?si=0c1b4fef1a2445c7',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/4XsDs3YTwBfFsHM3Dthhkj?utm_source=generator&theme=0',
  tags: diumengeComuna.tags,
  songCount: diumengeComuna.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: diumengeComuna.chapters,
}, {
  volume: 3,
  slug: 'la-sortida-equivocada',
  title: sortidaEquivocada.title,
  kicker: 'Havíem de ser a Acapulco abans que es fes fosc. A partir d’aquí, les versions no coincideixen.',
  description: sortidaEquivocada.description,
  cover: '/covers/la-sortida-equivocada.webp',
  coverAlt: 'Dos homes viatjant en un descapotable pel desert mexicà',
  spotifyUrl: 'https://open.spotify.com/playlist/02SBXDV2MPRqYblhz0aNXd?si=a09602beb1294d7e',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/02SBXDV2MPRqYblhz0aNXd?utm_source=generator&theme=0',
  tags: sortidaEquivocada.tags,
  songCount: sortidaEquivocada.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: sortidaEquivocada.chapters,
}]

export const getPlaylist = (slug) => playlists.find((playlist) => playlist.slug === slug)
