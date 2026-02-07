'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Split } from 'lucide-react'
import toast from 'react-hot-toast'
import { useHouseholds } from '../shared/hooks/useHouseholds'
import { filterHouseholds } from '../shared/utils/filterUtils'
import { Household } from '../shared/types'
import HouseholdSearch from '../shared/components/HouseholdSearch'
import SelectedHouseholdInfo from '../shared/components/SelectedHouseholdInfo'
import PersonSelection from './components/PersonSelection'
import NewHouseholdForm from './components/NewHouseholdForm'

export default function SplitHouseholdPage() {
  const router = useRouter()
  const { households } = useHouseholds()
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('')
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  const [selectedPersons, setSelectedPersons] = useState<Set<string>>(new Set())
  const [personRelationships, setPersonRelationships] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    newHouseholdId: '',
    ownerName: '',
    address: '',
    street: '',
    ward: '',
    district: '',
    splitReason: '',
    splitDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (selectedHouseholdId) {
      const household = households.find(h => h.id === selectedHouseholdId)
      setSelectedHousehold(household || null)
      setSelectedPersons(new Set())
      setPersonRelationships({})
      if (household) {
        setFormData(prev => ({
          ...prev,
          ward: household.ward,
          district: household.district,
          ownerName: '',
          newHouseholdId: '' // Reset để tự động điền
        }))
        
        // Tự động tìm và điền số hộ khẩu mới
        const fetchNextHouseholdId = async () => {
          try {
            const response = await fetch('/api/households/next-id', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ oldHouseholdId: household.householdId })
            })

            if (response.ok) {
              const data = await response.json()
              setFormData(prev => ({
                ...prev,
                newHouseholdId: data.newHouseholdId
              }))
            } else {
              console.error('Không thể tìm số hộ khẩu mới')
            }
          } catch (error) {
            console.error('Lỗi khi tìm số hộ khẩu mới:', error)
          }
        }

        fetchNextHouseholdId()
      }
    } else {
      setSelectedHousehold(null)
    }
  }, [selectedHouseholdId, households])

  // Auto-fill owner name when someone is set as "Chủ hộ"
  useEffect(() => {
    if (!selectedHousehold) return

    const householdHeadPersonId = Object.keys(personRelationships).find(
      personId => personRelationships[personId] === 'Chủ hộ'
    )

    if (householdHeadPersonId) {
      const person = selectedHousehold.persons.find(p => p.id === householdHeadPersonId)
      if (person) {
        setFormData(prev => ({
          ...prev,
          ownerName: person.fullName
        }))
      }
    }
  }, [personRelationships, selectedHousehold])

  const filteredHouseholds = filterHouseholds(households, searchTerm)

  const togglePersonSelection = (personId: string) => {
    const newSelected = new Set(selectedPersons)
    if (newSelected.has(personId)) {
      newSelected.delete(personId)
      const newRelationships = { ...personRelationships }
      delete newRelationships[personId]
      setPersonRelationships(newRelationships)
    } else {
      newSelected.add(personId)
    }
    setSelectedPersons(newSelected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedHousehold) {
      toast.error('Vui lòng chọn hộ khẩu cần tách')
      return
    }

    if (selectedPersons.size === 0) {
      toast.error('Vui lòng chọn ít nhất một thành viên để tách')
      return
    }

    if (!formData.newHouseholdId || !formData.ownerName || !formData.address || 
        !formData.ward || !formData.district) {
      toast.error('Vui lòng điền đầy đủ thông tin hộ khẩu mới')
      return
    }

    setLoading(true)

    try {
      const personIds = Array.from(selectedPersons)
      
      const response = await fetch(`/api/households/${selectedHousehold.id}/split`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newHouseholdId: formData.newHouseholdId,
          ownerName: formData.ownerName,
          address: formData.address,
          street: formData.street,
          ward: formData.ward,
          district: formData.district,
          personIds: personIds,
          personRelationships: personRelationships,
          splitReason: formData.splitReason,
          splitDate: formData.splitDate
        })
      })

      if (response.ok) {
        toast.success('Tách hộ khẩu thành công!')
        router.push('/dashboard/households')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi tách hộ khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tách hộ khẩu')
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
            <Split className="h-8 w-8 text-navy-1" />
            Tách hộ khẩu
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Chọn hộ khẩu và thành viên để tách thành hộ khẩu mới
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chọn hộ khẩu */}
        <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
              <Split className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Chọn hộ khẩu cần tách</h2>
          </div>
          
          <HouseholdSearch
            households={filteredHouseholds}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedHouseholdId={selectedHouseholdId}
            onSelectHousehold={setSelectedHouseholdId}
          />

          {selectedHousehold && <SelectedHouseholdInfo household={selectedHousehold} />}
        </div>

        {/* Chọn thành viên */}
        {selectedHousehold && (
          <PersonSelection
            household={selectedHousehold}
            selectedPersons={selectedPersons}
            personRelationships={personRelationships}
            onTogglePerson={togglePersonSelection}
            onUpdateRelationship={(personId, relationship) => {
              setPersonRelationships(prev => ({
                ...prev,
                [personId]: relationship
              }))
            }}
          />
        )}

        {/* Thông tin hộ khẩu mới */}
        {selectedHousehold && selectedPersons.size > 0 && (
          <NewHouseholdForm
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all duration-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || !selectedHousehold || selectedPersons.size === 0}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center"
          >
            <Split className="h-4 w-4 mr-2" />
            {loading ? 'Đang xử lý...' : 'Xác nhận tách hộ'}
          </button>
        </div>
      </form>
    </div>
  )
}


