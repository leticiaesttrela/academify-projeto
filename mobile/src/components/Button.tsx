import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Colors } from "@/src/constants/Colors";

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

const variants = {
  primary: {
    bg: {
      backgroundColor: Colors.primary,
    },
    text: {
      color: Colors.background,
    },
  },
  secondary: {
    bg: {
      borderColor: Colors.primary,
      borderWidth: 2,
    },
    text: {
      color: Colors.primary,
    },
  },
  danger: {
    bg: {
      backgroundColor: Colors.danger,
    },
    text: {
      color: Colors.background,
    },
  },
};

export const Button = ({ 
  text, 
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const styles = StyleSheet.flatten(props.style)
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      {...props}
      style={{
        marginHorizontal: 'auto',
        padding: 10,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        ...variants[variant].bg,
        ...styles
      }}
    >
      <Text style={{
        fontSize: 16,
        fontWeight: 'bold',
        ...variants[variant].text,
      }}>{text}</Text>
    </TouchableOpacity>
  )
}