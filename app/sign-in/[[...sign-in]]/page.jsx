import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome to ChatNest</h1>
      <SignIn />
    </div>
  )
}