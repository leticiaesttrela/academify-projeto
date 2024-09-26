import { Button } from '@/src/components/Button';
import { Label } from '@/src/components/Label';
import { Title } from '@/src/components/Title.';
import { Colors } from '@/src/constants/Colors';
import { useAuth } from '@/src/hooks/useAuth';
import { api } from '@/src/lib/api';
import { NavigatorRoutesProps } from '@/src/types/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Text, ToastAndroid, View } from 'react-native';

export const Student = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();
  const route = useRoute();

  const [student, setStudent] = useState<IStudent>({} as IStudent);

  const { removeUserAndToken } = useAuth();

  useEffect(() => {
    navigation.addListener('focus', async () => {
      if (route.params && 'id' in route.params) {
        const id = route.params.id as string;
        await getStudent(id);
      }
    });
  }, [navigation]);

  const getStudent = async (id: string) => {
    try {
      const response = await api.get(`/students/${id}`);

      setStudent(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage === 'Student not found') {
          Alert.alert('Erro', 'Aluno não encontrado');
        } else if (errorMessage === 'Unauthorized') {
          await removeUserAndToken();
          ToastAndroid.show('Sessão expirada', 300);
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar o aluno');
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
        <Title>{student.name?.split(' ')[0]}</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '70%',
          }}
        >
          Matrícula: {student.registration}
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

          <Label label="Nome completo" text={student.name} />
          <Label label="Email" text={student.email} />
          <Label label="Telefone" text={student.phone} />
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
          text="Atualizar aluno"
          onPress={() =>
            navigation.navigate('StudentEditor', {
              id: student.id,
            })
          }
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
};
