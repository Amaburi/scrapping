import { ScrapeProduct } from "@/lib/actions/scraper";
import { connectTODB } from "@/lib/actions/scraper/db";
import Product from "@/lib/models/product.model";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        connectTODB();

        const products = await Product.find({});
        if(!products)throw new Error("Product not found");

        const updateProduct = await Promise.all(
            products.map(async (currentProduct) =>{
                const scrapedProduct = await ScrapeProduct(currentProduct.url);

                if(!scrapedProduct) throw new Error("Product not found");

                const updatedPriceHistory: any = [
                    ...currentProduct.priceHistory,
                    {price: scrapedProduct.currentPrice}
                ]
    
               const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory)
                }
                const updatedProduct = await Product.findOneAndUpdate({url : scrapedProduct.url},product);

                //2
                const emailNotif = getEmailNotifType(scrapedProduct,currentProduct);

                if(emailNotif && updatedProduct.users.length > 0) {
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url
                    }

                    const emailContent = await generateEmailBody(productInfo, emailNotif);
                    const userEmails = updatedProduct.users.map((user:any)=> user.email)
                    await sendEmail(emailContent, userEmails);
                }
                return updatedProduct;
            })
        )
        return NextResponse.json({
            message:'OK',data: updateProduct
        })
    }catch(err){
        throw new Error(`Error in GET: ${err.message}`);
    }
}