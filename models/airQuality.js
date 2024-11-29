const Sequelize = require("sequelize");

class AirQuality extends Sequelize.Model {
  static initiate(sequelize) {
    AirQuality.init(
      {
        sidoName: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        pm10: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        pm25: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        timestamp: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: "AirQuality",
        tableName: "air_quality",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {}
}

module.exports = AirQuality;
