import { faker } from '@faker-js/faker'
import { interval } from 'rxjs'
import tradeModel from '../db/model/trade'
import { TradeEntity, TradeStatus, Direction } from '../model'
import mergeMapFrom from '../operators/merge-map-from'
import { addTrades } from './add-trades'
import { random } from '../helper'

export const randomPickTrades = async (maxAmount: number) =>
  await tradeModel.findRandom(maxAmount)

export const updateTradePrices = async (pickedTrades: TradeEntity[]) => {
  return await Promise.all(
    pickedTrades.map(async (trade) => {
      const currentPrice = trade.currentPrice
      const newPrice = Number(faker.finance.amount())
      const trend =
        newPrice > currentPrice
          ? Direction.Up
          : newPrice < currentPrice
          ? Direction.Down
          : Direction.Origin

      const updateObj = {
        currentPrice: newPrice,
        lastPrice: currentPrice,
        tradeStatus: TradeStatus.Updated,
        trend,
      }

      await tradeModel.updateOne({ tradeId: trade.tradeId }, updateObj)
      return {
        ...trade,
        ...updateObj,
      }
    }),
  )
}

export const addTradePrices = async (amount: number) => await addTrades(amount)

export const timingModifer = (
  period: number,
  maxUpdateAmount: number,
  maxAddAmount: number,
) => {
  return interval(period).pipe(
    mergeMapFrom(async () => {
      const pickedTrades = await randomPickTrades(maxUpdateAmount)
      const updateTrades = await updateTradePrices(pickedTrades)
      const addTrades = await addTradePrices(random(0, maxAddAmount))
      const totalAmount = await tradeModel.estimatedDocumentCount()
      return {
        eventType: 'updateTrades',
        data: { updateTrades, addTrades, totalAmount },
      }
    }),
  )
}
