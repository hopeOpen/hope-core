export default (app) => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const Menu = app.model.define('menu', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    // 名称
    name: STRING(255),
    // 
    sign: STRING(255),
    // 顺序下标
    index: INTEGER,
    // 父级菜单id
    parentId: INTEGER,
    // 页面地址
    url: STRING(255),
    // 描述
    description: STRING(255),
    // 自定义参数
    customParams: STRING(255),
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
    tableName: 'menu', // 设置表名称
    // 默认false修改表名为复数，true不修改表名，与数据库表名同步
    freezeTableName: true,
    autoIncrement: true,
    // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
    // 将createdAt设为自定义字段createdTime
    // createdAt: "createdTime",
    createdAt: false, // 关闭createdAt
    updatedAt: true, // 关闭updatedAt
  });

  return Menu;
}