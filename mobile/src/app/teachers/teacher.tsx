import { Button } from "@/src/components/Button";
import { Label } from "@/src/components/Label";
import { Title } from "@/src/components/Title.";
import { Colors } from "@/src/constants/Colors";
import { useAuth } from "@/src/hooks/useAuth";
import { api } from "@/src/lib/api";
import { NavigatorRoutesProps } from "@/src/types/routes";
import { useNavigation, useRoute } from "@react-navigation/native";
import { isAxiosError } from "axios";
import { reverseGeocodeAsync } from "expo-location";
import { useEffect, useState } from "react";
import { Alert, Text, ToastAndroid, View } from "react-native";

type Coords = {
  lat: string;
  long: string;
};

export const Teacher = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();
  const route = useRoute();

  const [teacher, setTeacher] = useState<ITeacher>({} as ITeacher);

  const { removeUserAndToken } = useAuth();

  useEffect(() => {
    navigation.addListener('focus', async () => {
      if (route.params && 'id' in route.params) {
        const id = route.params.id as string;
        await getTeacher(id)
      }
    });
  }, [navigation]);

  const getTeacher = async (id: string) => {
    try {
      const response = await api.get(`/teachers/${id}`);
      const address = await getAddress({ lat: response.data.lat, long: response.data.long });
    
      setTeacher({ ...response.data, address});
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage === 'Teacher not found') {
          Alert.alert('Erro', 'Professor não encontrado');
        } else if (errorMessage === 'Unauthorized') {
          await removeUserAndToken();
          ToastAndroid.show('Sessão expirada', 300);
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar o professor');
      }
    }
  };

  const getAddress = async (coords: Coords) => {
    if (coords.lat && coords.long) {
      const [result] = await reverseGeocodeAsync({
        latitude: parseFloat(coords.lat),
        longitude: parseFloat(coords.long),
      });
      const address = `${result.street} ${result.name}, ${result.city}`;
      return address;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.background,
        justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 40,
          width: '100%',
        }}
      >
        <Title>{teacher.name?.split(' ')[0]}</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '70%',
          }}
        >
          Matrícula: {teacher.registration}
        </Text>
      </View>

      <View
        style={{
          width: '100%',
          paddingHorizontal: 30,
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: Colors.inputBackground,
            borderRadius: 10,
            padding: 20,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 15,
          }}
        >
          <Text
            style={{
              color: Colors.primary,
              fontSize: 25,
              fontWeight: 'bold',
            }}
          >
            Dados de cadastro
          </Text>

          <Label label="Nome completo" text={teacher.name} />
          <Label label="Email" text={teacher.email} />
          <Label label="Telefone" text={teacher.phone} />
          <Label label="Endereço" text={teacher.address} />
        </View>
      </View>

      <View
        style={{
          width: '100%',
          paddingTop: 20,
          paddingHorizontal: 30,
          paddingBottom: 30,
          gap: 25,
        }}
      >
        <Button
          text="Atualizar docente"
          onPress={() =>
            navigation.navigate('TeacherEditor', {
              id: teacher.id,
            })
          }
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}