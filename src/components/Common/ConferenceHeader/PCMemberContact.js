import React, { useEffect, useMemo, useState } from 'react'

import MaterialReactTable from 'material-react-table'

import { Box, CircularProgress, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useConference } from '~/api/common/conference'
import { AppStyles } from '~/constants/colors'

const PCMemberContact = ({ open, handleClose, conferenceID }) => {
    const [dashboardDetails, setDashboardDetails] = useState({})
    const { getDashboardSummaryAndPC } = useConference()
    const [isLoading, setLoading] = useState(true)
    const { conferenceId } = useParams()
    const showSnackbar = useSnackbar()
    const conferenceIdUsed = conferenceID ? conferenceID : conferenceId

    useEffect(() => {
        const controller = new AbortController()
        if (conferenceIdUsed) {
            getDashboardSummaryAndPC(conferenceIdUsed, controller.signal)
                .then((response) => {
                    const data = response.data
                    setDashboardDetails(data)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later.',
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        }

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceIdUsed])

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
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'PC Member Contacts'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="lg"
        >
            <Box>
                <Box display="flex" justifyContent="center">
                    {isLoading ? (
                        <CircularProgress thickness={4} />
                    ) : (
                        <MaterialReactTable
                            columns={columns}
                            data={dashboardDetails.pcChairs ? dashboardDetails.pcChairs : []}
                            enableStickyHeader
                            enableSorting
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
                        />
                    )}
                </Box>
            </Box>
        </ModalInfo>
    )
}

export default PCMemberContact
