import { NavigatorRoutesProps } from '@/src/types/routes';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import WelcomeLogo from '../../../assets/images/welcome.svg';
import { Button } from '@/src/components/Button';
import { Title } from '@/src/components/Title.';
import { Colors } from '@/src/constants/Colors';

export const Welcome = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        backgroundColor: Colors.background,
      }}
    >
      <WelcomeLogo width={350} />

      <View
        style={{
          gap: 20,
          paddingHorizontal: 40,
        }}
      >
        <Title
          style={{
            fontSize: 40,
          }}
        >
          Bem vindo ao Academify!
        </Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 20,
            textAlign: 'center',
          }}
        >
          Sistema acadêmico de gerenciamento de turmas.
        </Text>
      </View>

      <View
        style={{
          padding: 20,
          paddingHorizontal: 30,
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 25,
        }}
      >
        <Button
          text="Login"
          onPress={() => navigation.navigate('Login')}
          style={{ flex: 1 }}
        />
        <Button
          text="Cadastro"
          variant="secondary"
          onPress={() => navigation.navigate('Register')}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}
