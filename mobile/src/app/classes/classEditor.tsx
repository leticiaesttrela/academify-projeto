import { Button } from '@/src/components/Button';
import { Control, Input } from '@/src/components/Input';
import { Select, Control as SelectControl } from '@/src/components/Select';
import { Title } from '@/src/components/Title.';
import { Colors } from '@/src/constants/Colors';
import { useAuth } from '@/src/hooks/useAuth';
import { api } from '@/src/lib/api';
import { NavigatorRoutesProps } from '@/src/types/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, ToastAndroid, View } from 'react-native';
import { z } from 'zod';

export const createClassSchema = z
  .object({
    label: z.string({ required_error: 'Label inválida' }).min(2, 'Label inválida'),
    period: z.string({ required_error: 'Período inválido' }).min(1, 'Período inválido'),
    teacher: z.string({ required_error: 'Professor inválido' }).min(5, 'Professor inválido'),
  });

export type ICreateClass = z.infer<typeof createClassSchema>;

export const ClassEditor = () => {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [classId, setClassId] = useState<string | null>(null);
  
  const navigation = useNavigation<NavigatorRoutesProps>();
  const route = useRoute();

  const { removeUserAndToken } = useAuth();
  
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICreateClass>({
    resolver: zodResolver(createClassSchema),
  });

  useEffect(() => {
    navigation.addListener('focus', async () => {
      await getTeachers();

      if (route.params && 'id' in route.params) {
        const id = route.params.id as string;
        await getClass(id);
      }
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

  const getClass = async (id: string) => {
    try {
      const response = await api.get(`/classes/${id}`);

      const _class: IClass = response.data;

      setClassId(_class.id);

      setValue('label', _class.label);
      setValue('period', _class.period);
      setValue('teacher', _class.teacherId);
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

  const handleCreateClass = async (data: ICreateClass) => {
    try {
      await api.post('/classes', data);

      ToastAndroid.show('Turma cadastrada com sucesso', 300);

      navigation.goBack();
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
        Alert.alert('Erro', 'Ocorreu um erro ao tentar registrar a turma');
      }
    }
  };

  const handleUpdateClass = async (data: ICreateClass) => {
    try {
      await api.put(`/classes/${classId}`, data);

      ToastAndroid.show('Turma atualizada com sucesso', 300);

      navigation.goBack();
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
        Alert.alert('Erro', 'Ocorreu um erro ao tentar atualizar a turma');
      }
    }
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',

        backgroundColor: Colors.background,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 40,
          width: '100%',
        }}
      >
        <Title>{classId ? 'Atualizar' : 'Cadastrar'} turma</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '70%',
          }}
        >
          Insira os dados para realizar{' '}
          {classId ? 'a atualização' : 'o cadastro'} da turma
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
          <Input error={errors.label?.message}>
            <Controller
              name="label"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Control
                  id="label"
                  onChangeText={onChange}
                  placeholder="Rótulo"
                  value={value}
                />
              )}
            />
          </Input>

          <Input error={errors.period?.message}>
            <Controller
              name="period"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Control
                  id="period"
                  onChangeText={onChange}
                  placeholder="Período"
                  value={value}
                />
              )}
            />
          </Input>

          <Select error={errors.teacher?.message}>
            <Controller
              name="teacher"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectControl
                  id="teacher"
                  selectedValue={value}
                  onValueChange={onChange}
                >
                  <Picker.Item
                    label={'Selecione um professor'}
                    color={
                      errors.teacher?.message ? Colors.danger : Colors.text
                    }
                    enabled
                  />
                  {teachers.map((teacher) => (
                    <Picker.Item
                      key={teacher.id}
                      label={teacher.name}
                      value={teacher.id}
                    />
                  ))}
                </SelectControl>
              )}
            />
          </Select>
        </View>

        <Button
          text={classId ? 'Atualizar turma' : 'Cadastrar turma'}
          onPress={handleSubmit(
            classId ? handleUpdateClass : handleCreateClass
          )}
          style={{ width: '100%', marginTop: 25 }}
        />
      </View>
    </View>
  );
};
