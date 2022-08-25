export default (app) => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const Category = app.model.define('category', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    // 分类名称
    categoryName: STRING(255),
    // 分类描述
    categoryDesc: STRING(255),
    // 分类级别
    categoryLevel: INTEGER,
    // 父级分类
    parentId: STRING(255),
    // 创建时间
    createdAt: {
      type: DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: NOW,
    },
    // 更新时间
    updatedAt: {
      type: DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: NOW,
    }
  },
  {
    timestamps: true, // 自动增加创建时间
    tableName: 'category', // 设置表名称
    // 默认false修改表名为复数，true不修改表名，与数据库表名同步
    freezeTableName: true,
    autoIncrement: true,
    // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
    // 将createdAt设为自定义字段createdTime
    // createdAt: "createdTime",
    createdAt: false, // 关闭createdAt
    updatedAt: true, // 关闭updatedAt
  });

  return Category;
}