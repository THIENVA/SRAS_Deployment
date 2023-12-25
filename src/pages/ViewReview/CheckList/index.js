import { useMemo } from 'react'

import MaterialReactTable from 'material-react-table'

import { Box } from '@mui/material'

import TitleSection from '../TitleSection'

const CheckList = ({ listChecked }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return (
        <Box mb={2}>
            <TitleSection>CHECK LIST</TitleSection>
            <MaterialReactTable
                columns={columns}
                data={listChecked}
                enableStickyHeader
                enableRowNumbers
                enableBottomToolbar={false}
                enableColumnActions={false}
                enableTopToolbar={false}
                enableFilters={false}
                enableSorting={false}
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
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        header: 'Check',
                        size: 1,
                    },
                }}
                initialState={{
                    density: 'compact',
                }}
            />
        </Box>
    )
}

export default CheckList
