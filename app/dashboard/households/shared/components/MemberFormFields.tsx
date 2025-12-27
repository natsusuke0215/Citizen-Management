'use client'

interface Member {
  fullName: string
  relationship: string
  dateOfBirth: string
  gender: string
  idNumber: string
  origin: string
  ethnicity: string
  religion: string
  nationality: string
  education: string
}

interface MemberFormFieldsProps {
  member: Member
  index: number
  onUpdate: (index: number, field: string, value: string) => void
}

export default function MemberFormFields({ member, index, onUpdate }: MemberFormFieldsProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-3">Thành viên {index + 1}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="input"
            value={member.fullName}
            onChange={(e) => onUpdate(index, 'fullName', e.target.value)}
            placeholder="Nhập họ và tên"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quan hệ với chủ hộ <span className="text-red-500">*</span>
          </label>
          <select
            className="input"
            value={member.relationship}
            onChange={(e) => onUpdate(index, 'relationship', e.target.value)}
          >
            <option value="Chủ hộ">Chủ hộ</option>
            <option value="Vợ/Chồng">Vợ/Chồng</option>
            <option value="Con">Con</option>
            <option value="Cha/Mẹ">Cha/Mẹ</option>
            <option value="Anh/Chị/Em">Anh/Chị/Em</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="input"
            value={member.dateOfBirth}
            onChange={(e) => onUpdate(index, 'dateOfBirth', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <select
            className="input"
            value={member.gender}
            onChange={(e) => onUpdate(index, 'gender', e.target.value)}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số CCCD/CMND
          </label>
          <input
            type="text"
            className="input"
            value={member.idNumber}
            onChange={(e) => onUpdate(index, 'idNumber', e.target.value)}
            placeholder="Nhập số CCCD/CMND"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nguyên quán
          </label>
          <input
            type="text"
            className="input"
            value={member.origin}
            onChange={(e) => onUpdate(index, 'origin', e.target.value)}
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
            value={member.ethnicity}
            onChange={(e) => onUpdate(index, 'ethnicity', e.target.value)}
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
            value={member.religion}
            onChange={(e) => onUpdate(index, 'religion', e.target.value)}
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
            value={member.nationality}
            onChange={(e) => onUpdate(index, 'nationality', e.target.value)}
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
            value={member.education}
            onChange={(e) => onUpdate(index, 'education', e.target.value)}
            placeholder="Nhập trình độ học vấn"
          />
        </div>
      </div>
    </div>
  )
}

