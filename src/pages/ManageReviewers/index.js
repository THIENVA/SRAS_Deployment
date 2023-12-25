import React, { Fragment, useEffect, useMemo, useState } from 'react'

import MaterialReactTable from 'material-react-table'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { ArrowDropDown, AssignmentInd } from '@mui/icons-material'
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    LinearProgress,
    MenuItem as MenuItemMUI,
    Select,
    Skeleton,
    Tooltip,
    Typography,
    Zoom,
} from '@mui/material'
import IDField from '~/components/IDField'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import SyncComponent from '~/components/SyncComponent'

import ConferenceDetail from '../ConferenceDetail'
import DataTable from './DataTable'

import { Menu, MenuItem } from '@szhsin/react-menu'
import { useGetReviewerQuery } from '~/api/common/RTKQuery/ManagingReviewer'
import { useStatistic } from '~/api/common/statistic'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const ManageReviewers = () => {
    const [sync, setSync] = useState(uuid())
    const tableFontSize = 12
    const history = useHistory()
    const { conferenceId } = useParams()
    const { getReviewerStatis } = useStatistic()
    const {
        trackConference: { trackId },
        roleConference: { roleName },
        conference: { conferenceName, conferenceFullName },
    } = useAppSelector((state) => state.conference)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    })
    const [statusFilter, setFilter] = useState({
        IsReviewed: 'all',
        IsAssigned: 'all',
        IsAllReviewerAssignmentFinished: 'all',
    })
    const { pageIndex, pageSize } = pagination
    const [globalFilter, setGlobalFilter] = useState('')
    const [tableLoading, setTableLoading] = useState(true)
    const [reviewerTable, setReviewerTable] = useState([])
    const [sorting, setSorting] = useState([])
    const track = roleName === ROLES_NAME.CHAIR ? null : trackId

    const {
        data = { items: [], totalCount: 0 },
        isFetching,
        isLoading,
        refetch,
    } = useGetReviewerQuery({
        conferenceId,
        track,
        page: pageIndex,
        pageSize,
        globalFilter: globalFilter === undefined ? '' : globalFilter,
        Sorting: sorting[0]?.id,
        SortedAsc: !sorting[0]?.desc,
        IsReviewed: statusFilter.IsReviewed === 'yes' ? true : statusFilter.IsReviewed === 'no' ? false : '',
        IsAssigned: statusFilter.IsAssigned === 'yes' ? true : statusFilter.IsAssigned === 'no' ? false : '',
        IsAllReviewerAssignmentFinished:
            statusFilter.IsAllReviewerAssignmentFinished === 'yes'
                ? true
                : statusFilter.IsAllReviewerAssignmentFinished === 'no'
                ? false
                : '',
    })
    const [tableData, setTableData] = useState([])
    const handleFilterChange = (event) => {
        const { name, value } = event.target
        setFilter((prev) => ({ ...prev, [name]: value }))
    }
    useEffect(() => {
        if (!isFetching) {
            setTableData(data?.items ? data?.items : [])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        pageIndex,
        pageSize,
        isFetching,
        track,
        globalFilter,
        sorting,
        statusFilter.IsReviewed,
        statusFilter.IsAssigned,
        statusFilter.IsAllReviewerAssignmentFinished,
    ])

    useEffect(() => {
        const controller = new AbortController()
        if (conferenceId) {
            getReviewerStatis(conferenceId, controller.signal)
                .then((res) => {
                    setReviewerTable(res.data)
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
    }, [conferenceId, sync])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'reviewerId',
                header: 'ID',
                Cell: ({ row }) => (
                    <React.Fragment>
                        <IDField
                            id={row?.original?.reviewerId}
                            showButton={true}
                            style={{
                                fontSize: 14,
                            }}
                            boxStyle={{ justifyContent: 'center' }}
                        />
                    </React.Fragment>
                ),
                enableEditing: false,
                size: 100,
            },
            {
                id: 'reviewer',
                header: 'Reviewers',
                size: 260,
                Cell: ({ row }) => (
                    <Box>
                        <Box display={'flex'} alignItems={'center'}>
                            <Typography textAlign="left" sx={{ fontSize: 12 }}>
                                <strong>{row.original.fullName}</strong> ({row.original.email})
                            </Typography>
                        </Box>
                        <Typography textAlign="left" sx={{ fontSize: 12, color: AppStyles.colors['#0D1B3EB3'] }}>
                            <b>Organization:</b> {row.original.organization}
                        </Typography>
                        <Typography textAlign="left" sx={{ fontSize: 12, color: AppStyles.colors['#0D1B3EB3'] }}>
                            <b>Country:</b> {row.original.country}
                        </Typography>
                    </Box>
                ),
            },

            {
                accessorKey: 'quota',
                header: 'Quota',
                size: 130,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },

            {
                id: 'primarySubjectArea',
                header: 'Primary Subject Area',
                accessorKey: 'subjectAreas',
                Cell: ({ row }) => (
                    <Box display="flex" flexDirection={'column'}>
                        {row.original.reviewerSubjectAreas
                            ?.filter((area) => area.isPrimary)
                            .map((area, index) => (
                                <Typography sx={{ fontSize: tableFontSize }} color="primary" key={index}>
                                    {area.subjectAreaName}
                                </Typography>
                            ))}
                    </Box>
                ),
                enableEditing: false,
                size: 240,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                id: 'secondarySubjectArea',
                header: 'Secondary Subject Area',
                accessorKey: 'subjectAreas',
                Cell: ({ row }) => {
                    return (
                        <Box display="flex" flexDirection={'column'}>
                            {row.original.reviewerSubjectAreas
                                ?.filter((area) => !area.isPrimary)
                                .map((area, index) => (
                                    <Typography sx={{ fontSize: tableFontSize }} color="secondary" key={index}>
                                        • {area.subjectAreaName}
                                    </Typography>
                                ))}
                        </Box>
                    )
                },
                enableEditing: false,
                size: 260,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'left',
                },
            },
            {
                accessorKey: 'domainConflict',
                header: 'Domain Conflict',
                size: 200,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'numOfAssigned',
                header: 'Assigned',
                Cell: ({ row }) => (
                    <Typography
                    // sx={{
                    //     fontWeight: 500,
                    //     color: AppStyles.colors['#027A9D'],
                    //     ':hover': {
                    //         textDecoration: 'underline',
                    //     },
                    //     cursor: 'pointer',
                    // }}
                    // onClick={() =>
                    //     history.push(`/conferences/${conferenceId}/dashboard-console/${row.original.paperId}`)
                    // }
                    >
                        {row.original.numOfAssigned ? row.original.numOfAssigned : 0}
                    </Typography>
                ),
                size: 160,
                filterFn: 'contains',
            },
            {
                accessorKey: 'reviewed',
                header: 'Progress',
                Cell: ({ row }) => {
                    const percentProgress =
                        row.original.numOfReviewed !== null && row.original.numOfAssigned !== null
                            ? (row.original.numOfReviewed / row.original.numOfAssigned) * 100
                            : 0

                    return (
                        <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={isNaN(percentProgress) === true ? 0 : percentProgress}
                                    />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                                        isNaN(percentProgress) === true ? 0 : percentProgress
                                    )}%`}</Typography>
                                </Box>
                            </Box>
                            <Box textAlign="left">
                                <Typography variant="caption">
                                    {row.original.numOfReviewed ? row.original.numOfReviewed : 0}/
                                    {row.original.numOfAssigned ? row.original.numOfAssigned : 0}
                                </Typography>
                            </Box>
                        </React.Fragment>
                    )
                },
                enableColumnFilter: false,
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
                        Manage Reviewer
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
                            <MenuItem
                                onClick={() => history.push(`/conferences/${conferenceId}/manage-reviewer-invite`)}
                            >
                                Manage Reviewer Invite
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
                <Grid container>
                    <Grid item xs={12} md={12} lg={12}>
                        <Box ml={1}>
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
                        </Box>
                    </Grid>
                    {/* <Grid item xs={6} md={6} lg={6}></Grid> */}
                </Grid>
                <Box mb={2}>
                    {tableLoading ? <Skeleton variant="rounded" height={168} /> : <DataTable data={reviewerTable} />}
                </Box>
                <Box display="flex" mb={1} mt={2} flexDirection={'row-reverse'} justifyContent={'flex-start'}>
                    {/* <Box display="flex">
                        <Typography mr={2}>Reviewed:</Typography>
                        <Select
                            name="IsReviewed"
                            variant="standard"
                            size="small"
                            onChange={(event) => handleFilterChange(event)}
                            value={statusFilter.IsReviewed}
                            style={{ textAlign: 'center', width: 63 }}
                        >
                            <MenuItemMUI value={'all'} sx={{ fontStyle: 'italic' }}>
                                All
                            </MenuItemMUI>
                            <MenuItemMUI value={'yes'}>Yes</MenuItemMUI>
                            <MenuItemMUI value={'no'}>No</MenuItemMUI>
                        </Select>
                    </Box> */}
                    <Box display="flex">
                        <Typography mr={2}>Assigned:</Typography>
                        <Select
                            name="IsAssigned"
                            variant="standard"
                            size="small"
                            onChange={(event) => handleFilterChange(event)}
                            value={statusFilter.IsAssigned}
                            style={{ textAlign: 'center', width: 63 }}
                        >
                            <MenuItemMUI value={'all'} sx={{ fontStyle: 'italic' }}>
                                All
                            </MenuItemMUI>
                            <MenuItemMUI value={'yes'}>Yes</MenuItemMUI>
                            <MenuItemMUI value={'no'}>No</MenuItemMUI>
                        </Select>
                    </Box>
                    <Box display="flex" mx={3}>
                        <Typography mr={2}>All Reviewer Assignment Finished:</Typography>
                        <Select
                            name="IsAllReviewerAssignmentFinished"
                            variant="standard"
                            size="small"
                            onChange={(event) => handleFilterChange(event)}
                            value={statusFilter.IsAllReviewerAssignmentFinished}
                            style={{ textAlign: 'center', width: 63 }}
                        >
                            <MenuItemMUI value={'all'} sx={{ fontStyle: 'italic' }}>
                                All
                            </MenuItemMUI>
                            <MenuItemMUI value={'yes'}>Yes</MenuItemMUI>
                            <MenuItemMUI value={'no'}>No</MenuItemMUI>
                        </Select>
                    </Box>
                </Box>
                <MaterialReactTable
                    columns={columns}
                    data={tableData}
                    enableColumnFilterModes
                    enableRowActions
                    enableColumnResizing
                    enablePinning
                    enableStickyHeader
                    enableRowNumbers
                    manualPagination
                    rowCount={data?.totalCount}
                    positionActionsColumn="last"
                    positionToolbarAlertBanner="bottom"
                    renderTopToolbarCustomActions={() => {
                        return (
                            <Fragment>
                                <Typography sx={{ m: 2, fontSize: 16, fontWeight: 'bold' }}>
                                    {data?.totalCount && <>{data?.totalCount} reviewers in total</>}
                                </Typography>
                            </Fragment>
                        )
                    }}
                    muiTableBodyProps={{
                        sx: () => ({
                            '& tr:nth-of-type(4n+1)': {
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
                    renderRowActions={({ row }) => (
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', gap: '8px' }}>
                            <Tooltip placement="top" title="View Reviewer Assignment Report" TransitionComponent={Zoom}>
                                <IconButton
                                    sx={{ color: AppStyles.colors['#027A9D'] }}
                                    onClick={() =>
                                        history.push(
                                            `/conferences/${conferenceId}/assignment-report/${row.original.accountId}`
                                        )
                                    }
                                >
                                    <AssignmentInd />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    // renderRowActionMenuItems={({ row }) => [
                    //     <MenuItemMUI key={uuid()} sx={{ m: 0 }}>
                    //         View Reviewer Assignment Report
                    //     </MenuItemMUI>,
                    // ]}
                    muiTableBodyCellEditTextFieldProps={() => ({
                        variant: 'outlined',
                    })}
                    onPaginationChange={setPagination}
                    onSortingChange={setSorting}
                    onGlobalFilterChange={setGlobalFilter}
                    state={{
                        pagination,
                        isLoading: !!isLoading,
                        showProgressBars: !!isFetching,
                        sorting,
                    }}
                    initialState={{
                        columnVisibility: { secondarySubjectArea: false, primarySubjectArea: false },
                        density: 'compact',
                    }}
                />
            </Container>
        </ConferenceDetail>
    )
}

export default ManageReviewers
