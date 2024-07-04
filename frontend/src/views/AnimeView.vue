<template>
  <div class="anime-list">
    <h1>Name's Anime List</h1>

    <ul class="anime-grid">
      <li class="grid-column-headers">
        <span>Rank</span>
        <span>Anime Title</span>
        <span>Rating</span>
        <span>Status</span>
      </li>
      <li class="anime-item" v-for="(anime, index) in animes" :key="anime.id">
        <span>{{ index + 1 }}</span>
        <span @click="toggleEdit(anime, 'title')">
          <template v-if="anime.isEditingTitle">
            <input v-model="anime.title" @change="saveField(anime, 'title')" />
          </template>
          <template v-else>
            {{ anime.title }}
          </template>
        </span>

        <span @click="toggleEdit(anime, 'rating')">
          <template v-if="anime.isEditingRating">
            <input
              type="number"
              min="0"
              max="10"
              v-model="anime.rating"
              @change="saveField(anime, 'rating')"
            />
          </template>
          <template v-else>
            {{ anime.rating ?? "-" }}
          </template>
        </span>

        <span @click="toggleEdit(anime, 'status')">
          <template v-if="anime.isEditingStatus">
            <select v-model="anime.status" @change="saveField(anime, 'status')">
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="dropped">Dropped</option>
              <option value="plan_to_watch">Plan to Watch</option>
            </select>
          </template>
          <template v-else>
            {{ anime.status }}
          </template>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Anime {
  id: string;
  title: string;
  status: string;
  rating?: number; // Optional field
  isEditingTitle?: boolean;
  isEditingRating?: boolean;
  isEditingStatus?: boolean;
}

export default defineComponent({
  name: "AnimeList",
  data() {
    return {
      animes: [] as Anime[],
    };
  },
  mounted() {
    this.fetchAnimeData();
  },
  methods: {
    async fetchAnimeData() {
      try {
        const response = await fetch("http://localhost:4000/api/animes");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Anime[] = await response.json();
        this.animes = data.map((anime) => ({
          ...anime,
          isEditingTitle: false,
          isEditingRating: false,
          isEditingStatus: false,
        }));
      } catch (error) {
        console.error(`Error fetching anime data: ${error}`);
      }
    },
    toggleEdit(anime: Anime, field: string) {
      if (field === "title") {
        anime.isEditingTitle = true;
      }
      if (field === "rating") {
        anime.isEditingRating = true;
      }
      if (field === "status") {
        anime.isEditingStatus = true;
      }
      //   anime[`isEditing${field.charAt(0).toUpperCase() + field.slice(1)}`] =
      //     true;
    },
    async saveField(anime: Anime, field: string) {
      try {
        const response = await fetch(
          `http://localhost:4000/api/animes/${anime.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ [field]: anime[field as keyof Anime] }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedAnime: Anime = await response.json();
        if (field === "title") {
          anime.isEditingTitle = false;
        }
        if (field === "rating") {
          anime.isEditingRating = false;
        }
        if (field === "status") {
          anime.isEditingStatus = false;
        }
        // anime[`isEditing${field.charAt(0).toUpperCase() + field.slice(1)}`] =
        //   false;

        const index = this.animes.findIndex((a) => a.id === anime.id);
        if (index !== -1) {
          this.animes[index] = updatedAnime;
        }
      } catch (error) {
        console.error(`Error updating anime ${field}: ${error}`);
      }
    },
  },
});
</script>

<style scoped>
li {
  list-style-type: none;
}

.anime-list {
  max-width: 800px;
  margin: 0 auto;
}

.anime-grid {
  display: grid;
}

.anime-grid > .grid-column-headers {
  font-weight: bold;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
}

.anime-item {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  border-bottom: 1px black solid;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 5px;
}

.anime-item span,
.anime-item select {
  padding: 10px;
}
</style>
