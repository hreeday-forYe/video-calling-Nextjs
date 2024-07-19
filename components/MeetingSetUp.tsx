'use client'
import { useState, useEffect } from "react";
import { useCall, VideoPreview, DeviceSettings } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";
const MeetingSetUp = ({setIsSetUpComplete}:{setIsSetUpComplete:(value:boolean)=>void}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)

  const call = useCall();
  if(!call){
    throw new Error('Use Call must be used within Streamcall Component')
  }

  // Now we can check if
  useEffect(()=>{
    if(isMicCamToggledOn){
      call?.camera.disable()
      call?.microphone.disable()
    }else{
      call?.camera.enable()
      call?.microphone.enable()
    }
  },[isMicCamToggledOn, call?.camera, call?.microphone])
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      {/* Rendering the stream vidoe component: Now this will show how our video will be shown but first we need to allow the application for the video feature  */}
      <VideoPreview/> 

      {/* Now we are going to inject our app with the features for modifying the video and audio */}
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input 
            type="checkbox" 
            checked={isMicCamToggledOn}
            onChange={(e) =>setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        {/* Render the second vidoe component from stream */}
        <DeviceSettings/>
      </div>
      <Button className="rounded-md bg-green-500 px-4 py-2" onClick={() =>{
        call.join()
        setIsSetUpComplete(true)
      }}>
        Join Meeting
      </Button>
    </div>
  )
};

export default MeetingSetUp;
