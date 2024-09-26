import { Button } from "@/src/components/Button";
import { Item } from "@/src/components/Item";
import { Title } from "@/src/components/Title.";
import { Colors } from "@/src/constants/Colors";
import { useAuth } from "@/src/hooks/useAuth";
import { api } from "@/src/lib/api";
import { NavigatorRoutesProps } from "@/src/types/routes";
import { useNavigation } from "@react-navigation/native";
import { isAxiosError } from "axios";
import { Edit, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, ToastAndroid, View } from "react-native";

export const Teachers = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();
  
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { removeUserAndToken } = useAuth();

  useEffect(() => {
    navigation.addListener('focus', async () => {
      await getTeachers();
    });
  }, [navigation]);

  const getTeachers = async () => {
    try {
      const response = await api.get('/teachers');

      setTeachers(response.data);
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
        Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar os docentes');
      }
    }
  };

  const handleSetRefreshing = () => {
    setRefreshing(true);
    getTeachers();
    setRefreshing(false);
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      await api.delete(`/teachers/${id}`);

      ToastAndroid.show('Docente deletado com sucesso', 300);

      handleSetRefreshing();
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage === 'Teacher has classes') {
          Alert.alert(
            'Erro',
            'O docente está cadastrado em alguma turma, não é possível deletá-lo no momento',
          );
        } else if (errorMessage === 'Unauthorized') {
          await removeUserAndToken();
          ToastAndroid.show('Sessão expirada', 300);
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar deletar o docente');
      }
    }
  };

  const showDeleteConfirmation = (id: string) => {
    Alert.alert(
      'CONFIRMAÇÃO',
      'Tem certeza que deseja deletar este professor?',
      [
        {
          text: 'CANCELAR',
          style: 'cancel',
        },
        {
          text: 'CONFIRMAR',
          onPress: async () => {
            await handleDeleteTeacher(id);
          },
        },
      ],
      { cancelable: false }
    );
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
        <Title>Docentes</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '70%',
          }}
        >
          Existe um total de {teachers?.length} docentes cadastrados
        </Text>
      </View>

      <FlatList
        data={teachers}
        refreshing={refreshing}
        onRefresh={handleSetRefreshing}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingVertical: 10,
          paddingHorizontal: 30,
        }}
        renderItem={({ item }) => (
          <Item
            text={item.name}
            onPress={() =>
              navigation.navigate('Teacher', {
                id: item.id,
              })
            }
          >
            <Edit
              size={25}
              color={Colors.primary}
              onPress={() =>
                navigation.navigate('TeacherEditor', {
                  id: item.id,
                })
              }
            />
            <Trash2
              size={25}
              color={Colors.danger}
              onPress={() => showDeleteConfirmation(item.id)}
            />
          </Item>
        )}
        ListEmptyComponent={() => <Text>A lista está vazia</Text>}
      />

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
          text="Cadastrar docente"
          onPress={() => navigation.navigate('TeacherEditor')}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}