"use strict";
import { Model } from "sequelize";

interface ILog {
  id: number;
  stack: string;
  date: Date;
}
module.exports = (sequelize: any, DataTypes: any) => {
  class Log extends Model<ILog> implements ILog {
    id!: number;
    stack!: string;
    date!: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Log.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      stack: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Log",
    }
  );
  return Log;
};
