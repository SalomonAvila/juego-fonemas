import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Obtener las palabras desde las variables de entorno
  const palabrasEnv = process.env.PALABRAS;
  
  if (!palabrasEnv) {
    return NextResponse.json(
      { error: 'No se encontraron palabras' },
      { status: 404 }
    );
  }

  // Parsear las palabras (formato: correcta,incorrecta1,incorrecta2|correcta,incorrecta1,incorrecta2|...)
  const grupos = palabrasEnv.split('|');
  
  // Seleccionar un grupo aleatorio
  const grupoAleatorio = grupos[Math.floor(Math.random() * grupos.length)];
  
  // Extraer las 3 palabras del grupo (correcta, incorrecta1, incorrecta2)
  const palabras = grupoAleatorio.split(',').map(p => p.trim());
  
  if (palabras.length !== 3) {
    return NextResponse.json(
      { error: 'Formato incorrecto en las palabras' },
      { status: 500 }
    );
  }

  // La primera siempre es la correcta
  const correcta = palabras[0];
  
  // Mezclar el orden de las opciones para que la correcta no siempre esté en la misma posición
  const opciones = [...palabras].sort(() => Math.random() - 0.5);

  return NextResponse.json({
    correcta,
    opciones
  });
}
