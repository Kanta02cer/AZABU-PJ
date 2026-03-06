import { useParams, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ArticleTemplate from '../../components/feature/ArticleTemplate';
import { newsData } from '../../mocks/news';
import { columnsData } from '../../mocks/columns';
import Loading from '../../components/Loading';

const modules = import.meta.glob('./*.tsx');

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const cleanId = id?.replace(/\/$/, '') || '';
  
  // Find in news data first, then column data
  const newsItem = newsData.find(n => n.id === cleanId);
  const columnItem = columnsData.find(c => c.id === cleanId);
  
  const article = newsItem || columnItem;
  const sourceType = newsItem ? 'news' : 'column';

  if (!article) {
    return <Navigate to="/azabu-press" replace />;
  }

  const importFunc = modules[`./${cleanId}.tsx`];
  const ContentComponent = importFunc ? lazy(importFunc as any) : null;

  // Get related articles (exclude current article, mix both sources or restrict to same source if preferred)
  // To keep it simple, we filter from the source it belongs to
  const sourceData = newsItem ? newsData : columnsData;

  const relatedArticles = sourceData
    .filter(a => a.id !== id)
    .slice(0, 3)
    .map(a => ({
      id: a.id,
      title: a.title,
      thumbnail: a.thumbnail,
      category: a.category,
      date: a.date
    }));

  // Sort articles by date to find Prev and Next
  const sortedArticles = [...sourceData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const currentIndex = sortedArticles.findIndex(a => a.id === cleanId);
  
  // Next article is older (index + 1), Prev article is newer (index - 1)
  const nextArticleData = currentIndex >= 0 && currentIndex < sortedArticles.length - 1 ? sortedArticles[currentIndex + 1] : null;
  const prevArticleData = currentIndex > 0 ? sortedArticles[currentIndex - 1] : null;

  const prevArticle = prevArticleData ? { id: prevArticleData.id, title: prevArticleData.title, type: sourceType as 'news' | 'column' } : null;
  const nextArticle = nextArticleData ? { id: nextArticleData.id, title: nextArticleData.title, type: sourceType as 'news' | 'column' } : null;

  return (
    <ArticleTemplate
      title={article.title}
      subtitle={article.excerpt}
      date={article.date}
      category={article.category}
      thumbnail={article.thumbnail}
      tags={columnItem ? columnItem.tags : undefined} // Only column data has tags currently
      relatedArticles={relatedArticles}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
      type={sourceType}
    >
      {ContentComponent && (
        <Suspense fallback={<Loading />}>
          <ContentComponent />
        </Suspense>
      )}
    </ArticleTemplate>
  );
}
