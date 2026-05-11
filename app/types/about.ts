export interface AboutValue {
  id?: number;
  slug?: string;
  title: string;
  description: string;
  sortOrder?: number;
}

export interface BranchLocation {
  id: number;
  slug?: string;
  name: string;
  address?: string;
  mapUrl?: string;
  sortOrder?: number;
}

export interface AboutPageData {
  heroTitle: string;
  heroDescription: string;
  values: AboutValue[];
  locations: BranchLocation[];
}
