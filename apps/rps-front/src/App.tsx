import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './Auth/Login';
import ChessBoardPage from './pages/chess_board';
import Register from './Auth/Register';
import ProtectedRoutes from './routes/ProtectedRoutes';
// import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <ChessBoardPage />
      </ProtectedRoutes>
    ),
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
      {/* <Toaster position="top-center" /> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
