import { Classes } from '@/src/app/classes';
import { ClassEditor } from '@/src/app/classes/classEditor';
import { Home } from '@/src/app/home';
import { People } from '@/src/app/home/people';
import { Profile } from '@/src/app/home/profile';
import { Students } from '@/src/app/students';
import { Student } from '@/src/app/students/student';
import { StudentEditor } from '@/src/app/students/studentEditor';
import { Teachers } from '@/src/app/teachers';
import { Teacher } from '@/src/app/teachers/teacher';
import { TeacherEditor } from '@/src/app/teachers/teacherEditor';
import { NavigatorRoutesProps, RoutesProps } from '@/src/types/routes';
import { API_URL } from '@env';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, TouchableOpacity } from 'react-native';
import { AddStudents } from '../app/classes/addStudents';
import { Class } from '../app/classes/class';
import { useAuth } from '../hooks/useAuth';

interface UserOptionsProps {
  navigation: NavigatorRoutesProps;
  imageUrl?: string;
}

const UserOptions = ({ 
  navigation, 
  imageUrl 
}: UserOptionsProps) => {
  return {
    headerShadowVisible: false,
    title: '',
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={{ marginRight: 15 }}
        activeOpacity={0.8}
      >
        <Image
          source={
            !imageUrl
              ? require('../../assets/images/user.png')
              : { uri: API_URL.concat(`/${imageUrl}`) }
          }
          style={{ width: 40, height: 40, borderRadius: 25 }}
        />
      </TouchableOpacity>
    ),
  };
};

const { Navigator, Screen } = createNativeStackNavigator<RoutesProps>();

export const MainRoutes = () => {
  const { user } = useAuth();

  return (
    <Navigator>
      <Screen
        name="Home"
        component={Home}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />

      <Screen
        name="Profile"
        component={Profile}
        options={{ title: '', headerShadowVisible: false }}
      />

      <Screen
        name="Classes"
        component={Classes}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />
      <Screen
        name="People"
        component={People}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />
      <Screen
        name="ClassEditor"
        component={ClassEditor}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />
      <Screen
        name="Class"
        component={Class}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />
      <Screen
        name="AddStudents"
        component={AddStudents}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />

      <Screen
        name="Teachers"
        component={Teachers}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />
      <Screen
        name="Teacher"
        component={Teacher}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />
      <Screen
        name="TeacherEditor"
        component={TeacherEditor}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />

      <Screen
        name="Students"
        component={Students}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />
      <Screen
        name="Student"
        component={Student}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />
      <Screen
        name="StudentEditor"
        component={StudentEditor}
        options={({ navigation }) =>
          UserOptions({ navigation, imageUrl: user?.imageUrl })
        }
      />
    </Navigator>
  );
};
