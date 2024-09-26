import { Button } from '@/src/components/Button';
import { Title } from '@/src/components/Title.';
import { Colors } from '@/src/constants/Colors';
import { useAuth } from '@/src/hooks/useAuth';
import { api } from '@/src/lib/api';
import { NavigatorRoutesProps } from '@/src/types/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, ToastAndroid, View } from 'react-native';

export const Class = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();
  const route = useRoute();

  const [_class, setClass] = useState<IClass>({} as IClass);

  const { removeUserAndToken } = useAuth();

  useEffect(() => {
    navigation.addListener('focus', async () => {
      if (route.params && 'id' in route.params) {
        const id = route.params.id as string;
        await getClass(id);
      }
    });
  }, [navigation]);

  const getClass = async (id: string) => {
    try {
      const response = await api.get(`/classes/${id}`);

      setClass(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage === 'Class not found') {
          Alert.alert('Erro', 'Turma não encontrada');
        } else if (errorMessage === 'Unauthorized') {
          await removeUserAndToken();
          ToastAndroid.show('Sessão expirada', 300);
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar a turma');
      }
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
        <Title>{_class.label}</Title>

        <Text
          style={{
            color: Colors.text,
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center',
            width: '70%',
          }}
        >
          Período: {_class.period}
        </Text>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '70%',
          }}
        >
          Essa turma possui um total de {_class?.students?.length} alunos
        </Text>
      </View>

      <View
        style={{
          width: '100%',
          paddingHorizontal: 30,
          gap: 40,
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
            Docente
          </Text>

          <Text style={{ fontWeight: '600', fontSize: 16 }}>
            {_class.teacherName}
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: Colors.primary,
              fontSize: 25,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 15,
            }}
          >
            Alunos matriculados
          </Text>

          <FlatList
            data={_class?.students}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: 10,
              paddingVertical: 10,
            }}
            renderItem={({ item, index }) => (
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
                    fontWeight: '900',
                    fontSize: 16,
                  }}
                >
                  {index + 1}.{' '}
                  <Text style={{ color: Colors.text, fontWeight: '500' }}>
                    {item.name}
                  </Text>
                </Text>
              </View>
            )}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center' }}>A lista está vazia</Text>
            )}
          />
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
          text="Adicionar alunos"
          onPress={() =>
            navigation.navigate('AddStudents', {
              id: _class.id,
            })
          }
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
};
