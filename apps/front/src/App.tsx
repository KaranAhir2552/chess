import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './Auth/Login';
import ChessBoardPage from './pages/chess_board';
import Register from './Auth/Register';
import ProtectedRoutes from './routes/ProtectedRoutes.js';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/chess-board',
    element: (
      <ProtectedRoutes>
        <ChessBoardPage />
      </ProtectedRoutes>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
