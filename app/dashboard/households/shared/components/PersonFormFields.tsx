'use client'

import { PersonFormData } from '../types'

interface PersonFormFieldsProps {
  formData: PersonFormData
  setFormData: (data: PersonFormData) => void
  showRegistrationDate?: boolean
}

export default function PersonFormFields({ formData, setFormData, showRegistrationDate = false }: PersonFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="input"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="Nhập họ và tên"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ngày sinh <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          required
          className="input"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Giới tính <span className="text-red-500">*</span>
        </label>
        <select
          required
          className="input"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        >
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quan hệ với chủ hộ
        </label>
        <select
          className="input"
          value={formData.relationship}
          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
        >
          <option value="">Chọn quan hệ</option>
          <option value="Chủ hộ">Chủ hộ</option>
          <option value="Vợ/Chồng">Vợ/Chồng</option>
          <option value="Con">Con</option>
          <option value="Cha/Mẹ">Cha/Mẹ</option>
          <option value="Anh/Chị/Em">Anh/Chị/Em</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      {showRegistrationDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày đăng ký thường trú <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            className="input"
            value={formData.registrationDate}
            onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
          />
          <p className="mt-1 text-xs text-gray-500">
            Ngày tháng năm đăng ký thường trú vào hộ khẩu này
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ thường trú trước khi chuyển đến
        </label>
        <input
          type="text"
          className="input"
          value={formData.previousAddress}
          onChange={(e) => setFormData({ ...formData, previousAddress: e.target.value })}
          placeholder='Nhập địa chỉ thường trú trước đây, nếu là con mới sinh có thể ghi "mới sinh"'
        />
        <p className="mt-1 text-xs text-gray-500">
          Nếu gia đình sinh thêm con tại địa chỉ hiện tại, bạn có thể ghi <span className="italic">"mới sinh"</span>.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nơi sinh
        </label>
        <input
          type="text"
          className="input"
          value={formData.placeOfBirth}
          onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
          placeholder="Nhập nơi sinh"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nguyên quán
        </label>
        <input
          type="text"
          className="input"
          value={formData.origin}
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          placeholder="Nhập nguyên quán"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dân tộc
        </label>
        <input
          type="text"
          className="input"
          value={formData.ethnicity}
          onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
          placeholder="Nhập dân tộc"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tôn giáo
        </label>
        <input
          type="text"
          className="input"
          value={formData.religion}
          onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
          placeholder="Nhập tôn giáo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quốc tịch
        </label>
        <input
          type="text"
          className="input"
          value={formData.nationality}
          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
          placeholder="Nhập quốc tịch"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trình độ học vấn
        </label>
        <input
          type="text"
          className="input"
          value={formData.education}
          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
          placeholder="Nhập trình độ học vấn"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nghề nghiệp
        </label>
        <input
          type="text"
          className="input"
          value={formData.occupation}
          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
          placeholder="Nhập nghề nghiệp"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nơi làm việc
        </label>
        <input
          type="text"
          className="input"
          value={formData.workplace}
          onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
          placeholder="Nhập nơi làm việc"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Loại giấy tờ
        </label>
        <select
          className="input"
          value={formData.idType}
          onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
        >
          <option value="CCCD">CCCD</option>
          <option value="CMND">CMND</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số CCCD/CMND
        </label>
        <input
          type="text"
          className="input"
          value={formData.idNumber}
          onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
          placeholder="Nhập số CCCD/CMND"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ngày cấp
        </label>
        <input
          type="date"
          className="input"
          value={formData.idIssueDate}
          onChange={(e) => setFormData({ ...formData, idIssueDate: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nơi cấp
        </label>
        <input
          type="text"
          className="input"
          value={formData.idIssuePlace}
          onChange={(e) => setFormData({ ...formData, idIssuePlace: e.target.value })}
          placeholder="Nhập nơi cấp"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú
        </label>
        <textarea
          className="input"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Nhập ghi chú (nếu có)"
        />
      </div>
    </div>
  )
}

