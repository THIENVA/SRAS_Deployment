import React, { useMemo } from 'react'

import MaterialReactTable from 'material-react-table'

import { Box, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ProgramCommittee = ({ tableData }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'pcChairFullName',
                header: 'Full Name',
                size: 200,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 300,
            },
            {
                accessorKey: 'organization',
                header: 'Organization',
            },
            {
                accessorKey: 'country',
                header: 'Country',
                size: 100,
            },
            {
                accessorKey: 'roles',
                header: 'Position',
                Cell: ({ row }) => {
                    return (
                        <Box display="flex" flexDirection="column">
                            {row.original.roles.map((value, index) => (
                                <Typography key={index}>
                                    {value.roleName} {value.trackName && '  ( ' + value.trackName + ' ) '}
                                </Typography>
                            ))}
                        </Box>
                    )
                },
                size: 200,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )
    return (
        <Box
            sx={{
                boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                mt: 3,
            }}
            borderRadius={2}
        >
            <Box sx={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,.08)' }}>
                <Box py={2} px={3}>
                    <Typography sx={{ fontSize: 16, color: AppStyles.colors['#002b5d'], fontWeight: 600 }}>
                        ORGANIZING COMMITTEE
                    </Typography>
                </Box>
            </Box>
            <Box>
                <MaterialReactTable
                    columns={columns}
                    data={tableData}
                    enableStickyHeader
                    enableSorting
                    enableRowNumbers
                    enableHiding={false}
                    enableDensityToggle={false}
                    enableColumnResizing={false}
                    enablePagination={false}
                    enableBottomToolbar={false}
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
                    muiTableFooterCellProps={{ sx: { fontSize: 16 } }}
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
                />
            </Box>
        </Box>
    )
}

export default ProgramCommittee
