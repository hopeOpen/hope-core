export default (app) => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const Question = app.model.define('questions', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    // 题目名称
    topic: STRING(255),
    // 题目类型
    type: INTEGER,
    // 题目选项
    options: STRING(255),
    // 题目答案
    correctOption: STRING(255),
    // 题目解析
    parsing: STRING(255),
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
    },
  },
  {
    timestamps: true, // 自动增加创建时间
    tableName: 'questions', // 设置表名称
    // 默认false修改表名为复数，true不修改表名，与数据库表名同步
    freezeTableName: true,
    autoIncrement: true,
    // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
    // 将createdAt设为自定义字段createdTime
    // createdAt: "createdTime",
    createdAt: false, // 关闭createdAt
    updatedAt: true, // 关闭updatedAt
  });

  return Question;
};