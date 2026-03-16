export interface HelpTopic {
  id: string;
  title: string;
  description: string;
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
