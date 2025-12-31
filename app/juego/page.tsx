'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface Word {
  id: number;
  text: string;
  targetBox: number;
  isAnimating: boolean;
  hasArrived: boolean;
}

interface PalabrasResponse {
  correcta: string;
  opciones: string[];
}

function JuegoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transition = searchParams.get('transition') || 'A';
  
  const [words, setWords] = useState<Word[]>([]);
  const [palabraCorrecta, setPalabraCorrecta] = useState<string>('');
  const [cargando, setCargando] = useState(true);

  const [aciertos, setAciertos] = useState(0);
  const [totalPalabras, setTotalPalabras] = useState(0);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(false);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [mostrarCertificado, setMostrarCertificado] = useState(false);
  const canvasRef = useState<HTMLCanvasElement | null>(null)[0];

  const cargarNuevasPalabras = async () => {
    setCargando(true);
    try {
      const response = await fetch(`/api/palabras`);
      const data: PalabrasResponse = await response.json();
      
      setPalabraCorrecta(data.correcta);
      
      const nuevasWords = data.opciones.map((palabra, index) => ({
        id: index + 1,
        text: palabra,
        targetBox: index + 1,
        isAnimating: false,
        hasArrived: false
      }));
      
      setWords(nuevasWords);
      
      setTimeout(() => {
        setWords(prev => prev.map(word => ({ ...word, hasArrived: true })));
      }, 300);
    } catch (error) {
      console.error('Error cargando palabras:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNuevasPalabras();
  }, []);

  useEffect(() => {
    if (totalPalabras >= 10) {
      setTimeout(() => {
        setMostrarResultados(true);
      }, 500);
    }
  }, [totalPalabras]);

  const handleWordClick = (palabraSeleccionada: string) => {
    const isCorrect = palabraSeleccionada === palabraCorrecta;
    setTotalPalabras(prev => prev + 1);
    if (isCorrect) {
      setAciertos(prev => prev + 1);
    }
    setRespuestaCorrecta(isCorrect);
    setOpcionSeleccionada(true);
  };

  const handleContinuar = () => {
    setOpcionSeleccionada(false);
    cargarNuevasPalabras();
  };

  const generarCertificado = () => {
    if (!nombreUsuario.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx!.drawImage(img, 0, 0);
      
      // Configurar el texto
      ctx!.font = 'bold 20px Arial';
      ctx!.fillStyle = '#000000ff';
      ctx!.textAlign = 'center';
      
      // Dibujar el nombre en el centro del certificado
      const centerX = (canvas.width / 2) + 190;
      const centerY = (canvas.height / 2) -80;
      ctx!.fillText(nombreUsuario.toUpperCase(), centerX, centerY);
      
      const timeX = (canvas.width / 2) - 225;
      const timeY = (canvas.height / 2) + 400;
      const timeDate = new Date();
      ctx!.fillText(timeDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), timeX, timeY);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const printWindow = window.open(url, '_blank');
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.print();
            };
          }
        }
      });
    };

    img.src = '/Certificado.png';
  };

  if (mostrarResultados) {
    return (
      <div className="h-screen bg-[#959b7c] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#6E302B] mb-6">¡Juego Terminado!</h1>
            <div className="bg-[#6E302B] rounded-xl p-8 mb-6">
              <p className="text-white text-lg mb-2">Resultado Final</p>
              <p className="text-white text-5xl font-bold">{aciertos}/10</p>
              <p className="text-white/80 text-sm mt-2">
                {aciertos >= 8 ? '¡Excelente trabajo!' : aciertos >= 5 ? '¡Bien hecho!' : 'Sigue practicando'}
              </p>
            </div>
            
            {aciertos === 10 && (
              <div className="mb-6 space-y-4">
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                  <p className="text-yellow-800 font-semibold mb-3">
                    ¡Puntaje perfecto! Obtén tu certificado
                  </p>
                  <input
                    type="text"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    placeholder="Ingresa tu nombre"
                    className="w-full px-4 py-2 border-2 border-[#6E302B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#959b7c] text-center font-semibold"
                    maxLength={30}
                  />
                </div>
                <button
                  onClick={generarCertificado}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
                >
                  🏆 Generar e Imprimir Certificado
                </button>
              </div>
            )}
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-[#959b7c] hover:bg-[#848c6d] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-green-200 flex flex-col">
      <nav className="bg-[#6E302B] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-white text-xl font-bold">
                Juego de Fonemas - Transición {transition}
              </h1>
              <div className="bg-[#959b7c] px-4 py-2 rounded-lg">
                <p className="text-white font-bold text-lg">
                  {aciertos}/{totalPalabras}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-[#959b7c] hover:bg-[#848c6d] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </nav>
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/Fondo.png"
            alt="Fondo"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0">
          <Image
            src="/Dinosaurio.gif"
            alt="Dinosaurio animado"
            fill
            className="object-cover scale-x-[-1]"
            style={{ objectPosition: 'left center' }}
            unoptimized
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-xs md:max-w-sm lg:max-w-md pointer-events-auto ml-auto mr-8 md:mr-16 lg:mr-60">
            <div className="bg-white/90 backdrop-blur-sm shadow-2xl p-4 md:p-6 rounded-2xl flex flex-col gap-4 md:gap-6">
              
              {cargando ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-[#6E302B] text-xl font-semibold">Cargando palabras...</div>
                </div>
              ) : !opcionSeleccionada ? (
                <>
                  {words.map((word) => (
                    <div 
                      key={word.id}
                      onClick={() => handleWordClick(word.text)}
                      className="bg-[#6E302B] rounded-xl p-4 md:p-6 min-h-[80px] md:min-h-[100px] flex items-center justify-center border-4 border-[#959b7c] cursor-pointer hover:border-[#FF6B35] hover:scale-105 transition-all"
                    >
                      <p className={`text-white text-lg md:text-xl font-semibold text-center transition-opacity duration-1000 ${word.hasArrived ? 'opacity-100' : 'opacity-0'}`}>
                        {word.text}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="space-y-4">
                  <div className={`text-center py-2 px-4 rounded-lg font-bold text-xl ${
                    respuestaCorrecta 
                      ? 'bg-[#959b7c] text-white' 
                      : 'bg-[#6E302B] text-white'
                  }`}>
                    {respuestaCorrecta ? '✓ Correcto' : '✗ Incorrecto'}
                  </div>
                  
                  <div className="bg-[#6E302B] rounded-xl p-6 md:p-8 border-4 border-[#959b7c] animate-in fade-in duration-500">
                    <h3 className="text-white text-xl md:text-2xl font-bold mb-4 text-center">
                      Palabra correcta:
                    </h3>
                    <p className="text-white text-3xl md:text-4xl font-bold text-center">
                      {palabraCorrecta}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleContinuar}
                    className="w-full bg-[#959b7c] hover:bg-[#848c6d] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Juego() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#959b7c] flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    }>
      <JuegoContent />
    </Suspense>
  );
}
