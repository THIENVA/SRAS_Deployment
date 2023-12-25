import { useMemo } from 'react'

import MaterialReactTable from 'material-react-table'

import { Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

import { AppStyles } from '~/constants/colors'

const AvgReviewer = ({ tableData }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Submission Name',
                size: 300,
            },
            {
                accessorKey: 'number',
                header: 'Avg. Reviewers',
                size: 80,
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
            enableStickyFooter
            enableSorting
            enableRowNumbers
            enableHiding={false}
            enableDensityToggle={false}
            enableColumnResizing={false}
            enablePagination={false}
            enableBottomToolbar={false}
            renderTopToolbarCustomActions={() => {
                return (
                    <Typography
                        fontWeight={600}
                        sx={{
                            pt: 1.5,
                            color: grey[600],
                        }}
                        fontSize="0.9rem"
                    >
                        Average Reviewer Assignment
                    </Typography>
                )
            }}
            muiTableContainerProps={{
                sx: {
                    maxHeight: 400,
                },
            }}
            muiTableHeadCellProps={{
                sx: {
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                    ':last-child': {
                        borderRight: 'none',
                    },
                    fontSize: 14,
                },
            }}
            muiTableBodyCellProps={{
                sx: {
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                    ':last-child': {
                        borderRight: 'none',
                    },
                    fontSize: 14,
                },
            }}
            muiTableFooterCellProps={{ sx: { fontSize: 14 } }}
            muiTableBodyProps={{
                sx: () => ({
                    '& tr:nth-of-type(2n+1)': {
                        backgroundColor: AppStyles.colors['#F7F7F7'],
                    },
                }),
            }}
            initialState={{
                expanded: true,
                density: 'comfortable',
            }}
            displayColumnDefOptions={{
                'mrt-row-numbers': {
                    size: 1,
                },
            }}
        />
    )
}

export default AvgReviewer
