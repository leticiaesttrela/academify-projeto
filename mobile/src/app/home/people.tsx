import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { Button } from "@/src/components/Button";
import { Title } from "@/src/components/Title.";
import { Colors } from "@/src/constants/Colors";
import { NavigatorRoutesProps } from "@/src/types/routes";

export const People = () => {
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
        <Title>Gestão de Pessoas</Title>

        <Text
          style={{
            color: Colors.text,
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'black',
            width: '70%',
          }}
        >
          Gerenciamento de docentes e alunos
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
          text="Docentes"
          onPress={() => navigation.navigate('Teachers')}
          style={{ width: '100%' }}
        />

        <Button
          text="Alunos"
          onPress={() => navigation.navigate('Students')}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}