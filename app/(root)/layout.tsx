import React, { ReactNode } from 'react'
import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "LINGA",
  description: "Video Calling App",
  icons:{
    icon: '/icons/logo.svg'
  }
};
const RootLayout = ({children}: {children:ReactNode}) => {
  return (
    <main>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout

// https://youtu.be/R8CIO1DZ2b8?t=7844