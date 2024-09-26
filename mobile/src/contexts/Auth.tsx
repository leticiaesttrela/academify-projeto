import { api } from '@/src/lib/api';
import {
    storageTokenGet,
    storageTokenRemove,
} from '@/src/storage/storageToken';
import { isAxiosError } from 'axios';
import {
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { Alert } from 'react-native';

export interface AuthContextProps {
  user: IUser | undefined;
  setUser: (user: IUser) => void;
  removeUserAndToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>({} as IUser);

  const removeUserAndToken = useCallback(async () => {
    await storageTokenRemove();
    setUser({} as IUser);
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const token = await storageTokenGet();

      if (token) {
        try {
          const response = await api.get('/me');
          setUser(response.data.user);
        } catch (error) {
          if (isAxiosError(error)) {
            const errorMessage = error.response?.data.message;

            if (errorMessage === 'Unauthorized') {
              await removeUserAndToken();
              Alert.alert('Erro', 'Não autorizado');
            }
          } else {
            Alert.alert('Erro', 'Ocorreu um erro ao tentar recuperar o usuário');
          }
        }
      } else await removeUserAndToken(); 
    } catch (error) {
      if (error instanceof Error) {
        await removeUserAndToken();
      }
    }
  }, [removeUserAndToken]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        removeUserAndToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
