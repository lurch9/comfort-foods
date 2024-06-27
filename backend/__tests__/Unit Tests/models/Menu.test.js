const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Menu = require('../../../models/Menu');

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
  await Menu.deleteMany({});
});

describe('Menu Model Test', () => {
  it('should create and save a new menu successfully', async () => {
    const validMenu = new Menu({
      name: 'Dinner Menu',
      items: [
        {
          name: 'Burger',
          description: 'A delicious burger',
          price: 9.99,
        },
      ],
      restaurantId: new mongoose.Types.ObjectId(),
    });

    const savedMenu = await validMenu.save();

    expect(savedMenu._id).toBeDefined();
    expect(savedMenu.name).toBe(validMenu.name);
    expect(savedMenu.items.length).toBe(1);
    expect(savedMenu.items[0].name).toBe(validMenu.items[0].name);
  });

  it('should require a name field', async () => {
    const menuWithoutName = new Menu({
      items: [
        {
          name: 'Burger',
          description: 'A delicious burger',
          price: 9.99,
        },
      ],
      restaurantId: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await menuWithoutName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  it('should require item fields', async () => {
    const menuWithInvalidItem = new Menu({
      name: 'Dinner Menu',
      items: [
        {
          description: 'A delicious burger',
          price: 9.99,
        },
      ],
      restaurantId: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await menuWithInvalidItem.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors['items.0.name']).toBeDefined();
  });

  it('should require restaurantId field', async () => {
    const menuWithoutRestaurantId = new Menu({
      name: 'Dinner Menu',
      items: [
        {
          name: 'Burger',
          description: 'A delicious burger',
          price: 9.99,
        },
      ],
    });

    let err;
    try {
      await menuWithoutRestaurantId.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.restaurantId).toBeDefined();
  });
});
