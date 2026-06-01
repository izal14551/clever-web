export interface HelpTopic {
  id: number;
  slug?: string;
  title: string;
  description: string;
  sortOrder?: number;
}

export interface HelpPageData {
  heroTitle: string;
  heroDescription: string;
  topics: HelpTopic[];
  contactTitle: string;
  contactDescription: string;
  contactButtonLabel: string;
  whatsappNumber?: string;
}
