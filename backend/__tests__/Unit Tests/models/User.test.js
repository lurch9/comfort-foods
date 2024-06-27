const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const User = require('../../../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model Test', () => {
    it('should create and save a new user successfully', async () => {
        const plainTextPassword = 'password123'; // Store the plain text password separately
    
        const validUser = new User({
          name: 'Test User',
          email: 'test@example.com',
          password: plainTextPassword,
          dateOfBirth: new Date('2000-01-01'),
          role: 'user'
        });
    
        const savedUser = await validUser.save();
        console.log('Valid User:', validUser);
        console.log('Saved User:', savedUser);
    
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(validUser.name);
        expect(savedUser.email).toBe(validUser.email);
        expect(savedUser.password).not.toBe(plainTextPassword); // Password should be hashed
      });

  it('should require name field', async () => {
    const userWithoutName = new User({
      email: 'test@example.com',
      password: 'password123',
      dateOfBirth: new Date('2000-01-01'),
      role: 'user'
    });

    let err;
    try {
      await userWithoutName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  it('should require email field', async () => {
    const userWithoutEmail = new User({
      name: 'Test User',
      password: 'password123',
      dateOfBirth: new Date('2000-01-01'),
      role: 'user'
    });

    let err;
    try {
      await userWithoutEmail.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });

  it('should require password field', async () => {
    const userWithoutPassword = new User({
      name: 'Test User',
      email: 'test@example.com',
      dateOfBirth: new Date('2000-01-01'),
      role: 'user'
    });

    let err;
    try {
      await userWithoutPassword.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it('should require dateOfBirth field', async () => {
    const userWithoutDateOfBirth = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    let err;
    try {
      await userWithoutDateOfBirth.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.dateOfBirth).toBeDefined();
  });

  it('should hash the password before saving', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      dateOfBirth: new Date('2000-01-01'),
      role: 'user'
    });

    await user.save();

    const savedUser = await User.findOne({ email: 'test@example.com' });
    const isMatch = await bcrypt.compare('password123', savedUser.password);

    expect(isMatch).toBe(true);
  });

  it('should match the password correctly', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      dateOfBirth: new Date('2000-01-01'),
      role: 'user'
    });

    await user.save();

    const isMatch = await user.matchPassword('password123');
    expect(isMatch).toBe(true);
  });
});
