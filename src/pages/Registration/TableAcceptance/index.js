import CheckIcon from '@mui/icons-material/Check'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { AppStyles } from '~/constants/colors'

const columns = [
    { id: 'stt', label: 'Stt', minWidth: 100, align: 'left' },
    { id: 'title', label: 'Title', minWidth: 100, align: 'left' },
    { id: 'check', label: 'Check', minWidth: 100, align: 'left' },
]

export default function TableAcceptance(props) {
    const ListFilterDrop = props.ListFilterDrop
    const dataRegistrablePapers = props.dataRegistrablePapers
    function createDataOption(data, index) {
        const stt = index + 1
        const title = data.submissionTitle
        const check = ListFilterDrop.map((item, index) => {
            if (item == data.submissionId) {
                return <CheckIcon key={index} />
            }
        })
        return { stt, title, check }
    }
    const rowsOption =
        dataRegistrablePapers &&
        dataRegistrablePapers.registrablePapers &&
        dataRegistrablePapers.registrablePapers.length > 0
            ? dataRegistrablePapers.registrablePapers.map((data, index) => {
                  return createDataOption(data, index)
              })
            : []
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 550 }}>
                <Table>
                    <TableHead sx={{ background: 'rgb(96 165 250)' }}>
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
                        {rowsOption.map((row, index) => {
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
                                    role="checkbox"
                                    tabIndex={-1}
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
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
