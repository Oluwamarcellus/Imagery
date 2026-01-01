import AsyncStorage from "@react-native-async-storage/async-storage";

const useAsyncStorage = () => {
  const PREFIX = "@conversations:";
  const storage = {
    async set(key, value) {
      try {
        await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
      } catch (e) {
        return new Error(e);
      }
    },

    async get(key, fallback = null) {
      try {
        const value = await AsyncStorage.getItem(PREFIX + key);
        return value ? JSON.parse(value) : fallback;
      } catch (e) {
        return new Error(e);
      }
    },

    async remove(key) {
      try {
        await AsyncStorage.removeItem(PREFIX + key);
      } catch (e) {
        return new Error(e);
      }
    },
  };

  return storage;
};

export default useAsyncStorage;
