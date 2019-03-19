module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define(
    'Brand',
    {
      name: DataTypes.STRING
    },
    {
      freezeTableName: true,
      tableName: 'brand'
    }
  )

  return Brand
}
