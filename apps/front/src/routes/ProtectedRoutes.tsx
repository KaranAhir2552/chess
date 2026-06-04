import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

type ProtectedRoutesProps = {
  children: ReactNode;
};

export default function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
