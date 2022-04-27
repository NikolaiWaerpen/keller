export interface Tags {
  count: number;
  total: number;
  _embedded: Embedded;
}

export interface Embedded {
  tag: Tag[];
}

export interface Tag {
  created_at: Date;
  updated_at: Date;
  value: string;
  _links: Links;
}

export interface Links {
  self: Self;
}

export interface Self {
  href: string;
}
