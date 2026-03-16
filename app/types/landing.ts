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
  id: string;
  label: string;
  category?: string;
  iconUrl?: string;
}

export interface ServiceListItemData {
  id: string;
  title: string;
  category?: string;
  description: string;
  duration: string;
  imageUrl?: string;
}

export interface PromoData {
  id: string;
  imageUrl?: string;
  title?: string;
  link?: string;
}

export interface PackageData {
  id: string;
  title: string;
  subtitle: string;
  details: string[];
  duration: string;
  imageUrl?: string;
}

export interface TreatmentData {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface TestimonialData {
  id: string;
  author: string;
  timeAgo: string;
  category: string;
  title: string;
  message: string;
  reactionCount: number;
  ctaLabel: string;
}

export interface LandingPageData {
  hero: HeroData;
  consultation: ConsultationData;
  services: ServiceData[];
  promos: PromoData[];
  packages: PackageData[];
  testimonials: TestimonialData[];
  featuredTreatments: TreatmentData[];
}
