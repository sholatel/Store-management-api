import request from 'supertest';
import app from '../../../app';
import Product  from '../schemas/product.schema';
import Store from '../../store/schemas/store.schema';
import { createTestUser } from '../../../test/utils';
import signToken from '../../../utils/signToken';

describe('Product Controller', () => {
  let authToken: string;
  let testStore: any;

  beforeEach(async () => {
    const testUser = await createTestUser();
    authToken = signToken(testUser._id?.toString());
    
    testStore = await Store.create({
      name: 'Test Store',
      st_location: 'Test Location',
      owner: testUser._id
    });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          price: 19.99,
          description: 'Test description',
          storeId: testStore._id
        })
        .expect(201);

      expect(response.body.data.name).toBe('Test Product');
    });

    it('should fail with invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'T', // Too short
          price: -10, // Invalid price
          storeId: 'invalid-id' // Invalid store ID
        })
        .expect(400);

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /products', () => {
    it('should get all products', async () => {
      // Create test products
      await Product.create([
        {
          name: 'Product 1',
          price: 10,
          store: testStore._id,
          createdBy: testStore.owner
        },
        {
          name: 'Product 2',
          price: 20,
          store: testStore._id,
          createdBy: testStore.owner
        }
      ]);

      const response = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(2);
    });

    it('should filter products by store', async () => {
      // Create another store and product
      const anotherStore = await Store.create({
        name: 'Another Store',
        st_location: 'Another Location',
        owner: testStore.owner
      });
      
      await Product.create([
        {
          name: 'Store 1 Product',
          price: 10,
          store: testStore._id,
          createdBy: testStore.owner
        },
        {
          name: 'Store 2 Product',
          price: 20,
          store: anotherStore._id,
          createdBy: testStore.owner
        }
      ]);

      const response = await request(app)
        .get(`/api/v1/products?storeId=${testStore._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('Store 1 Product');
    });
  });

  describe('GET /products/:productId', () => {
    it('should get a single product', async () => {
      const product = await Product.create({
        name: 'Single Product',
        price: 15,
        store: testStore._id,
        createdBy: testStore.owner
      });

      const response = await request(app)
        .get(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.name).toBe('Single Product');
    });

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .get('/api/v1/products/507f1f77bcf86cd799439011') // Random ObjectId
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /products/:productId', () => {
    it('should update a product', async () => {
      const product = await Product.create({
        name: 'Old Name',
        price: 10,
        store: testStore._id,
        createdBy: testStore.owner
      });

      const response = await request(app)
        .put(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New Name',
          price: 15
        })
        .expect(200);

      expect(response.body.data.name).toBe('New Name');
      expect(response.body.data.price).toBe(15);
    });

    it('should prevent unauthorized updates', async () => {
      const otherUser = await createTestUser();
      const product = await Product.create({
        name: 'Protected Product',
        price: 10,
        store: testStore._id,
        createdBy: otherUser._id // Different creator
      });

      await request(app)
        .put(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Should Not Update'
        })
        .expect(404);
    });
  });

  describe('DELETE /products/:productId', () => {
    it('should delete a product', async () => {
      const product = await Product.create({
        name: 'To Be Deleted',
        price: 10,
        store: testStore._id,
        createdBy: testStore.owner
      });

      await request(app)
        .delete(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });

  });
});