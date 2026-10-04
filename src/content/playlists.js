import malesIntencionsMarkdown from './males-intencions.md?raw'
import diumengeComunaMarkdown from './diumenge-a-la-comuna.md?raw'
import sortidaEquivocadaMarkdown from './la-sortida-equivocada.md?raw'
import perdutAlsSetantaMarkdown from './perdut-en-algun-lloc-dels-70.md?raw'
import finsQueLesRodesAguantinMarkdown from './fins-que-les-rodes-aguantin.md?raw'
import malesDecisionsGransCanconsMarkdown from './males-decisions-grans-cancons.md?raw'
import contraElsLlopsMarkdown from './contra-els-llops.md?raw'
import quanCallenElsLlopsMarkdown from './quan-callen-els-llops.md?raw'
import queUdolinElsLlopsMarkdown from './que-udolin-els-llops.md?raw'
import siMhasDeDeixarMarkdown from './si-mhas-de-deixar-posa-aquestes.md?raw'
import ultimMotelMarkdown from './lultim-motel-abans-del-buit.md?raw'
import caleidoscopiaMarkdown from './caleidoscopia.md?raw'
import malaBavaMarkdown from './mala-bava.md?raw'
import polsSotaLesUnglesMarkdown from './pols-sota-les-ungles.md?raw'
import malaCollitaMarkdown from './mala-collita.md?raw'
import totMalamentGraciesMarkdown from './tot-malament-gracies.md?raw'
import ultimSoterraniTokioMarkdown from './lultim-soterrani-de-tokio.md?raw'
import ultimDolarPastisMarkdown from './lultim-dolar-per-un-pastis-de-poma-amb-gelat.md?raw'
import abansQueComencesPloureMarkdown from './abans-que-comences-a-ploure.md?raw'
import despresQueSortisSolMarkdown from './despres-que-sortis-el-sol.md?raw'
import gentlemanMarkdown from './gentleman.md?raw'
import turnOnTuneInDropOutMarkdown from './turn-on-tune-in-drop-out.md?raw'
import finsQueSacabiElCamiMarkdown from './fins-que-sacabi-el-cami.md?raw'
import demaMarkdown from './dema.md?raw'
import camisaDeQuadresMarkdown from './camisa-de-quadres.md?raw'
import foraDeTemporadaMarkdown from './fora-de-temporada.md?raw'

import disfoniaMarkdown from './disfonia.md?raw'

import sensePlansMarkdown from './sense-plans.md?raw'

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
const siMhasDeDeixar = parseStoryMarkdown(siMhasDeDeixarMarkdown)
const ultimMotel = parseStoryMarkdown(ultimMotelMarkdown)
const caleidoscopia = parseStoryMarkdown(caleidoscopiaMarkdown)
const malaBava = parseStoryMarkdown(malaBavaMarkdown)
const polsSotaLesUngles = parseStoryMarkdown(polsSotaLesUnglesMarkdown)
const malaCollita = parseStoryMarkdown(malaCollitaMarkdown)
const totMalamentGracies = parseStoryMarkdown(totMalamentGraciesMarkdown)
const ultimSoterraniTokio = parseStoryMarkdown(ultimSoterraniTokioMarkdown)
const ultimDolarPastis = parseStoryMarkdown(ultimDolarPastisMarkdown)
const abansQueComencesPloure = parseStoryMarkdown(abansQueComencesPloureMarkdown)
const despresQueSortisSol = parseStoryMarkdown(despresQueSortisSolMarkdown)
const gentleman = parseStoryMarkdown(gentlemanMarkdown)
const turnOnTuneInDropOut = parseStoryMarkdown(turnOnTuneInDropOutMarkdown)
const finsQueSacabiElCami = parseStoryMarkdown(finsQueSacabiElCamiMarkdown)
const dema = parseStoryMarkdown(demaMarkdown)
const camisaDeQuadres = parseStoryMarkdown(camisaDeQuadresMarkdown)
const foraDeTemporada = parseStoryMarkdown(foraDeTemporadaMarkdown)

const disfonia = parseStoryMarkdown(disfoniaMarkdown)

const sensePlans = parseStoryMarkdown(sensePlansMarkdown)

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
}, {
  volume: 10,
  slug: 'si-mhas-de-deixar-posa-aquestes',
  title: siMhasDeDeixar.title,
  kicker: 'Que almenys la caiguda tingui banda sonora.',
  description: siMhasDeDeixar.description,
  cover: '/covers/si-mhas-de-deixar-posa-aquestes.webp',
  coverAlt: 'Una mà alçada amb LOVE tatuat als dits i un anell al polze',
  spotifyUrl: 'https://open.spotify.com/playlist/26CEyjE8Tm1qgoq7Jce6hD?si=46fbd609f51e4bef',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/26CEyjE8Tm1qgoq7Jce6hD?utm_source=generator&theme=0',
  tags: siMhasDeDeixar.tags,
  songCount: siMhasDeDeixar.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: siMhasDeDeixar.chapters,
}, {
  volume: 11,
  slug: 'lultim-motel-abans-del-buit',
  title: ultimMotel.title,
  kicker: 'Una nit al Blue Moon Motel. La resta és difícil de demostrar.',
  description: ultimMotel.description,
  cover: '/covers/lultim-motel-abans-del-buit.webp',
  coverAlt: 'Un home amb barret, ulleres i cigarret carregant una màquina d’escriure vermella pel passadís d’un motel',
  spotifyUrl: 'https://open.spotify.com/playlist/6dh0tFDLrlx3qk84qLcjVu?si=227fea2324ff4ead',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/6dh0tFDLrlx3qk84qLcjVu?utm_source=generator&theme=0',
  tags: ultimMotel.tags,
  songCount: ultimMotel.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: ultimMotel.chapters,
}, {
  volume: 12,
  slug: 'caleidoscopia',
  title: caleidoscopia.title,
  kicker: 'Les mateixes peces. Un món diferent cada vegada que gires el tub.',
  description: caleidoscopia.description,
  cover: '/covers/caleidoscopia.webp',
  coverAlt: 'Dues persones assegudes al costat d’una piscina buida, davant d’un paisatge desèrtic',
  spotifyUrl: 'https://open.spotify.com/playlist/46qiN2A4HwGqMZtKZ9aFPv?si=d328c473ae564a4b',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/46qiN2A4HwGqMZtKZ9aFPv?utm_source=generator&theme=0',
  tags: caleidoscopia.tags,
  songCount: caleidoscopia.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: caleidoscopia.chapters,
}, {
  volume: 13,
  slug: 'mala-bava',
  title: malaBava.title,
  kicker: 'Una última i marxem.',
  description: malaBava.description,
  cover: '/covers/mala-bava.webp',
  coverAlt: 'Un músic estirat damunt d’una bateria enmig del caos d’un concert, tenyit de verd',
  spotifyUrl: 'https://open.spotify.com/playlist/5TAuLQza167NLdZWpRMVID?si=d3117bb82a1145c9',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/5TAuLQza167NLdZWpRMVID?utm_source=generator&theme=0',
  tags: malaBava.tags,
  songCount: malaBava.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: malaBava.chapters,
}, {
  volume: 14,
  slug: 'pols-sota-les-ungles',
  title: polsSotaLesUngles.title,
  kicker: 'Hi ha feines que s’acaben quan plegues. D’altres te les emportes a casa.',
  description: polsSotaLesUngles.description,
  cover: '/covers/pols-sota-les-ungles.webp',
  coverAlt: 'Un home cavant terra fosca amb una pala sota un cel de tempesta',
  spotifyUrl: 'https://open.spotify.com/playlist/2X7KwSgiUo4fXXTAZcbv1e?si=6c4efe3b6cde4727',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/2X7KwSgiUo4fXXTAZcbv1e?utm_source=generator&theme=0',
  tags: polsSotaLesUngles.tags,
  songCount: polsSotaLesUngles.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: polsSotaLesUngles.chapters,
}, {
  volume: 15,
  slug: 'mala-collita',
  title: malaCollita.title,
  kicker: 'Hi havia feina per fer. Aquest va ser el primer problema.',
  description: malaCollita.description,
  cover: '/covers/mala-collita.webp',
  coverAlt: 'Unes cames amb botes de cowboy descansant a la finestra d’una pickup groga al capvespre',
  spotifyUrl: 'https://open.spotify.com/playlist/60QpaYoPZfkzh9iL7jJgO5?si=69a9580f2d3d4a6b',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/60QpaYoPZfkzh9iL7jJgO5?utm_source=generator&theme=0',
  tags: malaCollita.tags,
  songCount: malaCollita.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: malaCollita.chapters,
}, {
  volume: 16,
  slug: 'tot-malament-gracies',
  title: totMalamentGracies.title,
  kicker: 'Tenia una entrevista de feina. La resta del dia va ser conseqüència d’això.',
  description: totMalamentGracies.description,
  cover: '/covers/tot-malament-gracies.webp',
  coverAlt: 'Un home tatuat assegut de nit en un banc amb una planta i un gos negre',
  spotifyUrl: 'https://open.spotify.com/playlist/6HKMAFRPYEB6mDQ10F3gDF?si=e5dcae559abc4c6e',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/6HKMAFRPYEB6mDQ10F3gDF?utm_source=generator&theme=0',
  tags: totMalamentGracies.tags,
  songCount: totMalamentGracies.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: totMalamentGracies.chapters,
}, {
  volume: 17,
  slug: 'lultim-soterrani-de-tokio',
  title: ultimSoterraniTokio.title,
  kicker: 'Hi ha llocs que no tanquen. Simplement deixen de tornar a obrir.',
  description: ultimSoterraniTokio.description,
  cover: '/covers/lultim-soterrani-de-tokio.webp',
  coverAlt: 'El propietari d’un petit club de jazz japonès fumant darrere la barra durant l’última nit',
  spotifyUrl: 'https://open.spotify.com/playlist/5V1SXK2greibNQsrpJ6y6v?si=ff5a29a0cd724f4b',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/5V1SXK2greibNQsrpJ6y6v?utm_source=generator&theme=0',
  tags: ultimSoterraniTokio.tags,
  songCount: ultimSoterraniTokio.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: ultimSoterraniTokio.chapters,
}, {
  volume: 18,
  slug: 'lultim-dolar-per-un-pastis-de-poma-amb-gelat',
  title: ultimDolarPastis.title,
  kicker: 'Pocs diners, molta carretera i una gana infinita de viure.',
  description: ultimDolarPastis.description,
  cover: '/covers/lultim-dolar-per-un-pastis-de-poma-amb-gelat.webp',
  coverAlt: 'Dos amics en un diner de la Route 66 mirant la posta de sol, amb pastís de poma sobre la taula',
  spotifyUrl: 'https://open.spotify.com/playlist/1bcZRkZVj29IBCH04UDq5L?si=c19f9a57b033435d',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/1bcZRkZVj29IBCH04UDq5L?utm_source=generator&theme=0',
  tags: ultimDolarPastis.tags,
  songCount: ultimDolarPastis.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: ultimDolarPastis.chapters,
}, {
  volume: 19,
  slug: 'abans-que-comences-a-ploure',
  title: abansQueComencesPloure.title,
  kicker: 'Tres amics, un cotxe abandonat a la carretera i mig milió de persones convençudes que aquell cap de setmana podia canviar alguna cosa.',
  description: abansQueComencesPloure.description,
  cover: '/covers/abans-que-comences-a-ploure.webp',
  coverAlt: 'Tres joves hippies arribant a peu a un festival multitudinari l’any 1969',
  spotifyUrl: 'https://open.spotify.com/playlist/2Jb5mR0aUknKs04CTBWGlL?si=4e02dc999a454ddb',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/2Jb5mR0aUknKs04CTBWGlL?utm_source=generator&theme=0',
  tags: abansQueComencesPloure.tags,
  songCount: abansQueComencesPloure.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: abansQueComencesPloure.chapters,
}, {
  volume: 20,
  slug: 'despres-que-sortis-el-sol',
  title: despresQueSortisSol.title,
  kicker: 'La pluja havia de durar una estona. La resta també.',
  description: despresQueSortisSol.description,
  cover: '/covers/despres-que-sortis-el-sol.webp',
  coverAlt: 'Tres amics bruts de fang caminant fora d’un festival hippie quan surt el sol',
  spotifyUrl: 'https://open.spotify.com/playlist/1717LbTR55Pxhen3sWuS3s?si=509cfbad2bbf48e0',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/1717LbTR55Pxhen3sWuS3s?utm_source=generator&theme=0',
  tags: despresQueSortisSol.tags,
  songCount: despresQueSortisSol.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: despresQueSortisSol.chapters,
}, {
  volume: 21,
  slug: 'gentleman',
  title: gentleman.title,
  kicker: 'Sempre deia gràcies. Fins i tot quan no calia.',
  description: gentleman.description,
  cover: '/covers/gentleman.webp',
  coverAlt: 'Un home tatuat amb americana de ratlles ajustant-se una corbata vermella',
  spotifyUrl: 'https://open.spotify.com/playlist/49MMamEbu7sYGBZTjJ4KEP?si=46dd89a9b08d4ed8',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/49MMamEbu7sYGBZTjJ4KEP?utm_source=generator&theme=0',
  tags: gentleman.tags,
  songCount: gentleman.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: gentleman.chapters,
}, {
  volume: 22,
  slug: 'turn-on-tune-in-drop-out',
  title: turnOnTuneInDropOut.title,
  kicker: 'Una tarda tranquil·la. Un escriptor que hauria d’estar escrivint. Una porta que no para d’obrir-se.',
  description: turnOnTuneInDropOut.description,
  cover: '/covers/turn-on-tune-in-drop-out.webp',
  coverAlt: 'Un rostre en colors magenta i blau amb espirals hipnòtiques reflectides a les ulleres',
  spotifyUrl: 'https://open.spotify.com/playlist/4cbuyGs1HWKmVx55pSYFW3?si=54af8209d2da4dc0',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/4cbuyGs1HWKmVx55pSYFW3?utm_source=generator&theme=0',
  tags: turnOnTuneInDropOut.tags,
  songCount: turnOnTuneInDropOut.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: turnOnTuneInDropOut.chapters,
}, {
  volume: 23,
  slug: 'fins-que-sacabi-el-cami',
  title: finsQueSacabiElCami.title,
  kicker: "Va sortir a caminar sense cap intenció de trobar-se a si mateix. Només volia arribar una mica més lluny que l'última vegada.",
  description: finsQueSacabiElCami.description,
  cover: '/covers/fins-que-sacabi-el-cami.webp',
  coverAlt: 'Unes botes de muntanya descansant davant d’un llac envoltat de cims al capvespre',
  spotifyUrl: 'https://open.spotify.com/playlist/0kAJtcdPb6Cj79yMj94bOL?si=b7d76082848e4303',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/0kAJtcdPb6Cj79yMj94bOL?utm_source=generator&theme=0',
  tags: finsQueSacabiElCami.tags,
  songCount: finsQueSacabiElCami.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: finsQueSacabiElCami.chapters,
}, {
  volume: 24,
  slug: 'dema',
  title: dema.title,
  kicker: 'Havien quedat per prendre una copa. Aquest va ser el primer error de càlcul.',
  description: dema.description,
  cover: '/covers/dema.webp',
  coverAlt: 'Les mans d’una parella asseguda molt a prop en un bar de llum càlida, amb una motxilla i dues cerveses',
  spotifyUrl: 'https://open.spotify.com/playlist/1mlGQXBfTA6TFSklLxLKEo?si=25a8d6bc87b84e94',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/1mlGQXBfTA6TFSklLxLKEo?utm_source=generator&theme=0',
  tags: dema.tags,
  songCount: dema.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: dema.chapters,
}, {
  volume: 25,
  slug: 'camisa-de-quadres',
  title: camisaDeQuadres.title,
  kicker: 'Al principi eren quatre. A mitja tarda ningú sabia quants eren.',
  description: camisaDeQuadres.description,
  cover: '/covers/camisa-de-quadres.webp',
  coverAlt: 'Un jove amb camisa de quadres tocant una guitarra al costat d’una casa de camp durant el capvespre',
  spotifyUrl: 'https://open.spotify.com/playlist/71Jon5dnMsccMxPFIXGOTb?si=a65e82e913a34635',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/71Jon5dnMsccMxPFIXGOTb?utm_source=generator&theme=0',
  tags: camisaDeQuadres.tags,
  songCount: camisaDeQuadres.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: camisaDeQuadres.chapters,
}, {
  volume: 26,
  slug: 'fora-de-temporada',
  title: foraDeTemporada.title,
  kicker: 'Hi ha llocs als quals no vas perquè passi alguna cosa. Hi vas perquè, durant una estona, no passi res.',
  description: foraDeTemporada.description,
  cover: '/covers/fora-de-temporada.webp',
  coverAlt: 'Una persona asseguda en una cadira plegable davant del mar durant una posta de sol d’hivern',
  spotifyUrl: 'https://open.spotify.com/playlist/3ZCqUbuGjIgnxMGlFC0ped?si=05e565ff54344aba',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/3ZCqUbuGjIgnxMGlFC0ped?utm_source=generator&theme=0',
  tags: foraDeTemporada.tags,
  songCount: foraDeTemporada.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: foraDeTemporada.chapters,
}, {
  volume: 27,
  slug: 'disfonia',
  title: disfonia.title,
  kicker: "Dues persones que encara s'estimen. Una última nit. I tot el que queda per dir quan ja no queda res a arreglar.",
  description: disfonia.description,
  cover: '/covers/disfonia.webp',
  coverAlt: 'Dues cadires buides al voltant d’una taula de fusta amb una ampolla i dos gots, il·luminades pel sol del matí',
  spotifyUrl: 'https://open.spotify.com/playlist/1ynBbcIlDIwGZBaC5IG0xW?si=0afc0ff427bc455d',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/1ynBbcIlDIwGZBaC5IG0xW?utm_source=generator&theme=0',
  tags: disfonia.tags,
  songCount: disfonia.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: disfonia.chapters,
}, {
  volume: 28,
  slug: 'sense-plans',
  title: sensePlans.title,
  kicker: 'Va sortir de casa sense cap pla. Va tornar quan el diumenge ja havia començat.',
  description: sensePlans.description,
  cover: '/covers/sense-plans.webp',
  coverAlt: 'Dues persones amb tatuatges assegudes juntes en uns graons de nit, amb una cervesa al costat',
  spotifyUrl: 'https://open.spotify.com/playlist/5oB7NbxBrwKxiQ5nq3QZ3r?si=f6baec7d72144ebc',
  spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/5oB7NbxBrwKxiQ5nq3QZ3r?utm_source=generator&theme=0',
  tags: sensePlans.tags,
  songCount: sensePlans.chapters.reduce((total, chapter) => total + chapter.songs.length, 0),
  chapters: sensePlans.chapters,
}]

export const getPlaylist = (slug) => playlists.find((playlist) => playlist.slug === slug)
