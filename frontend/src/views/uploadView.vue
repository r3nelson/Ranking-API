<template>
  <div class="file-upload">
    <input type="file" @change="handleFileUpload" />
    <button @click="uploadFile">Upload</button>
    <div v-if="uploadStatus">{{ uploadStatus }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "UploadView",
  setup() {
    const file = ref<File | null>(null);
    const uploadStatus = ref<string | null>(null);

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        file.value = target.files[0];
      }
    };

    const uploadFile = async () => {
      try {
        if (!file.value) {
          throw new Error("Please select a file to upload.");
        }

        uploadStatus.value = "Uploading file...";

        const baseURL = "http://localhost:4000"; // Replace with your backend URL
        const formData = new FormData();
        formData.append("file", file.value);

        const response = await fetch(`${baseURL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        uploadStatus.value = "File uploaded successfully!";
      } catch (error: any) {
        //   change any type to be type Error
        console.error("Error uploading file:", error.message);
        uploadStatus.value = `File upload failed: ${error.message}`;
      }
    };

    return {
      handleFileUpload,
      uploadFile,
      uploadStatus,
    };
  },
});
</script>

<style scoped>
.file-upload {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

input[type="file"] {
  margin-bottom: 10px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
