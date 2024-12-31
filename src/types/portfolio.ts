export interface Asset {
  id: number;
  symbol: string;
  name: string;
  type: string;
  amount: number;
  avgPrice: number;
  tgtRatio: number;
  currentPrice: number;
  currency: string;
  percentage: number;
}

export interface PortfolioDetail {
  id: number;
  name: string;
  totalValue: number;
  profit: number;
  profitPercentage: number;
  assets: Asset[];
}
