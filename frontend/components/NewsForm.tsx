'use client'
import { useState } from 'react'

export default function NewsForm({ onSubmit, initialData = {} }: any) {
  const [title, setTitle] = useState(initialData.title || '')
  const [summary, setSummary] = useState(initialData.summary || '')
  const [content, setContent] = useState(initialData.body || '') 
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('summary', summary)
    formData.append('body', content)
    if (image) formData.append('image', image)

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Resumo"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Conteúdo"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full border p-2 rounded h-40"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) setImage(e.target.files[0])
        }}
        className="w-full"
      />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Salvar
      </button>
    </form>
  )
}
