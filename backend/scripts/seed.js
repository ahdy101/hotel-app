const { User, Room, Image, Review } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@ailhsan.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1234567890',
      address: 'Hotel Address, City, Country'
    });
    console.log('✅ Admin user created');

    // Create sample user
    const userPassword = await bcrypt.hash('user123', 12);
    const sampleUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
      phone: '+1987654321',
      address: '123 Main St, City, Country'
    });
    console.log('✅ Sample user created');

    // Create sample rooms
    const rooms = await Room.bulkCreate([
      {
        name: 'Deluxe Single Room',
        description: 'Comfortable single room with modern amenities, perfect for solo travelers. Features a queen-size bed, en-suite bathroom, and city view.',
        type: 'single',
        price: 120.00,
        capacity: 1,
        size: 25,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Room Service'],
        isAvailable: true,
        featured: true,
        discount: 0
      },
      {
        name: 'Deluxe Double Room',
        description: 'Spacious double room ideal for couples or business travelers. Features two queen-size beds, large bathroom, and balcony with city views.',
        type: 'double',
        price: 180.00,
        capacity: 2,
        size: 35,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Balcony'],
        isAvailable: true,
        featured: true,
        discount: 10
      },
      {
        name: 'Executive Suite',
        description: 'Luxurious suite with separate living area, perfect for extended stays. Features king-size bed, living room, dining area, and premium amenities.',
        type: 'suite',
        price: 280.00,
        capacity: 3,
        size: 50,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Living Room', 'Dining Area', 'Premium Toiletries'],
        isAvailable: true,
        featured: true,
        discount: 15
      },
      {
        name: 'Presidential Suite',
        description: 'Our most luxurious accommodation with panoramic city views. Features multiple bedrooms, full kitchen, private terrace, and exclusive services.',
        type: 'deluxe',
        price: 450.00,
        capacity: 4,
        size: 80,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Full Kitchen', 'Private Terrace', 'Butler Service', 'Premium Toiletries'],
        isAvailable: true,
        featured: true,
        discount: 0
      },
      {
        name: 'Standard Single Room',
        description: 'Cozy single room with essential amenities for budget-conscious travelers. Features a comfortable bed and clean bathroom.',
        type: 'single',
        price: 80.00,
        capacity: 1,
        size: 20,
        amenities: ['WiFi', 'TV', 'Air Conditioning'],
        isAvailable: true,
        featured: false,
        discount: 0
      },
      {
        name: 'Standard Double Room',
        description: 'Comfortable double room with two beds, perfect for friends or family. Features essential amenities and city view.',
        type: 'double',
        price: 120.00,
        capacity: 2,
        size: 28,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'City View'],
        isAvailable: true,
        featured: false,
        discount: 5
      }
    ]);
    console.log('✅ Sample rooms created');

    // Create sample reviews
    const reviews = await Review.bulkCreate([
      {
        rating: 5,
        comment: 'Excellent stay! The room was clean, comfortable, and the staff was very friendly. Would definitely recommend and stay again.',
        isVerified: true,
        isApproved: true,
        helpfulCount: 3,
        userId: sampleUser.id,
        roomId: rooms[0].id
      },
      {
        rating: 4,
        comment: 'Great hotel with good amenities. The room was spacious and clean. Only minor issue was the WiFi speed, but overall very good experience.',
        isVerified: true,
        isApproved: true,
        helpfulCount: 1,
        userId: sampleUser.id,
        roomId: rooms[1].id
      },
      {
        rating: 5,
        comment: 'Absolutely amazing suite! The living area was perfect for our family, and the service was top-notch. Worth every penny.',
        isVerified: true,
        isApproved: true,
        helpfulCount: 2,
        userId: sampleUser.id,
        roomId: rooms[2].id
      }
    ]);
    console.log('✅ Sample reviews created');

    // Create sample images (placeholder URLs)
    const images = await Image.bulkCreate([
      {
        filename: 'deluxe-single-1.jpg',
        originalName: 'deluxe-single-room.jpg',
        path: 'uploads/deluxe-single-1.jpg',
        url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        size: 1024000,
        mimeType: 'image/jpeg',
        category: 'room',
        isFeatured: true,
        altText: 'Deluxe Single Room',
        roomId: rooms[0].id
      },
      {
        filename: 'deluxe-double-1.jpg',
        originalName: 'deluxe-double-room.jpg',
        path: 'uploads/deluxe-double-1.jpg',
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        size: 1200000,
        mimeType: 'image/jpeg',
        category: 'room',
        isFeatured: true,
        altText: 'Deluxe Double Room',
        roomId: rooms[1].id
      },
      {
        filename: 'executive-suite-1.jpg',
        originalName: 'executive-suite.jpg',
        path: 'uploads/executive-suite-1.jpg',
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        size: 1500000,
        mimeType: 'image/jpeg',
        category: 'room',
        isFeatured: true,
        altText: 'Executive Suite',
        roomId: rooms[2].id
      },
      {
        filename: 'hotel-lobby.jpg',
        originalName: 'hotel-lobby.jpg',
        path: 'uploads/hotel-lobby.jpg',
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        size: 1800000,
        mimeType: 'image/jpeg',
        category: 'hotel',
        isFeatured: true,
        altText: 'Hotel Lobby'
      },
      {
        filename: 'hotel-pool.jpg',
        originalName: 'hotel-pool.jpg',
        path: 'uploads/hotel-pool.jpg',
        url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
        size: 1600000,
        mimeType: 'image/jpeg',
        category: 'hotel',
        isFeatured: true,
        altText: 'Hotel Swimming Pool'
      },
      {
        filename: 'hotel-restaurant.jpg',
        originalName: 'hotel-restaurant.jpg',
        path: 'uploads/hotel-restaurant.jpg',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        size: 1400000,
        mimeType: 'image/jpeg',
        category: 'hotel',
        isFeatured: true,
        altText: 'Hotel Restaurant'
      }
    ]);
    console.log('✅ Sample images created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Default credentials:');
    console.log('Admin: admin@ailhsan.com / admin123');
    console.log('User: john@example.com / user123');
    console.log('\n🏨 Sample data created:');
    console.log(`- ${rooms.length} rooms`);
    console.log(`- ${reviews.length} reviews`);
    console.log(`- ${images.length} images`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;


