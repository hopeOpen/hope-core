
interface OptionsType {
  label: string;
  answer: string;
}

// 新增题目格式
export interface QuestionType {
  id?: number;
  // 试题分类
  categoryId: number;
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

// 筛选题目参数
export interface QuestionFilterType {
  // 试题分类
  categoryId: number | string;
  // 难易程度
  level: number | string;
  // 题目类型
  topicType: number | string;
  // 题目名称
  topic: string;
  pageSize: number;
  pageNum: number;
}