import { Text, TextProps } from "react-native"
import { Colors } from "@/src/constants/Colors"

interface TitleProps extends TextProps {}

export const Title = (props : TitleProps) => {
  return (
    <Text
      {...props}
      style={{
        color: Colors.primary,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 35,
      }}
    />
  );
}