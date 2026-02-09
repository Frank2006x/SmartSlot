"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AppointmentDetails() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const all =
      JSON.parse(localStorage.getItem("appointments") || "[]")

    const found = all.find((a: any) => a.id === id)
    setData(found)
  }, [id])

  if (!data)
    return (
      <div className="p-10">
        Appointment not found
      </div>
    )

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white w-[700px] rounded-2xl p-8 space-y-4">

        <h1 className="text-2xl font-bold">{data.title}</h1>

        {data.image && (
          <img
            src={data.image}
            className="h-40 rounded-xl border"
          />
        )}

        <p>{data.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Start: {data.startDate} {data.startTime}</div>
          <div>End: {data.endDate} {data.endTime}</div>
          <div>Duration: {data.duration} mins</div>
          <div>Price: {data.price || "Free"}</div>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-6 bg-emerald-400 text-white px-6 py-2 rounded-full"
        >
          Back
        </button>
      </div>
    </div>
  )
}
