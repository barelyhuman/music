<script setup>
import { Howl, Howler } from "howler";
import { STORAGE } from "../lib/constants";
import { isSafari } from "../lib/browser";

Howler.autoUnlock = true;

let player = new Howl({
  src: [""],
  format: "mp3",
});

const currLink = ref("");

const activeIndex = ref(-1);

const playlist = ref([]);

const processing = ref(false);
const loading = ref(false);
const error = ref("");

onMounted(() => {
  // Disable html5 in safari since the
  // streaming breaks with most keep alive implementations
  // that we have in node
  if (!isSafari()) {
    player = new Howl({
      src: [""],
      format: "mp3",
      html5: true,
    });
  }

  let items = localStorage.getItem(STORAGE.TRACKS);

  if (!items) {
    items = [];
  }

  try {
    items = JSON.parse(items);
  } catch (err) {
    // Digest
  }
  playlist.value = items;

  // Setup howler listeners
  player.on("load", () => {
    player.play();
  });

  player.on("playerror", (err) => {
    error.value = err;
  });

  player.on("play", () => {
    loading.value = false;
  });

  player.on("end", () => {
    if (activeIndex.value + 1 > playlist.value.length - 1) {
      activeIndex.value = -1;
      return;
    }

    onNext();
  });
});

watch(playlist, () => {
  let value = [];
  if (playlist.value) {
    value = playlist.value;
  }
  localStorage.setItem(STORAGE.TRACKS, JSON.stringify(value));
});

async function addToPlaylist(link) {
  processing.value = true;
  const title = await $fetch(`/api/info?link=${link}`).then((x) => x.title);
  const playableLink = `/api/play?link=${link}`;
  playlist.value = playlist.value.concat({
    title,
    link: playableLink,
  });
  processing.value = false;
}

function removeFromPlaylist(link) {
  playlist.value = playlist.value.filter((x) => x.link !== link);
}

function onTrackClick(index) {
  loading.value = true;
  playAtIndex(index);
}

async function playAtIndex(toPlayIndex) {
  const toPlay = playlist.value[toPlayIndex];
  if (!toPlay) return;
  player.stop();
  player.unload();
  player._src = [toPlay.link];
  player.load();
  player.volume(1);
  activeIndex.value = toPlayIndex;
}

function onNext() {
  const nextIndex = activeIndex.value + 1;
  if (!playlist.value[nextIndex]) return;
  loading.value = true;
  playAtIndex(nextIndex);
}

function onPrev() {
  const prevIndex = activeIndex.value - 1;
  if (!playlist.value[prevIndex]) return;
  loading.value = true;
  playAtIndex(prevIndex);
}

function onPlayPause() {
  if (player.playing()) {
    player.pause();
  } else {
    player.play();
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
      <p v-if="error">{{ error }}</p>
    </div>

    <div flex items-center gap-3>
      <button @click="onPrev()">Prev</button>
      <button @click="onPlayPause()">Play/Pause</button>
      <button @click="onNext()">Next</button>
    </div>

    <div>
      <h3>Playlist</h3>
      <ul v-if="playlist.length > 0" class="max-h-[350px]" overflow-y-auto>
        <li flex items-center justify-between v-for="(x, index) in playlist">
          <a
            @click="onTrackClick(index)"
            :class="
              activeIndex == index
                ? 'dark:text-emerald-400 text-emerald-500'
                : ''
            "
          >
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
      <small
        >Please try to avoid using this on Safari, it'll work, won't be nearly
        as fast as the other browsers though</small
      >
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
  width: 400px;
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
