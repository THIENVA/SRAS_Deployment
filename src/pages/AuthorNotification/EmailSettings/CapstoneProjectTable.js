import React, { useMemo } from 'react'

import MaterialReactTable from 'material-react-table'

import { MenuItem, Typography } from '@mui/material'

const CapstoneProjectTable = ({
    tableData,
    setRowSelection,
    rowSelection,
    handleSaveCell,
    handleOpenCreateModal,
    handleOpenUpdateModal,
    templateData,
    trackName,
}) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Paper Status',
                size: 200,
                enableEditing: false,
            },
            {
                accessorKey: 'templateId',
                header: 'Email Template',
                size: 400,
                editVariant: 'select',
                muiTableBodyCellEditTextFieldProps: () => ({
                    children: templateData.map((option) => (
                        <MenuItem key={option.templateId} value={option.templateId}>
                            {option.templateName}
                        </MenuItem>
                    )),
                    select: true,
                }),
            },
            // {
            //     header: 'Actions',
            //     rowSpan: 5,
            //     Cell: () => (
            //         <React.Fragment>
            //             <Box display="flex" flexDirection="column">
            //                 {templateData.length !== 0 && (
            //                     <Button
            //                         variant="text"
            //                         sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
            //                         startIcon={<Subject />}
            //                         onClick={() => handleOpenUpdateModal()}
            //                     >
            //                         Edit Templates
            //                     </Button>
            //                 )}
            //                 <Button
            //                     variant="text"
            //                     sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
            //                     startIcon={<Add />}
            //                     onClick={() => handleOpenCreateModal()}
            //                 >
            //                     Create New Templates
            //                 </Button>
            //             </Box>
            //         </React.Fragment>
            //     ),
            //     size: 100,
            //     muiTableBodyCellProps: {
            //         align: 'center',
            //     },
            //     enableEditing: false,
            // },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [templateData]
    )
    return (
        <React.Fragment>
            {/* <Box mb={1} display="flex">
                <Button
                    variant="text"
                    sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                    startIcon={<Add />}
                    onClick={() => handleOpenCreateModal()}
                >
                    Create New Templates
                </Button>
                {templateData.length !== 0 && (
                    <Button
                        variant="text"
                        sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none', ml: 2 }}
                        startIcon={<Subject />}
                        onClick={() => handleOpenUpdateModal()}
                    >
                        Edit Templates
                    </Button>
                )}
            </Box> */}
            <MaterialReactTable
                columns={columns}
                data={tableData}
                enableStickyHeader
                enableColumnResizing
                enableRowSelection
                enablePagination={false}
                enableBottomToolbar={false}
                enableToolbarInternalActions={false}
                enableSorting={false}
                enableColumnActions={false}
                enableColumnFilters={false}
                positionToolbarAlertBanner="bottom"
                editingMode="table"
                enableEditing
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
                muiTableBodyCellEditTextFieldProps={({ cell }) => ({
                    onBlur: (event) => {
                        handleSaveCell(cell, event.target.value)
                    },
                    variant: 'outlined',
                })}
                renderTopToolbarCustomActions={() => {
                    return (
                        <Typography sx={{ fontSize: 16 }}>
                            <strong>Track:</strong> {trackName}
                        </Typography>
                    )
                }}
            />
        </React.Fragment>
    )
}

export default CapstoneProjectTable
