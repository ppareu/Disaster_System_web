const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        username: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        birthdate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User", // User은 테이블
        tableName: "users", // users은
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associations(db) {}
}

module.exports = User;
