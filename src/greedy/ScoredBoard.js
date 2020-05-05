import R from "../common/role.js"
import S from "./score.js"
import config from "./config.js"
import statistic from "../common/statistic.js";
import role from "../common/role.js"

class ScoredBoard {
  init (sizeOrBoard) {
    this.currentSteps = [] // 当前一次思考的步骤
    this.allSteps = []
    this.stepsTail = []
    this.count = 0;// chessman count

    var size
    if(sizeOrBoard.length) {
      this.board = sizeOrBoard
      size = this.board.length
      for (let i=0;i<this.board.length;i++) this.count += this.board[i].filter(d=>d>0).length
    } else {
      size = sizeOrBoard
      this.board = []
      for(let i=0;i<size;i++) {
        var row = []
        for(var j=0;j<size;j++) {
          row.push(0)
        }
        this.board.push(row)
      }
    }
    this.size = size

    statistic.init(size)
  }

  // 计算棋盘单个位置得分
  score (p) {
    let score = 0
    let i = p[0]
    let j = p[1]
    // 水平
    for (; i > p[0] - 5; --i) {
      if (i >= 0 && i + 4 < this.size) {
        let m = i
        let n = j
        let num_m = 0
        let num_e = 0
        for (; m < i + 5; ++m) {
          if (this.board[m][n] === role.com) {
            ++num_m
          } else if (this.board[m][n] === role.hum) {
            ++num_e
          }
          score += this.getTupleScore(num_m, num_e)
        }
      }
    }
    // 竖直
    i = p[0]
    for (; j > p[1] - 5; --j) {
      if (j >= 0 && j + 4 < this.size) {
        let m = i
        let n = j
        let num_m = 0
        let num_e = 0
        for (; n < j + 5; ++n) {
          if (this.board[m][n] === role.com) {
            ++num_m
          } else if (this.board[m][n] === role.hum) {
            ++num_e
          }
          score += this.getTupleScore(num_m, num_e)
        }
      }
    }
    // 斜向上
    i = p[0]
    j = p[1]
    for (; i > p[0] - 5 && j > p[1] - 5; --i, --j) {
      if (i >= 0 && j >= 0 && i + 4 < this.size && j + 4 < this.size) {
        let m = i
        let n = j
        let num_m = 0
        let num_e = 0
        for (; m < i + 5 && n < j + 5; ++m, ++n) {
          if (this.board[m][n] === role.com) {
            ++num_m
          } else if (this.board[m][n] === role.hum) {
            ++num_e
          }
          score += this.getTupleScore(num_m, num_e)
        }
      }
    }
    // 斜向下
    i = p[0]
    j = p[1]
    for (; i > p[0] - 5 && j < p[1] + 5; --i, ++j) {
      if (i >= 0 && j - 4 >= 0 && i + 4 < this.size && j < this.size) {
        let m = i
        let n = j
        let num_m = 0
        let num_e = 0
        for (; m < i + 5 && n > j - 5; ++m, --n) {
          if (this.board[m][n] === role.com) {
            ++num_m
          } else if (this.board[m][n] === role.hum) {
            ++num_e
          }
          score += this.getTupleScore(num_m, num_e)
        }
      }
    }

    return score
  }

  getTupleScore (num_m, num_e) {
    if (num_m + num_e === 0) {
      return S.TupleTypeBlank
    } else if (num_m === 1 && num_e === 0) {
      return S.TupleTypeM
    } else if (num_m === 2 && num_e === 0) {
      return S.TupleTypeMM
    } else if (num_m === 3 && num_e === 0) {
      return S.TupleTypeMMM
    } else if (num_m === 4 && num_e === 0) {
      return S.TupleTypeMMMM
    } else if (num_m === 0 && num_e === 1) {
      return S.TupleTypeE
    } else if (num_m === 0 && num_e === 2) {
      return S.TupleTypeEE
    } else if (num_m === 0 && num_e === 3) {
      return S.TupleTypeEEE
    } else if (num_m === 0 && num_e === 4) {
      return S.TupleTypeEEEE
    } else {
      return S.TupleTypePolluted
    }
  }

  // 下子
  put (p, role) {
    config.debug && console.log('put [' + p + ']' + ' ' + role)
    this.board[p[0]][p[1]] = role
    this.allSteps.push(p)
    this.currentSteps.push(p)
    this.stepsTail = []
    this.count ++
  }

  // 移除棋子
  remove (p) {
    var r = this.board[p[0]][p[1]]
    config.debug && console.log('remove [' + p + ']' + ' ' + r)
    this.board[p[0]][p[1]] = R.empty
    this.allSteps.pop()
    this.currentSteps.pop()
    this.count --
  }

  // 悔棋
  backward () {
    if(this.allSteps.length < 2) return
    var i =0;
    while(i<2) {
      var s = this.allSteps[this.allSteps.length-1]
      this.remove(s)
      this.stepsTail.push(s)
      i++
    }
  }

  // 取消悔棋
  forward () {
    if(this.stepsTail.length < 2) return
    var i =0;
    while(i<2) {
      var s = this.stepsTail.pop()
      this.put(s, s.role)
      i++
    }
  }

  logSteps () {
    console.log("steps:" + this.allSteps.map((d) => '['+d[0]+','+d[1]+']').join(','))
  }

  toString () {
    return this.board.map(function (d) { return d.join(',') }).join('\n')
  }
}

var board = new ScoredBoard()

export default board
