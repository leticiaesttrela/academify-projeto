import { Button } from "@/src/components/Button";
import { Colors } from "@/src/constants/Colors";
import { useAuth } from "@/src/hooks/useAuth";
import { api } from "@/src/lib/api";
import { storageUserSave } from "@/src/storage/storageUser";
import { API_URL } from '@env';
import { isAxiosError } from "axios";
import * as ImagePicker from 'expo-image-picker';
import { PenBox } from "lucide-react-native";
import { Alert, Image, Text, ToastAndroid, TouchableOpacity, View } from "react-native";

export const Profile = () => {
  const { user, setUser, removeUserAndToken } = useAuth();

  const handleLogout = async () => {
    await removeUserAndToken();
    ToastAndroid.show('Você saiu da sua conta!', 300);
  }

  const handleUpdateImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        const formData = new FormData();

        formData.append('file', {
          uri: imageUri,
          name: 'image.jpg',
          type: 'image/jpeg',
        } as any);

        const response = await api.patch('/me/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const userModified = {
          ...(user as IUser),
          imageUrl: response.data.imageUrl,
        };

        await storageUserSave(userModified);
        setUser(userModified);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;


        if (errorMessage === 'Unauthorized') {
          await removeUserAndToken();
          ToastAndroid.show('Sessão expirada', 300);
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar atualizar a imagem');
      }
    }
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        gap: 20,
        backgroundColor: Colors.background,
      }}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={
            !user?.imageUrl
              ? require('../../../assets/images/user.png')
              : { uri: API_URL.concat(`/${user?.imageUrl}`) }
          }
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            borderWidth: 2,
            borderColor: Colors.primary
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 10,
            position: 'absolute',
            bottom: 0,
            right: 0,
            marginBottom: 5,
            marginRight: 5,
            borderRadius: 50,
          }}
          onPress={handleUpdateImage}
          activeOpacity={0.8}
        >
          <PenBox size={30} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.primary,
          }}
        >
          {user?.email}
        </Text>
      </View>

      <Button text="Sair da conta" variant="danger" onPress={handleLogout} />
    </View>
  );
}