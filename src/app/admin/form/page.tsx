"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateSlotPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    id: Date.now().toString(),
    serviceTitle: "",
    description: "",
    price: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    duration: "30",
    maxBookings: "1",
    active: true,
    image: "",
    status: "Upcoming",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setForm(prev => ({ ...prev, image: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!form.serviceTitle || !form.startDate || !form.startTime) {
      alert("Please fill required fields")
      return
    }

    const stored = JSON.parse(localStorage.getItem("appointments") || "[]")
    stored.push({
      id: form.id,
      patientName: form.serviceTitle,
      treatment: form.description,
      date: form.startDate,
      startTime: form.startTime,
      endTime: form.endTime,
      status: form.active ? "Upcoming" : "Hidden",
    })

    localStorage.setItem("appointments", JSON.stringify(stored))
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-emerald-200 flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-5xl rounded-3xl px-5">

        <h1 className="text-3xl font-bold mb-8">
          Create Appointment Slot
        </h1>

        <div className="grid grid-cols-2 gap-6">

          {/* Service Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Service Title
            </label>
            <input
              name="serviceTitle"
              value={form.serviceTitle}
              onChange={handleChange}
              placeholder="Eg. Dental Checkup"
              className="w-full border rounded-xl px-4 py-3 outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Price (optional)
            </label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="₹500"
              className="w-full border rounded-xl px-4 py-3 outline-none"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the service..."
              className="w-full border rounded-xl px-4 py-3 h-24 resize-none outline-none"
            />
          </div>

          {/* Image */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Service Image
            </label>

            <label className="inline-block bg-emerald-400 text-white px-6 py-3 rounded-full cursor-pointer font-semibold">
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImage}
              />
            </label>

            
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Slot Duration (minutes)
            </label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Max Bookings
            </label>
            <input
              name="maxBookings"
              value={form.maxBookings}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
        </div>

        

        <button
          onClick={handleSubmit}
          className="w-full bg-emerald-400 hover:bg-emerald-500 text-white py-4 rounded-full font-semibold text-lg mt-9"
        >
          Create Slot
        </button>
      </div>
    </div>
  )
}
