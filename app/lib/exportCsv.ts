'use client'

export function exportBookingsToCsv(filename: string, bookings: any[]) {
  if (!bookings || bookings.length === 0) {
    const csvEmpty = 'No data'
    const blob = new Blob([csvEmpty], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    return
  }

  const headers = ['Tiêu đề', 'Nhà văn hóa', 'Thời gian bắt đầu', 'Thời gian kết thúc', 'Số tiền', 'Trạng thái']
  const rows = bookings.map(b => [
    `"${(b.title || '').replace(/"/g, '""')}"`,
    `"${(b.culturalCenter?.name || '').replace(/"/g, '""')}"`,
    `"${b.startTime}"`,
    `"${b.endTime}"`,
    `${typeof b.fee === 'number' ? b.fee : 0}`,
    `"${b.feePaid ? 'Thành công' : (b.status === 'REJECTED' ? 'Thất bại' : 'Chờ')}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
}


