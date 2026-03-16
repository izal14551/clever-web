export interface AboutValue {
  title: string;
  description: string;
}

export interface BranchLocation {
  id: string;
  name: string;
  address?: string;
  mapUrl?: string;
}

export interface AboutPageData {
  heroTitle: string;
  heroDescription: string;
  values: AboutValue[];
  locations: BranchLocation[];
}
