export type QuotesType = {
  count: number;
  total: number;
  _embedded: WelcomeEmbedded;
  _links: WelcomeLinks;
};

export interface WelcomeEmbedded {
  quotes: Quote[];
}

export interface Quote {
  appeared_at: Date;
  created_at: Date;
  quote_id: string;
  tags: string[];
  updated_at: Date;
  value: string;
  _embedded: QuoteEmbedded;
  _links: AuthorLinks;
}

export interface QuoteEmbedded {
  author: Author[];
  source: Source[];
}

export interface Author {
  author_id: string;
  bio: null;
  created_at: Date;
  name: string;
  slug: string;
  updated_at: Date;
  _links: AuthorLinks;
}

export interface AuthorLinks {
  self: First;
}

export interface First {
  href: string;
}

export interface Source {
  created_at: Date;
  filename: null;
  quote_source_id: string;
  remarks: string;
  updated_at: Date;
  url: string;
  _links: AuthorLinks;
}

export interface WelcomeLinks {
  self: First;
  first: First;
  prev: First;
  next: First;
  last: First;
}
