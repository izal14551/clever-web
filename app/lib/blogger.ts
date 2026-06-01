import { mockArticleData } from "@/app/data/mockArticleData";
import type { ArticleDetail, ArticleListItem } from "@/app/types/article";
import { createSlug } from "@/app/utils/slug";

interface BloggerPostAuthor {
  displayName?: string;
}

interface BloggerPost {
  id?: string;
  title?: string;
  content?: string;
  published?: string;
  updated?: string;
  url?: string;
  author?: BloggerPostAuthor;
  images?: Array<{ url?: string }>;
}

interface BloggerPostListResponse {
  items?: BloggerPost[];
}

function getBloggerConfig() {
  return {
    blogId: process.env.BLOGGER_BLOG_ID,
    apiKey: process.env.BLOGGER_API_KEY,
  };
}

function hasBloggerConfig() {
  const { blogId, apiKey } = getBloggerConfig();
  return Boolean(blogId && apiKey);
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildExcerpt(content: string, maxLength = 140): string {
  const text = stripHtml(content);
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function extractImageUrl(post: BloggerPost): string | undefined {
  const imageFromArray = post.images?.find((image) => image.url)?.url;
  if (imageFromArray) {
    return imageFromArray;
  }

  const imageFromContent = post.content?.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  return imageFromContent || undefined;
}

function normalizePost(post: BloggerPost, index: number): ArticleDetail | null {
  if (!post.id || !post.title) {
    return null;
  }

  const contentHtml = post.content || "<p>Konten artikel belum tersedia.</p>";

  return {
    id: post.id || `post-${index + 1}`,
    slug: createSlug(post.title, post.id || `post-${index + 1}`),
    title: post.title,
    excerpt: buildExcerpt(contentHtml),
    publishedAt: post.published || new Date().toISOString(),
    updatedAt: post.updated || post.published || undefined,
    imageUrl: extractImageUrl(post),
    url: post.url,
    authorName: post.author?.displayName,
    contentHtml,
  };
}

async function fetchFromBlogger<T>(path: string): Promise<T | null> {
  const { blogId, apiKey } = getBloggerConfig();
  if (!blogId || !apiKey) {
    return null;
  }

  const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}${path}${path.includes("?") ? "&" : "?"}key=${apiKey}`;

  try {
    const res = await fetch(url, {
      redirect: "follow",
      next: {
        revalidate: 900,
      },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error("Gagal mengambil data Blogger:", error);
    return null;
  }
}

export async function getArticleList(): Promise<ArticleListItem[]> {
  const toListItem = (article: ArticleDetail): ArticleListItem => ({
    id: article.id,
    slug: article.slug || createSlug(article.title, article.id),
    title: article.title,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    imageUrl: article.imageUrl,
    url: article.url,
  });

  if (!hasBloggerConfig()) {
    return normalizeArticleSlugs(mockArticleData).map(toListItem);
  }

  const payload = await fetchFromBlogger<BloggerPostListResponse>(
    "/posts?fetchBodies=true&status=LIVE",
  );

  if (!payload) {
    return normalizeArticleSlugs(mockArticleData).map(toListItem);
  }

  const items =
    payload?.items
      ?.map((post, index) => normalizePost(post, index))
      .filter((post): post is ArticleDetail => post !== null) || [];

  return normalizeArticleSlugs(items).map(toListItem);
}

export async function getArticleById(id: string): Promise<ArticleDetail | null> {
  if (!hasBloggerConfig()) {
    return (
      mockArticleData
        .map(normalizeArticleSlug)
        .find((article) => article.id === id || article.slug === id) || null
    );
  }

  const post = await fetchFromBlogger<BloggerPost>(`/posts/${id}?view=READER`);
  const normalized = post ? normalizePost(post, 0) : null;

  if (!normalized) {
    return (
      mockArticleData
        .map(normalizeArticleSlug)
        .find((article) => article.id === id || article.slug === id) || null
    );
  }

  return normalized;
}

export async function getArticleBySlugOrId(
  slugOrId: string,
): Promise<ArticleDetail | null> {
  if (!hasBloggerConfig()) {
    return getArticleById(slugOrId);
  }

  const articles = await getArticleList();
  const match = articles.find(
    (article) => article.id === slugOrId || article.slug === slugOrId,
  );

  return match ? getArticleById(match.id) : getArticleById(slugOrId);
}

function normalizeArticleSlug(article: ArticleDetail): ArticleDetail {
  return {
    ...article,
    slug: article.slug || createSlug(article.title, article.id),
  };
}

function normalizeArticleSlugs(articles: ArticleDetail[]): ArticleDetail[] {
  const slugCounts = new Map<string, number>();

  return articles.map((article) => {
    const normalized = normalizeArticleSlug(article);
    const baseSlug = normalized.slug || createSlug(normalized.title, normalized.id);
    const count = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, count + 1);

    return {
      ...normalized,
      slug: count === 0 ? baseSlug : `${baseSlug}-${count + 1}`,
    };
  });
}
