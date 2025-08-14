module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER, // in bytes
      allowNull: false
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('room', 'hotel', 'gallery'),
      defaultValue: 'gallery'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    altText: {
      type: DataTypes.STRING,
      allowNull: true
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rooms',
        key: 'id'
      }
    }
  }, {
    tableName: 'images',
    timestamps: true
  });

  // Instance method to get full URL
  Image.prototype.getFullUrl = function() {
    return `${process.env.BASE_URL || 'http://localhost:5000'}/${this.path}`;
  };

  // Instance method to get thumbnail URL
  Image.prototype.getThumbnailUrl = function() {
    const pathParts = this.path.split('.');
    const extension = pathParts.pop();
    const basePath = pathParts.join('.');
    return `${process.env.BASE_URL || 'http://localhost:5000'}/${basePath}_thumb.${extension}`;
  };

  return Image;
};


