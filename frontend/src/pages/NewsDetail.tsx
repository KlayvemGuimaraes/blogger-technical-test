import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Edit, Clock, Eye, Share2, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsDetailType {
  id: number;
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  category: string;
  views: number;
  readTime: number;
  createdAt?: string;
  isOwner?: boolean; // Adicionando campo para verificar se o usuário é dono da notícia
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [news, setNews] = useState<NewsDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Verificação simplificada de autenticação (substitua por sua lógica real)
  const isAuthenticated = true; // Em produção, verifique se o usuário está logado
  const isAdmin = true; // Em produção, verifique se o usuário é admin ou dono da notícia

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

  const formatBodyContent = (body: string) => {
    if (!body) return '<p>Conteúdo não disponível</p>';
    
    return body
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p class="mb-4">${paragraph}</p>`)
      .join('');
  };

  useEffect(() => {
    const mockNewsItem = location.state?.newsItem;

    if (mockNewsItem) {
      const transformedNews: NewsDetailType = {
        ...mockNewsItem,
        body: formatBodyContent(mockNewsItem.body || mockNewsItem.summary),
        readTime: calculateReadTime(mockNewsItem.body || mockNewsItem.summary),
        isOwner: true // Assumindo que se veio do state, o usuário tem permissão
      };
      setNews(transformedNews);
      setIsLoading(false);
      return;
    }

    const loadNews = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/news/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setNews(null);
            return;
          }
          throw new Error('Falha ao carregar notícia');
        }
        
        const data = await response.json();
        const transformedNews: NewsDetailType = {
          id: data.id,
          title: data.title,
          summary: data.summary,
          body: formatBodyContent(data.body || data.summary),
          imageUrl: data.imageUrl ? `${API_BASE_URL}${data.imageUrl}` : '',
          author: data.author || 'Autor Desconhecido',
          publishedAt: formatPublishedAt(data.createdAt || new Date().toISOString()),
          category: data.category || 'Geral',
          views: Math.floor(Math.random() * 3000) + 100,
          readTime: calculateReadTime(data.body || data.summary),
          createdAt: data.createdAt,
          isOwner: true // Em produção, verifique se o usuário atual é o dono
        };
        
        setNews(transformedNews);
      } catch (error) {
        console.error('Erro ao carregar notícia:', error);
        toast({
          title: "Erro ao carregar notícia",
          description: "Não foi possível carregar os dados da notícia.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [id, toast, location.state]);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tecnologia':
        return 'bg-blue-100 text-blue-800';
      case 'economia':
        return 'bg-green-100 text-green-800';
      case 'esportes':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiado!",
      description: "O link da notícia foi copiado para a área de transferência.",
    });
  };

  const handleDelete = async () => {
    if (!id || !news) return;
    
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.');
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir notícia');
      }

      toast({
        title: "Notícia excluída",
        description: "A notícia foi removida com sucesso.",
      });
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
      toast({
        title: "Erro ao excluir notícia",
        description: "Não foi possível excluir a notícia. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
          <p className="text-gray-600 mb-6">A notícia que você está procurando não existe.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
                className="hidden sm:flex"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
              
              {(isAuthenticated && (isAdmin || news.isOwner)) && (
                <>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => navigate(`/news/${news.id}/edit`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>

                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <Badge className={`${getCategoryColor(news.category)} mb-4`}>
            {news.category}
          </Badge>
          
          <h1 className="text-3xl font-bold leading-tight mb-4 text-gray-900">
            {news.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            {news.summary}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`https://ui-avatars.com/api/?name=${news.author}&background=random`} />
                <AvatarFallback>{news.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{news.author}</p>
                <p className="text-sm text-gray-500">{news.publishedAt}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {news.readTime} min de leitura
              </div>
              <div className="flex items-center">
                <Eye className="mr-1 h-4 w-4" />
                {news.views.toLocaleString()} visualizações
              </div>
            </div>
          </div>
        </div>

        {news.imageUrl && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
            <img 
              src={news.imageUrl} 
              alt={news.title}
              className="w-full h-auto max-h-[500px] object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div 
            className="prose max-w-none prose-p:text-gray-700 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.body }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Compartilhar:</span>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            
            {(isAuthenticated && (isAdmin || news.isOwner)) && (
              <Button 
                variant="default" 
                onClick={() => navigate(`/news/${news.id}/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar esta notícia
              </Button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;