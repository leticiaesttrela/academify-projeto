import { createContext, useContext, useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewProps
} from 'react-native';
import { Colors } from '@/src/constants/Colors';

interface InputProps extends ViewProps{
  error?: string;
}

interface InputContext {
  focus: boolean;
  setFocus: (focus: boolean) => void;
}

const inputContext = createContext({} as InputContext);

export const Input = ({error, ...props}: InputProps) => {
  const [focus, setFocus] = useState(false);

  const borderColor = !error
  ? focus
    ? Colors.primary
    : 'transparent'
  : Colors.danger;

  return (
    <inputContext.Provider value={{ focus, setFocus }}>
      <View>
        <View
          style={{
            backgroundColor: Colors.inputBackground,
            height: 54,
            borderRadius: 10,
            gap: 3,
            borderWidth: 2,
            borderColor,
          }}
          {...props}
        />
        {error && <Text style={{ color: Colors.danger }}>{error}</Text>}
      </View>
    </inputContext.Provider>
  );
};

interface ControlProps extends TextInputProps {}

export const Control = (props: ControlProps) => {
  const { setFocus } = useContext(inputContext);

  return (
    <TextInput
      style={{
        flex: 1,
        padding: 10,
      }}
      onBlur={() => setFocus(false)
      }
      onFocus={() => setFocus(true)}
      {...props}
    />
  )
}