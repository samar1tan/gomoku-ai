import VueI18n from 'vue-i18n'
import Vue from 'vue'

import store from '../store/index.js'

Vue.use(VueI18n)

const messages = {
  en: {
    'title': 'ZJZ\'s Gomoku',
    'settings': 'Settings',
    'changes': 'Changelog',
    'lang': 'language',
    'search depth': 'search depth',
    'idiot': 'Idiot',
    'easy': 'Easy',
    'normal': 'Normal',
    'hard': 'Hard',
    'algorithm': 'ALGORITHM',
    'start': 'START',
    'give': 'GIVE',
    'forward': 'FWD',
    'backward': 'BWD',
    'show steps': 'show steps',
    'step spread': 'step spread',
    'home': 'Home',
    'about': 'About',
    'status': {
      'loading': 'Click `Algorithm` Button',
      'start': 'Click `Start` Button',
      'thinking': 'Thinking...',
      'playing': 'Score {score}, Step: {step}, Time: {time}'
    },
    'you lose': 'You Lose',
    'you win': 'You Win',
    'dialog': {
      'chooseOffensiveTitle': 'Choose Offensive',
      'chooseOffensiveBody': 'Who is to go on the offensive?',
      'me': 'Me',
      'computer': 'Computer',
      'giveTitle': 'Give up?',
      'giveBody': 'Are you sure to give up?',
      'chooseAlgorithmTitle': 'Choose Algorithm',
      'chooseAlgorithmBody': 'Select the algorithm for computer',
      'greedy': 'Greedy',
      'minimax': 'Minimax',
      'ok': 'OK',
      'cancel': 'Cancel'
    }
  },
  zh: {
    'title': '张竞之的五子棋',
    'settings': '设置',
    'changes': '更新日志',
    'lang': '语言',
    'search depth': '搜索深度',
    'idiot': '萌新',
    'easy': '简单',
    'normal': '普通',
    'hard': '困难',
    'algorithm': '算法',
    'start': '开始',
    'give': '认输',
    'forward': '前进',
    'backward': '后退',
    'show steps': '显示序号',
    'step spread': '单步延伸',
    'home': '首页',
    'about': '关于',
    'status': {
      'loading': '请点击 `算法` 按钮...',
      'start': '请点击 `开始` 按钮',
      'thinking': '正在思考...',
      'playing': '分数 {score}, 步数: {step}, 时间: {time}'
    },
    'you lose': '你输了',
    'you win': '你赢了',
    'dialog': {
      'chooseOffensiveTitle': '选择先手',
      'chooseOffensiveBody': '谁是先手下子？',
      'me': '我',
      'computer': '电脑',
      'giveTitle': '认输?',
      'giveBody': '你确定认输吗?',
      'chooseAlgorithmTitle': '选择算法',
      'chooseAlgorithmBody': '请选择电脑玩家使用的算法',
      'greedy': '贪心',
      'minimax': '极小极大搜索',
      'ok': '确认',
      'cancel': '取消'
    }
  }
}

export default new VueI18n({
  locale: store.getters.lang,
  messages
})
