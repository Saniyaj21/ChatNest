
import React from 'react'
import ResponsiveHome from '@/components/home/ResponsiveHome'
import GlobalChat from '@/components/globalChat/GlobalChat'
import AIChat from '@/components/AIChat/AIChat'
import Sidebar from '@/components/sidebar/Sidebar'
import LandingPage from '@/components/home/LandingPage'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

const page = () => {
  return (
    <div>

      <SignedIn>
        <ResponsiveHome />

      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </div>
  )
}

export default page
