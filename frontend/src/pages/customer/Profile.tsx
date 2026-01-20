import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { getOrders } from '../../api/products'
import { Package, MapPin, Settings, LogOut } from 'lucide-react'

export default function Profile() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [tab, setTab] = useState<'orders' | 'wishlist'>('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching orders:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // No need for manual guard - ProtectedRoute handles redirect
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-5 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold">Olá, {user.name ?? 'Cliente'}</h1>
        <p className="text-sm text-neutral-500 mt-1">Bem-vindo(a) ao seu painel.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Link to="/orders" className="group rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow transition">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
            <Package size={18} className="text-neutral-700" />
          </div>
          <div className="text-sm font-medium">Meus Pedidos</div>
          <div className="text-xs text-neutral-500">Acompanhe suas compras</div>
        </Link>
        <button className="group rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow transition text-left">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
            <MapPin size={18} className="text-neutral-700" />
          </div>
          <div className="text-sm font-medium">Endereços</div>
          <div className="text-xs text-neutral-500">Gerencie seus endereços</div>
        </button>
        <button className="group rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow transition text-left">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
            <Settings size={18} className="text-neutral-700" />
          </div>
          <div className="text-sm font-medium">Dados Pessoais</div>
          <div className="text-xs text-neutral-500">Atualize suas informações</div>
        </button>
        <button onClick={handleLogout} className="group rounded-xl border border-neutral-200 bg-white p-4 hover:border-red-300 hover:bg-red-50 transition text-left">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
            <LogOut size={18} className="text-red-600" />
          </div>
          <div className="text-sm font-medium text-red-600">Sair</div>
          <div className="text-xs text-neutral-500">Encerrar sessão</div>
        </button>
      </div>

      {/* Tabs for Orders/Wishlist (optional) */}
      <div className="flex gap-3 text-sm">
        <button
          onClick={() => setTab('orders')}
          className={`rounded-full px-4 py-2 border ${tab === 'orders' ? 'border-neutral-900 text-neutral-900' : 'border-neutral-200 text-neutral-500'}`}
        >
          Pedidos Recentes
        </button>
        <button
          onClick={() => setTab('wishlist')}
          className={`rounded-full px-4 py-2 border ${tab === 'wishlist' ? 'border-neutral-900 text-neutral-900' : 'border-neutral-200 text-neutral-500'}`}
        >
          Wishlist
        </button>
      </div>

      {tab === 'orders' && (
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-neutral-500">Carregando pedidos...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">Você ainda não fez nenhum pedido.</div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div>
                  <div className="text-sm font-semibold">Pedido #{o.id}</div>
                  <div className="text-xs text-neutral-500">{new Date(o.created_at).toLocaleDateString('pt-BR')}</div>
                </div>
                <div className="text-sm text-neutral-700">{o.status || 'Processando'}</div>
                <div className="text-sm font-medium">R$ {Number(o.total_amount || 0).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'wishlist' && (
        <div className="text-center py-8 text-neutral-500">
          Sua wishlist está vazia. Adicione produtos aos favoritos!
        </div>
      )}
    </div>
  )
}
