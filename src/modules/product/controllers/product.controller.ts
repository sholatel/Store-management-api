import { IRequest } from "../../../Interfaces/custom.interface";
import jsonResponse from "../../../utils/jsonResponse";
import logger from "../../../utils/logger";
import Store from "../../store/schemas/store.schema";
import Product from "../schemas/product.schema";
import { Response } from "express"

export const createProduct = async (req: IRequest, res: Response) => {
    try {
      const { name, price, description, storeId } = req.body;
      
      // Verify store exists and user has permission
      const store = await Store.findOne({ 
        _id: storeId, 
        owner: req.user._id 
      });
  
      if (!store) {
        return res.status(403).json(jsonResponse("Invalid store/store not found"));
      }
  
      const product = await Product.create({
        name,
        price,
        description,
        store: storeId,
        createdBy: req.user._id
      });
  
      // Add product to store's products array
      await Store.findByIdAndUpdate(storeId, {
        $push: { products: product._id }
      });
  
      res.status(201).json(jsonResponse("Product created successfully", "", product));
      
    } catch (err: any) {
      jsonResponse(`Error creating product ${err}`)
      res.status(500).json(jsonResponse(`Failed to create product`));
    }
  };


  export const getProducts = async (req: IRequest, res: Response) => {
    try {
      // Optional filtering by store
      const filter = req.query.storeId 
        ? { store: req.query.storeId } 
        : {};
  
      const products = await Product.find(filter)
        .select("createdBy store name price")
        .populate('createdBy', 'name email')
        .populate('store', 'name location');
  
      res.status(200).json(jsonResponse("Products fetched successfully","", products));
    } catch (err: any) {
      logger("Failed to fetch products:", err)
      res.status(500).json(jsonResponse("Failed to fetch products"));
    }
  };
  
  export const getProduct = async (req: IRequest, res: Response) => {
    try {
      const product = await Product.findById(req.params.productId)
        .populate('createdBy', 'name email')
        .populate('store', 'name location');
  
      if (!product) {
        return res.status(404).json(jsonResponse("Product not found"));
      }
  
      res.status(200).json(jsonResponse("Product failed successfully", "", product));
    } catch (err: any) {
      logger(`Error fetching single product: ${err}`)
      res.status(404).json(jsonResponse('Failed to fetch product'));
    }
  };
  
  export const updateProduct = async (req: IRequest, res: Response) => {
    try {
   
      // Verify product exists and user has permission
      const product = await Product.findOne({
        _id: req.params.productId,
        createdBy: req.user._id
      });
  
      if (!product) {
        return res.status(404).json(jsonResponse("Product not found or you are not the creator"));
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        { new: true, runValidators: true }
      );
  
      res.status(200).json(jsonResponse("Product updated successfully", "", updatedProduct));
    } catch (err: any) {
      logger(`Failed to update product ${req.params.productId}:${err}`)
      res.status(500).json(jsonResponse("Failed to update product"));
    }
  };
  
  export const deleteProduct = async (req: IRequest, res: Response) => {
    try {
      const product = await Product.findOneAndDelete({
        _id: req.params.productId,
        createdBy: req.user._id
      });
  
      if (!product) {
        return res.status(404).json(jsonResponse('Product not found or you are not the creator'));
      }
  
      // Remove product reference from store
      await Store.findByIdAndUpdate(product.store, {
        $pull: { products: product._id }
      });
  
      res.status(204).json(jsonResponse("Product deleted successfully"));
    } catch (err: any) {
      logger(`Failed to delete product ${req.params.productId}: ${err}`)
      res.status(400).json(jsonResponse(`Failed to delete product`));
    }
  };