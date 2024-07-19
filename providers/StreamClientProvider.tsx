"use client";
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

// Now here token and user id should be comming from the clerk after connecting to the clerk so that each user is connected to stream user

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!apiKey) throw new Error("Stream API key Missing");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      // Here in this case token is coming from the env file where there is stream API SECRET however that key or secret should not be accessed by client side cause of security reasons and that's why we make the token provider in the file stream.actions.ts which has the important notation at the top named 'use server' in the actions folder from the root
      tokenProvider,
    });

    // After all this our client will be set so that we can update the state of our client
    setVideoClient(client);
  }, [user, isLoaded]);

  if (!videoClient) {
    return <Loader />;
  }

  return ( 
  <StreamVideo client={videoClient}>
    {children}
    {/* Now we can set this componenet to our root layout so that we can infuse the application with the necessary requirements */}
  </StreamVideo>
  );
};

export default StreamVideoProvider;
