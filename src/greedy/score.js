/*
 * 把五个连续的位置称为五元组（Tuple）
 * 对于一个可以下的位置来说，对于所有包含它的五元组，根据五元组中己方棋子（用于进攻）和对方棋子（用于防御）的数量进行评分
 * 这个位置的最终得分就是所有这些五元组的评分的和
 */

// M = My, E = Enemy's 棋子
export default {
  // tuple is empty
  TupleTypeBlank: 7,
  // tuple contains a black chess  
  TupleTypeM: 35,
  // tuple contains two my chesses
  TupleTypeMM: 800,
  // tuple contains three my chesses  
  TupleTypeMMM: 15000,
  // tuple contains four my chesses  
  TupleTypeMMMM: 800000,
  // tuple contains an enemy's chess
  TupleTypeE: 15,
  // tuple contains two enemy's chesses
  TupleTypeEE: 400,
  // tuple contains three enemy's chesses  
  TupleTypeEEE: 1800,
  // tuple contains four enemy's chesses  
  TupleTypeEEEE: 100000,
  // tuple contains at least one my and at least one enemy's  
  TupleTypePolluted: 0
}
