import malesIntencionsMarkdown from './males-intencions.md?raw'
import diumengeComunaMarkdown from './diumenge-a-la-comuna.md?raw'
import sortidaEquivocadaMarkdown from './la-sortida-equivocada.md?raw'
import perdutAlsSetantaMarkdown from './perdut-en-algun-lloc-dels-70.md?raw'
import finsQueLesRodesAguantinMarkdown from './fins-que-les-rodes-aguantin.md?raw'
import malesDecisionsGransCanconsMarkdown from './males-decisions-grans-cancons.md?raw'
import contraElsLlopsMarkdown from './contra-els-llops.md?raw'
import quanCallenElsLlopsMarkdown from './quan-callen-els-llops.md?raw'
import queUdolinElsLlopsMarkdown from './que-udolin-els-llops.md?raw'

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
const perdutAlsSetanta = parseStoryMarkdown(perdutAlsSetantaMarkdown)
const finsQueLesRodesAguantin = parseStoryMarkdown(finsQueLesRodesAguantinMarkdown)
const malesDecisionsGransCancons = parseStoryMarkdown(malesDecisionsGransCanconsMarkdown)
const contraElsLlops = parseStoryMarkdown(contraElsLlopsMarkdown)
const quanCallenElsLlops = parseStoryMarkdown(quanCallenElsLlopsMarkdown)
const queUdolinElsLlops = parseStoryMarkdown(queUdolinElsLlopsMarkdown)

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
}, {
  volume: 4,
  slug: 'perdut-en-algun-lloc-dels-70',
  title: perdutAlsSetanta.title,
  kicker: 'Va marxar pensant que necessitava saber on anava. Amb el temps va descobrir que potser era just al contrari.',
  description: perdutAlsSetanta.description,
  cover: '/covers/perdut-en-algun-lloc-dels-70.webp',
  coverAlt: 'Un jove de cabells llargs assegut al voral d’una carretera als anys setanta',
  spotifyUrl: 'https://open.spotify.com/playlist/2pMKY0K5VNmsXQLX9OVWZa?si=7fdc33bdd0a24a6e',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/2pMKY0K5VNmsXQLX9OVWZa?utm_source=generator&theme=0',
  tags: perdutAlsSetanta.tags,
  songCount: perdutAlsSetanta.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: perdutAlsSetanta.chapters,
}, {
  volume: 5,
  slug: 'fins-que-les-rodes-aguantin',
  title: finsQueLesRodesAguantin.title,
  kicker: 'Ens estimàvem prou per tornar sempre. No prou bé per deixar de fer-nos mal.',
  description: finsQueLesRodesAguantin.description,
  cover: '/covers/fins-que-les-rodes-aguantin.webp',
  coverAlt: 'Una parella abraçada dins d’un cotxe, en una fotografia nocturna en blanc i negre',
  spotifyUrl: 'https://open.spotify.com/playlist/1LyANTrvKYH5CfnIEHW3OR?si=b4f4b69c7cae411b',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/1LyANTrvKYH5CfnIEHW3OR?utm_source=generator&theme=0',
  tags: finsQueLesRodesAguantin.tags,
  songCount: finsQueLesRodesAguantin.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: finsQueLesRodesAguantin.chapters,
}, {
  volume: 6,
  slug: 'males-decisions-grans-cancons',
  title: malesDecisionsGransCancons.title,
  kicker: 'Algunes les tornaria a prendre. D’altres, probablement també.',
  description: malesDecisionsGransCancons.description,
  cover: '/covers/males-decisions-grans-cancons.webp',
  coverAlt: 'Un home amb ulleres de sol descansant en un descapotable davant del mar al capvespre',
  spotifyUrl: 'https://open.spotify.com/playlist/7nKGMetCe0UP5c84dcFfmL?si=5c6cb27f7c5c4cc3',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/7nKGMetCe0UP5c84dcFfmL?utm_source=generator&theme=0',
  tags: malesDecisionsGransCancons.tags,
  songCount: malesDecisionsGransCancons.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: malesDecisionsGransCancons.chapters,
}, {
  volume: 7,
  slug: 'contra-els-llops',
  title: contraElsLlops.title,
  kicker: 'No tots venien del bosc.',
  description: contraElsLlops.description,
  cover: '/covers/contra-els-llops.webp',
  coverAlt: 'Un home amb ulleres de sol i una pell de llop al cap, davant d’un bosc fosc',
  spotifyUrl: 'https://open.spotify.com/playlist/5C0II43NabSYWwPH6He7Jq?si=d2638f7429a9403a',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/5C0II43NabSYWwPH6He7Jq?utm_source=generator&theme=0',
  tags: contraElsLlops.tags,
  songCount: contraElsLlops.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: contraElsLlops.chapters,
}, {
  volume: 8,
  slug: 'quan-callen-els-llops',
  title: quanCallenElsLlops.title,
  kicker: 'La carretera continuava allà.',
  description: quanCallenElsLlops.description,
  cover: '/covers/quan-callen-els-llops.webp',
  coverAlt: 'Dos llops allunyant-se reflectits al retrovisor d’un cotxe al capvespre',
  spotifyUrl: 'https://open.spotify.com/playlist/6ajo73hj5QlkRjd7AGGc5B?si=9f03ac3b09ea447b',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/6ajo73hj5QlkRjd7AGGc5B?utm_source=generator&theme=0',
  tags: quanCallenElsLlops.tags,
  songCount: quanCallenElsLlops.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: quanCallenElsLlops.chapters,
}, {
  volume: 9,
  slug: 'que-udolin-els-llops',
  title: queUdolinElsLlops.title,
  kicker: 'Aprendre a no deixar de viure quan tornen.',
  description: queUdolinElsLlops.description,
  cover: '/covers/que-udolin-els-llops.webp',
  coverAlt: 'Una mà tatuada apujant el volum d’un radiocasset vell dins d’un cotxe',
  spotifyUrl: 'https://open.spotify.com/playlist/6aGV1aD2j7SsgNoQl0nBfy?si=c2108159b27145bb',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/6aGV1aD2j7SsgNoQl0nBfy?utm_source=generator&theme=0',
  tags: queUdolinElsLlops.tags,
  songCount: queUdolinElsLlops.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: queUdolinElsLlops.chapters,
}]

export const getPlaylist = (slug) => playlists.find((playlist) => playlist.slug === slug)
