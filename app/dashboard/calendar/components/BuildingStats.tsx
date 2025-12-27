'use client'

import { Building as BuildingIcon } from 'lucide-react'
import { CulturalCenter, Booking, Building } from '../types'

interface BuildingStatsProps {
  buildings: Building[]
  centers: CulturalCenter[]
  bookings: Booking[]
}

export default function BuildingStats({ buildings, centers, bookings }: BuildingStatsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
      {buildings.map((building) => {
        const buildingCenters = centers.filter(c => c.building === building.id)
        const buildingBookings = bookings.filter(b => 
          b.culturalCenter.building === building.id && 
          b.status === 'APPROVED'
        )
        const totalCapacity = buildingCenters.reduce((sum, c) => sum + c.capacity, 0)
        
        return (
          <div key={building.id} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${building.color}`}>
                <BuildingIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {building.name}
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Phòng</p>
                    <p className="font-medium">{buildingCenters.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sức chứa</p>
                    <p className="font-medium">{totalCapacity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Lịch đặt</p>
                    <p className="font-medium">{buildingBookings.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tỷ lệ sử dụng</p>
                    <p className="font-medium">
                      {buildingCenters.length > 0 
                        ? Math.round((buildingBookings.length / (buildingCenters.length * 15)) * 100) 
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

