module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('single', 'double', 'suite', 'deluxe'),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10
      }
    },
    size: {
      type: DataTypes.INTEGER, // in square meters
      allowNull: true
    },
    amenities: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    bookingComId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Booking.com room ID for integration'
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    }
  }, {
    tableName: 'rooms',
    timestamps: true
  });

  // Instance method to get discounted price
  Room.prototype.getDiscountedPrice = function() {
    if (this.discount > 0) {
      return this.price * (1 - this.discount / 100);
    }
    return this.price;
  };

  // Instance method to check availability
  Room.prototype.isRoomAvailable = function() {
    return this.isAvailable;
  };

  return Room;
};


