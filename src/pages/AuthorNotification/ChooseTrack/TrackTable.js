import { useMemo } from 'react'

import MaterialReactTable from 'material-react-table'

const TrackTable = ({ tableData, setRowSelection, rowSelection }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'trackName',
                header: 'Track',
                size: 80,
            },
            {
                accessorKey: 'numOfSubmissions',
                header: '	Number of Submissions',
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
            enableColumnResizing
            enableRowSelection
            enableMultiRowSelection={false}
            enableTopToolbar={false}
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
            onRowSelectionChange={setRowSelection}
            state={{ rowSelection }}
        />
    )
}

export default TrackTable
