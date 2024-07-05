<template>
  <div class="anime-list">
    <h1>Name's Anime List</h1>
    <button @click="toggleForm">{{ isFormHidden ? "+" : "-" }}</button>
    <form @submit.prevent="createAnime" v-if="!isFormHidden">
      <input v-model="formData.title" placeholder="title" required />
      <input v-model="formData.rating" type="number" />
      <select v-model="formData.status" required>
        <option value="Watching">Watching</option>
        <option value="Completed">Completed</option>
        <option value="On Hold">On Hold</option>
        <option value="Dropped">Dropped</option>
        <option value="Plan to Watch">Plan to Watch</option>
      </select>
      <!-- Create Anime -->
      <button type="submit">Create</button>
    </form>

    <ul class="anime-grid">
      <li class="grid-column-headers">
        <span>Rank</span>
        <span>Anime Title</span>
        <span>Rating</span>
        <span>Status</span>
        <span></span>
      </li>
      <li class="anime-item" v-for="(anime, index) in animes" :key="anime._id">
        <span>{{ index + 1 }}</span>
        <span>
          <template v-if="anime.isEditing">
            <input v-model="anime.title" />
          </template>
          <template v-else>
            {{ anime.title }}
          </template>
        </span>

        <span>
          <template v-if="anime.isEditing">
            <input type="number" min="0" max="10" v-model="anime.rating" />
          </template>
          <template v-else>
            {{ anime.rating === 0 ? "-" : anime.rating }}
          </template>
        </span>

        <span>
          <template v-if="anime.isEditing">
            <select v-model="anime.status">
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
        <div>
          <img
            class="settings-icon"
            src="../../public/settings.png"
            alt=""
            @click="anime.isShowMenu = !anime.isShowMenu"
          />
          <div class="menu-options" v-if="anime.isShowMenu">
            <button
              v-if="!anime.isEditing"
              @click="anime.isEditing = !anime.isEditing"
            >
              Edit
            </button>
            <button
              v-if="anime.isEditing"
              @click="
                updateAnime(anime._id, anime.title, anime.status, anime.rating)
              "
            >
              Save
            </button>
            <button
              v-if="anime.isEditing"
              @click="anime.isEditing = !anime.isEditing"
            >
              Cancel
            </button>
            <button
              v-if="!anime.isEditing"
              @click="deleteAnime(anime._id, anime.title)"
            >
              Delete
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Anime {
  _id: string;
  title: string;
  status: string;
  rating?: number;
  isEditing?: boolean;
  isShowMenu?: boolean;
}

export default defineComponent({
  name: "AnimeList",
  data() {
    return {
      animes: [] as Anime[],
      isFormHidden: true,
      formData: {
        title: "",
        rating: 0,
        status: "Watching",
      },
    };
  },
  mounted() {
    this.fetchAnimeData();
  },
  methods: {
    toggleForm() {
      this.isFormHidden = !this.isFormHidden;
    },
    async fetchAnimeData() {
      try {
        const response = await fetch("http://localhost:4000/api/animes");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Anime[] = await response.json();
        console.log(data);
        this.animes = data.map((anime) => ({
          ...anime,
          isEditingTitle: false,
          isEditingRating: false,
          isEditingStatus: false,
          isShowMenu: false,
        }));
      } catch (error) {
        console.error(`Error fetching anime data: ${error}`);
      }
    },
    async updateAnime(
      _id: string,
      title: string,
      status: string,
      rating?: number
    ) {
      try {
        const response = await fetch(
          `http://localhost:4000/api/animes/${_id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title,
              rating: rating,
              status: status,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newAnime = await response.json();
        console.log("Success:", newAnime);

        this.animes.push({
          ...newAnime,
          isEditing: false,
          isShowMenu: false,
        });

        window.location.reload();
      } catch (error) {
        console.error(`Error updating anime: ${error}`);
      }
    },
    async createAnime() {
      try {
        const response = await fetch(`http://localhost:4000/api/animes/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newAnime = await response.json();
        console.log("Success:", newAnime);

        this.animes.push({
          ...newAnime,
          isEditing: false,
          isShowMenu: false,
        });

        // Reset the form
        this.formData.title = "";
        this.formData.rating = 0;
        this.formData.status = "";
        this.isFormHidden = true;

        window.location.reload();
      } catch (error) {
        console.error(`Error creating anime: ${error}`);
      }
    },
    async deleteAnime(_id: string, title: string) {
      try {
        const userInput = prompt(
          `Are you sure you wish to delete ${title}? 'Yes or no' `
        );
        if (userInput?.toLowerCase() != "yes") {
          alert(`${title} was not deleted`);
          return;
        }
        const response = await fetch(
          `http://localhost:4000/api/animes/${_id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.animes = this.animes.filter((anime) => anime._id !== _id);
      } catch (error) {
        console.error(`Error deleting anime: ${error}`);
      }
    },
  },
});
</script>

<style scoped>
li {
  list-style-type: none;
}

.settings-icon {
  height: 10%;
  width: 10%;
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
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
}

.anime-item {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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
