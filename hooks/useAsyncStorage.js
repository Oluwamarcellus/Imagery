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

    async removeItem(key) {
      try {
        const conversations = await AsyncStorage.getItem(
          PREFIX + "conversations"
        );
        const newConvo = JSON.parse(conversations).filter(
          (convo) => convo.id !== key.toString()
        );
        await AsyncStorage.setItem(
          PREFIX + "conversations",
          JSON.stringify(newConvo)
        );
      } catch (e) {
        return new Error(e);
      }
    },
  };

  return storage;
};

export default useAsyncStorage;
