
import React from 'react'
import ResponsiveHome from '@/components/home/ResponsiveHome'
import GlobalChat from '@/components/globalChat/GlobalChat'
import AIChat from '@/components/AIChat/AIChat'
import Sidebar from '@/components/sidebar/Sidebar'
import LandingPage from '@/components/home/LandingPage'
import { SignIn } from '@clerk/clerk-react'
const page = () => {
  return (
    <div>
      <ResponsiveHome />
      {/* <LandingPage />
      <SignedIn >

      </SignedIn> */}
    </div>
  )
}

export default page
