export type Item = {
  name: string;
  cost?: number;
  tags?: string[];
  components?: string[];
  stats?: Record<string, number>;
  descriptions?: ItemDescription[];
  image?: string;
};

export type ItemDescription = {
  descriptionType?: string;
  description?: string;
};
