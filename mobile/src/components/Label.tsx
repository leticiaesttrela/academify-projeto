import { Text, View } from "react-native";
import { Colors } from "@/src/constants/Colors";

interface LabelProps {
  label: string;
  text: string;
};

export const Label = ({label, text}: LabelProps) => {
  return (
    <View>
      <Text
        style={{
          color: Colors.text,
          fontSize: 15,
          fontWeight: 'black',
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: Colors.text,
          fontSize: 20,
          fontWeight: 'bold',
        }}
      >
        {text}
      </Text>
    </View>
  );
}