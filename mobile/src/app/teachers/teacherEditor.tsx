import { Button } from '@/src/components/Button';
import { Control, Input } from '@/src/components/Input';
import { Maps } from '@/src/components/Maps';
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
import { Alert, ScrollView, Text, ToastAndroid, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { z } from 'zod';

export const createTeacherSchema = z.object({
  name: z.string({ required_error: 'Nome inválido' }).min(3, 'Nome inválido'),
  registration: z.string({ required_error: 'Matrícula inválida' }).min(8, 'Matrícula inválida'),
  email: z.string({ required_error: 'Email inválido' }).email('Email inválido'),
  phone: z.string({ required_error: 'Telefone inválido' }).min(8, 'Telefone inválido'),
  coords: z.object({
    latitude: z.number({ required_error: 'Latitude inválida' }),
    longitude: z.number({ required_error: 'Longitude inválida' }),
  }).default({ latitude: 0, longitude: 0 }),
});

export type ICreateTeacher = z.infer<typeof createTeacherSchema>;

export const TeacherEditor = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();
  const route = useRoute();

  const [teacherId, setTeacherId] = useState<string | null>(null);

  const { removeUserAndToken } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ICreateTeacher>({
    resolver: zodResolver(createTeacherSchema),
  });

  useEffect(() => {
    navigation.addListener('focus', async () => {
      if (route.params && 'id' in route.params) {
        const id = route.params.id as string;
        await getTeacher(id);
      }
    });
  });

  const getTeacher = async (id: string) => {
    try {
      const response = await api.get(`/teachers/${id}`);

      const teacher: ITeacher = response.data;

      setTeacherId(teacher.id);

      setValue('name', teacher.name);
      setValue('registration', teacher.registration);
      setValue('email', teacher.email);
      setValue('phone', teacher.phone);
      setValue('coords', {
        latitude: parseFloat(teacher.lat),
        longitude: parseFloat(teacher.long),
      });
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
  }

  const handleCreateTeacher = async (data: ICreateTeacher) => {
    if (data.coords.latitude === 0 || data.coords.longitude === 0) {
      setError('coords', {
        type: 'required',
        message: 'Selecione a localização no mapa',
      });
    } else {
      try {
        await api.post('/teachers', data);
  
        ToastAndroid.show('Professor cadastrado com sucesso', 300);
  
        navigation.goBack();
      } catch (error) {
        if (isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
  
          if (errorMessage === 'Teacher already exists') {
            Alert.alert('Erro', 'Professor já existe');
          } else if (errorMessage === 'Unauthorized') {
            await removeUserAndToken();
            ToastAndroid.show('Sessão expirada', 300);
          } else {
            Alert.alert('Erro', errorMessage);
          }
        } else {
          Alert.alert('Erro', 'Ocorreu um erro ao tentar registrar o professor');
        }
      }
    }

  };

  const handleUpdateTeacher = async (data: ICreateTeacher) => {
    if(data.coords.latitude === 0 || data.coords.longitude === 0) {
      setError('coords', {
        type: 'required',
        message: 'Selecione a localização no mapa',
      });
    } else {
      try {
        await api.put(`/teachers/${teacherId}`, data);
  
        ToastAndroid.show('Professor atualizado com sucesso', 300);
  
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
          Alert.alert('Erro', 'Ocorreu um erro ao tentar atualizar o professor');
        }
      }
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors.background,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
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
        <Title>{teacherId ? 'Atualizar' : 'Cadastrar'} docente</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '60%',
          }}
        >
          Insira os dados para realizar{' '}
          {teacherId ? 'a atualização' : 'o cadastro'} do docente
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

          <Controller
            name="coords"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Maps error={errors.coords?.message} onPress={(event) => onChange(event.nativeEvent.coordinate)}>
                {value && value.latitude !== 0 && (
                  <Marker
                    pinColor={Colors.primary}
                    coordinate={{
                      latitude: value.latitude,
                      longitude: value.longitude,
                    }}
                  />
                )}
              </Maps>
            )}
          />
        </View>

        <Button
          text={teacherId ? 'Atualizar professor' : 'Cadastrar professor'}
          onPress={handleSubmit(
            teacherId ? handleUpdateTeacher : handleCreateTeacher
          )}
          style={{ width: '100%', marginTop: 25 }}
        />
      </View>
    </ScrollView>
  );
};
