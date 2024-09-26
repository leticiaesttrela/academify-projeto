import { createContext, useContext, useState } from 'react';
import { Text, View, ViewProps } from 'react-native';
import { Colors } from '@/src/constants/Colors';
import { Picker, PickerProps } from '@react-native-picker/picker';

interface SelectProps extends ViewProps {
  error?: string;
}

interface SelectContext {
  focus: boolean;
  setFocus: (focus: boolean) => void;
}

export const Select = ({ error, ...props }: SelectProps) => {

  const borderColor = error ? Colors.danger : 'transparent';

  return (
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
  );
};

interface ControlProps extends PickerProps {}

export const Control = (props: ControlProps) => {

  return (
    <Picker {...props} />
  )
};


 