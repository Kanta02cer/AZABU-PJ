import { useParams, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ArticleTemplate from '../../components/feature/ArticleTemplate';
import Loading from '../../components/Loading';
import { allPosts, getPostById } from './posts';

const modules = import.meta.glob('./*.tsx');

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const cleanId = id?.replace(/\/$/, '') || '';

  const article = getPostById(cleanId);

  if (!article) {
    return <Navigate to="/azabu-press" replace />;
  }

  const importFunc = modules[`./${cleanId}.tsx`];
  const ContentComponent = importFunc ? lazy(importFunc as any) : null;

  const sourceType = article.type;

  // 同じ種別（news / column）の記事から関連記事を生成
  const sourceData = allPosts.filter((p) => p.type === sourceType);

  const relatedArticles = sourceData
    .filter((a) => a.id !== cleanId)
    .slice(0, 3)
    .map(a => ({
      id: a.id,
      title: a.title,
      thumbnail: a.thumbnail,
      category: a.category,
      date: a.date
    }));

  // Sort articles by date to find Prev and Next
  const sortedArticles = [...sourceData].sort(
    (a, b) =>
      new Date(b.date.replace(/\./g, '/')).getTime() -
      new Date(a.date.replace(/\./g, '/')).getTime()
  );
  const currentIndex = sortedArticles.findIndex((a) => a.id === cleanId);
  
  // Next article is older (index + 1), Prev article is newer (index - 1)
  const nextArticleData = currentIndex >= 0 && currentIndex < sortedArticles.length - 1 ? sortedArticles[currentIndex + 1] : null;
  const prevArticleData = currentIndex > 0 ? sortedArticles[currentIndex - 1] : null;

  const prevArticle = prevArticleData
    ? { id: prevArticleData.id, title: prevArticleData.title, type: sourceType }
    : null;
  const nextArticle = nextArticleData
    ? { id: nextArticleData.id, title: nextArticleData.title, type: sourceType }
    : null;

  return (
    <ArticleTemplate
      title={article.title}
      subtitle={article.excerpt}
      date={article.date}
      category={article.category}
      thumbnail={article.thumbnail}
      code={article.code}
      tags={article.tags}
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
