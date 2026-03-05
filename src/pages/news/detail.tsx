import { useParams, Navigate } from 'react-router-dom';
import ArticleTemplate from '../../components/feature/ArticleTemplate';
import { newsData } from '../../mocks/news';

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const cleanId = id?.replace(/\/$/, '') || '';
  
  const news = newsData.find(n => n.id === cleanId);
  
  if (!news) {
    return <Navigate to="/news" replace />;
  }

  // Get related articles (exclude current article)
  const relatedArticles = newsData
    .filter(n => n.id !== id)
    .slice(0, 3)
    .map(n => ({
      id: n.id,
      title: n.title,
      thumbnail: n.thumbnail,
      category: n.category,
      date: n.date
    }));

  return (
    <ArticleTemplate
      title={news.title}
      subtitle={news.excerpt}
      date={news.date}
      category={news.category}
      thumbnail={news.thumbnail}
      content={news.content}
      relatedArticles={relatedArticles}
      type="news"
    />
  );
}
