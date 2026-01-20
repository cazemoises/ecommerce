export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Painel do Vendedor</h1>
      <div className="grid md:grid-cols-4 gap-4">
        {["Vendas", "Pedidos", "Produtos", "Estoque baixo"].map((label) => (
          <div key={label} className="rounded-xl border border-border p-6">
            <div className="text-sm text-textSecondary">{label}</div>
            <div className="mt-2 text-2xl font-semibold">—</div>
          </div>
        ))}
      </div>
    </div>
  )
}
