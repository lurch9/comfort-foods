const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Order = require('../../../models/Order');

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
  await Order.deleteMany({});
});

describe('Order Model Test', () => {
  it('should create and save a new order successfully', async () => {
    const validOrder = new Order({
      user: new mongoose.Types.ObjectId(),
      restaurant: new mongoose.Types.ObjectId(),
      items: [
        {
          product: new mongoose.Types.ObjectId(),
          name: 'Burger',
          quantity: 2,
          price: 9.99,
        },
      ],
      total: 19.98,
      paymentIntentId: 'pi_1234567890',
      sessionId: 'sess_1234567890',
      status: 'pending',
    });

    const savedOrder = await validOrder.save();

    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.user).toEqual(validOrder.user);
    expect(savedOrder.restaurant).toEqual(validOrder.restaurant);
    expect(savedOrder.items.length).toBe(1);
    expect(savedOrder.items[0].name).toBe(validOrder.items[0].name);
    expect(savedOrder.total).toBe(validOrder.total);
    expect(savedOrder.paymentIntentId).toBe(validOrder.paymentIntentId);
    expect(savedOrder.sessionId).toBe(validOrder.sessionId);
    expect(savedOrder.status).toBe(validOrder.status);
  });

  it('should require restaurant field', async () => {
    const orderWithoutRestaurant = new Order({
      user: new mongoose.Types.ObjectId(),
      items: [
        {
          product: new mongoose.Types.ObjectId(),
          name: 'Burger',
          quantity: 2,
          price: 9.99,
        },
      ],
      total: 19.98,
      paymentIntentId: 'pi_1234567890',
      sessionId: 'sess_1234567890',
      status: 'pending',
    });

    let err;
    try {
      await orderWithoutRestaurant.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.restaurant).toBeDefined();
  });

  it('should require valid item fields', async () => {
    const orderWithInvalidItem = new Order({
      user: new mongoose.Types.ObjectId(),
      restaurant: new mongoose.Types.ObjectId(),
      total: 19.98,
      paymentIntentId: 'pi_1234567890',
      sessionId: 'sess_1234567890',
      status: 'pending',
      items: [
        {
          name: 'Burger',
          price: 9.99,
          // Missing product and quantity fields
        },
      ],
    });
  
    let err;
    try {
      await orderWithInvalidItem.save();
    } catch (error) {
      err = error;
    }
    console.log('Error:', err); // Log the error to inspect the structure
    expect(err).toBeDefined();
    expect(err.errors['items.0.product']).toBeDefined();
    expect(err.errors['items.0.quantity']).toBeDefined();
  });
  

  it('should require total field', async () => {
    const orderWithoutTotal = new Order({
      user: new mongoose.Types.ObjectId(),
      restaurant: new mongoose.Types.ObjectId(),
      items: [
        {
          product: new mongoose.Types.ObjectId(),
          name: 'Burger',
          quantity: 2,
          price: 9.99,
        },
      ],
      paymentIntentId: 'pi_1234567890',
      sessionId: 'sess_1234567890',
      status: 'pending',
    });

    let err;
    try {
      await orderWithoutTotal.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.total).toBeDefined();
  });

  it('should require paymentIntentId field', async () => {
    const orderWithoutPaymentIntentId = new Order({
      user: new mongoose.Types.ObjectId(),
      restaurant: new mongoose.Types.ObjectId(),
      items: [
        {
          product: new mongoose.Types.ObjectId(),
          name: 'Burger',
          quantity: 2,
          price: 9.99,
        },
      ],
      total: 19.98,
      sessionId: 'sess_1234567890',
      status: 'pending',
    });

    let err;
    try {
      await orderWithoutPaymentIntentId.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.paymentIntentId).toBeDefined();
  });

  it('should require sessionId field', async () => {
    const orderWithoutSessionId = new Order({
      user: new mongoose.Types.ObjectId(),
      restaurant: new mongoose.Types.ObjectId(),
      items: [
        {
          product: new mongoose.Types.ObjectId(),
          name: 'Burger',
          quantity: 2,
          price: 9.99,
        },
      ],
      total: 19.98,
      paymentIntentId: 'pi_1234567890',
      status: 'pending',
    });

    let err;
    try {
      await orderWithoutSessionId.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.sessionId).toBeDefined();
  });
});
