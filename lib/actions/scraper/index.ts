import { ExtractCurrency, extractDescription, ExtractPrice } from "@/lib/utils";
import axios from "axios";
import * as cheerio from "cheerio";

export async function ScrapeProduct(url:string){
    if(!url) return;
    const username = String(process.env.BRIGHT_USERNAME)
    const password = String(process.env.BRIGHT_PASSWORD)
    const port = 22225
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth:{
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try{
        const response = await axios.get(url, options)
        const $ = cheerio.load(response.data)

        const title = $('#productTitle').text().trim()
        const CPrice = ExtractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price')
        )
        const Price = ExtractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        )
        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable'
        const images = $('#imgBlkFront').attr('data-a-dynamic-image') ||
        $('#landingImage').attr('data-a-dynamic-image') ||
        '{}'

        const imageUrls= Object.keys(JSON.parse(images));

        const currency = ExtractCurrency($('.a-price-symbol'))
        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");
        const description = extractDescription($)

        const ratingsText = $('#acrCustomerReviewText').text();
        const ratingsMatch = ratingsText.match(/\d+/);
        const reviewCounts = ratingsMatch ? ratingsMatch[0] : null;
        
        const ratingText = $('a.a-popover-trigger > span.a-size-base.a-color-base').text().trim();
        const ratingMatch = ratingText.match(/\d+(\.\d+)?/);
        const rating = ratingMatch ? ratingMatch[0] : null;

        const bestSellerText = $('.zg-badge-wrapper .badge-link .p13n-best-seller-badge').text().trim();
        const data = {
            url,
            currency: currency || 'idr',
            image: imageUrls[0],
            currentPrice: Number(CPrice) || Number(Price),
            originalPrice: Number(Price) || Number(CPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: reviewCounts ,
            stars: rating,
            isOutofStock: outOfStock,
            description: description,
            lowestPrice: Number(CPrice) || Number(Price),
            highestPrice: Number(Price) || Number(CPrice),
            averagePrice: Number(CPrice) || Number(Price),
            percents: 80,
            bestSeller: bestSellerText ||''
        }
        return data;
    }catch(err:any){
        throw new Error(`Failed to scrape the product : ${err.message}`)
    }
}