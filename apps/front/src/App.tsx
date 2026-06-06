import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import Login from './Auth/Login';
import ChessBoardPage from './pages/chess_board';
import Register from './Auth/Register';
import { Toaster } from 'react-hot-toast';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const router = createBrowserRouter([
  {
    path: '/',
    element: isAuthenticated() ? <ChessBoardPage /> : <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  // {
  //   path: '/chess-board',
  //   element: (
  //     <ProtectedRoutes>
  //       <ChessBoardPage />
  //     </ProtectedRoutes>
  //   ),
  // },
]);

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
