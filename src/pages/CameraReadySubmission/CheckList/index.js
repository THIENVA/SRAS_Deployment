import { useMemo } from 'react'

import { cloneDeep } from 'lodash'
import MaterialReactTable from 'material-react-table'

import { Box, Checkbox } from '@mui/material'

import TitleSection from '../TitleSection'

const CheckList = ({ listChecked, setListChecked }) => {
    const handleCheckChange = (event, row) => {
        const index = row.index
        const updatedTableData = cloneDeep(listChecked)
        updatedTableData[index].isChecked = event.target.checked
        setListChecked(updatedTableData)
    }

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
                enableBottomToolbar={false}
                enableRowActions
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
                renderRowActions={({ row }) => {
                    return (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <Checkbox
                                size="medium"
                                name="isCorrect"
                                onChange={(event) => handleCheckChange(event, row)}
                                checked={row.original.isChecked}
                                sx={{ mr: 1.5 }}
                            />
                        </Box>
                    )
                }}
                initialState={{
                    density: 'compact',
                }}
            />
        </Box>
    )
}

export default CheckList
