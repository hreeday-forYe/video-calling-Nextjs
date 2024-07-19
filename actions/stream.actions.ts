"use server";
//  Meaning this file will only be accessed in the server side not on the client side of our application (WILL NOT BE RENDERED)

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

// Here in this case  we are going to create the token of the user 

export const tokenProvider = async() =>{
  const user = await currentUser(); // geting the user from the clerk server 

  // Some precautions so that everything is in place
  if(!user){
    throw new Error('User is not logged in');
  }
  if(!apiKey){
    throw new Error("No API key");
  }
  if(!apiSecret){
    throw new Error("No API Secret");
  }

  // Now the client will be created from the StreamClient but this one is different from the stream client on our 

  const client = new StreamClient(apiKey, apiSecret)
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60

  // Now after this we will have the client we can create users and users token which is the reason of creating this file now to create a user we can provide id and their role along with the name and image as well tokens should be generated on the server side only 


  // Getting the token issued date
  const issued = Math.floor(Date.now() / 1000) - 60


  // Once we have client expiration(exp) and (issued) we can create a new token by 
  const token = client.createToken(user?.id, exp, issued)

  return token;

}