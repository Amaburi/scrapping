"use server"
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { ScrapeProduct } from "./scraper";
import { connectTODB } from "./scraper/db";
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';
export async function ScapeAndStoreProduct(productUrl: string){
    if(!productUrl)return;
    try{
        connectTODB()
        const scrapedProduct = await ScrapeProduct(productUrl);
        if(!scrapedProduct)return;

        let product = scrapedProduct;

        const existingProduct = await Product.findOne({url : scrapedProduct.url});

        if(existingProduct){
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                {price: scrapedProduct.currentPrice}
            ]

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory)
            }
        }

        const newProduct = await Product.findOneAndUpdate({url : scrapedProduct.url}, product,{upsert: true, new: true});
        revalidatePath(`/products/${newProduct._id}`)
    }catch(err:any){
        throw new Error(`failed to retrieve product: ${err.message}`);
    }
}

export async function getProductById(productId:string){
    try{
        connectTODB();
        const product = await Product.findOne({_id: productId});

        if(!product) return null;
    }catch(err:any){
        throw new Error(`failed to retrieve product: ${err.message}`);
    }
}


export async function getAllProducts(){
    try{
        connectTODB();

        const products = await Product.find();
        return products
    }catch(err:any){
        throw new Error(`failed to retrieve product: ${err.message}`);
    }
}