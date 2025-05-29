'use client'
import React, { useState, useEffect } from 'react'
import ResponsiveHome from '@/components/home/ResponsiveHome'
import LandingPage from '@/components/home/LandingPage'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import LoadingChats from '@/components/ui/LoadingChats'
import { backendURL } from '@/lib/socket'
import axios from 'axios'

const page = () => {
  const [loading, setLoading] = useState(true)
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    fetch(backendURL)
      .then(res => res.json())
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (isSignedIn && user) {
      (async () => {
        try {
          const profilePicture = {
            url: user.imageUrl || '',
            publicId: '', // Clerk does not provide a Cloudinary publicId by default
          };
          const payload = {
            userId: user.id,
            name: user.fullName || '',
            userAvatar: user.imageUrl || '',
            userName: user.username || user.fullName || '',
            profilePicture,
            userEmail: user.primaryEmailAddress?.emailAddress || '',
          };
          const res = await axios.post(`${backendURL}/api/user`, payload);
          if (res.status !== 200) {
          }
        } catch (err) {
          if (err.response) {
          } else {
          }
        }
      })();
    }
  }, [isSignedIn, user]);

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
