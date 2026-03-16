export interface ArticleListItem {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  imageUrl?: string;
  url?: string;
}

export interface ArticleDetail extends ArticleListItem {
  contentHtml: string;
  authorName?: string;
}
