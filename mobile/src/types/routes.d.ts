import { ParamListBase } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

interface RoutesProps extends ParamListBase {
  Login: undefined;
  Register: undefined;
}

type NavigatorRoutesProps = NativeStackNavigationProp<RoutesProps>;
