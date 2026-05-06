import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  DIAGNOSIS_HISTORY: 'dermai_diagnosis_history',
  USER_SETTINGS: 'dermai_user_settings',
  ASHA_BATCH_DATA: 'dermai_asha_batch_data',
};

export const StorageService = {
  async saveDiagnosis(data: any) {
    try {
      const existing = await this.getHistory();
      const updated = [data, ...existing];
      await AsyncStorage.setItem(KEYS.DIAGNOSIS_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save diagnosis', e);
    }
  },

  async getHistory() {
    try {
      const data = await AsyncStorage.getItem(KEYS.DIAGNOSIS_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get history', e);
      return [];
    }
  },

  async clearHistory() {
    await AsyncStorage.removeItem(KEYS.DIAGNOSIS_HISTORY);
  },

  async saveBatchData(data: any) {
    try {
      await AsyncStorage.setItem(KEYS.ASHA_BATCH_DATA, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save batch data', e);
    }
  },

  async getBatchData() {
    const data = await AsyncStorage.getItem(KEYS.ASHA_BATCH_DATA);
    return data ? JSON.parse(data) : null;
  }
};
