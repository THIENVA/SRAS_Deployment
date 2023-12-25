import { useMemo } from 'react'

import MaterialReactTable from 'material-react-table'

import { Box, Typography } from '@mui/material'

const StatusTable = ({ tableData, trackName }) => {
    const totalSubmissions = tableData.reduce((total, item) => total + item.numberOfSubmissions, 0)
    const totalEmails = tableData.reduce((total, item) => total + item.numberOfEmail, 0)

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Paper Status',
                size: 200,
            },
            {
                accessorKey: 'numberOfSubmissions',
                header: 'Number of Submissions',
                size: 200,
            },
            {
                accessorKey: 'numberOfEmail',
                header: 'Number of Emails to Send',
                size: 200,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )
    return (
        <MaterialReactTable
            columns={columns}
            data={tableData}
            enableStickyHeader
            enableColumnResizing
            positionToolbarAlertBanner="bottom"
            enableToolbarInternalActions={false}
            enablePagination={false}
            enableSorting={false}
            enableColumnActions={false}
            enableColumnFilters={false}
            muiTableHeadCellProps={{
                sx: {
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                    ':last-child': {
                        borderRight: 'none',
                    },
                    fontSize: 16,
                },
            }}
            muiTableBodyCellProps={{
                sx: {
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                    ':last-child': {
                        borderRight: 'none',
                    },
                    fontSize: 16,
                },
            }}
            initialState={{
                expanded: true,
                density: 'compact',
            }}
            displayColumnDefOptions={{
                'mrt-row-select': {
                    size: 2,
                },
            }}
            renderBottomToolbar={() => (
                <Box sx={{ display: 'flex', py: 2, px: 5, justifyContent: 'flex-end' }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                        Total Submission:{' '}
                        <Typography component="span" sx={{ fontSize: 16, fontWeight: 'none' }}>
                            {totalSubmissions}
                        </Typography>
                    </Typography>

                    <Typography sx={{ ml: 4, fontSize: 16, fontWeight: 'bold' }}>
                        Total Emails Send{' '}
                        <Typography component="span" sx={{ fontSize: 16, fontWeight: 'none' }}>
                            {totalEmails}
                        </Typography>
                    </Typography>
                </Box>
            )}
            renderTopToolbarCustomActions={() => {
                return <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>{trackName}</Typography>
            }}
        />
    )
}

export default StatusTable
