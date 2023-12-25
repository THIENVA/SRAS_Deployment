import { useMemo } from 'react'

import MaterialReactTable from 'material-react-table'
import { useHistory } from 'react-router-dom'

import { Typography } from '@mui/material'

const StatusTable = ({ tableData, trackName }) => {
    const history = useHistory()
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Paper Status',
                size: 200,
            },
            // {
            //     header: ' ',
            //     size: 200,
            //     Cell: () => {
            //         return (
            //             <Typography sx={{ fontSize: 16 }}>
            //                 View on{' '}
            //                 <Typography
            //                     component="span"
            //                     sx={{
            //                         fontSize: 16,
            //                         color: AppStyles.colors['#027A9D'],
            //                         ':hover': {
            //                             textDecoration: 'underline',
            //                         },
            //                         cursor: 'pointer',
            //                     }}
            //                     onClick={() => history.push(`/conferences/${1}/email-history`)}
            //                 >
            //                     email history
            //                 </Typography>{' '}
            //                 page.
            //             </Typography>
            //         )
            //     },
            // },
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
            enableBottomToolbar={false}
            enablePagination={false}
            enableToolbarInternalActions={false}
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
            renderTopToolbarCustomActions={() => {
                return <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>{trackName}</Typography>
            }}
        />
    )
}

export default StatusTable
