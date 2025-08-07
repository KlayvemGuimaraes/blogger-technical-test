import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  id?: number;
  title: string;
  summary: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  category: string;
  views: number;
  readTime: number;
}

const NewsCard = ({ 
  id = 1, 
  title, 
  summary, 
  imageUrl, 
  author, 
  publishedAt, 
  category, 
  views, 
  readTime 
}: NewsCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tecnologia':
        return 'text-category-tech border-category-tech/20 bg-category-tech/10';
      case 'economia':
        return 'text-category-economy border-category-economy/20 bg-category-economy/10';
      case 'esportes':
        return 'text-category-sports border-category-sports/20 bg-category-sports/10';
      default:
        return 'text-category-default border-category-default/20 bg-category-default/10';
    }
  };

  return (
    <Link to={`/news/${id}`} className="block group">
      <article className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category */}
          <Badge 
            variant="outline" 
            className={`mb-3 w-fit ${getCategoryColor(category)}`}
          >
            {category}
          </Badge>
          
          {/* Title */}
          <h3 className="text-lg font-bold mb-2 line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* Summary */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
            {summary}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
            <div className="flex flex-col space-y-1">
              <span className="font-medium text-foreground">{author}</span>
              <span>{publishedAt}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {readTime} min
              </div>
              <div className="flex items-center">
                <Eye className="mr-1 h-3 w-3" />
                {views.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;