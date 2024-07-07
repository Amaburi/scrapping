import mongoose from "mongoose";
let isConnected = false;

export const connectTODB = async()=>{
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URI) return console.log('MONGODB URI ISNT DEFINED');

    if(isConnected) return console.log('=> CONNECTED');

    try{
      await mongoose.connect(process.env.MONGODB_URI)
      isConnected = true
      console.log('MongoDB IS CONNECTED')   
    }catch(err){
        throw new Error(`Something went wrong: ${err}`)
    }
    
}