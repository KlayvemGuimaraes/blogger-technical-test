'use client'
import NewsForm from '@/components/NewsForm'
import { useRouter } from 'next/navigation'

export default function CreateNews() {
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      router.push('/')
    } else {
      const error = await res.json()
      alert('Erro ao criar notícia: ' + error.error)
    }
  }

  return (
    <main className="relative bg-gradient-to-b from-white via-white to-gray-100 min-h-screen">
      <div className="absolute top-0 left-0 w-full h-64 bg-[url('/banner.jpg')] bg-cover bg-center opacity-70" />
      <div className="relative z-10 pt-28 pb-10 max-w-2xl mx-auto px-4">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-6">Criar Nova Notícia</h1>
          <NewsForm onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  )
}
