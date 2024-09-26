import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { AuthContext } from '@/src/contexts/Auth';
import { AuthRoutes } from './auth.routes';
import { MainRoutes } from './main.routes';

const { Navigator, Screen } = createNativeStackNavigator();

export const Routes = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Navigator>
        {!user?.id ? (
          <Screen
            name="Auth"
            component={AuthRoutes}
            options={{ headerShown: false }}
          />
        ) : (
          <Screen
            name="Main"
            component={MainRoutes}
            options={{ headerShown: false }}
          />
        )}
      </Navigator>
    </NavigationContainer>
  );
};
