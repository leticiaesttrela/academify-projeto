import { Button } from '@/src/components/Button';
import { Control, Input } from '@/src/components/Input';
import { Title } from '@/src/components/Title.';
import { Colors } from '@/src/constants/Colors';
import { useAuth } from '@/src/hooks/useAuth';
import { api } from '@/src/lib/api';
import { NavigatorRoutesProps } from '@/src/types/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, ToastAndroid, View } from 'react-native';
import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string({ required_error: 'Nome inválido' }).min(3, 'Nome inválido'),
  registration: z.string({ required_error: 'Matrícula inválida' }).min(8, 'Matrícula inválida'),
  email: z.string({ required_error: 'Email inválido' }).email('Email inválido'),
  phone: z.string({ required_error: 'Telefone inválido' }).min(8, 'Telefone inválido'),
});

export type ICreateStudent = z.infer<typeof createStudentSchema>;

export const StudentEditor = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();
  const route = useRoute();

  const [studentId, setStudentId] = useState<string | null>(null);

  const { removeUserAndToken } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICreateStudent>({
    resolver: zodResolver(createStudentSchema),
  });

  useEffect(() => {
    navigation.addListener('focus', async () => {
      if (route.params && 'id' in route.params) {
        const id = route.params.id as string;
        await getStudent(id);
      }
    });
  });

  const getStudent = async (id: string) => {
    try {
      const response = await api.get(`/students/${id}`);

      const student: IStudent = response.data;

      setStudentId(student.id);

      setValue('name', student.name);
      setValue('registration', student.registration);
      setValue('email', student.email);
      setValue('phone', student.phone);
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

  const handleCreateStudent = async (data: ICreateStudent) => {
    try {
      await api.post('/students', data);

      ToastAndroid.show('Aluno cadastrado com sucesso', 300);

      navigation.goBack();
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage === 'Student already exists') {
          Alert.alert('Erro', 'Aluno já existe');
        } else if (errorMessage === 'Unauthorized') {
          await removeUserAndToken();
          ToastAndroid.show('Sessão expirada', 300);
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar registrar o aluno');
      }
    }
  };

  const handleUpdateStudent = async (data: ICreateStudent) => {
    try {
      await api.put(`/students/${studentId}`, data);

      ToastAndroid.show('Aluno atualizado com sucesso', 300);

      navigation.goBack();
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
        Alert.alert('Erro', 'Ocorreu um erro ao tentar atualizar o aluno');
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 40,
          width: '100%',
        }}
      >
        <Title>{studentId ? 'Atualizar' : 'Cadastrar'} aluno</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '70%',
          }}
        >
          Insira os dados para realizar {studentId ? 'a atualização' : 'o cadastro'} do aluno
        </Text>
      </View>

      <View
        style={{
          width: '100%',
          flex: 1,
          paddingHorizontal: 30,
          paddingBottom: 30,
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            gap: 25,
          }}
        >
          <Input error={errors.registration?.message}>
            <Controller
              name="registration"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Control
                  id="registration"
                  onChangeText={onChange}
                  placeholder="Matrícula"
                  value={value}
                />
              )}
            />
          </Input>

          <Input error={errors.name?.message}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Control
                  id="name"
                  onChangeText={onChange}
                  placeholder="Nome"
                  value={value}
                />
              )}
            />
          </Input>

          <Input error={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Control
                  id="email"
                  onChangeText={onChange}
                  placeholder="Email"
                  value={value}
                  inputMode="email"
                />
              )}
            />
          </Input>

          <Input error={errors.phone?.message}>
            <Controller
              name="phone"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Control
                  id="phone"
                  onChangeText={onChange}
                  placeholder="Telefone"
                  value={value}
                  inputMode="tel"
                />
              )}
            />
          </Input>
        </View>

        <Button
          text={studentId ? 'Atualizar aluno' : 'Cadastrar aluno'}
          onPress={handleSubmit(
            studentId ? handleUpdateStudent : handleCreateStudent
          )}
          style={{ width: '100%', marginTop: 25 }}
        />
      </View>
    </View>
  );
};
