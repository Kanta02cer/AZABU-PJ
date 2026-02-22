import { useParams, Navigate } from 'react-router-dom';
import ArticleTemplate from '../../components/feature/ArticleTemplate';
import { columnsData } from '../../mocks/columns';

export default function ColumnDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const column = columnsData.find(c => c.id === id);
  
  if (!column) {
    return <Navigate to="/column" replace />;
  }

  // Get related articles (exclude current article)
  const relatedArticles = columnsData
    .filter(c => c.id !== id)
    .slice(0, 3)
    .map(c => ({
      id: c.id,
      title: c.title,
      thumbnail: c.thumbnail,
      category: c.category,
      date: c.date
    }));

  return (
    <ArticleTemplate
      title={column.title}
      subtitle={column.excerpt}
      date={column.date}
      category={column.category}
      thumbnail={column.thumbnail}
      content={column.content}
      tags={column.tags}
      relatedArticles={relatedArticles}
      type="column"
    />
  );
}
