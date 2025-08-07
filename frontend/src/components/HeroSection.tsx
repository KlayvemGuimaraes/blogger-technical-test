import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-800 to-blue-900 text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <Badge variant="secondary" className="text-white bg-primary-foreground/30 border-primary-foreground/40">
              Matenha-se informado!
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Mantenha-se informado sempre
            </h1>
            
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Acompanhe as últimas notícias, análises e reportagens especiais com nossa plataforma de jornalismo moderno e confiável.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 text-sm">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">500+</span>
                <span className="text-primary-foreground/70">Notícias hoje</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">24/7</span>
                <span className="text-primary-foreground/70">Cobertura</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">100k+</span>
                <span className="text-primary-foreground/70">Leitores</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Explorar Notícias
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Sobre nós
              </Button>
            </div>
          </div>

          {/* Featured News Card */}
          <div className="relative">
            <div className="bg-card/10 backdrop-blur-sm rounded-lg overflow-hidden border border-primary-foreground/20">
              <Link to="/news/1" className="block">
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop" 
                  alt="Notícia Urgente"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <Badge variant="secondary" className="mb-3 text-category-tech bg-primary-foreground/10 border-primary-foreground/20">
                    Tecnologia
                  </Badge>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    Inteligência Artificial revoluciona o jornalismo moderno
                  </h3>
                  <p className="text-primary-foreground/70 text-sm mb-4 line-clamp-2">
                    Nova tecnologia permite análise em tempo real de dados complexos para reportagens mais precisas.
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-primary-foreground/60">
                    <span>Por Ana Silva</span>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        há 2 minutos
                      </div>
                      <div className="flex items-center">
                        <Eye className="mr-1 h-3 w-3" />
                        1.2k
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Live indicator */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-red-100">Notícia Urgente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;