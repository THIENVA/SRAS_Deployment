import { Fragment, useEffect, useMemo, useState } from 'react'

import MaterialReactTable from 'material-react-table'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { ArrowDropDown } from '@mui/icons-material'
import { Box, Button, Container, Divider, MenuItem as MenuItemMUI, Skeleton, Typography } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import SyncComponent from '~/components/SyncComponent'

import ConferenceDetail from '../ConferenceDetail'
import AddUserToRoleDialog from './AddUserToRoleDialog'
import DataTable from './DataTable'

import { Menu, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import { useGetUserQuery } from '~/api/common/RTKQuery/ManagingUser'
import { useStatistic } from '~/api/common/statistic'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const ManageConferenceUsers = () => {
    const [sync, setSync] = useState(uuid())
    const history = useHistory()
    const { getUserStatis } = useStatistic()
    const { conferenceId } = useParams()
    const [openAddUser, setOpenAddUser] = useState({ status: false, email: '' })
    const [globalFilter, setGlobalFilter] = useState('')
    // const showSnackbar = useSnackbar()
    const [tableLoading, setTableLoading] = useState(true)
    const [userTable, setUserTable] = useState([])
    const [sorting, setSorting] = useState([])
    const [unique, setUnique] = useState(uuid())
    const {
        trackConference: { trackId },
        roleConference: { roleName },
        conference: { conferenceName, conferenceFullName },
    } = useAppSelector((state) => state.conference)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const { pageIndex, pageSize } = pagination

    const track = roleName === ROLES_NAME.CHAIR ? null : trackId
    const {
        data = { items: [], totalCount: 0 },
        isFetching,
        isLoading,
        refetch,
    } = useGetUserQuery({
        conferenceId,
        track,
        page: pageIndex,
        pageSize,
        globalFilter: globalFilter === undefined ? '' : globalFilter,
        Sorting: sorting[0]?.id,
        SortedAsc: !sorting[0]?.desc,
    })
    useEffect(() => {
        const controller = new AbortController()
        setTableLoading(true)
        if (conferenceId) {
            getUserStatis(conferenceId, track, controller.signal)
                .then((res) => {
                    setUserTable(res.data)
                })
                .catch(() => {})
                .finally(() => {
                    setTableLoading(false)
                })
            return () => {
                controller.abort()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId, track, unique])

    const handleOpenAddUser = () => {
        setOpenAddUser({ status: true, email: '' })
    }

    const handleCloseAddUser = () => {
        setOpenAddUser({ status: false, email: '' })
    }

    const columns = useMemo(
        () => [
            {
                id: 'fullName',
                header: 'Full Name',
                size: 180,
                Cell: ({ row }) => (
                    <Typography sx={{ fontSize: 14 }}>
                        {row.original.firstName} {row.original.middleName ? row.original.middleName : ''}{' '}
                        {row.original.lastName}
                    </Typography>
                ),
            },
            // {
            //     accessorKey: 'middleName',
            //     header: 'Middle Name',
            //     size: 200,
            // },
            // {
            //     accessorKey: 'lastName',
            //     header: 'Last Name',
            //     size: 180,
            // },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 300,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'organization',
                header: 'Organization',
                size: 200,
            },
            {
                accessorKey: 'country',
                header: 'Country',
                size: 180,
            },
            {
                accessorKey: 'roles',
                header: 'Roles',
                Cell: ({ row }) => {
                    return (
                        <Box display="flex" flexDirection="column">
                            {row.original.roles.map((value, index) => (
                                <Typography sx={{ fontSize: 14 }} key={index}>
                                    {value}
                                </Typography>
                            ))}
                        </Box>
                    )
                },
                size: 180,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return (
        <ConferenceDetail>
            <Container maxWidth="xl">
                <Box mb={1} display="flex" justifyContent="space-between">
                    <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                        Manage Conference Users
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Menu
                            align="end"
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
                                    <Typography>Actions</Typography>
                                    <ArrowDropDown fontSize="medium" sx={{ color: AppStyles.colors['#FFFFFF'] }} />
                                </Button>
                            }
                        >
                            <MenuItem onClick={handleOpenAddUser}>Add user to conference</MenuItem>
                            <MenuItem onClick={() => history.push(`/conferences/${conferenceId}/invite-reviewer`)}>
                                Invite reviewer
                            </MenuItem>
                        </Menu>
                        <SyncComponent
                            setSync={() => {
                                setSync(uuid())
                                refetch()
                            }}
                        />
                    </Box>
                </Box>

                <Box ml={1} mb={3}>
                    <ListItemPopupInfo
                        itemName="Conference name"
                        value={conferenceFullName}
                        itemWidth={1.5}
                        valueWidth={10.5}
                        outerStyle={{ boxShadow: 'none', my: 1 }}
                    />
                    <ListItemPopupInfo
                        itemName="Short name"
                        value={conferenceName}
                        itemWidth={1.5}
                        valueWidth={10.5}
                        outerStyle={{ boxShadow: 'none', my: 1 }}
                    />
                    {/* {phase?.currentPhases && (
                        <ListItemForID
                            itemName="Current phase"
                            itemWidth={1.5}
                            valueWidth={10.5}
                            outerStyle={{ boxShadow: 'none', my: 1 }}
                        >
                            <strong>{phase?.currentPhases[0]?.phase}</strong>: {phase?.currentPhases[0]?.deadlineName} (
                            {new Date(phase?.currentPhases[0]?.deadline).toLocaleDateString('en-GB')})
                        </ListItemForID>
                    )}
                    {phase?.nextPhases && (
                        <ListItemForID
                            itemName="Next phase"
                            itemWidth={1.5}
                            valueWidth={10.5}
                            outerStyle={{ boxShadow: 'none', my: 1 }}
                        >
                            <strong>{phase?.nextPhases[0]?.phase}</strong>: {phase?.nextPhases[0]?.deadlineName} (
                            {new Date(phase?.nextPhases[0]?.deadline).toLocaleDateString('en-GB')})
                        </ListItemForID>
                    )} */}
                </Box>
                <Box mb={2}>
                    {tableLoading ? <Skeleton variant="rounded" height={168} /> : <DataTable data={userTable} />}
                </Box>
                <MaterialReactTable
                    columns={columns}
                    data={data ? data.items : []}
                    enableColumnFilterModes
                    enablePinning
                    enableColumnVirtualization
                    enableRowVirtualization
                    enableColumnResizing
                    enableRowNumbers
                    enableStickyHeader
                    rowCount={data?.totalCount}
                    enableRowActions
                    manualPagination
                    getRowId={(row) => row.id}
                    positionActionsColumn="last"
                    positionToolbarAlertBanner="bottom"
                    renderTopToolbarCustomActions={() => {
                        return (
                            <Fragment>
                                <Typography sx={{ m: 2, fontSize: 16, fontWeight: 'bold' }}>
                                    {data?.totalCount && <>{data?.totalCount ? data?.totalCount : 0} users in total</>}
                                </Typography>
                            </Fragment>
                        )
                    }}
                    muiTableBodyProps={{
                        sx: () => ({
                            '& tr:nth-of-type(odd)': {
                                backgroundColor: AppStyles.colors['#F7FCFF'],
                            },
                        }),
                    }}
                    muiTableHeadCellProps={{
                        sx: {
                            borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                            ':last-child': {
                                borderRight: 'none',
                            },
                            fontSize: 14,
                        },
                        align: 'center',
                    }}
                    muiTableBodyCellProps={{
                        sx: {
                            borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                            ':last-child': {
                                borderRight: 'none',
                            },
                            fontSize: 14,
                        },
                        align: 'center',
                    }}
                    renderRowActionMenuItems={({ closeMenu, row }) => {
                        const showReviewerAction = row.original?.roles?.includes('Reviewer')
                        return [
                            <MenuItemMUI
                                key={0}
                                onClick={() => {
                                    setOpenAddUser({ status: true, email: row.original.email })
                                    closeMenu()
                                }}
                                sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                            >
                                Manage Roles
                                <Divider />
                            </MenuItemMUI>,
                            showReviewerAction && (
                                <MenuItemMUI
                                    key={3}
                                    onClick={() => {
                                        history.push(
                                            `/conferences/${conferenceId}/assignment-report/${row.original.accountId}`
                                        )
                                    }}
                                    sx={{ m: 0 }}
                                >
                                    View Reviewer Assignment Report
                                </MenuItemMUI>
                            ),
                        ]
                    }}
                    onPaginationChange={setPagination}
                    onSortingChange={setSorting}
                    onGlobalFilterChange={setGlobalFilter}
                    state={{
                        pagination,
                        isLoading: !!isLoading,
                        showProgressBars: !!isFetching,
                        sorting,
                    }}
                />
            </Container>
            {openAddUser.status && (
                <AddUserToRoleDialog
                    open={openAddUser.status}
                    onClose={handleCloseAddUser}
                    title={'Add Role To User'}
                    searchEmail={openAddUser.email}
                    setUnique={setUnique}
                />
            )}
        </ConferenceDetail>
    )
}

export default ManageConferenceUsers
