"use client"

import React, { useState } from "react"
import { ArrowLeft, Search, Star, Clock } from "lucide-react"

const doctors = [
  { id: 1, name: "Dr. Sarah Miller", role: "General Physician", specialization: "Internal Medicine", rating: 4.7, available: true, fee: 100, image: "/placeholder.svg?height=400&width=400", experience: 8, totalReviews: 425 },
  { id: 2, name: "Dr. James Wilson", role: "Cardiologist", specialization: "Heart Specialist", rating: 4.9, available: true, fee: 150, image: "/placeholder.svg?height=400&width=400", experience: 12, totalReviews: 738 },
  { id: 3, name: "Dr. Emily Chen", role: "Pediatrician", specialization: "Child Care", rating: 4.8, available: false, fee: 120, image: "/placeholder.svg?height=400&width=400", experience: 6, totalReviews: 289, nextAvailable: "Tomorrow 10:00 AM" },
  { id: 4, name: "Dr. Michael Brown", role: "Dermatologist", specialization: "Skin Care", rating: 4.5, available: true, fee: 130, image: "/placeholder.svg?height=400&width=400", experience: 10, totalReviews: 512 },
  { id: 5, name: "Dr. Lisa Anderson", role: "Neurologist", specialization: "Brain & Spine", rating: 4.9, available: false, fee: 200, image: "/placeholder.svg?height=400&width=400", experience: 15, totalReviews: 892, nextAvailable: "Today 4:30 PM" },
  { id: 6, name: "Dr. Robert Taylor", role: "Orthopedic", specialization: "Bone & Joints", rating: 4.6, available: true, fee: 140, image: "/placeholder.svg?height=400&width=400", experience: 9, totalReviews: 367 }
]

const Avatar = ({ src, alt }) => (
  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-200">
    <img src={src || "/placeholder.svg"} alt={alt} className="h-full w-full object-cover" />
  </div>
)

const Badge = ({ children, variant }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${variant === "green" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{children}</span>
)

const Button = ({ children, variant, disabled, onClick }) => (
  <button className={`w-full px-4 py-3 text-center rounded-md font-semibold transition-colors ${variant === "default" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} disabled={disabled} onClick={onClick}>{children}</button>
)

const DoctorCard = ({ doctor }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-4 space-y-4 w-full">
    <div className="flex gap-4 items-start">
      <Avatar src={doctor.image} alt={doctor.name} />
      <div className="flex-1 space-y-1 min-w-0">
        <h3 className="text-lg font-semibold truncate">{doctor.name}</h3>
        <p className="text-gray-600 text-sm">{doctor.role}</p>
        <p className="text-gray-600 text-sm">{doctor.specialization}</p>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium">{doctor.rating}</span>
          <span className="text-gray-600 text-sm">({doctor.totalReviews} reviews)</span>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        {doctor.available ? <Badge variant="green">Available Now</Badge> : <Badge variant="red">Not Available</Badge>}
        <span className="text-gray-600 text-sm">₹{doctor.fee} Consultation Fee</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>{doctor.experience} Years Experience</span>
      </div>
      <Button variant={doctor.available ? "default" : "secondary"} disabled={!doctor.available}> {doctor.available ? "Book Appointment Now" : "Currently Unavailable"} </Button>
    </div>
  </div>
)

const DoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const filteredDoctors = doctors.filter(doctor => doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || doctor.role.toLowerCase().includes(searchQuery.toLowerCase()) || doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-pink-50 p-4 md:p-8 lg:p-12">
      <div className="sticky top-0 z-10 bg-pink-50 bg-opacity-90 backdrop-blur border-b p-4 flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-pink-100 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by doctor name, speciality..." className="pl-10 pr-4 py-2 w-full bg-white rounded-full border border-gray-300 focus:ring-2 focus:ring-pink-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.length ? filteredDoctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} />) : <p className="text-center text-gray-600">No doctors found matching your search.</p>}
      </div>
    </div>
  )
}

export default DoctorSearch