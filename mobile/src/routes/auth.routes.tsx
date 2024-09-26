import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '@/src/app/auth/login';
import { Register } from '@/src/app/auth/register';
import { Welcome } from '@/src/app/auth/welcome';
import { RoutesProps } from '@/src/types/routes';

const { Navigator, Screen } = createNativeStackNavigator<RoutesProps>();

export const AuthRoutes = () => {
  return (
    <Navigator>
      <Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Screen
        name="Login"
        component={Login}
        options={{ headerShadowVisible: false, title: '' }}
      />
      <Screen
        name="Register"
        component={Register}
        options={{ headerShadowVisible: false, title: '' }}
      />
    </Navigator>
  );
};
