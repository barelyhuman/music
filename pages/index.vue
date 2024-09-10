<script setup>
import { Howl, Howler } from 'howler'
import { STORAGE } from '../lib/constants'
import { isSafari } from '../lib/browser'
import { createAlert } from '../lib/alert'

Howler.autoUnlock = true

let player = new Howl({
  src: [''],
  format: 'mp3',
})

const volumeSteps = 5
const currLink = ref('')
const msg = ref('')
const activeIndex = ref(-1)
const playlist = ref([])
const volume = ref(100)
const processing = ref(false)
const loading = ref(false)
const error = ref('')
let volumeChangeRef = null
let volumeTextColor = ref('var(--gray)')

const errorAlert = createAlert(error)
const successAlert = createAlert(msg)

onMounted(() => {
  // Disable html5 in safari since the
  // streaming breaks with most keep alive implementations
  // that we have in node
  if (!isSafari()) {
    player = new Howl({
      src: [''],
      format: 'mp3',
      html5: true,
    })
  }

  let items = localStorage.getItem(STORAGE.TRACKS)

  if (!items) {
    items = []
  }

  try {
    items = JSON.parse(items)
  } catch (err) {
    // Digest
  }
  playlist.value = items

  // Setup howler listeners
  player.on('load', () => {
    player.play()
  })

  player.on('playerror', err => {
    error.value = err
  })

  player.on('play', () => {
    loading.value = false
  })

  player.on('end', () => {
    if (activeIndex.value + 1 > playlist.value.length - 1) {
      activeIndex.value = -1
      return
    }

    onNext()
  })

  window.addEventListener('keydown', windowKeyHandler)
})

onUnmounted(() => {
  window.removeEventListener('keydown', windowKeyHandler)
})

watch(playlist, () => {
  let value = []
  if (playlist.value) {
    value = playlist.value
  }
  localStorage.setItem(STORAGE.TRACKS, JSON.stringify(value))
})

watch(volume, () => {
  const playerVol = volume.value / 100
  if (volumeChangeRef) {
    clearTimeout(volumeChangeRef)
  }
  volumeTextColor.value = 'var(--accent)'
  volumeChangeRef = setTimeout(() => {
    volumeTextColor.value = 'var(--gray)'
  }, 750)
  player.volume(playerVol)
})

function windowKeyHandler(e) {
  volumeControls(e)
}

function volumeControls(e) {
  switch (e.code) {
    case 'ArrowUp': {
      if (volume.value + volumeSteps > 100) {
        return
      }
      volume.value += volumeSteps
      break
    }
    case 'ArrowDown': {
      if (volume.value - volumeSteps < 0) {
        return
      }
      volume.value -= volumeSteps
      break
    }
  }
  return
}

async function addToPlaylist(link) {
  try {
    currLink.value = ''

    const playableLink = `/api/play?link=${link}`

    const existingSet = new Set(playlist.value.map(x => x.link))

    if (existingSet.has(playableLink)) {
      errorAlert('Track already exists in the playlist...')
      return
    }
    processing.value = true
    const title = await $fetch(`/api/info?link=${link}`).then(x => x.title)

    playlist.value = playlist.value.concat({
      title,
      link: playableLink,
    })
    processing.value = false

    successAlert('Added to playlist')
  } catch (err) {
    errorAlert('Could not process for some reason')
  } finally {
    processing.value = false
  }
}

function removeFromPlaylist(link) {
  playlist.value = playlist.value.filter(x => x.link !== link)
  player.stop()
  player.unload()
  successAlert('Removed from playlist')
}

function onTrackClick(index) {
  loading.value = true
  playAtIndex(index)
}

async function playAtIndex(toPlayIndex) {
  const toPlay = playlist.value[toPlayIndex]
  if (!toPlay) return
  player.stop()
  player.unload()
  player._src = [toPlay.link]
  player.load()
  player.volume(volume.value / 100)
  activeIndex.value = toPlayIndex
}

function onNext() {
  const nextIndex = activeIndex.value + 1
  if (!playlist.value[nextIndex]) return
  loading.value = true
  playAtIndex(nextIndex)
}

function onPrev() {
  const prevIndex = activeIndex.value - 1
  if (!playlist.value[prevIndex]) return
  loading.value = true
  playAtIndex(prevIndex)
}

function onPlayPause() {
  if (player.playing()) {
    player.pause()
  } else {
    player.play()
  }
}
</script>

<template>
  <div class="music-container">
    <div flex items-center gap-2>
      <input placeholder="insert a youtube link" v-model="currLink" />
      <button @click="addToPlaylist(currLink)">Add</button>
    </div>
    <p text-gray v-if="activeIndex == -1">
      click on a track in the playlist to start
    </p>

    <div text-gray>
      <p v-if="processing">Getting track details...</p>
      <p v-if="loading">Loading Music...</p>
      <p text-red-100 bg-red-400 px-3 py-2 rounded-md v-if="error">
        {{ error }}
      </p>
      <p text-emerald-100 bg-emerald-400 px-3 py-2 rounded-md v-if="msg">
        {{ msg }}
      </p>
    </div>

    <div flex items-start gap-3>
      <button @click="onPrev()">Prev</button>
      <button @click="onPlayPause()">Play/Pause</button>
      <button @click="onNext()">Next</button>
      <div flex flex-col>
        <div flex items-center gap-2 class="border border-solid rounded-md p-2 border-light">
          <p text-gray class="p-0 m-0">Volume</p>
          <p p-0 m-0 class="border-0 appearance-none transition-colors duration-300"
            :style="{ color: volumeTextColor }">
            {{ volume }}
          </p>
        </div>
        <p p-0 m-0 text-gray text-xs>
          <small> Control volume with Up/Down </small>
        </p>
      </div>
    </div>

    <div>
      <h3>Playlist</h3>
      <ul v-if="playlist.length > 0" class="max-h-[350px]" overflow-y-auto>
        <li flex items-center justify-between v-for="(x, index) in playlist">
          <a @click="onTrackClick(index)" :class="activeIndex == index
              ? 'dark:text-emerald-400 text-emerald-500'
              : ''
            ">
            {{ x.title || x.link }}
          </a>
          <button @click="removeFromPlaylist(x.link)">Remove</button>
        </li>
      </ul>
    </div>

    <p text-gray v-if="playlist.length === 0">Nothing to show...</p>
  </div>
  <div text-gray text-sm fixed bottom-2 left-0 right-0 text-center>
    <p>
      <strong>Note: </strong>
      <small>Please try to avoid using this on Safari, it'll work, won't be nearly
        as fast as the other browsers though</small>
    </p>
  </div>
</template>

<style>
h3 {
  color: var(--a8);
  margin: 4px 0px;
}

.music-container {
  display: flex;
  flex-direction: column;
  width: 600px;
  margin: 0 auto;
  margin-top: 25vh;
  gap: 14px;
  font-size: 12px;
}

ul {
  margin: 0px;
  padding: 0px;
}

li {
  color: var(--a4);
  margin: 12px 0px;
  list-style-type: none;
}

li:hover {
  color: var(--a9);
}

.music-entry {
  display: flex;
  align-items: center;
  gap: 10px;
}

.text-secondary {
  color: var(--gray);
}
</style>
