import { useState, useEffect } from 'react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSchema, paymentSchema } from '../../lib/validators'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { createOrder } from '../../api/products'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const steps = ['Endereço', 'Pagamento']

export default function Checkout() {
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.total)
  const clear = useCartStore((state) => state.clear)
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  
  const addressForm = useForm({ 
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: ''
    }
  })
  const paymentForm = useForm({ 
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'credit_card'
    }
  })

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para continuar com a compra')
      navigate('/auth/login', { state: { from: { pathname: '/checkout' } } })
    }
  }, [isAuthenticated, navigate])

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  const onSubmit = async () => {
    try {
      setSubmitting(true)
      const addressData = addressForm.getValues()
      const paymentData = paymentForm.getValues()
      
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        color: item.selectedColor,
        size: item.selectedSize
      }))

      const total = getTotal()

      await createOrder(orderItems as any)

      toast.success('Pedido realizado com sucesso!')
      clear()
      navigate('/orders')
    } catch (error: any) {
      console.error('Order error:', error)
      toast.error('Erro ao processar pedido. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="text-sm text-neutral-500">Conclua em 3 passos simples.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-neutral-600">
          {steps.map((label, i) => (
            <div key={label} className={`flex items-center gap-2 ${i <= step ? 'text-neutral-900' : 'text-neutral-400'}`}>
              <span className={`h-6 w-6 rounded-full border flex items-center justify-center ${i <= step ? 'border-neutral-900' : 'border-neutral-300'}`}>{i + 1}</span>
              <span>{label}</span>
              {i < steps.length - 1 && <span className="w-8 h-px bg-neutral-200" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {step === 0 && (
            <section className="space-y-4 bg-white border border-neutral-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Endereço de entrega</h2>
              <form className="grid grid-cols-2 gap-4" onSubmit={addressForm.handleSubmit(next)}>
                <Input placeholder="Rua" {...addressForm.register('street')} />
                <Input placeholder="Número" {...addressForm.register('number')} />
                <Input placeholder="Complemento" {...addressForm.register('complement')} />
                <Input placeholder="Bairro" {...addressForm.register('neighborhood')} />
                <Input placeholder="Cidade" {...addressForm.register('city')} />
                <Input placeholder="Estado" {...addressForm.register('state')} />
                <Input placeholder="CEP" {...addressForm.register('postal_code')} />
                <div className="col-span-2 flex justify-between mt-2">
                  <Button type="button" variant="secondary" onClick={back}>Voltar</Button>
                  <Button type="submit">Continuar</Button>
                </div>
              </form>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4 bg-white border border-neutral-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Pagamento</h2>
              <form className="space-y-4" onSubmit={paymentForm.handleSubmit(onSubmit)}>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="radio" value="credit_card" {...paymentForm.register('method')} /> Cartão</label>
                  <label className="flex items-center gap-2"><input type="radio" value="pix" {...paymentForm.register('method')} /> PIX</label>
                  <label className="flex items-center gap-2"><input type="radio" value="boleto" {...paymentForm.register('method')} /> Boleto</label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Número do cartão" {...paymentForm.register('card_number')} />
                  <Input placeholder="Nome impresso" {...paymentForm.register('card_name')} />
                  <Input placeholder="Validade (MM/AA)" {...paymentForm.register('card_exp')} />
                  <Input placeholder="CVV" {...paymentForm.register('card_cvv')} />
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={back} disabled={submitting}>Voltar</Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Processando...' : 'Finalizar compra'}
                  </Button>
                </div>
              </form>
            </section>
          )}
        </div>

        <div className="border border-neutral-200 rounded-2xl p-6 h-fit sticky top-24 bg-white">
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={`${i.product.id}-${i.selectedSize}-${i.selectedColor}`} className="flex justify-between">
                <span>{i.product.name} x {i.quantity}</span>
                <span>R$ {(i.product.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between font-medium">
            <span>Total</span>
            <span>R$ {getTotal().toFixed(2)}</span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">Frete e descontos aplicados na próxima etapa.</p>
        </div>
      </div>
    </div>
  )
}
