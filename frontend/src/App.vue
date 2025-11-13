<script setup>
import { ref, onMounted } from 'vue';
import { healthCheck, getItems, createItem, deleteItem } from './api';

const apiStatus = ref('Checking...');
const items = ref([]);
const newItemName = ref('');
const newItemDescription = ref('');
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  await checkHealth();
  await fetchItems();
});

const checkHealth = async () => {
  try {
    const response = await healthCheck();
    apiStatus.value = response.data.message;
  } catch (err) {
    apiStatus.value = 'API connection failed';
    error.value = err.message;
  }
};

const fetchItems = async () => {
  loading.value = true;
  try {
    const response = await getItems();
    items.value = response.data.results || response.data;
  } catch (err) {
    error.value = 'Failed to fetch items: ' + err.message;
  } finally {
    loading.value = false;
  }
};

const addItem = async () => {
  if (!newItemName.value) return;
  
  try {
    await createItem({
      name: newItemName.value,
      description: newItemDescription.value,
    });
    newItemName.value = '';
    newItemDescription.value = '';
    await fetchItems();
  } catch (err) {
    error.value = 'Failed to create item: ' + err.message;
  }
};

const removeItem = async (id) => {
  try {
    await deleteItem(id);
    await fetchItems();
  } catch (err) {
    error.value = 'Failed to delete item: ' + err.message;
  }
};
</script>

<template>
  <div class="app">
    <header>
      <h1>PanelApp2</h1>
      <p class="subtitle">Vue 3 + Django + PostgreSQL + nginx</p>
    </header>

    <div class="container">
      <div class="status-card">
        <h2>System Status</h2>
        <p class="status" :class="{ connected: apiStatus.includes('running') }">
          API: {{ apiStatus }}
        </p>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <div class="items-section">
        <h2>Items</h2>
        
        <div class="add-item-form">
          <input
            v-model="newItemName"
            type="text"
            placeholder="Item name"
            @keyup.enter="addItem"
          />
          <input
            v-model="newItemDescription"
            type="text"
            placeholder="Description"
            @keyup.enter="addItem"
          />
          <button @click="addItem" :disabled="!newItemName">Add Item</button>
        </div>

        <div v-if="loading" class="loading">Loading items...</div>
        
        <div v-else-if="items.length === 0" class="empty-state">
          No items yet. Add one above!
        </div>
        
        <div v-else class="items-list">
          <div v-for="item in items" :key="item.id" class="item-card">
            <div class="item-content">
              <h3>{{ item.name }}</h3>
              <p v-if="item.description">{{ item.description }}</p>
              <small>Created: {{ new Date(item.created_at).toLocaleString() }}</small>
            </div>
            <button @click="removeItem(item.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-size: 3rem;
  color: #42b883;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.2rem;
}

.container {
  display: grid;
  gap: 2rem;
}

.status-card,
.items-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #2c3e50;
}

.status {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-weight: 500;
}

.status.connected {
  background: #d4edda;
  color: #155724;
}

.error {
  color: #dc3545;
  margin-top: 1rem;
}

.add-item-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.add-item-form input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.add-item-form button {
  padding: 0.75rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.3s;
}

.add-item-form button:hover:not(:disabled) {
  background: #35a372;
}

.add-item-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading,
.empty-state {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.items-list {
  display: grid;
  gap: 1rem;
}

.item-card {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #42b883;
}

.item-content {
  flex: 1;
}

.item-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.item-content p {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.item-content small {
  color: #999;
}

.delete-btn {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #c82333;
}
</style>
