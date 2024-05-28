export interface Country {
  name: string;
  code: string;
}

export interface CountryApiResponse {
  content: Country[];
  total: number;
  hasNext: boolean;
  skip: number;
}
