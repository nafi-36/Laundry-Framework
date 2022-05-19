'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.transaksi, {
        foreignKey: "transaksi_id",
        as: "transaksi"
      })
      this.belongsTo(models.paket, {
        foreignKey: "paket_id",
        as: "paket"
      })
    }
  }
  detail_transaksi.init({
    transaksi_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paket_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: DataTypes.DOUBLE,
    qty: DataTypes.DOUBLE,
    subtotal: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'detail_transaksi',
    tableName: 'detail_transaksi'
  });
  return detail_transaksi;
};