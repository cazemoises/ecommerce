import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/customer/Home'
import ProductList from '../pages/customer/ProductList'
import ProductDetail from '../pages/customer/ProductDetail'
import Cart from '../pages/customer/Cart'
import Checkout from '../pages/customer/Checkout'
import OrderHistory from '../pages/customer/OrderHistory'
import Profile from '../pages/customer/Profile'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ProtectedRoute from '../components/auth/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <ProductList /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { 
        path: 'checkout', 
        element: <ProtectedRoute><Checkout /></ProtectedRoute> 
      },
      { 
        path: 'orders', 
        element: <ProtectedRoute><OrderHistory /></ProtectedRoute> 
      },
      { 
        path: 'profile', 
        element: <ProtectedRoute><Profile /></ProtectedRoute> 
      }
    ]
  },
  // Auth routes - standalone without navbar/footer
  {
    path: '/auth/login',
    element: <Login />
  },
  {
    path: '/auth/register',
    element: <Register />
  }
])
