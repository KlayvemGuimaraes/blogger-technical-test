'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditNewsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`)
      const data = await res.json()
      setTitle(data.title)
      setSummary(data.summary)
      setContent(data.body) 
      setLoading(false)
    }

    if (id) fetchNews()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, summary, content }),
    })

    if (res.ok) {
      router.push(`/news/${id}`)
    } else {
      alert('Erro ao atualizar a notícia.')
    }
  }

  if (loading) return <p className="p-4">Carregando...</p>

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Notícia</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resumo
          </label>
          <textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conteúdo
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={10}
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-full transition"
        >
          Salvar Alterações
        </button>
      </form>
    </main>
  )
}
