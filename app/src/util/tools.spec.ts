/* eslint-env jest */
import { ethers } from 'ethers'
import { calcDistributionHint, calcNetCost, calcPrice, computePriceAfterTrade } from './tools'

describe('tools', () => {
  describe('calcPrice', () => {
    const testCases: any = [[[100, 100], 0.5], [[100, 32], 0.8], [[100, 230], 0.2]]

    for (const [[funding, holdings], expectedResult] of testCases) {
      it(`should compute the right price for funding ${funding} and holdings ${holdings}`, () => {
        const fundingBN = ethers.utils.bigNumberify(funding)
        const holdingsBN = ethers.utils.bigNumberify(holdings)
        const result = calcPrice(fundingBN, holdingsBN)

        expect(result).toBeCloseTo(expectedResult)
      })
    }
  })

  describe('calcNetCost', () => {
    const testCases: any = [
      [[100, 0.5, 200, 0.5, 0], 132],
      [[100, 0.8, 200, 0.2, 0], 176],
      [[100, 0.5, 0, 0.5, 150], 93],
      [[100, 0.85, 100, 0.15, 0], 88],
      [[100, 0.85, 200000, 0.15, 0], 199976],
      [[100, 0.85, 0, 0.15, 200000], 199726],
    ]

    for (const [[funding, priceYes, tradeYes, priceNo, tradeNo], expectedResult] of testCases) {
      it(`should compute the right net cost, `, () => {
        const fundingBN = ethers.utils.bigNumberify(funding)
        const tradeYesBN = ethers.utils.bigNumberify(tradeYes)
        const tradeNoBN = ethers.utils.bigNumberify(tradeNo)
        const result = calcNetCost(fundingBN, priceYes, tradeYesBN, priceNo, tradeNoBN).toNumber()

        expect(result).toBeCloseTo(expectedResult)
      })
    }
  })

  describe('computePriceAfterTrade', () => {
    // const testCases: any = [
    //   [[100, 50, 0, 100, 100], [0.58579, 0.41421]],
    //   [[100, 0, 50, 100, 100], [0.41421, 0.58579]],
    //   [[100, 50, 0, 77, 127], [0.6666, 0.3333]],
    //   [[100, 0, 50, 77, 127], [0.5, 0.5]],
    //   [[100, -50, 0, 100, 100], [0.41421, 0.58579]],
    //   [[100, 50, 50, 100, 100], [0.5, 0.5]],
    // ]
    //
    // for (const [
    //   [funding, tradeYes, tradeNo, holdingsYes, holdingsNo],
    //   [expectedPriceYes, expectedPriceNo],
    // ] of testCases) {
    //   it(`should compute the right net cost, `, () => {
    //     const fundingBN = ethers.utils.bigNumberify(funding)
    //     const tradeYesBN = ethers.utils.bigNumberify(tradeYes)
    //     const tradeNoBN = ethers.utils.bigNumberify(tradeNo)
    //     const holdingsYesBN = ethers.utils.bigNumberify(holdingsYes)
    //     const holdingsNoBN = ethers.utils.bigNumberify(holdingsNo)
    //     const [newPriceYes, newPriceNo] = computePriceAfterTrade(
    //       tradeYesBN,
    //       tradeNoBN,
    //       holdingsYesBN,
    //       holdingsNoBN,
    //       fundingBN,
    //     )
    //
    //     expect(newPriceYes).toBeCloseTo(expectedPriceYes)
    //     expect(newPriceNo).toBeCloseTo(expectedPriceNo)
    //   })
    // }
  })

  describe('calcDistributionHint', () => {
    const testCases: any = [
      [[50, 50], [1000000, 1000000]],
      [[60, 40], [816497, 1224745]],
      [[40, 60], [1224745, 816497]],
    ]

    for (const [[oddsForYes, oddsForNo], [expectedHintForYes, expectedHintForNo]] of testCases) {
      it(`should compute the right distribution hint`, () => {
        const distributionHint = calcDistributionHint(oddsForYes, oddsForNo)

        expect(distributionHint[0].toNumber()).toBeCloseTo(expectedHintForYes)
        expect(distributionHint[1].toNumber()).toBeCloseTo(expectedHintForNo)
      })
    }
  })
})
