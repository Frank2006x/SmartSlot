import React from 'react'
import Image from "next/image";


const page = () => {
  return (
    <div className="flex min-h-screen">
      <div
        className="w-2/5 flex flex-col items-center justify-center gap-12 text-white
                  bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url('/lp_imgs/login.png')" }}
      >
        <h1 className="text-5xl font-bold">Welcome Back!</h1>
        <p className="text-xl text-center leading-relaxed">
          To keep connected with us please<br />login with your personal info
        </p>
        <button
            className="
              bg-transparent
              border border-white
              text-white
              px-20 py-3
              rounded-full
              transition-all duration-300
              hover:bg-emerald-700/40
              hover:border-emerald-200
              hover:text-white
            "
          >
            Sign In
          </button>

      </div>

      <div className="w-3/5 bg-white flex flex-col items-center justify-center px-20">
        <h1 className="text-4xl font-extrabold text-[#4FC08D] mb-6">
          Create Account
        </h1>
         <button className="border border-gray-300 px-10 py-3 rounded-full flex items-center gap-3 hover:shadow-md transition">
          <span>
                          <Image
                            src="/lp_contact_icons/google.png"
                            alt="google"
                            width={28}
                            height={28}
                          />
        
          </span>
          <span className='text-black'>Continue with Google</span>
        </button>
        <div className="mt-10 space-y-4 text-gray-600 text-lg">
        <p>✓ Book appointments 24×7</p>
        <p>✓ Manage clients & schedules</p>
        <p>✓ Automated reminders</p>
        <p>✓ Secure & cloud-based</p>
      </div>
       </div> 
    </div>

  )
}

export default page
