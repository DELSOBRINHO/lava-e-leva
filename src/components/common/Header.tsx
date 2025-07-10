

export default function Header() {
  return (
    <header className="bg-brand-primary text-white px-6 py-4 flex items-center gap-4 shadow">
      {/* Espaço para logo (pode substituir pelo logo real depois) */}
      <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center font-bold text-brand-dark text-xl">
        L&L
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Lava & Leva</h1>
    </header>
  );
} 