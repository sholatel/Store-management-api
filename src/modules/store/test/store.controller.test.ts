import request from 'supertest';
import app from '../../../app';
import Store  from '../schemas/store.schema';
import { createTestUser } from '../../../test/utils';
import signToken from '../../../utils/signToken';
import Product from '../../product/schemas/product.schema'

describe('Store Controller', () => {
  let authToken: string;
  let testUser:any;

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = signToken(testUser._id?.toString());
  });

  describe('POST /stores', () => {
    it('should create a new store', async () => {
      const response = await request(app)
        .post('/api/v1/stores')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New Store',
          location: '123 Main St'
        })
        .expect(201);

      expect(response.body.data.name).toBe('New Store');
    });

    it('should fail with invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/stores')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'S', // Too short
          location: '' // Empty
        })
        .expect(400);

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /stores', () => {
    it('should get all stores', async () => {
      // Create test stores
      await Store.create([
        { name: 'Store 1', st_location: 'Location 1', owner:testUser?._id  },
        { name: 'Store 2', st_location: 'Location 2', owner:testUser?._id }
      ]);

      const response = await request(app)
        .get('/api/v1/stores')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(2);
    });
  });

  describe('GET /stores/:storeId/products', () => {
    it('should get products for a store', async () => {
      const store = await Store.create({
        name: 'Product Store',
        st_location: 'Product Location',
        owner:testUser?._id
      });

      const product = await Product.create({
            name: 'Single Product',
            price: 15,
            store: store._id,
            createdBy:testUser?._id
      });
      
      store.products.push(product?._id);
      await store.save();

      const response = await request(app)
        .get(`/api/v1/stores/${store._id}/products`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
    });
  });
});