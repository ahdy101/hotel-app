module.exports = (sequelize, DataTypes) => {
  const Content = sequelize.define('Content', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    page: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['home', 'about', 'contact', 'gallery']]
      }
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('text', 'html', 'json'),
      defaultValue: 'text'
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'contents',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['page', 'section']
      }
    ]
  });

  return Content;
};

