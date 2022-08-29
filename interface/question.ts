
interface OptionsType {
  label: string;
  answer: string;
}

// 新增题目格式
export interface QuestionType {
  // 试题分类
  categoryType: number;
  // 题目分类
  topicType: number;
  // 题目
  topic: string;
  // 选项
  options: OptionsType[] | string;
  // 正确答案
  correctOption: string;
  // 描述
  parsing: string;
  // 难度: 0-容易 1-中等 2-困难
  level: number
}