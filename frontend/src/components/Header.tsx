// Header.tsx
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  slug: string;
}

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Carregar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fechar os resultados quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Buscar notícias conforme o usuário digita
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:3001/news?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-news to-news-hover rounded-lg flex items-center justify-center">
              <span className="text-news-foreground font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-foreground">Blogger</span>
          </Link>

          {/* Navegação */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Últimas Notícias da Semana
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Busca e Ações */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="relative" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Buscar notícias..." 
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => searchQuery && setShowResults(true)}
                />
                {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                {/* Dropdown de resultados */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute mt-1 w-full bg-popover text-popover-foreground rounded-md shadow-lg border z-50 max-h-96 overflow-y-auto">
                    <ul>
                      {searchResults.map((item) => (
                        <li key={item.id}>
                          <Link
                            to={`/news/${item.id}`}
                            className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setShowResults(false)}
                          >
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground truncate">{item.summary}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;