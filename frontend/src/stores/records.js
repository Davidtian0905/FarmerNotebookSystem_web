import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getAllTransactions } from '@/mock/database_flow';

export const useRecordsStore = defineStore('records', () => {
  const records = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const message = ref(null);

  const fetchRecords = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = getAllTransactions();
      if (!data) {
        throw new Error('No data returned');
      }
      records.value = data;
    } catch (e) {
      error.value = '获取记录失败，请稍后再试';
      console.error('获取记录错误:', e);
    } finally {
      loading.value = false;
    }
  };

  const clearData = () => {
    records.value = [];
  };

  const resetError = () => {
    error.value = null;
  };
  
  const setMessage = (msg) => {
    message.value = msg;
  };
  
  const resetMessage = () => {
    message.value = null;
  };

  const hasData = computed(() => records.value.length > 0);

  return {
    records,
    loading,
    error,
    message,
    fetchRecords,
    clearData,
    resetError,
    setMessage,
    resetMessage,
    hasData,
  };
});