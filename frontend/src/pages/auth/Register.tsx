import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../lib/validators'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useAuthStore } from '../../store/authStore'
import { Link, useNavigate } from 'react-router-dom'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function Register() {
  const register = useAuthStore((state) => state.register)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm({ 
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })
  
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      await register(data.name, data.email, data.password)
      toast.success('Conta criada com sucesso!')
      navigate('/')
    } catch (err: any) {
      const status = err?.response?.status
      
      if (status === 409) {
        toast.error('Email já cadastrado. Tente fazer login.')
      } else if (status === 400) {
        toast.error('Dados inválidos. Verifique os campos.')
      } else {
        toast.error('Erro ao criar conta. Tente novamente.')
      }
      console.error('Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="grid min-h-[80vh] grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft">
          
          {/* Coluna da Imagem */}
          <div className="relative hidden md:block order-last md:order-first">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
              alt="Fashion Register"
              className="h-full w-full"
              imgClassName="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <div className="text-xs uppercase tracking-[0.2em]">Junte-se a nós</div>
              <div className="text-2xl font-semibold">Crie sua conta hoje</div>
            </div>
          </div>

          {/* Coluna do Formulário */}
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold">Criar Conta</h1>
              <p className="text-sm text-neutral-500">Preencha seus dados para começar.</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1">
                <Input 
                  placeholder="Nome Completo" 
                  type="text" 
                  {...form.register('name')}
                  className={form.formState.errors.name ? 'border-red-500' : ''}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs font-medium">{form.formState.errors.name.message as string}</p>
                )}
              </div>

              <div className="space-y-1">
                <Input 
                  placeholder="Email" 
                  type="email" 
                  {...form.register('email')}
                  className={form.formState.errors.email ? 'border-red-500' : ''}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs font-medium">{form.formState.errors.email.message as string}</p>
                )}
              </div>

              <div className="space-y-1">
                <Input 
                  placeholder="Senha" 
                  type="password" 
                  {...form.register('password')}
                  className={form.formState.errors.password ? 'border-red-500' : ''}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs font-medium">{form.formState.errors.password.message as string}</p>
                )}
              </div>

              <Button 
                className="w-full h-11 font-medium" 
                type="submit" 
                disabled={isLoading || form.formState.isSubmitting}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cadastrando...
                  </span>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>

            <div className="text-sm text-neutral-600 text-center">
              Já tem uma conta? <Link to="/auth/login" className="font-medium underline text-neutral-900">Entre aqui</Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}