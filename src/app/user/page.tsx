"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UserPage() {
  const [code, setCode] = useState("")
  const router = useRouter()

  const handleJoin = () => {
    if (code.length === 6) {
      router.push(`/user/meet?code=${code}`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">

      <div className="w-[420px] bg-white rounded-3xl p-10 shadow-lg flex flex-col gap-6">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">
            SmartSlot
          </h1>
          <p className="text-gray-500">
            Enter your 6-digit appointment code
          </p>
        </div>

        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/[^0-9]/g, ""))
          }
          placeholder="XXXXXX"
          className="
            text-center text-2xl tracking-widest
            border border-gray-300 rounded-xl
            py-4 outline-none
            focus:border-emerald-400
          "
        />

        <button
          onClick={handleJoin}
          disabled={code.length !== 6}
          className={`
            py-4 rounded-xl text-lg font-semibold
            transition
            ${
              code.length === 6
                ? "bg-emerald-400 text-white hover:bg-emerald-500"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Join Meet
        </button>

        <p className="text-xs text-center text-gray-400">
          Ask your service provider for the 6-digit code
        </p>

      </div>
    </div>
  )
}
