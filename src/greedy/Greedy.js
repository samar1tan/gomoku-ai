import role from "../common/role.js"
import board from "./ScoredBoard.js"
import opening from '../common/opening.js'
import open26 from '../common/open26.js'
import config from "./config.js"
import Random from "random-js"

class Greedy {
  // 初始化，开始游戏
  start (random) {
    if (random) {
      const names = []
      for (var k in open26) {
        names.push(k)
      }
      const n = names[parseInt(Math.random()*26)]
      const o = open26[n]
      board.init(open26[n])
      return {
        board: o,
        name: o.name
      }
    } else {
      board.init(15)
      return {
        board: undefined
      }
    }
  }

  // 电脑下棋
  begin () {
    let p
    if (board.allSteps.length > 1) p = opening(board)
    p = p || this.getBestMove()
    board.put(p, role.com, true)
    return p
  }

  // 得到最优下棋位置的贪心解
  getBestMove() {
    let max_score = 0
    let id = 0
    let best_point
    let best_points = new Array(board.size * board.size)
    for (let i = 0; i < board.size; ++i) {
      for (let j = 0; j < board.size; ++j) {
        if (board.board[i][j] === role.empty) {
          let point = [i, j]
          let score = board.score(point)
          if(score === max_score) {
            best_points[id] = point
            ++id
          } else if (score > max_score) {
            max_score = score
            id = 0
            best_points[id] = point
            ++id
          }
        }
      }
    }

    if (config.random) {
      const random = new Random()
      const value = random.integer(0, best_points.filter(Boolean).length - 1)
      best_point = best_points[value]
    } else {
      best_point = best_points[0]
    }

    return best_point
  }

  // 下子并计算
  turn (x, y) {
    this.set(x, y, role.hum)
    return this.begin()
  }

  // 只下子，不做计算
  set (x, y, r) {
    board.put([x,y], r, true)
  }

  // 悔棋
  backward () {
    board.backward()
  }

  // 取消悔棋
  forward () {
    board.forward()
  }
}

export default Greedy
