import { useEffect, useMemo, useState } from 'react'

import MaterialReactTable from 'material-react-table'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { ArrowDropDown } from '@mui/icons-material'
import { Box, Button, MenuItem as MenuItemMUI, Select, Skeleton, Typography } from '@mui/material'
import SyncComponent from '~/components/SyncComponent'

import ConferenceDetail from '../ConferenceDetail'
import DataTable from './DataTable'

import { Menu, MenuItem } from '@szhsin/react-menu'
import { useReviewer } from '~/api/common/reviewer'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'
import { formatDateTime } from '~/utils/commonFunction'

const ManageReviewerInvite = () => {
    const [sync, setSync] = useState(uuid())
    const { conferenceId } = useParams()
    const { getManageInvite } = useReviewer()
    const history = useHistory()
    const [statisticInvite, setStatisticInvite] = useState({})
    const [tableData, setTableData] = useState([])
    const [sorting, setSorting] = useState([])
    const [status, setStatus] = useState('')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    })
    const { pageIndex, pageSize } = pagination
    const [globalFilter, setGlobalFilter] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isRefetching, setIsRefetching] = useState(false)
    const handleChangeStatus = (event) => {
        setStatus(event)
    }
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        if (conferenceId) {
            if (!tableData.length) {
                setIsLoading(true)
            } else {
                setIsRefetching(true)
            }
            const params = {
                InclusionText: globalFilter,
                ConferenceId: conferenceId,
                SkipCount: pageIndex * pageSize,
                MaxResultCount: pageSize,
                Sorting: sorting[0]?.id,
                SortedAsc: !sorting[0]?.desc,
                status: status,
            }
            getManageInvite(params, signal)
                .then((response) => {
                    const data = response.data
                    setStatisticInvite(data)
                    setTableData(data.items ? data.items : [])
                    setTotalCount(data ? data?.totalCount : 0)
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                })
                .finally(() => {
                    setIsLoading(false)
                    setIsRefetching(false)
                })
        }

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, globalFilter, sorting, sync, status])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'firstName',
                header: 'First Name',
                enableEditing: false,
                enableColumnFilter: false,
            },
            {
                accessorKey: 'lastName',
                header: 'Last Name',
                enableEditing: false,
                enableColumnFilter: false,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                enableEditing: false,
                enableColumnFilter: false,
            },
            {
                accessorKey: 'organization',
                header: 'Organization',
                enableEditing: false,
                enableColumnFilter: false,
            },

            {
                accessorKey: 'sentTime',
                header: 'Sent Time',
                enableEditing: false,
                Cell: ({ row }) => (
                    <Typography sx={{ fontSize: 14 }}>
                        {row.original.sentTime && formatDateTime(row.original.sentTime)}
                    </Typography>
                ),
                enableColumnFilter: false,
            },
            {
                accessorKey: 'expirationTime',
                header: 'Expires Time',
                enableEditing: false,
                Cell: ({ row }) => (
                    <Typography sx={{ fontSize: 14 }}>
                        {row.original.expirationTime && formatDateTime(row.original.expirationTime)}
                    </Typography>
                ),
                enableColumnFilter: false,
            },
            {
                accessorKey: 'trackName',
                header: 'Track',
                enableEditing: false,
                enableColumnFilter: false,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Filter: () => (
                    <Select
                        fullWidth
                        variant="standard"
                        size="small"
                        onChange={(event) => handleChangeStatus(event.target.value)}
                        value={status}
                        style={{ textAlign: 'center' }}
                    >
                        <MenuItemMUI value={''} sx={{ fontStyle: 'italic' }}>
                            None
                        </MenuItemMUI>

                        <MenuItemMUI value={'Not responsed'}>Not responsed</MenuItemMUI>
                        <MenuItemMUI value={'Accepted'}>Accepted</MenuItemMUI>
                        <MenuItemMUI value={'Reject'}>Reject</MenuItemMUI>
                        <MenuItemMUI value={'Expired'}>Expired</MenuItemMUI>
                    </Select>
                ),
                Cell: ({ row }) => {
                    return (
                        <Typography
                            sx={{
                                fontWeight: 500,
                                color: AppStyles.colors['#027A9D'],
                            }}
                        >
                            {row.original.status}
                        </Typography>
                    )
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [status]
    )
    return (
        <ConferenceDetail>
            <Box width={ScreenSize.ScreenWidth} m="0 auto">
                <Box mb={2} display="flex" justifyContent="space-between">
                    <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                        Manage Reviewer Invites
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Menu
                            align={'end'}
                            menuButton={
                                <Button
                                    sx={{
                                        height: 36,
                                        textTransform: 'none',
                                        border: '1px solid #0077CC',
                                        backgroundImage: 'linear-gradient(#42A1EC, #0070C9)',
                                        borderRadius: 1,
                                        color: AppStyles.colors['#FFFFFF'],
                                        fontWeight: 500,
                                        padding: '4px 15px',
                                        ':hover': {
                                            backgroundImage: 'linear-gradient(#51A9EE, #147BCD)',
                                            borderColor: '#1482D0',
                                            textDecoration: 'none',
                                        },
                                        ':active': {
                                            backgroundImage: 'linear-gradient(#3D94D9, #0067B9)',
                                            borderColor: '#006DBC',
                                            outline: 'none',
                                        },
                                        ':focus': {
                                            boxShadow: 'rgba(131, 192, 253, 0.5) 0 0 0 3px',
                                            outline: 'none',
                                        },
                                    }}
                                >
                                    <Typography> Actions</Typography>
                                    <ArrowDropDown fontSize="medium" sx={{ color: AppStyles.colors['#FFFFFF'] }} />
                                </Button>
                            }
                        >
                            <MenuItem onClick={() => history.push(`/conferences/${conferenceId}/invite-reviewer`)}>
                                Invite Reviewer
                            </MenuItem>
                        </Menu>
                        <SyncComponent
                            setSync={() => {
                                setSync(uuid())
                            }}
                        />
                    </Box>
                </Box>
                <Box mb={2}>
                    {isLoading ? <Skeleton variant="rounded" height={80} /> : <DataTable data={statisticInvite} />}
                </Box>
                <MaterialReactTable
                    columns={columns}
                    data={tableData}
                    // enableColumnFilterModes
                    enablePinning
                    enableColumnResizing
                    enableStickyHeader
                    positionActionsColumn="last"
                    positionToolbarAlertBanner="bottom"
                    renderTopToolbarCustomActions={() => {
                        return (
                            <Box display="flex" my={1} mx={2} alignItems={'center'}>
                                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                    {totalCount} invite in total
                                </Typography>
                            </Box>
                        )
                    }}
                    muiTableHeadCellProps={{
                        sx: {
                            borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                            ':last-child': {
                                borderRight: 'none',
                            },
                        },
                        align: 'center',
                    }}
                    muiTableBodyCellProps={{
                        sx: {
                            borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                            ':last-child': {
                                borderRight: 'none',
                            },
                        },
                        align: 'center',
                    }}
                    muiTableBodyProps={{
                        sx: () => ({
                            '& tr:nth-of-type(odd)': {
                                backgroundColor: AppStyles.colors['#F7FCFF'],
                            },
                        }),
                    }}
                    muiTableBodyRowProps={({ row }) => ({
                        sx: {
                            backgroundColor:
                                (row.getValue('status') === 'Accept'
                                    ? AppStyles.colors['#dff0d8']
                                    : row.getValue('status') === 'Decline'
                                    ? AppStyles.colors['#f2dede']
                                    : '') + '!important',
                        },
                    })}
                    muiTableBodyCellEditTextFieldProps={() => ({
                        variant: 'outlined',
                    })}
                    rowCount={totalCount}
                    manualPagination
                    onSortingChange={setSorting}
                    onGlobalFilterChange={setGlobalFilter}
                    onPaginationChange={setPagination}
                    state={{ pagination, isLoading: isLoading, showProgressBars: isRefetching, sorting }}
                />
            </Box>
        </ConferenceDetail>
    )
}

export default ManageReviewerInvite
