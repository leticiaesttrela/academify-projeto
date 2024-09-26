import { AuthProvider } from '@/src/contexts/Auth';
import { Routes } from '@/src/routes';

export const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
