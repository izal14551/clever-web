export interface HeroData {
  logoUrl: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface ConsultationData {
  title: string;
  description: string;
  buttonText: string;
  whatsappNumber?: string;
}

export interface ServiceData {
  id: number;
  slug?: string;
  label: string;
  category?: string;
  iconUrl?: string;
  sortOrder?: number;
}

export interface ServiceListItemData {
  id: number;
  slug?: string;
  title: string;
  category?: string;
  description: string;
  duration: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface PromoData {
  id: number;
  slug?: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  link?: string;
  sortOrder?: number;
}

export interface PackageData {
  id: number;
  slug?: string;
  title: string;
  subtitle: string;
  details: string[];
  duration: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface TreatmentData {
  id: number;
  slug?: string;
  name: string;
  description: string;
  imageUrl?: string;
  href?: string;
  recommendationCount?: number;
  sortOrder?: number;
}

export interface TestimonialData {
  id: number | string;
  slug?: string;
  serviceId?: number;
  serviceSlug?: string;
  author: string;
  timeAgo: string;
  category: string;
  title: string;
  message: string;
  reactionCount: number;
  persistedReactionCount?: number;
  reactedByCurrentUser?: boolean;
  ctaLabel: string;
  sortOrder?: number;
}

export interface SocialLinkData {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  telegram?: string;
  community?: string;
}

export interface LandingPageData {
  hero: HeroData;
  consultation: ConsultationData;
  socials: SocialLinkData;
  services: ServiceData[];
  promos: PromoData[];
  packages: PackageData[];
  testimonials: TestimonialData[];
  featuredTreatments: TreatmentData[];
}

