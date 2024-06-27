const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Restaurant = require('../../../models/Restaurant');

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
  await Restaurant.deleteMany({});
});

describe('Restaurant Model Test', () => {
  it('should create and save a new restaurant successfully', async () => {
    const validRestaurant = new Restaurant({
      name: 'Test Restaurant',
      address: {
        street: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zip: '12345',
        location: {
          type: 'Point',
          coordinates: [-73.856077, 40.848447]
        }
      },
      contact: '123-456-7890',
      manager: new mongoose.Types.ObjectId(),
    });

    const savedRestaurant = await validRestaurant.save();

    expect(savedRestaurant._id).toBeDefined();
    expect(savedRestaurant.name).toBe(validRestaurant.name);
    expect(savedRestaurant.address.street).toBe(validRestaurant.address.street);
    expect(savedRestaurant.contact).toBe(validRestaurant.contact);
  });

  it('should require name field', async () => {
    const restaurantWithoutName = new Restaurant({
      address: {
        street: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zip: '12345',
        location: {
          type: 'Point',
          coordinates: [-73.856077, 40.848447]
        }
      },
      contact: '123-456-7890',
      manager: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await restaurantWithoutName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  it('should require address fields', async () => {
    const restaurantWithEmptyAddress = new Restaurant({
      name: 'Test Restaurant',
      contact: '123-456-7890',
      manager: new mongoose.Types.ObjectId(),
      address: {}
    });
  
    let err;
    try {
      await restaurantWithEmptyAddress.save();
    } catch (error) {
      err = error;
    }
  
    console.log('Error:', err); // Log the error to inspect the structure
  
    expect(err).toBeDefined();
    expect(err.errors['address.street']).toBeDefined();
    expect(err.errors['address.city']).toBeDefined();
    expect(err.errors['address.state']).toBeDefined();
    expect(err.errors['address.zip']).toBeDefined();
    expect(err.errors['address.location.type']).toBeDefined();
    expect(err.errors['address.location.coordinates']).toBeDefined();
  });
  

  it('should require contact field', async () => {
    const restaurantWithoutContact = new Restaurant({
      name: 'Test Restaurant',
      address: {
        street: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zip: '12345',
        location: {
          type: 'Point',
          coordinates: [-73.856077, 40.848447]
        }
      },
      manager: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await restaurantWithoutContact.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.contact).toBeDefined();
  });

  it('should require manager field', async () => {
    const restaurantWithoutManager = new Restaurant({
      name: 'Test Restaurant',
      address: {
        street: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zip: '12345',
        location: {
          type: 'Point',
          coordinates: [-73.856077, 40.848447]
        }
      },
      contact: '123-456-7890',
    });

    let err;
    try {
      await restaurantWithoutManager.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.manager).toBeDefined();
  });
});
