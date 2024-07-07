"use server"
import { ScrapeProduct } from "./scraper";
export async function ScapeAndStoreProduct(productUrl: string){
    if(!productUrl)return;
    try{
        const scrapedPorduct = await ScrapeProduct(productUrl);
    }catch(err:any){
        throw new Error(`failed to retrieve product: ${err.message}`);
    }
}