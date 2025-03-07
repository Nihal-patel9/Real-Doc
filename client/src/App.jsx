import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css'
import EditorPage from './EditorPage'
import RegisterPage from './RegisterPage';

function App() {

  const isAuthenticated = !!localStorage.getItem('token');

  const router = createBrowserRouter([
    {
      path: '/register',
      element: <><RegisterPage /></>
    },
    {
      path: '/document/:id',
      element: <>{isAuthenticated ? <EditorPage /> : <Navigate to="/login" />}</>
    },
    {
      path: '*',
      element: <><Navigate to={`/document/${Math.random().toString(36).substr(2, 9)}`} /></>
    }
  ])


  return (
    <>
      < RouterProvider router={router} />
    </>
  )
}

export default App
