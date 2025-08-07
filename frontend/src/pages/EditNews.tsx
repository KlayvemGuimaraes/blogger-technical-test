import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsData {
  id: number;
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  category: string;
  author: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newsData, setNewsData] = useState<NewsData>({
    id: 0,
    title: '',
    summary: '',
    body: '',
    imageUrl: '',
    category: '',
    author: ''
  });

  useEffect(() => {
    const loadNews = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/news/${id}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar notícia');
        }
        const data = await response.json();
        setNewsData({
          id: data.id,
          title: data.title || '',
          summary: data.summary || '',
          body: data.body || '',
          imageUrl: data.imageUrl || '',
          category: data.category || '',
          author: data.author || ''
        });
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
  }, [id, toast]);

  const handleInputChange = (field: keyof NewsData, value: string) => {
    setNewsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setNewsData(prev => ({
        ...prev,
        imageUrl: previewUrl
      }));
    }
  };

  const handleSave = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', newsData.title);
      formData.append('summary', newsData.summary);
      formData.append('body', newsData.body);
      formData.append('category', newsData.category);
      formData.append('author', newsData.author);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar notícia');
      }

      toast({
        title: "Notícia atualizada com sucesso!",
        description: "As alterações foram salvas.",
      });
      navigate(`/news/${id}`);
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      toast({
        title: "Erro ao salvar notícia",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/news/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mb-6"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-6">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-40 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/news/${id}`)}
                className="hover:bg-accent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <h1 className="text-xl font-semibold">Editar Notícia</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              
              <Button 
                variant="news" 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Edit Form */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Notícia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newsData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Digite o título da notícia"
                className="text-lg font-medium"
              />
            </div>

            {/* Category and Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={newsData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Economia">Economia</SelectItem>
                    <SelectItem value="Esportes">Esportes</SelectItem>
                    <SelectItem value="Política">Política</SelectItem>
                    <SelectItem value="Cultura">Cultura</SelectItem>
                    <SelectItem value="Saúde">Saúde</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={newsData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Nome do autor"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Imagem</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {newsData.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={newsData.imageUrl.startsWith('blob:') ? newsData.imageUrl : `${API_BASE_URL}${newsData.imageUrl}`}
                    alt="Preview" 
                    className="max-w-xs h-24 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Resumo</Label>
              <Textarea
                id="summary"
                value={newsData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                placeholder="Escreva um resumo da notícia"
                className="min-h-[80px]"
              />
              <p className="text-sm text-muted-foreground">
                {newsData.summary.length}/200 caracteres
              </p>
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body">Conteúdo</Label>
              <Textarea
                id="body"
                value={newsData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="Escreva o conteúdo completo da notícia"
                className="min-h-[300px]"
              />
              <p className="text-sm text-muted-foreground">
                {newsData.body.length} caracteres
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-card">
              {newsData.imageUrl && (
                <img 
                  src={newsData.imageUrl.startsWith('blob:') ? newsData.imageUrl : `${API_BASE_URL}${newsData.imageUrl}`}
                  alt={newsData.title}
                  className="w-full h-48 object-cover rounded mb-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{newsData.category}</p>
                <h2 className="text-2xl font-bold">{newsData.title || 'Título da notícia'}</h2>
                <p className="text-muted-foreground">{newsData.summary || 'Resumo da notícia'}</p>
                <p className="text-sm text-muted-foreground">Por {newsData.author || 'Autor'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditNews;