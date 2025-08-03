import Link from 'next/link'
import { notFound } from 'next/navigation'
import BackButton from '@/components/BackButton'  

interface News {
  id: number
  title: string
  summary: string
  body: string
  imageUrl: string | null
  createdAt: string
}

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`)
  if (!res.ok) return []

  const newsList: News[] = await res.json()
  return newsList.map((news) => ({ id: news.id.toString() }))
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return notFound()
  }

  const news: News = await res.json()

  if (!news || !news.id || !news.title) {
    return notFound()
  }

  const imageFullUrl =
    news.imageUrl?.startsWith('http')
      ? news.imageUrl
      : news.imageUrl
      ? `${process.env.NEXT_PUBLIC_API_URL}${news.imageUrl}`
      : null

  return (
    <>
      <BackButton />
      <main className="min-h-screen bg-gray-100 py-12 px-4">
        <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {imageFullUrl && (
            <img
              src={imageFullUrl}
              alt={news.title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
            <p className="text-gray-600 mb-6">{news.summary}</p>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: news.body }} />
            </div>
            <p className="mt-8 text-sm text-gray-500">
              Publicado em{' '}
              {new Date(news.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>

            <div className="flex justify-end mt-6">
              <Link
                href={`/news/edit/${news.id}`}
                className="bg-black text-white px-5 py-3 rounded-full shadow transition font-semibold"
                aria-label="Editar notícia"
              >
                Editar
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
