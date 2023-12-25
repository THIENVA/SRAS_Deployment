import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { AppStyles } from '~/constants/colors'

const columns = [
    { id: 'option', label: 'Option', minWidth: 170, align: 'left' },
    { id: 'earlyRefistration', label: 'Early Registration', minWidth: 100, align: 'left' },
    { id: 'regularRegistration', label: 'Regular Registration', minWidth: 100, align: 'left' },
]

export default function TablePrice(props) {
    const dataSettings = props.dataSettings

    function createDataOption(data) {
        const option = data.option
        const regularRegistration =
            parseFloat(data.regularRegistration ? data.regularRegistration : 0)
                .toLocaleString()
                .replace(/,/g, '.') + ' VND'
        const earlyRefistration = data.earlyRegistration
            ? parseFloat(data.earlyRegistration ? data.earlyRegistration : 0)
                  .toLocaleString()
                  .replace(/,/g, '.') + ' VND'
            : ''
        return { option, earlyRefistration, regularRegistration }
    }
    // function createDataCharge(data, index) {
    //     const option = data.option
    //     const regularRegistration = '$' + data.regularRegistration
    //     const earlyRefistration = '$' + data.earlyRegistration
    //     return { option, earlyRefistration, regularRegistration }
    // }

    const rowsOption =
        dataSettings && dataSettings.rows && dataSettings.rows.length > 0
            ? dataSettings.rows.slice(dataSettings.length).map((data, index) => {
                  return createDataOption(data, index)
              })
            : []
    // const rowsCharge =
    //     dataSettings && dataSettings.rows && dataSettings.rows.length > 0
    //         ? dataSettings.rows.slice(-3).map((data, index) => {
    //               return createDataCharge(data, index)
    //           })
    //         : []
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 550 }}>
                <Table aria-label="sticky table">
                    <TableHead sx={{ background: 'rgb(34 197 94)' }}>
                        <TableRow
                            sx={{
                                'td, th': {
                                    borderRight: `1px solid ${AppStyles.colors['#ddd']}`,
                                    py: 1,
                                    px: 2,
                                },
                            }}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        fontWeight: 'bold',
                                        color: AppStyles.colors['#F7F7F7'],
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowsOption.length > 0
                            ? rowsOption.map((row, index) => {
                                  return (
                                      <TableRow
                                          sx={{
                                              padding: '0px',
                                              height: '30px',
                                              'td, th': {
                                                  borderRight: `1px solid ${AppStyles.colors['#ddd']}`,
                                              },
                                          }}
                                          hover
                                          key={index}
                                      >
                                          {columns.map((column) => {
                                              const value = row[column.id]
                                              return (
                                                  <TableCell key={column.id} align={column.align}>
                                                      {column.format && typeof value === 'number'
                                                          ? column.format(value)
                                                          : value}
                                                  </TableCell>
                                              )
                                          })}
                                      </TableRow>
                                  )
                              })
                            : null}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
