'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { Household, District } from '../shared/types'
import HouseholdSelection from './components/HouseholdSelection'
import TransferForm from './components/TransferForm'

export default function TransferHouseholdPage() {
  const router = useRouter()
  const [households, setHouseholds] = useState<Household[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('')
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    newAddress: '',
    newStreet: '',
    newWard: '',
    newDistrict: '',
    newDistrictId: '',
    transferReason: '',
    transferDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchHouseholds()
    fetchDistricts()
  }, [])

  useEffect(() => {
    if (selectedHouseholdId) {
      const household = households.find(h => h.id === selectedHouseholdId)
      setSelectedHousehold(household || null)
      if (household) {
        setFormData(prev => ({
          ...prev,
          newAddress: household.address,
          newStreet: household.street || '',
          newWard: household.ward,
          newDistrict: household.district,
          newDistrictId: household.districtRelation.id
        }))
      }
    } else {
      setSelectedHousehold(null)
    }
  }, [selectedHouseholdId, households])

  const fetchHouseholds = async () => {
    try {
      const response = await fetch('/api/households')
      if (response.ok) {
        const data = await response.json()
        setHouseholds(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách hộ khẩu')
    }
  }

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/districts')
      if (response.ok) {
        const data = await response.json()
        setDistricts(data)
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
    }
  }

  const handleHouseholdClick = (householdId: string) => {
    setSelectedHouseholdId(householdId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedHousehold) {
      toast.error('Vui lòng chọn hộ khẩu cần chuyển')
      return
    }

    if (!formData.newAddress || !formData.newWard || !formData.newDistrict || !formData.newDistrictId) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ mới')
      return
    }

    // Check if address changed
    if (formData.newAddress === selectedHousehold.address &&
        formData.newWard === selectedHousehold.ward &&
        formData.newDistrict === selectedHousehold.district &&
        formData.newDistrictId === selectedHousehold.districtRelation.id) {
      toast.error('Địa chỉ mới phải khác địa chỉ hiện tại')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/households/${selectedHousehold.id}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newAddress: formData.newAddress,
          newStreet: formData.newStreet,
          newWard: formData.newWard,
          newDistrict: formData.newDistrict,
          newDistrictId: formData.newDistrictId,
          transferReason: formData.transferReason,
          transferDate: formData.transferDate
        })
      })

      if (response.ok) {
        toast.success('Chuyển hộ khẩu thành công!')
        router.push('/dashboard/households')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi chuyển hộ khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi chuyển hộ khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ArrowRightLeft className="h-8 w-8 text-navy-1" />
            Chuyển hộ khẩu
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Chuyển hộ khẩu sang địa chỉ mới
          </p>
        </div>
      </div>

      {/* Chọn hộ khẩu */}
      <HouseholdSelection
        households={households}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedHouseholdId={selectedHouseholdId}
        onHouseholdClick={handleHouseholdClick}
      />

      {/* Địa chỉ mới */}
      {selectedHousehold && (
        <TransferForm
          formData={formData}
          setFormData={setFormData}
          districts={districts}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      )}
    </div>
  )
}
