import { useState } from 'react'
import { Alert, Snackbar, Stack, Typography } from '@mui/material'
import { downloadTemplate, exportEmployeesCsv } from '../employees/csv'
import DeleteEmployeeDialog from '../employees/DeleteEmployeeDialog'
import EmployeeFilters from '../employees/EmployeeFilters'
import EmployeeFormDialog from '../employees/EmployeeFormDialog'
import EmployeeTable from '../employees/EmployeeTable'
import ImportEmployeesDialog from '../employees/ImportEmployeesDialog'
import SalaryHistoryDrawer from '../employees/SalaryHistoryDrawer'
import { useEmployees, useMetaFilters } from '../employees/useEmployees'

export default function EmployeesPage() {
  const { filters, setFilters, clearFilters, data, meta, loading, error, refresh } = useEmployees()
  const { meta: filterMeta, countries } = useMetaFilters()

  const [formOpen, setFormOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [historyEmployee, setHistoryEmployee] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' })

  function showSnack(message, severity = 'success') {
    setSnack({ open: true, message, severity })
  }

  function handleSort(column) {
    if (filters.sort === column) {
      setFilters({ dir: filters.dir === 'asc' ? 'desc' : 'asc' }, { resetPage: false })
    } else {
      setFilters({ sort: column, dir: 'asc' }, { resetPage: false })
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      await exportEmployeesCsv(filters)
      showSnack('Export downloaded')
    } catch (err) {
      showSnack(err.message || 'Export failed', 'error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Employees</Typography>

      <EmployeeFilters
        filters={filters}
        meta={filterMeta}
        onChange={(patch) => setFilters(patch)}
        onClear={clearFilters}
        onAdd={() => {
          setEditing(null)
          setFormOpen(true)
        }}
        onExport={handleExport}
        onImport={() => setImportOpen(true)}
        onDownloadTemplate={downloadTemplate}
        exporting={exporting}
      />


      <EmployeeTable
        rows={data}
        meta={meta}
        loading={loading}
        error={error}
        sort={filters.sort}
        dir={filters.dir}
        onSort={handleSort}
        onPageChange={(page) => setFilters({ page: String(page) }, { resetPage: false })}
        onPerPageChange={(perPage) => setFilters({ per_page: String(perPage), page: '1' })}
        onRetry={refresh}
        onEdit={(employee) => {
          setEditing(employee)
          setFormOpen(true)
        }}
        onDelete={setDeleting}
        onHistory={setHistoryEmployee}
        onRowClick={setHistoryEmployee}
      />

      <EmployeeFormDialog
        open={formOpen}
        employee={editing}
        countries={countries}
        departments={filterMeta.departments}
        jobTitles={filterMeta.job_titles}
        onClose={() => setFormOpen(false)}
        onSaved={(message) => {
          showSnack(message)
          refresh()
        }}
      />

      <DeleteEmployeeDialog
        open={Boolean(deleting)}
        employee={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={(message, severity = 'success') => {
          showSnack(message, severity)
          if (severity !== 'error') refresh()
        }}
      />

      <SalaryHistoryDrawer
        open={Boolean(historyEmployee)}
        employee={historyEmployee}
        onClose={() => setHistoryEmployee(null)}
      />

      <ImportEmployeesDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={(summary) => {
          showSnack(
            `Import finished — created ${summary.created}, updated ${summary.updated}, failed ${summary.failed}`,
          )
          refresh()
        }}
      />

      <Snackbar

        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}
