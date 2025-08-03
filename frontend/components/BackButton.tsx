'use client'

import Link from 'next/link'

export default function BackButton() {
  return (
    <Link
      href="/"
      className="fixed top-6 left-6 text-gray-800 px-4 py-2 rounded hover:text-gray-600 transition"
      aria-label="Voltar para a página inicial"
    >
      ← Voltar
    </Link>
  )
}
