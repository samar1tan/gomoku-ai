import { expect } from 'chai'

import board from '@/minimax/ScoredBoard.js'
import Search from '@/minimax/negamax.js'
import SCORE from '@/minimax/score.js'

import math from '@/minimax/math.js'

import config from '@/minimax/config.js'

describe('测试 gen 函数性能', () => {
  it('性能', () => {
    const b = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    board.init(b)
    board.put([5, 10], 1)
    board.put([4, 11], 2)
    board.put([6, 10], 1)
    const start = + new Date()
    let i=0
    while(i++<100000) board.gen(2, true, true)
    console.log(new Date - start)
  })
  
})
