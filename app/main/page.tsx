'use client';

import Image from 'next/image';

export default function MainPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#959b7c]">
      <div className="relative w-full max-w-2xl px-6">
        <Image
          src="/Dinosaurio.png"
          alt="Dinosaurio"
          width={800}
          height={800}
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  );
}
