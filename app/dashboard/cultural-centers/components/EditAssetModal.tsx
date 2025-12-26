'use client'

import { memo, useState } from 'react'
import { X, Save, CheckCircle, Wrench, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Asset } from '../types'

interface EditAssetModalProps {
  asset: Asset
  centerId: string
  onClose: () => void
  onUpdate: () => void
}

function EditAssetModal({ asset, centerId, onClose, onUpdate }: EditAssetModalProps) {
  const [formData, setFormData] = useState<Partial<Asset>>({
    name: asset.name,
    category: asset.category || '',
    quantity: asset.quantity,
    condition: asset.condition,
    goodQuantity: asset.goodQuantity,
    repairingQuantity: asset.repairingQuantity,
    poorQuantity: asset.poorQuantity,
    damagedQuantity: asset.damagedQuantity,
    location: asset.location || '',
    imageUrl: asset.imageUrl || '',
    notes: asset.notes || ''
  })

  const handleUpdate = async () => {
    try {
      // Validate total
      const goodQty = formData.goodQuantity || 0
      const repairingQty = formData.repairingQuantity || 0
      const brokenQty = (formData.poorQuantity || 0) + (formData.damagedQuantity || 0)
      const total = goodQty + repairingQty + brokenQty
      
      if (total !== formData.quantity) {
        toast.error(`Tổng số lượng các trạng thái (${total}) phải bằng tổng số lượng thiết bị (${formData.quantity})`)
        return
      }

      const response = await fetch(`/api/cultural-centers/${centerId}/assets/${asset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Cập nhật thiết bị thành công')
        onUpdate()
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật thiết bị')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thiết bị')
    }
  }

  const currentTotal = (formData.goodQuantity || 0) + (formData.repairingQuantity || 0) + ((formData.poorQuantity || 0) + (formData.damagedQuantity || 0))
  const isTotalMismatch = currentTotal !== formData.quantity

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-[20px] shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa thiết bị</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên thiết bị</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tổng số lượng</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng chung</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
              >
                <option value="GOOD">Tốt</option>
                <option value="FAIR">Khá</option>
                <option value="POOR">Kém</option>
                <option value="DAMAGED">Hỏng</option>
              </select>
            </div>
            <div className="bg-blue-50 rounded-[8px] p-4 border border-blue-200 mb-4">
              <div className="text-sm font-medium text-blue-900 mb-2">⚠️ Lưu ý: Tổng số lượng các trạng thái phải bằng tổng số lượng thiết bị</div>
              <div className="text-xs text-blue-700">
                Tổng hiện tại: {currentTotal} / {formData.quantity}
                {isTotalMismatch && (
                  <span className="text-red-600 font-semibold"> (Không khớp!)</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Số lượng tốt
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.quantity}
                  value={formData.goodQuantity || ''}
                  onChange={(e) => setFormData({ ...formData, goodQuantity: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Wrench className="h-4 w-4 text-purple-600" />
                  Số lượng đang sửa chữa
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.quantity}
                  value={formData.repairingQuantity || ''}
                  onChange={(e) => setFormData({ ...formData, repairingQuantity: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Số lượng hỏng/kém
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    min="0"
                    max={formData.quantity}
                    value={(formData.poorQuantity || 0) + (formData.damagedQuantity || 0)}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : 0
                      const currentTotal = (formData.poorQuantity || 0) + (formData.damagedQuantity || 0)
                      const damagedRatio = currentTotal > 0 ? (formData.damagedQuantity || 0) / currentTotal : 0.5
                      setFormData({ 
                        ...formData, 
                        damagedQuantity: value > 0 ? Math.round(value * damagedRatio) : null,
                        poorQuantity: value > 0 ? value - Math.round(value * damagedRatio) : null
                      })
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Tổng hỏng/kém"
                  />
                  <div className="flex gap-2 text-xs">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Hỏng</label>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={formData.damagedQuantity || ''}
                        onChange={(e) => {
                          const damaged = e.target.value ? parseInt(e.target.value) : null
                          const totalBroken = (formData.poorQuantity || 0) + (formData.damagedQuantity || 0)
                          const newTotal = damaged || 0
                          setFormData({ 
                            ...formData, 
                            damagedQuantity: damaged,
                            poorQuantity: totalBroken - newTotal > 0 ? totalBroken - newTotal : null
                          })
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Kém</label>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={formData.poorQuantity || ''}
                        onChange={(e) => {
                          const poor = e.target.value ? parseInt(e.target.value) : null
                          const totalBroken = (formData.poorQuantity || 0) + (formData.damagedQuantity || 0)
                          const newTotal = poor || 0
                          setFormData({ 
                            ...formData, 
                            poorQuantity: poor,
                            damagedQuantity: totalBroken - newTotal > 0 ? totalBroken - newTotal : null
                          })
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đường dẫn hình ảnh</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="/assets/images/center/ten-file.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Ví dụ: /assets/images/center/loa-bluetooth.jpg</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 bg-navy-1 text-white rounded-[8px] font-medium hover:bg-navy-2 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Lưu thay đổi
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-[8px] font-medium hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(EditAssetModal)

