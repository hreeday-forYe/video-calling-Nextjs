'use client'
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCalls = () =>{
  const [calls, setCalls] = useState<Call[]>([])
  // For loading state during the fetching of the calls 
  const [isLoading, setIsLoading] = useState(false)
  // Getting the calls using the stream video client
  const client = useStreamVideoClient();
  // getting the user as we have the get the calls for the specific user
  const {user} = useUser();


  // now use effect to fetch which will have call back function 
  useEffect(() =>{
    const loadCalls = async () =>{
      if(!client || user?.id){
        return;
      }
      setIsLoading(true);
      try {
        const {calls} = await client.queryCalls({
          sort: [{field: 'starts_at', direction:-1}],
          filter_conditions: {
            starts_at: {$exists: true},
            $or:[
              {created_by_user_id: user?.id},
              {members: {$in: [user?.id]}}
            ]
          }
        });
        setCalls(calls)
      } catch (error) {
        console.log(error)
      }finally{
        setIsLoading(false)
      }
    }

    loadCalls();
  },[client, user?.id])

  // filtering the different calls that have been fetched 

  // Logic for getting the endedCalls and upcoming calls
  
  // getting the now time 
  const now = new Date(); // cause if the date of the calls are after the current date then it is an ended calls else an upcoming calls 

  const endedCalls = calls.filter(({state:{startsAt, endedAt}}:Call) =>{
    return (startsAt && new Date(startsAt) < now || !!endedAt)
  })
  const upcomingCalls = calls.filter(({state:{startsAt}}:Call) =>{
    return startsAt && new Date(startsAt) > now
  })


  return {
    endedCalls,
    upcomingCalls,
    callRecordings: calls,
    isLoading,
  }
  
}

// https://youtu.be/R8CIO1DZ2b8?t=12012