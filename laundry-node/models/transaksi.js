'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.customer, {
        foreignKey: "customer_id",
        as: "customer"
      })
      this.belongsTo(models.admin, {
        foreignKey: "admin_id",
        as: "admin"
      })
      this.belongsTo(models.outlet, {
        foreignKey: "outlet_id",
        as: "outlet"
      })
      this.hasMany(models.detail_transaksi, {
        foreignKey: "transaksi_id",
        as: "detail_transaksi"
      })
    }
  }
  transaksi.init({
    transaksi_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false  
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false  
    },
    outlet_id: {
      type: DataTypes.INTEGER,
      allowNull: false  
    },
    tgl: DataTypes.DATE,
    batas_waktu: DataTypes.DATE,
    tgl_bayar: DataTypes.DATE,
    status: DataTypes.ENUM('Baru', 'Proses', 'Selesai', 'Diambil'),
    dibayar: DataTypes.ENUM('Lunas', 'Belum bayar'),
    total: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'transaksi',
    tableName: 'transaksi'
  });
  return transaksi;
};