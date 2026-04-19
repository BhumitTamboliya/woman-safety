const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const SafeZone = require('../models/SafeZone');
const Alert = require('../models/Alert');
const Contact = require('../models/Contact');

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Volunteer.deleteMany(),
    SafeZone.deleteMany(),
    Alert.deleteMany(),
    Contact.deleteMany(),
  ]);
  console.log('Cleared existing data');

  // ─── ADMIN ───────────────────────────────────────────────────
  const admin = await User.create({
    name: 'Admin User',
    email: 'adminw@safeguard.com',
    phone: '9999999999',
    password: 'Adminw@123',
    role: 'admin',
    isVerified: true,
  });

  // ─── TEST USERS (LPU area) ────────────────────────────────────
  const user1 = await User.create({
    name: 'neha Sharma',
    email: 'neha@test.com',
    phone: '9873543210',
    password: 'Test@123',
    role: 'user',
    isVerified: true,
    bloodGroup: 'B+',
    age: 21,
    gender: 'Female',
    address: { city: 'Phagwara', state: 'Punjab', pincode: '144411', full: 'LPU Campus, Phagwara, Punjab' },
    lastLocation: { type: 'Point', coordinates: [75.7052, 31.2547] }, // LPU
  });

  const user2 = await User.create({
    name: 'ishu Gupta',
    email: 'ishu@test.com',
    phone: '9872543211',
    password: 'Test@123',
    role: 'user',
    isVerified: true,
    bloodGroup: 'O+',
    age: 20,
    gender: 'Female',
    address: { city: 'Phagwara', state: 'Punjab', pincode: '144401' },
    lastLocation: { type: 'Point', coordinates: [75.7730, 31.2240] }, // Phagwara city
  });

  // ─── VOLUNTEERS (LPU area) ────────────────────────────────────
  const vol1User = await User.create({
    name: 'krjun Mehta',
    email: 'krjun@test.com',
    phone: '9176543220',
    password: 'Test@123',
    role: 'volunteer',
    isVerified: true,
    lastLocation: { type: 'Point', coordinates: [75.7060, 31.2540] }, // Near Lovely Hospital
  });

  await Volunteer.create({
    user: vol1User._id,
    verificationStatus: 'verified',
    availability: 'available',
    currentLocation: { type: 'Point', coordinates: [75.7060, 31.2540] }, // Near Lovely Hospital
    serviceRadius: 5000,
    specializations: ['first_aid', 'transport'],
    rating: 4.9,
    ratingCount: 34,
    totalResponses: 34,
    successfulResponses: 33,
    bio: 'Trained first aid responder with 3 years experience. Based near LPU campus.',
  });

  const vol2User = await User.create({
    name: 'Samran Kaur',
    email: 'samran@test.com',
    phone: '9873543221',
    password: 'Test@123',
    role: 'volunteer',
    isVerified: true,
    lastLocation: { type: 'Point', coordinates: [75.7730, 31.2240] }, // Phagwara city
  });

  await Volunteer.create({
    user: vol2User._id,
    verificationStatus: 'verified',
    availability: 'available',
    currentLocation: { type: 'Point', coordinates: [75.7730, 31.2240] }, // Phagwara city
    serviceRadius: 5000,
    specializations: ['counseling', 'medical'],
    rating: 4.8,
    ratingCount: 20,
    totalResponses: 20,
    successfulResponses: 19,
    bio: 'Certified counselor and medical aid volunteer. Based in Phagwara.',
  });

  const vol3User = await User.create({
    name: 'Mahul Singh',
    email: 'mahul@test.com',
    phone: '9876143222',
    password: 'Test@123',
    role: 'volunteer',
    isVerified: true,
    lastLocation: { type: 'Point', coordinates: [75.7052, 31.2580] }, // LPU Gate area
  });

  await Volunteer.create({
    user: vol3User._id,
    verificationStatus: 'verified',
    availability: 'available',
    currentLocation: { type: 'Point', coordinates: [75.7052, 31.2580] }, // LPU Gate area
    serviceRadius: 5000,
    specializations: ['security', 'transport'],
    rating: 4.7,
    ratingCount: 15,
    totalResponses: 15,
    successfulResponses: 14,
    bio: 'Security personnel. Available near LPU main gate.',
  });

  // ─── EMERGENCY CONTACTS ───────────────────────────────────────
  await Contact.create([
    {
      user: user1._id,
      name: 'Mukesh Sharma',
      phone: '9223456789',
      relation: 'family',
      isPrimary: true,
      email: 'mukesh@test.com',
    },
    {
      user: user1._id,
      name: 'Sunta Sharma',
      phone: '9723456780',
      relation: 'family',
      email: 'sunta@test.com',
    },
  ]);

  await Contact.create([
    {
      user: user2._id,
      name: 'Amat Gupta',
      phone: '9234567890',
      relation: 'family',
      isPrimary: true,
    },
  ]);

  // ─── SAFE ZONES (LPU & Phagwara area) ────────────────────────
  await SafeZone.create([
    // Police Stations
    {
      name: 'Phagwara City Police Station',
      type: 'police_station',
      location: {
        type: 'Point',
        coordinates: [75.7730, 31.2240],
        address: 'GT Road, Phagwara, Punjab 144401',
      },
      phone: '01824-260100',
      operatingHours: '24/7',
      addedBy: admin._id,
    },
    {
      name: 'LPU Campus Security',
      type: 'police_station',
      location: {
        type: 'Point',
        coordinates: [75.7052, 31.2547],
        address: 'Lovely Professional University, Phagwara, Punjab 144411',
      },
      phone: '01824-517000',
      operatingHours: '24/7',
      addedBy: admin._id,
    },

    // Hospitals
    {
      name: 'Lovely Hospital (LPU)',
      type: 'hospital',
      location: {
        type: 'Point',
        coordinates: [75.7067, 31.2561],
        address: 'Lovely Professional University Campus, Phagwara, Punjab',
      },
      phone: '01824-517000',
      operatingHours: '24/7',
      addedBy: admin._id,
    },
    {
      name: 'Civil Hospital Phagwara',
      type: 'hospital',
      location: {
        type: 'Point',
        coordinates: [75.7710, 31.2230],
        address: 'Civil Hospital Road, Phagwara, Punjab 144401',
      },
      phone: '01824-260200',
      operatingHours: '24/7',
      addedBy: admin._id,
    },
    {
      name: 'Shri Satya Sai Hospital',
      type: 'hospital',
      location: {
        type: 'Point',
        coordinates: [75.7600, 31.2100],
        address: 'Phagwara - Kapurthala Road, Punjab',
      },
      phone: '01824-261000',
      operatingHours: '24/7',
      addedBy: admin._id,
    },

    // Shelters / NGOs
    {
      name: 'Phagwara Women Helpline Center',
      type: 'shelter',
      location: {
        type: 'Point',
        coordinates: [75.7680, 31.2200],
        address: 'Near Bus Stand, Phagwara, Punjab',
      },
      phone: '1091',
      operatingHours: '24/7',
      addedBy: admin._id,
    },
    {
      name: 'LPU Student Welfare Office',
      type: 'public_safe_zone',
      location: {
        type: 'Point',
        coordinates: [75.7045, 31.2550],
        address: 'LPU Campus, Block 34, Phagwara, Punjab',
      },
      phone: '01824-517000',
      operatingHours: '8am - 8pm',
      addedBy: admin._id,
    },
    {
      name: 'Kapurthala Police Station',
      type: 'police_station',
      location: {
        type: 'Point',
        coordinates: [75.3800, 31.3800],
        address: 'Civil Lines, Kapurthala, Punjab 144601',
      },
      phone: '01822-232100',
      operatingHours: '24/7',
      addedBy: admin._id,
    },
  ]);

  // ─── SAMPLE ALERTS ────────────────────────────────────────────
  await Alert.create({
    user: user2._id,
    type: 'sos',
    status: 'resolved',
    location: {
      type: 'Point',
      coordinates: [75.7730, 31.2240],
      address: 'Phagwara Bus Stand, Punjab',
    },
    assignedResponder: vol1User._id,
    responderType: 'volunteer',
    respondedAt: new Date(Date.now() - 30 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 25 * 60 * 1000),
    responseTime: 134,
    priority: 'critical',
    incidentReport: {
      description: 'User was safe, false alarm.',
      outcome: 'Resolved safely',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin:       adminw@safeguard.com  / Adminw@123');
  console.log('User 1:      neha@test.com        / Test@123');
  console.log('User 2:      ishu@test.com         / Test@123');
  console.log('Volunteer 1: krjun@test.com        / Test@123  (near LPU Hospital)');
  console.log('Volunteer 2: samran@test.com       / Test@123  (Phagwara city)');
  console.log('Volunteer 3: mahul@test.com        / Test@123  (LPU Gate)');
  console.log('\n📍 All locations set to LPU & Phagwara area, Punjab');

  mongoose.connection.close();
};

seedDB().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});