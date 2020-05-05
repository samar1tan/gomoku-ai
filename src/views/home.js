// @ is an alias to /src
import { mapState } from 'vuex'
import Board from '@/components/Board'
import Dialog from '@/components/Dialog'
import BigText from '@/components/BigText'
import {
  ADD_CHESSMAN,
  SET_STATUS,
  SET_BOARD,
  SET_STEPS,
  RESET_BOARD,
  FORWARD,
  BACKWARD,
  SET_ALGORITHM,
  SET_FIRST,
  SET_FIVES
} from '@/store/mutations'
import MINIMAX_SCORE from '@/minimax/score.js'
import * as STATUS from '@/status.js'
import win from '@/common/win.js'
import role from '@/common/role.js'

export default {
  name: 'home',
  data () {
    return {
      bigText: '',
      score: 0,
      step: -1,
      lastScore: 0,
      startTime: + new Date()
    }
  },
  created () {
    this.greedy_worker = new Worker("./greedy.bundle.js?r="+(+new Date()));
    this.greedy_worker.onmessage = e => {
      const data = e.data
      const d = data.data
      if (data.type === 'put') {
        const score = this.score = d.score
        const position = [d[0], d[1]]
        this._set(position, role.com)
        this.$store.dispatch(SET_STATUS, STATUS.PLAYING)

        let win_state = this.checkWinAtPoint(position)
        if (win_state === role.hum) {
          this.displayHumanWin()
        } else if (win_state === role.com) {
          this.displayComputerWin()
        } else {
          this.$store.dispatch(SET_FIVES, []) // reset
        }
        this.lastScore = score
      } else if (data.type === 'board') { // 返回的开局
        const b = d.board
        // 说明使用了开局
        if (b) {
          this.$store.dispatch(SET_BOARD, b) // reset
          // 由于开局没有steps，因此自己创建一下
          const steps = [
            {position: [7, 7], role: 1}
          ]
          let second, third
          for (let i = 0; i < b.length; i++) {
            for (let j = 0; j < b.length; j++) {
              if (i === 7 && j === 7) continue
              const r = b[i][j]
              if (r === 1) third = {position: [i, j], role: 1}
              if (r === 2) second = {position: [i, j], role: 2}
            }
          }
          steps.push(second)
          steps.push(third)
          this.$store.dispatch(SET_STEPS, steps)
          this.showBigText(b.name)
        }
      }
    }

    this.minimax_worker = new Worker("./minimax.bundle.js?r="+(+new Date()));
    this.minimax_worker.onmessage = e => {
      const data = e.data
      const d = data.data
      if (data.type === 'put') {
        const score = this.score = d.score
        const position = [d[0], d[1]]
        const step = this.step = d.step
        this._set(position, role.com)
        this.$store.dispatch(SET_STATUS, STATUS.PLAYING)

        if (score >= MINIMAX_SCORE.FIVE/2 && step <= 1) {
          this.displayComputerWin()
        } else if (score <= - MINIMAX_SCORE.FIVE/2 && step <= 1) {
          this.displayHumanWin()
        } else {
          this.$store.dispatch(SET_FIVES, []) // reset
        }
        this.lastScore = score
      } else if (data.type === 'board') { // 返回的开局
        const b = d.board
        // 说明使用了开局
        if (b) {
          this.makeBoard(b)
        }
      }
    }
  },
  components: {
    Board,
    Dialog,
    BigText,
  },
  computed: {
    statusText () {
      if (this.status === STATUS.LOADING) {
        return this.$t('status.loading')
      } else if (this.status === STATUS.READY) {
        return this.$t('status.start')
      } else if (this.status === STATUS.THINKING) {
        return this.$t('status.thinking')
      } else if (this.status === STATUS.PLAYING) {
        return this.$t('status.playing', {
          score: this.score,
          step: this.step,
          time: ((new Date() - this.startTime)/1000).toFixed(2) + ' s'
        })
      } else return this.$t('status.loading')
    },
    ...mapState({
      board: state => state.board.board,
      steps: state => state.board.steps,
      stepsTail: state => state.board.stepsTail,
      algorithm: state => state.home.algorithm,
      status: state => state.home.status,
      deep: state => state.home.deep,
      spread: state => state.home.spread,
      first: state => state.home.first,
      randomOpening: state => state.home.randomOpening,
      version: 'version'
    })
  },
  watch: {
    deep () {
      this.updateConfig()
    },
    spread () {
      this.updateConfig()
    }
  },
  methods: {
    checkWinAtPoint (p) {
      let count = 1;
      let i = p[0];
      let j = p[1];
      let winner = this.board[i][j]
      
      // Horizontal
      for (j++; j < this.board.size; j++) {
        if (this.board[i][j] === winner) {
          count++;
        } else {
          break;
        }
      }
      j = p[1];
      for (j--; j >= 0; j--) {
        if (this.board[i][j] === winner) {
          count++;
        } else {
          break;
        }
      }
      if (count >= 5) {
        return winner;
      } else {
        count = 1;
      }

      // Vertical
      i = p[0];
      j = p[1];
      for (i++; i < this.board.size; i++) {
        if (this.board[i][j] === winner) {
          count++;
        } else {
          break;
        }
      }
      i = p[0];
      for (i--; i >= 0; i--) {
        if (this.board[i][j] === winner) {
          count++;
        } else {
          break;
        }
      }
      if (count >= 5) {
        return winner;
      } else {
        count = 1;
      }

      // Oblique up
      i = p[0] + 1;
      j = p[1] + 1;
      for (; i < this.board.size && j < this.board.size; i++, j++) {
        if (this.board[i][j] === winner) {
          count++;
        } else {
          break;
        }
      }
      i = p[0] - 1;
      j = p[1] - 1;
      for (; i >= 0 && j >= 0; i--, j--) {
        if (this.board[i][j] === winner) {
          count++;
        } else {
          break;
        }
      }
      if (count >= 5) {
        return winner;
      } else {
        count = 1;
      }

      // Oblique down
      i = p[0] + 1;
      j = p[1] - 1;
      for (; i < this.board.size && j >= 0; i++, j--) {
        if (this.board[i][j] === winner) {
          count++;
        } else {
          break;
        }
      }
      i = p[0] - 1;
      j = p[1] + 1;
      for (; i >= 0 && j < this.board.size; i--, j++) {
        if (this.board[i][j] === winner) {
          count++;
        } else {
          break;
        }
      }
      if (count >= 5) {
        return winner;
      } else {
        return role.blank;
      }
    },
    displayHumanWin () {
      this.$store.dispatch(SET_FIVES, win(this.board))
      this.$store.dispatch(SET_STATUS, STATUS.LOCKED)
      this.showBigText(this.$t('you win'), this.end)
    },
    displayComputerWin () {
      this.$store.dispatch(SET_FIVES, win(this.board))
      this.$store.dispatch(SET_STATUS, STATUS.LOCKED)
      this.showBigText(this.$t('you lose'), this.end)
    },
    makeBoard (b) {
      this.$store.dispatch(SET_BOARD, b) // reset
      // 由于开局没有steps，因此自己创建一下
      const steps = [
        {position: [7, 7], role: 1}
      ]
      let second, third
      for (let i=0;i<b.length;i++) {
        for (let j=0; j<b.length; j++) {
          if (i === 7 && j === 7) continue
          const r = b[i][j]
          if (r === 1) third = { position: [i,j], role: 1 }
          if (r === 2) second = { position: [i,j], role: 2 }
        }
      }
      steps.push(second)
      steps.push(third)
      this.$store.dispatch(SET_STEPS, steps)
      this.showBigText(b.name)
    },
    showChooseAlgorithmDialog () {
      if (this.status !== STATUS.LOADING) return false
      this.$refs.algorithm.open()
    },
    showStartDialog () {
      if (this.status !== STATUS.READY) return false
      this.$refs.offensive.open()
    },
    showGiveDialog () {
      if (this.status !== STATUS.PLAYING) return false
      this.$refs.give.open()
    },
    chooseAlgorithm (algorithm) {
      this.$refs.algorithm.close()
      this.$store.dispatch(SET_ALGORITHM, algorithm)
      if (algorithm === 'greedy') {
        this.showBigText('对战贪心算法！')
      } else {
        this.showBigText('对战极小极大搜索！')
      }
      this.$store.dispatch(SET_STATUS, STATUS.READY)
    },
    start (first) {
      this.$refs.offensive.close()
      this.$store.dispatch(SET_STATUS, STATUS.LOCKED)
      this.$store.dispatch(SET_FIRST, first)
      this.$store.dispatch(RESET_BOARD)

      if (this.algorithm === 'greedy') {
        this.worker = this.greedy_worker
      } else {
        this.worker = this.minimax_worker
      }

      this.showBigText('START!', () => {
        this.worker.postMessage({
          type: "START",
          random: first === 1
        });
      //if (first === 1 && !this.randomOpening) {
      //  this.worker.postMessage({
      //    type: "BEGIN"
      //  });
      //}
        this.$store.dispatch(SET_STATUS, STATUS.PLAYING)
      })
    },
    end () {
      this.$store.dispatch(SET_STATUS, STATUS.LOADING)
    },
    forward () {
      if (!this.canForward()) return false
      this.$store.dispatch(FORWARD)
      this.worker.postMessage({
        type: "FORWARD"
      });
    },
    backward() {
      if (!this.canBackward()) return false
      this.$store.dispatch(BACKWARD)
      this.worker.postMessage({
        type: "BACKWARD"
      });
    },
    give () {
      this.$store.dispatch(SET_STATUS, STATUS.LOCKED)
      this.$refs.give.close()
      this.showBigText(this.$t('you lose'), () => {
        this.end()
      })
    },
    showBigText (title, callback) {
      this.bigText = title
      this.$refs.big.open()
      setTimeout(() => {
        this.$refs.big.close()
      }, 1000)
      setTimeout(() => {
        callback && callback.call(this)
      }, 1500)
    },
    _set (position, role) {
      this.$store.dispatch(ADD_CHESSMAN, {
        position: position,
        role: role
      })
    },
    set (position) {
      if (this.status !== STATUS.PLAYING) return false
      const x = position[0]
      const y = position[1]
      if(this.board[x][y] !== 0) {
        throw new Error("NOT_EMPTY")
      }

      this._set(position, 2)

      this.worker.postMessage({
        type: "GO",
        x: x,
        y: y
      })
      this.$store.dispatch(SET_STATUS, STATUS.THINKING)
      this.startTime = + new Date()
    },
    canBackward () {
      return this.status === STATUS.PLAYING && this.steps.length >= 2
    },
    canForward () {
      return this.status === STATUS.PLAYING && this.stepsTail.length >= 2
    },
    updateConfig () {
      this.worker.postMessage({
        type: 'CONFIG',
        config: {
          searchDeep: this.deep,
          spread: this.spread
        }
      })
    }
  }
}
