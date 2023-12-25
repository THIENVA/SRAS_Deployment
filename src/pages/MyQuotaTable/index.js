import { useEffect, useMemo, useState } from 'react'

import MaterialReactTable from 'material-react-table'
import { useHistory, useParams } from 'react-router-dom'

import { Edit } from '@mui/icons-material'
import { Box, Divider, IconButton, MenuItem, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'
import ListItemForID from '~/components/ListItemForID'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'

import ConferenceDetail from '../ConferenceDetail'
import DomainConflict from './DomainConflict'

import { useReviewer } from '~/api/common/reviewer'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'
// import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const MyQuotaTable = () => {
    // const {
    //     roleConference: { roleName },
    // } = useAppSelector((state) => state.conference)
    const history = useHistory()
    // const showSnackbar = useSnackbar()
    const { userId } = useAppSelector((state) => state.auth)
    const { conferenceId } = useParams()
    const { getReviewerFacts } = useReviewer()
    const [isLoading, setIsLoading] = useState(false)
    const [isRefetching, setIsRefetching] = useState(false)
    const [tableData, setTableData] = useState([])
    const [reviewer, setReviewer] = useState({})
    const [totalCount, setTotalCount] = useState(0)
    const [domainConflict, setDomainConflict] = useState('')
    const [globalFilter, setGlobalFilter] = useState('')
    const [openPaperModal, setOpenPaperModal] = useState(false)
    const [sorting, setSorting] = useState([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    })
    const { pageIndex, pageSize } = pagination

    const handleOpenModal = () => {
        setOpenPaperModal(true)
    }

    const handleCloseModal = () => {
        setOpenPaperModal(false)
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        // if (roleName !== ROLES_NAME.REVIEWER) {
        //     history.push('/conferences')
        // } else {
        if (conferenceId) {
            if (!tableData.length) {
                setIsLoading(true)
            } else {
                setIsRefetching(true)
            }
            const params = {
                InclusionText: globalFilter,
                ConferenceId: conferenceId,
                AccountId: userId,
                SkipCount: pageIndex * pageSize,
                MaxResultCount: pageSize,
                Sorting: sorting[0]?.id,
                SortedAsc: !sorting[0]?.desc,
            }
            getReviewerFacts(params, signal)
                .then((response) => {
                    const data = response.data
                    setReviewer(data.reviewer)
                    setDomainConflict(data.reviewer?.domainConflicts)
                    setTableData(data.reviewingFacts ? data.reviewingFacts?.items : [])
                    setTotalCount(data.reviewingFacts ? data.reviewingFacts?.totalCount : 0)
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
            // }
        }

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, globalFilter, sorting])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'conferenceFullName',
                header: 'Conference',
                size: 100,
            },
            {
                accessorKey: 'conferenceShortName',
                header: 'Short Name',
                size: 100,
            },
            {
                accessorKey: 'trackName',
                header: 'Track',
                size: 80,
            },
            {
                id: 'subjectAreas',
                header: 'Subject Areas',
                columns: [
                    {
                        header: 'Primary',
                        Cell: ({ row }) => (
                            <Box display="flex" flexDirection={'column'}>
                                {row.original.subjectAreas
                                    ?.filter((area) => area.isPrimary)
                                    .map((area, index) => (
                                        <Typography color="primary" key={index}>
                                            {area.subjectAreaName}
                                        </Typography>
                                    ))}
                            </Box>
                        ),
                        enableEditing: false,
                        size: 100,
                    },
                    {
                        header: 'Secondary',
                        Cell: ({ row }) => {
                            return (
                                <Box display="flex" flexDirection={'column'}>
                                    {row.original.subjectAreas
                                        ?.filter((area) => !area.isPrimary)
                                        .map((area, index) => (
                                            <Typography color="secondary" key={index}>
                                                • {area.subjectAreaName}
                                            </Typography>
                                        ))}
                                </Box>
                            )
                        },
                        enableEditing: false,
                        size: 100,
                    },
                ],
            },
            {
                accessorKey: 'quota',
                header: 'Quota',
                size: 80,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return (
        <ConferenceDetail>
            {openPaperModal && (
                <DomainConflict
                    open={openPaperModal}
                    handleClose={handleCloseModal}
                    domainConflict={domainConflict}
                    setDomainConflict={setDomainConflict}
                />
            )}
            <Box width={ScreenSize.ScreenWidth} m="0 auto">
                <Box mb={1} display="flex" justifyContent="space-between">
                    <Typography sx={{ fontSize: 28, fontWeight: 600 }}>My Reviewing Information</Typography>
                </Box>
                <Box mb={3}>
                    {isLoading ? (
                        <Box maxWidth={500}>
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </Box>
                    ) : (
                        <>
                            <ListItemPopupInfo
                                itemName="Full name"
                                value={reviewer?.firstName + ' ' + reviewer?.lastName}
                                itemWidth={3}
                                valueWidth={9}
                                outerStyle={{ boxShadow: 'none' }}
                            />
                            <ListItemForID
                                itemName="Account ID"
                                itemWidth={3}
                                valueWidth={9}
                                outerStyle={{ boxShadow: 'none' }}
                            >
                                <IDField id={reviewer?.accountId} showButton={true} />
                            </ListItemForID>
                            <ListItemPopupInfo
                                itemName="Email"
                                value={reviewer?.email}
                                itemWidth={3}
                                valueWidth={9}
                                outerStyle={{ boxShadow: 'none' }}
                            />
                            <ListItemPopupInfo
                                itemName="Country"
                                value={reviewer?.country}
                                itemWidth={3}
                                valueWidth={9}
                                outerStyle={{ boxShadow: 'none' }}
                            />
                            <ListItemForID
                                itemName="Domain conflicts"
                                itemWidth={3}
                                valueWidth={9}
                                outerStyle={{ boxShadow: 'none' }}
                            >
                                <Box display="flex" alignItems="center">
                                    <Typography>{domainConflict}</Typography>
                                    <IconButton
                                        color="primary"
                                        sx={{ ml: domainConflict ? 1 : 0, height: 24 }}
                                        onClick={handleOpenModal}
                                        size="small"
                                    >
                                        <Edit fontSize="inherit" />
                                    </IconButton>
                                </Box>
                            </ListItemForID>
                        </>
                    )}
                </Box>
                <MaterialReactTable
                    columns={columns}
                    data={tableData}
                    enableColumnFilterModes
                    enablePinning
                    enableHiding={false}
                    enableColumnResizing
                    enableStickyHeader
                    enableRowActions
                    positionActionsColumn="last"
                    positionToolbarAlertBanner="bottom"
                    enableRowNumbers
                    muiTableBodyProps={{
                        sx: () => ({
                            '& tr:nth-of-type(odd)': {
                                backgroundColor: AppStyles.colors['#F7FCFF'],
                            },
                        }),
                    }}
                    renderRowActionMenuItems={({ row }) => {
                        return [
                            <MenuItem
                                key={0}
                                onClick={() =>
                                    history.push({
                                        pathname: `/conferences/${row.original.conferenceId}/my-reviewing/edit-quota/${row.original.trackId}`,
                                        state: {
                                            conferenceName: row.original.conferenceFullName,
                                            trackName: row.original.trackName,
                                            quota: row.original.quota,
                                        },
                                    })
                                }
                                sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                            >
                                Edit Quota
                                <Divider />
                            </MenuItem>,

                            <MenuItem
                                key={1}
                                onClick={() =>
                                    history.push({
                                        pathname: `/conferences/${row.original.conferenceId}/my-reviewing/select-subject`,
                                        state: {
                                            conferenceName: row.original.conferenceFullName,
                                            trackName: row.original.trackName,
                                            trackId: row.original.trackId,
                                            accountId: reviewer?.accountId,
                                            firstName: reviewer?.firstName,
                                            middleName: reviewer?.middleName,
                                            lastName: reviewer?.lastName,
                                            subjectAreas: row.original.subjectAreas,
                                        },
                                    })
                                }
                                sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                            >
                                Select Subject Areas
                            </MenuItem>,
                        ]
                    }}
                    // renderRowActions={({ row }) => (
                    //     <React.Fragment>
                    //         <Tooltip TransitionComponent={Zoom} title="Edit Quota" placement="bottom-start">
                    //             <IconButton
                    //                 onClick={() =>
                    //                     history.push({
                    //                         pathname: `/conferences/${row.original.conferenceId}/my-quota/edit-quota/${row.original.trackId}`,
                    //                         state: {
                    //                             conferenceName: row.original.conferenceFullName,
                    //                             trackName: row.original.trackName,
                    //                             quota: row.original.quota,
                    //                         },
                    //                     })
                    //                 }
                    //             >
                    //                 <EditOutlined fontSize="small" sx={{ color: AppStyles.colors['#027A9D'] }} />
                    //             </IconButton>
                    //         </Tooltip>
                    //     </React.Fragment>
                    // )}
                    muiTableHeadCellProps={{
                        sx: {
                            borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                            ':last-child': {
                                borderRight: 'none',
                            },
                            fontSize: 16,
                        },
                        align: 'center',
                    }}
                    muiTableBodyCellProps={{
                        sx: {
                            borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                            ':last-child': {
                                borderRight: 'none',
                            },
                            fontSize: 16,
                        },
                        align: 'center',
                    }}
                    displayColumnDefOptions={{
                        'mrt-row-numbers': {
                            size: 10,
                        },
                    }}
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

export default MyQuotaTable
