import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors } from '@/src/constants/Colors';

interface LinkProps extends TouchableOpacityProps {
  text: string
}

export const Link = ({text, ...props}: LinkProps) => {
  return (
    <TouchableOpacity {...props}>
      <Text 
        style={{ 
          color: Colors.primary, 
          textDecorationLine: 'underline', 
          textAlign: 'center', 
          fontWeight: 'bold' 
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
