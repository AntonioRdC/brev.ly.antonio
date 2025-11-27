import { createBrowserRouter } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Redirect } from '../pages/Redirect'
import { NotFound } from '../pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '/:shortCode',
    element: <Redirect />,
  },
])
