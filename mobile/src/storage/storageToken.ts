import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN = '@token';

export const storageTokenSave = async (token: string) => {
  await AsyncStorage.setItem(TOKEN, JSON.stringify(token));
};

export const storageTokenGet = async () => {
  const storage = await AsyncStorage.getItem(TOKEN);

  const token: string = storage ? JSON.parse(storage) : '';

  return token;
};

export const storageTokenRemove = async () => {
  await AsyncStorage.removeItem(TOKEN);
};
