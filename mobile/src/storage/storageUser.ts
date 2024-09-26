import AsyncStorage from '@react-native-async-storage/async-storage';

const USER = '@user';

export const storageUserSave = async (user: IUser) => {
  await AsyncStorage.setItem(USER, JSON.stringify(user));
};

export const storageUserGet = async () => {
  const storage = await AsyncStorage.getItem(USER);

  const user: IUser = storage ? JSON.parse(storage) : {};

  return user;
};

export const storageUserRemove = async () => {
  await AsyncStorage.removeItem(USER);
};
