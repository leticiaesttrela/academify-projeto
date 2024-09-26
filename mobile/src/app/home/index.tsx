import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { Button } from "@/src/components/Button";
import { Title } from "@/src/components/Title.";
import { Colors } from "@/src/constants/Colors";
import { NavigatorRoutesProps } from "@/src/types/routes";

export const Home = () => {
  const navigation = useNavigation<NavigatorRoutesProps>();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        gap: 80,
        backgroundColor: Colors.background,
      }}
    >
      <View 
        style={{ 
          alignItems: 'center', 
          paddingVertical: 40,
          width: '100%',
        }}
      >
        <Title>Sistema de Gestão</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '70%',
          }}
        >
          Gerenciamento da sua instituição
        </Text>
      </View>

      <View
        style={{
          width: '100%',
          padding: 20,
          paddingHorizontal: 30,
          gap: 35,
        }}
      >
        <Button
          text="Turmas"
          onPress={() => navigation.navigate('Classes')}
          style={{ width: '100%' }}
        />

        <Button
          text="Pessoas"
          onPress={() => navigation.navigate('People')}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
} 