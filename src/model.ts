export enum Direction {
  Up = 'Up',
  Down = 'Down',
  Origin = 'Origin',
}

export enum TradeStatus {
  New = 'New',
  Updated = 'Updated',
  Closed = 'Closed',
}

export interface TradeEntity {
  tradeId: string
  tradeName: string
  tradeSymbol: string
  currentPrice: number
  lastPrice: number
  traderName: string
  trend: Direction
  updateTime?: string
  createTime?: string
  tradeStatus: TradeStatus
}
