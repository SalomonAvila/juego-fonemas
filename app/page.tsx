'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [transition, setTransition] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transition) {
      router.push(`/juego?transition=${transition}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#959b7c]">
      <main className="w-full max-w-md px-6">
        <div className="bg-[#6E302B] rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Juego de Fonemas
            </h1>
            <p className="text-white/90">
              Bienvenido/a
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="transition" 
                className="block text-sm font-medium text-white mb-2"
              >
                ¿A qué transición perteneces?
              </label>
              <select
                id="transition"
                value={transition}
                onChange={(e) => setTransition(e.target.value)}
                className="w-full px-4 py-3 border border-[#959b7c] rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#959b7c] focus:border-transparent transition-all"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="A">Transición A</option>
                <option value="B">Transición B</option>
                <option value="C">Transición C</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#959b7c] hover:bg-[#848c6d] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!transition}
            >
              Comenzar
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-white/80 text-center mb-3 font-medium">Creado por:</p>
            <ul className="space-y-1 text-white text-center">
              <li className="text-sm">Salomon Avila</li>
              <li className="text-sm">Sonia Larrotta</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
