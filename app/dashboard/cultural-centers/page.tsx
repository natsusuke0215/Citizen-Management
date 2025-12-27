'use client'

import { useState, useMemo, useEffect } from 'react'
import { Building } from 'lucide-react'
import { useCenters } from './hooks/useCenters'
import { filterCenters, sortCenters } from './utils/filterUtils'
import StatisticsCards from './components/StatisticsCards'
import SearchAndFilterBar from './components/SearchAndFilterBar'
import CenterCard from './components/CenterCard'
import CenterListItem from './components/CenterListItem'
import CenterDetailModal from './components/CenterDetailModal'
import EmptyState from './components/EmptyState'

export default function CulturalCentersPage() {
  const { centers, loading, statistics } = useCenters()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'bookings'>('name')
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null)
  const [user, setUser] = useState<{ role: string } | null>(null)

  // Fetch user role
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setUser(data))
      .catch(() => {})
  }, [])

  const filteredAndSortedCenters = useMemo(() => {
    const filtered = filterCenters(centers, searchTerm)
    return sortCenters(filtered, sortBy)
  }, [centers, searchTerm, sortBy])

  const isAdmin = () => {
    return user?.role === 'ADMIN' || user?.role === 'TEAM_LEADER' || user?.role === 'LEADER' || user?.role === 'FACILITY_MANAGER'
  }

  const handleCenterClick = (centerId: string) => {
    setSelectedCenter(centerId)
  }

  const closeModal = () => {
    setSelectedCenter(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1"></div>
      </div>
    )
  }

  const selectedCenterData = selectedCenter 
    ? centers.find(c => c.id === selectedCenter) 
    : null

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slideUp">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="h-8 w-8 text-navy-1" />
            Nhà văn hóa
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và khám phá các nhà văn hóa trong khu dân cư
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards
        totalCenters={statistics.totalCenters}
        totalCapacity={statistics.totalCapacity}
        totalBookings={statistics.totalBookings}
        indoorCenters={statistics.indoorCenters}
        outdoorCenters={statistics.outdoorCenters}
        totalAmenities={statistics.totalAmenities}
        avgAmenities={statistics.avgAmenities}
        avgBookingsPerCenter={statistics.avgBookingsPerCenter}
      />

      {/* Search and Filter Bar */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Cultural Centers List */}
      {filteredAndSortedCenters.length === 0 ? (
        <EmptyState
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm('')}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCenters.map((center, index) => (
            <CenterCard
              key={center.id}
              center={center}
              index={index}
              onClick={() => handleCenterClick(center.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedCenters.map((center, index) => (
            <CenterListItem
              key={center.id}
              center={center}
              index={index}
              onClick={() => handleCenterClick(center.id)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedCenterData && (
        <CenterDetailModal
          center={selectedCenterData}
          onClose={closeModal}
          isAdmin={isAdmin()}
        />
      )}
    </div>
  )
}
