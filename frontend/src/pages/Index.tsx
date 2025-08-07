import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import NewsForm from '@/components/NewsForm'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  category: string;
  views: number;
  readTime: number;
  createdAt?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Index = () => {
  const [showForm, setShowForm] = useState(false)
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  const mockInitialNews: NewsItem[] = [
    {
      id: 1,
      title: "Hackatons As a Path",
      summary: "Como soluções desenvolvidas dentro de Hackatons podem moldar a sua realidade.",
      imageUrl: "https://media.licdn.com/dms/image/v2/D4D22AQEts-l_w71aLA/feedshare-shrink_800/B4DZe_G1aoGgAk-/0/1751257956756?e=1757548800&v=beta&t=MTzY0PdiNr91RIYpjoYvWnsBsbr7hJS6iLXGl2jSopg",
      author: "Klayvem Guimarães Leal da Silva",
      publishedAt: "há 2 horas",
      category: "Tecnologia",
      views: 1247,
      readTime: 5
    },
    {
      id: 2,
      title: "Economia brasileira mostra sinais de recuperação",
      summary: "Indicadores econômicos apontam crescimento sustentável no terceiro trimestre do ano.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQomCdU54V6KpHx5rOXl6f6gImXftA9wcamug&s",
      author: "Klayvem Guimarães Leal da Silva",
      publishedAt: "há 4 horas",
      category: "Economia",
      views: 892,
      readTime: 3
    }
  ];

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const formatPublishedAt = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'há menos de 1 hora';
    if (diffInHours < 24) return `há ${diffInHours} horas`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'há 1 dia';
    if (diffInDays < 7) return `há ${diffInDays} dias`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/news`);
      if (!response.ok) {
        throw new Error('Falha ao carregar notícias');
      }
      const data = await response.json();
      
      const transformedNews = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        imageUrl: item.imageUrl ? `${API_BASE_URL}${item.imageUrl}` : '',
        author: item.author || 'Autor Desconhecido',
        publishedAt: formatPublishedAt(item.createdAt || new Date().toISOString()),
        category: item.category || 'Geral',
        views: Math.floor(Math.random() * 3000) + 100,
        readTime: calculateReadTime(item.body || ''),
        createdAt: item.createdAt
      }));
      
      setNews(transformedNews.length > 0 ? transformedNews : mockInitialNews);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      toast({
        title: "Erro ao carregar notícias",
        description: "Não foi possível carregar as notícias. Exibindo dados mockados.",
        variant: "destructive"
      });
      setNews(mockInitialNews);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleNewsSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Falha ao criar notícia');
      }

      const newNews = await response.json();
      const title = formData.get('title') as string;
      
      toast({
        title: "Notícia publicada com sucesso!",
        description: `"${title}" foi adicionada ao feed de notícias.`,
      });
      
      setShowForm(false);
      loadNews();
    } catch (error) {
      console.error('Erro ao criar notícia:', error);
      toast({
        title: "Erro ao publicar notícia",
        description: "Não foi possível publicar a notícia. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {!showForm ? (
        <>
          <HeroSection />
          
          <section className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Últimas Notícias</h2>
                <p className="text-gray-600">Acompanhe as principais notícias do dia</p>
              </div>
              
              <Button 
                onClick={() => setShowForm(true)}
                className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Notícia
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm border p-4">
                    <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((newsItem) => (
                  <div 
                    key={newsItem.id} 
                    className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                    onClick={() => navigate(`/news/${newsItem.id}`, { state: { newsItem } })}
                  >
                    {newsItem.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={newsItem.imageUrl} 
                          alt={newsItem.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-800">
                          {newsItem.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {newsItem.readTime} min
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900">
                        {newsItem.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {newsItem.summary}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">
                          Por {newsItem.author}
                        </span>
                        <span className="text-gray-500">
                          {newsItem.publishedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">Nenhuma notícia encontrada</p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar primeira notícia
                </Button>
              </div>
            )}
            
            {news.length > 0 && (
              <div className="flex justify-center mt-12">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={loadNews}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Atualizar notícias
                </Button>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Nova Notícia</h2>
              <p className="text-gray-600">Crie e publique uma nova notícia</p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Voltar ao Feed
            </Button>
          </div>
          
          <NewsForm onSubmit={handleNewsSubmit} />
        </section>
      )}
      
      <Button 
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        <PlusCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Index;