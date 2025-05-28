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
          console.log('User is signed in:', user);
          // Prepare profilePicture object as required by backend
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
          console.log('Sending user payload to backend:', payload);
          const res = await axios.post(`${backendURL}/api/user`, payload);
          console.log('User API response status:', res.status);
          console.log('User API response data:', res.data);
          if (res.status !== 200) {
            console.error('User creation failed:', res.data);
          }
        } catch (err) {
          if (err.response) {
            console.error('User API error response:', err.response.data);
          } else {
            console.error('User API request error:', err);
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
