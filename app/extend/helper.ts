export default {
  // 扁平分类转换树状结构
  flatToTree(list: any) {
    const data = JSON.parse(JSON.stringify(list));
    const obj: any = {};
    const itemMap = new Map(data.map(node => [node.id, node]));
    data.forEach((item) => {
      const parent: any = itemMap.get(Number(item.parentId)) || obj;
      !parent.children && (parent['children'] = []);
      parent.children.push(item)
    });
    return obj.children.filter((item) => item.categoryLevel === 1);
  }
}