import { Colors } from "@/src/constants/Colors"
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native"

interface ItemProps extends TouchableOpacityProps {
  text: string
}

export const Item = ({text, children, ...props}: ItemProps) => {
  return (
    <TouchableOpacity 
      {...props}
      activeOpacity={0.8}
      style={{
        flex: 1,
        alignItems: 'center',
        height: 60,
        borderRadius: 10,
        backgroundColor: Colors.background,
        borderWidth: 2,
        borderColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        width: '100%',
      }}
    >
      <Text>
        {text}
      </Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {children}
      </View>
    </TouchableOpacity>
  )
}