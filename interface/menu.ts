
// 菜单类型
export type MenuConfigType = {
  id?: number;
  name: string;
  sign: string;
  // 顺序下标
  index: number;
  // 父级菜单id
  parentId?: number;
  // 描述
  description?: string;
  // 页面地址
  url?: string;
  // 自定义参数
  customParams?: string;
}