'use client'
import React, { useState, useEffect } from 'react'
import ResponsiveHome from '@/components/home/ResponsiveHome'
import LandingPage from '@/components/home/LandingPage'
import { SignedIn, SignedOut} from '@clerk/nextjs'
import LoadingChats from '@/components/ui/LoadingChats'
import { backendURL } from '@/lib/socket'

const page = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(backendURL)
      .then(res => res.json())
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <SignedIn>
        {loading ? <LoadingChats /> : <ResponsiveHome />}
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </div>
  )
}

export default page
