import { Button } from "@/src/components/Button";
import { Checkbox } from "@/src/components/Checkbox";
import { Title } from "@/src/components/Title.";
import { Colors } from "@/src/constants/Colors";
import { useAuth } from "@/src/hooks/useAuth";
import { api } from "@/src/lib/api";
import { NavigatorRoutesProps } from "@/src/types/routes";
import { useNavigation, useRoute } from "@react-navigation/native";
import { isAxiosError } from "axios";
import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, TextInput, ToastAndroid, View } from "react-native";

interface ISelectStudent {
  id: string;
  name: string;
  classId?: string;
  selected: boolean;
}

export const AddStudents = () => {
  const [students, setStudents] = useState<ISelectStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<ISelectStudent[]>([]);
  const [classId, setClassId] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const navigation = useNavigation<NavigatorRoutesProps>();
  const route = useRoute();

  const { removeUserAndToken } = useAuth();

  useEffect(() => {
    navigation.addListener('focus', async () => {
      if (route.params && 'id' in route.params) {
        const id = route.params.id as string;
        setClassId(id);

        await getClassStudentsAndFilter(id);
      }
    });
  }, [navigation]);

  const getClassStudentsAndFilter = async (id: string) => {
    try {
      const getClassStudents = await api.get(`/classes/${id}/students`);
      const getStudents = await api.get('/students');

      const selectedStudents = getClassStudents.data.map(
        (student: ISelectStudent) => {
          return {
            ...student,
            selected: true,
          };
        }
      );

      const allStudents = getStudents.data.map((student: ISelectStudent) => {
        return {
          id: student.id,
          name: student.name,
          selected: false,
        };
      });

      const studentsArray = allStudents.map((student: ISelectStudent) => {
        const studentFound = selectedStudents.find(
          (selectedStudent: ISelectStudent) => {
            return selectedStudent.id === student.id}
        );

        if (studentFound) {
          return studentFound;
        }

        return student;
      });

      setStudents(studentsArray);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage === 'Unauthorized') {
          await removeUserAndToken();
          ToastAndroid.show('Sessão expirada', 300);
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar os alunos');
      }
    }
  }

  const handleAddStudents = async () => {
    const selectedStudents = students.filter(student => student.selected);
    const studentsToAdd = selectedStudents.filter(student => student.classId === undefined);

    try {
      await api.patch(`/classes/${classId}/student`, {
        students: studentsToAdd.map((student) => student.id),
      });

      ToastAndroid.show('Alunos adicionados com sucesso', ToastAndroid.SHORT);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage === 'Unauthorized') {
          await removeUserAndToken();
          ToastAndroid.show('Sessão expirada', 300);
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar adicionar os alunos');
      }
    }
  }

  const handleRemoveStudents = async () => {
    const selectedStudents = students.filter(student => !student.selected);
    const studentsToRemove = selectedStudents.filter(student => student.classId !== undefined);

    try {
      await api.delete(`/classes/${classId}/student`, {
        data: {
          students: studentsToRemove.map((student) => student.id),
        },
      });

      ToastAndroid.show('Alunos removidos com sucesso', ToastAndroid.SHORT);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage === 'Unauthorized') {
          await removeUserAndToken();
          ToastAndroid.show('Sessão expirada', 300);
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar remover os alunos');
      }
    }
  }

  const handleSubmit = async () => {
    await handleAddStudents();
    await handleRemoveStudents();

    navigation.goBack();
  }

  const handleToggleStudent = (id: string) => {
    setStudents(prevState => {
      return prevState.map(student => {
        if (student.id === id) {
          return {
            ...student,
            selected: !student.selected
          }
        }

        return student;  
      });
    });

    if (search) {
      setFilteredStudents(prevState => {
        return prevState.map(student => {
          if (student.id === id) {
            return {
              ...student,
              selected: !student.selected
            }
          }

          return student;
        });
      });
    }
  }

  const handleSearch = (search: string) => {
    const studentsFiltered = students.filter(student => {
      return student.name.toLowerCase().includes(search.toLowerCase());
    });

    setSearch(search);
    setFilteredStudents(studentsFiltered);
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.background,
        justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 40,
          width: '100%',
          gap: 20,
        }}
      >
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Title>Adicionar alunos</Title>

          <Text
            style={{
              color: Colors.text,
              fontSize: 15,
              textAlign: 'center',
              fontWeight: 'black',
              width: '70%',
            }}
          >
            Selecione os alunos que deseja adicionar ou remover da turma
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: 30,
            width: '100%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.inputBackground,
              borderRadius: 10,
              paddingHorizontal: 15,
              width: '100%',
              height: 50,
              gap: 10,
              alignItems: 'center',
            }}
          >
            <Search size={25} color={Colors.primary} />
            <TextInput
              placeholder="Pesquisar aluno"
              style={{
                color: Colors.text,
              }}
              value={search}
              onChangeText={handleSearch}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          paddingHorizontal: 30,
          gap: 40,
          flex: 1,
        }}
      >
        <View>
          <Text
            style={{
              color: Colors.primary,
              fontSize: 25,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 15,
            }}
          >
            Alunos cadastrados
          </Text>

          <FlatList
            data={search ? filteredStudents : students}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: 10,
              paddingVertical: 10,
            }}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: Colors.inputBackground,
                  borderRadius: 10,
                  padding: 20,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 10,
                  flexDirection: 'row',
                }}
              >
                <Checkbox
                  isChecked={item.selected}
                  onToggle={() => handleToggleStudent(item.id)}
                />
                <Text
                  style={{
                    color: Colors.text,
                    fontWeight: '500',
                    fontSize: 16,
                  }}
                >
                  {item.name}
                </Text>
              </View>
            )}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center' }}>A lista está vazia</Text>
            )}
          />
        </View>
      </View>

      <View
        style={{
          width: '100%',
          paddingTop: 20,
          paddingHorizontal: 30,
          paddingBottom: 30,
          gap: 25,
        }}
      >
        <Button
          text="Adicionar alunos"
          onPress={handleSubmit}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
} 