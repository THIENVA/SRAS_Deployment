import { useMemo } from 'react'

import { cloneDeep } from 'lodash'
import MaterialReactTable from 'material-react-table'

import { Box, Checkbox } from '@mui/material'

import TitleSection from '../TitleSection'

const CheckPresenters = ({ listChecked, setListChecked, presenterIds, loading }) => {
    const handleCheckChange = (row) => {
        const position = presenterIds.findIndex((id) => id === row.original.participantId)
        if (position === -1) {
            setListChecked((prev) => [...prev, row.original.participantId])
        } else {
            const updatedPresenterIds = cloneDeep(presenterIds)
            updatedPresenterIds.splice(position, 1)
            setListChecked(updatedPresenterIds)
        }
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'fullName',
                header: 'Full Name',
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return (
        <Box mb={2}>
            <TitleSection>CHECK PRESENTERS</TitleSection>
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
                                onChange={() => handleCheckChange(row)}
                                checked={presenterIds.includes(row.original.participantId)}
                                sx={{ mr: 1.5 }}
                            />
                        </Box>
                    )
                }}
                initialState={{
                    density: 'compact',
                }}
                state={{ isLoading: loading }}
            />
        </Box>
    )
}

export default CheckPresenters
