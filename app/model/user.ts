module.exports = app => {
  const { STRING, BIGINT, DATE, NOW } = app.Sequelize;
  const Users = app.model.define(
    'user',
    {
      id: {
        type: BIGINT(10),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      // 用户名
      name: STRING(30),
      token: STRING(255),
      // 头像
      avatar: STRING(255),
      email: STRING(255),
      // 角色
      roles: STRING(255),
      // 描述
      desc: STRING(255),
      createdAt: {
        type: DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: NOW,
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at',
        allowNull: false,
        defaultValue: NOW,
      },
    },
    {
      timestamps: true, // 自动增加创建时间
      tableName: 'users', // 设置表名称
      // 默认false修改表名为复数，true不修改表名，与数据库表名同步
      freezeTableName: true,
      autoIncrement: true,
      // 如果需要sequelize帮你维护createdAt,updatedAt和deletedAt必须先启用timestamps功能
      // 将createdAt设为自定义字段createdTime
      // createdAt: "createdTime",
      createdAt: false, // 关闭createdAt
      updatedAt: true, // 关闭updatedAt
    },
  );
  return Users;
};

/*
  defaultValue 设置默认  Boolean
  allowNull 是否允许为空 Boolean
  unique 属性用来创建一个唯一约束. Boolean | string
  primaryKey 用于定义主键.  Boolean
  autoIncrement 可用于创建自增的整数列 Boolean
  comment 注释   string;
  references: {
    // 这是引用另一个模型
    model: Bar,

    // 这是引用模型的列名称
    key: 'id',

    // 这声明什么时候检查外键约束. 仅限PostgreSQL.
    deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
  }
*/
