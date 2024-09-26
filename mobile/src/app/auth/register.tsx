import { Button } from '@/src/components/Button';
import { Control, Input } from '@/src/components/Input';
import { Link } from '@/src/components/Link';
import { Title } from '@/src/components/Title.';
import { Colors } from '@/src/constants/Colors';
import { api } from '@/src/lib/api';
import { NavigatorRoutesProps } from '@/src/types/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, ToastAndroid, View } from 'react-native';
import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z
      .string({ required_error: 'Endereço de e-mail inválido' })
      .email('Endereço de e-mail inválido'),
    password: z
      .string({ required_error: 'Senha deve ter ao menos 6 caracteres' })
      .min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirm_password: z
      .string({
        required_error: 'Confirmação de senha deve ter ao menos 6 caracteres',
      })
      .min(6, 'Confirmação de senha deve ter ao menos 6 caracteres'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas devem ser iguais',
    path: ['confirm_password'],
  });

export type IRegister = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data: IRegister) => {
    try {
      await api.post('/users', data);

      ToastAndroid.show('Sua conta foi criada!', 300);
      
      navigation.navigate('Login');
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;
        Alert.alert('Erro', errorMessage);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer o cadastro');
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        gap: 10,
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
        <Title>Criar uma conta</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '70%',
          }}
        >
          Crie uma conta e comece agora a gerenciar suas turmas
        </Text>
      </View>

      <View
        style={{
          width: '100%',
          padding: 20,
          paddingHorizontal: 30,
          gap: 25,
        }}
      >
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
              />
            )}
          />
        </Input>

        <Input error={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Control
                id="password"
                onChangeText={onChange}
                placeholder="Senha"
                secureTextEntry
                value={value}
              />
            )}
          />
        </Input>

        <Input error={errors.confirm_password?.message}>
          <Controller
            name="confirm_password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Control
                id="confirm_password"
                onChangeText={onChange}
                placeholder="Confirmar Senha"
                secureTextEntry
                value={value}
              />
            )}
          />
        </Input>

        <View />

        <Button
          text="Criar conta"
          onPress={handleSubmit(handleRegister)}
          style={{ width: '100%' }}
        />

        <Link
          onPress={() => navigation.navigate('Login')}
          text="Já tenho uma conta"
          activeOpacity={0.7}
        />
      </View>
    </View>
  );
};
