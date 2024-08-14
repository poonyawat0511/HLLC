<template>
  <v-list-item @click="downloadForm()">
    <v-list-item-title>
      <v-icon>mdi-download</v-icon>
      Download user form
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import * as XLSX from 'xlsx'
const downloadForm = () => {
  if (confirm('Are you sure you want to download template file')) {
    const headers: string[] = ['studentId', 'first', 'last', 'major']

    headersToExcel(headers)
  }
}

const headersToExcel = (headers: string[]) => {
  const workbook = XLSX.utils.book_new()
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers])
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })
  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }

  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'hllc-users.xlsx'
  document.body.appendChild(a)
  a.click()

  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
</script>
