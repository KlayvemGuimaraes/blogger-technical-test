'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiTrash } from 'react-icons/fi'

export default function Home() {
  const [news, setNews] = useState([])

  const fetchNews = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`)
    const data = await res.json()
    setNews(data)
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar esta notícia?')
    if (!confirmDelete) return

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setNews(prev => prev.filter((n: any) => n.id !== id))
    } else {
      alert('Erro ao deletar a notícia.')
    }
  }

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Blogger de Notícias</h1>
        <Link href="/create" className="bg-black text-white px-4 py-2 rounded">
          Nova notícia
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((n: any) => (
          <div key={n.id} className="border rounded-xl overflow-hidden shadow bg-white flex flex-col">
            <img
              src={`http://localhost:3001${n.imageUrl}`}
              alt={n.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold">{n.title}</h2>
                <p className="text-gray-700">{n.summary}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Link href={`/news/${n.id}`} className="text-blue-600">
                  Acessar notícia
                </Link>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-black hover:text-gray-800"
                  title="Excluir notícia"
                >
                  <FiTrash size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
