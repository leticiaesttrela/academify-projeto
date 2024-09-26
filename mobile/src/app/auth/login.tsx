import { Button } from '@/src/components/Button';
import { Control, Input } from '@/src/components/Input';
import { Link } from '@/src/components/Link';
import { Title } from '@/src/components/Title.';
import { Colors } from '@/src/constants/Colors';
import { useAuth } from '@/src/hooks/useAuth';
import { api } from '@/src/lib/api';
import { storageTokenSave } from '@/src/storage/storageToken';
import { NavigatorRoutesProps } from '@/src/types/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, ToastAndroid, View } from 'react-native';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Endereço de e-mail inválido' })
    .email('Endereço de e-mail inválido'),
  password: z
    .string({ required_error: 'Senha deve ter ao menos 6 caracteres' })
    .min(6, 'A senha deve ter pelo menos 6 dígitos'),
});

export type ILogin = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();

  const { setUser, removeUserAndToken } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: ILogin) => {
    try {
      const response = await api.post('/sessions', data);

      const token = response.data.token;
      const user = response.data.user;

      await storageTokenSave(token);
      setUser(user);

      ToastAndroid.show('Você entrou na sua conta!', 300);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage === 'Invalid credentials') {
          await removeUserAndToken();
          ToastAndroid.show('Credenciais inválidas', 300);
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login');
      }
    }
  }

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
        <Title>Login</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '40%',
          }}
        >
          Seja bem-vindo de volta, sentimos sua falta!
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

        <Link
          text="Esqueceu a sua senha?"
          style={{ alignItems: 'flex-end' }}
          activeOpacity={0.7}
        />

        <Button
          text="Entrar"
          onPress={handleSubmit(handleLogin)}
          style={{ width: '100%' }}
        />

        <Link
          onPress={() => navigation.navigate('Register')}
          text="Criar uma conta"
          activeOpacity={0.7}
        />
      </View>
    </View>
  );
};
