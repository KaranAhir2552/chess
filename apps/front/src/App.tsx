import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './Auth/Login';
import ChessBoardPage from './pages/chess_board';
import Register from './Auth/Register';

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
    element: <ChessBoardPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
