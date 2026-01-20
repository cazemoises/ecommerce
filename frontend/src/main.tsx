import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Importe o 'Slide' aqui
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { router } from './routes/AppRoutes'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false} /* Agora é FALSE para mostrar a barra */
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable={true} /* Permite arrastar para fechar */
        pauseOnHover={true}
        theme="light"
        transition={Slide} /* Animação de Slide suave para entrada/saída */
        limit={3}
        toastClassName="luxury-toast"
        closeButton={false}
      />
    </QueryClientProvider>
  </React.StrictMode>
)