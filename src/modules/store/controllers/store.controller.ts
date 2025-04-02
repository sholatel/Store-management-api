import { Response } from 'express';
import  Store  from '../schemas/store.schema';
import { IRequest } from '../../../Interfaces/custom.interface';
import jsonResponse from '../../../utils/jsonResponse';
import logger from '../../../utils/logger';
import Product from "../../product/schemas/product.schema";

export const createStore = async (req: IRequest, res: Response) => {
  try {
    const { name, location } = req.body;
    
    const store = await Store.create({
      name,
      st_location:location,
      owner: req.user._id
    });

    res.status(201).json(jsonResponse("Store created successfully!", "", store));
  } catch (err: any) {
    logger("Error while creating store:", err)
    res.status(500).json(jsonResponse("Failed to create store"));
  }
};

export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await Store.find().populate('owner', 'name email');

    res.status(200).json(jsonResponse("", "", stores));
  } catch (err: any) {
    logger(`Error while fetching stores:`, err)
    res.status(404).json(jsonResponse("Failed to fetch stores"));
  }
};

export const getStoreProducts = async (req: IRequest, res: Response) => {
  const { storeId } = req.params
  try {
    const products = await Product.find({ store: storeId })
      .populate('createdBy', 'name email');

    res.status(200).json(jsonResponse("Store products fetched successfully", "" ,products));
  } catch (err: any) {
    logger(`Error while fetching store products:`, err)
    res.status(500).json(jsonResponse("Failed to get store products"));
  }
};