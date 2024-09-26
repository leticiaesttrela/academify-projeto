import { Button } from "@/src/components/Button";
import { Item } from "@/src/components/Item";
import { Title } from "@/src/components/Title.";
import { Colors } from "@/src/constants/Colors";
import { useAuth } from "@/src/hooks/useAuth";
import { api } from "@/src/lib/api";
import { NavigatorRoutesProps } from "@/src/types/routes";
import { useNavigation } from "@react-navigation/native";
import { isAxiosError } from "axios";
import { Edit, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, ToastAndroid, View } from "react-native";

export const Classes = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { removeUserAndToken } = useAuth();

  useEffect(() => {
    navigation.addListener('focus', async () => {
      await getClasses();
    });
  }, [navigation]);

  const getClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
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
        Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar as turmas');
      }
    }
  }

  const handleSetRefreshing = () => {
    setRefreshing(true);
    getClasses();
    setRefreshing(false);
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await api.delete(`/classes/${id}`);

      ToastAndroid.show('Turma deletada com sucesso', 300);

      handleSetRefreshing();
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
        Alert.alert('Erro', 'Ocorreu um erro ao tentar deletar a turma');
      }
    }
  };

  const showDeleteConfirmation = (id: string) => {
    Alert.alert(
      'CONFIRMAÇÃO',
      'Tem certeza que deseja deletar esta turma?',
      [
        {
          text: 'CANCELAR',
          style: 'cancel',
        },
        {
          text: 'CONFIRMAR',
          onPress: async () => {
            await handleDeleteClass(id);
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
        <Title>Turmas</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '70%',
          }}
        >
          Existe um total de {classes?.length} turmas cadastradas
        </Text>
      </View>

      <FlatList
        data={classes}
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
            text={item.label}
            onPress={() =>
              navigation.navigate('Class', {
                id: item.id,
              })
            }
          >
            <Edit
              size={25}
              color={Colors.primary}
              onPress={() =>
                navigation.navigate('ClassEditor', {
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
          text="Cadastrar turma"
          onPress={() => navigation.navigate('ClassEditor')}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}