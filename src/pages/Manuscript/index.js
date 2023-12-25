import { useEffect, useMemo, useState } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'
import { cloneDeep } from 'lodash'
import queryString from 'query-string'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { ArrowDropDown, CheckCircle, Info, RequestQuoteOutlined } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem as MenuItemMUI,
    Select,
    Tab,
    Tooltip,
    Typography,
    Zoom,
} from '@mui/material'
import SyncComponent from '~/components/SyncComponent'

import ConferenceDetail from '../ConferenceDetail'
import ConfirmPopup from './ConfirmPopup'
import ManuscriptTable from './ManuscriptTable'
import OrderInfoModal from './OrderInfoModal'
import ListItem from './OrderInfoModal/ListItem'
import PaymentProofSearchUser from './PaymentProofSearchUser'

import { Menu, MenuDivider, MenuItem, SubMenu } from '@szhsin/react-menu'
import { useSnackbar } from '~/HOCs/SnackbarContext'
import {
    useBulkAllRequestPresentationMutation,
    useEditRequestedPresentationMutation,
    useGetManuScriptQuery,
} from '~/api/common/RTKQuery/ManuScriptConsole'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { useStatistic } from '~/api/common/statistic'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const TAB_MANUSCRIPT = {
    CAMERA_READY: 'requestedforcameraready',
    ALL: 'all',
    REGISTERED: 'registered',
    REGISTER_PRESENTATION: 'requestedforpresentation',
    PRESENTED: 'presented',
}

const Manuscript = () => {
    const { stepSelected } = useAppSelector((state) => state.guidelines)
    const [sync, setSync] = useState(uuid())
    const tableFontSize = 14
    const { tracks } = useAppSelector((state) => state.trackForChair)
    const history = useHistory()
    const showSnackbar = useSnackbar()
    const { getManuscriptStatis } = useStatistic()
    // const { getPhase } = useConference()
    const { conferenceId } = useParams()
    const { deleteCameraReady } = usePaperSubmission()
    const {
        trackConference: { trackId },
        roleConference: { roleName },
        conference: { conferenceName, conferenceFullName },
    } = useAppSelector((state) => state.conference)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [paperInfo, setPaperInfo] = useState(null)
    const [openPaperModal, setOpenPaperModal] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    })
    const [editRequestedPresentation] = useEditRequestedPresentationMutation()
    const [bulkAllRequestPresentation] = useBulkAllRequestPresentationMutation()
    const [loading, setLoading] = useState({ status: false, rowId: null })
    const [statisticShow, setStatisticShow] = useState({})
    const [columnVisibility, setVisibility] = useState({
        title: true,
        trackName: true,
        primarySubjectArea: true,
        secondarySubjectArea: true,
        authors: true,
        isRegistered: true,
        registrationOption: true,
        order: true,
        registrant: true,
        isRequestedForPresentation: true,
        isPresentationSubmitted: true,
        presenters: true,
    })
    const [statisData, setStatisData] = useState({})
    // const [phase, setPhase] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')
    const { search: query, pathname } = useLocation()
    const { tab: currentTab } = queryString.parse(query)
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [openProof, setOpenProof] = useState(false)
    const track = roleName === ROLES_NAME.CHAIR ? null : trackId

    const getCurrentTab =
        !currentTab ||
        (currentTab !== TAB_MANUSCRIPT.ALL &&
            currentTab !== TAB_MANUSCRIPT.CAMERA_READY &&
            currentTab !== TAB_MANUSCRIPT.PRESENTED &&
            currentTab !== TAB_MANUSCRIPT.REGISTERED &&
            currentTab !== TAB_MANUSCRIPT.REGISTER_PRESENTATION)
            ? TAB_MANUSCRIPT.CAMERA_READY
            : currentTab

    const { pageIndex, pageSize } = pagination
    const [tab, setTab] = useState(getCurrentTab)
    const [aggregationType, setAggreType] = useState('')

    const [tableData, setTableData] = useState([])

    const [clickFilter, setClickFilter] = useState({
        cameraReadyRequest: false,
        cameReadySubmitted: false,
        cameraReadyNotSubmitted: false,
        registerPapers: false,
        notRegisterPapers: false,
        presentationRequest: false,
        presentationSubmitted: false,
        presentationNotSubmitted: false,
    })

    const statisticVisible = stepSelected?.guideLineSelected?.consoleFigures
        ? stepSelected?.guideLineSelected?.consoleFigures
        : ''
    const columnVisible = stepSelected?.guideLineSelected?.consoleUIColumns
        ? stepSelected?.guideLineSelected?.consoleUIColumns
        : ''

    const {
        data = { items: [], totalCount: 0 },
        isFetching,
        isLoading,
        refetch,
    } = useGetManuScriptQuery({
        aggregationType: aggregationType === '' ? tab : aggregationType,
        InclusionText: globalFilter === undefined ? '' : globalFilter,
        conferenceId: conferenceId,
        trackId: track,
        skipCount: pageIndex * pageSize,
        maxResultCount: pageSize,
    })

    const changeIndexHandler = (_, value) => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        setAggreType('')
        setGlobalFilter('')
        setClickFilter({
            cameraReadyRequest: false,
            cameReadySubmitted: false,
            cameraReadyNotSubmitted: false,
            registerPapers: false,
            notRegisterPapers: false,
            presentationRequest: false,
            presentationSubmitted: false,
            presentationNotSubmitted: false,
        })

        setTab(value)
    }

    const handleOpenModal = (row) => {
        setPaperInfo(row)
        setOpenPaperModal(true)
    }

    const handleCloseModal = () => {
        setPaperInfo(null)
        setOpenPaperModal(false)
    }

    const handleOpenConfirmModal = (row) => {
        setPaperInfo(row)
        setOpenConfirmModal(true)
    }

    const handleCloseConfirmModal = () => {
        setPaperInfo(null)
        setOpenConfirmModal(false)
    }

    const updateRouteHandler = () => {
        let route = pathname + `?tab=${tab}`
        history.push(route)
    }

    const handleOpenProof = () => {
        setOpenProof(true)
    }

    const handleCloseProof = () => {
        setOpenProof(false)
    }

    const handleDownload = () => {
        setButtonLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/conference-manuscripts-aggregation-file`,
            method: 'GET',
            responseType: 'blob',
            params: {
                aggregationType: tab,
                conferenceId: conferenceId,
                trackId: track,
            },
        })
            .then((response) => {
                saveAs(response.data, `${tab}.zip`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setButtonLoading(false)
            })
    }

    const handleRequestPresentation = (value, rowData) => {
        const paperId = rowData.original.paperId
        const cloneRow = cloneDeep(rowData.original)
        setLoading({ status: true, rowId: paperId })
        cloneRow.isRequestedForPresentation = value
        editRequestedPresentation({
            conferenceId,
            trackId: rowData.original.trackId,
            paperId,
            isCameraReadyRequested: value,
        })
            .then((response) => {
                if (response.data) {
                    const updateTable = cloneDeep(tableData)
                    updateTable[rowData.index] = cloneRow
                    setTableData(updateTable)
                }
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later',
                // })
            })
            .finally(() => {
                setLoading({ status: false, rowId: null })
            })
    }

    useEffect(() => {
        if (!isFetching) {
            setTableData(data?.items ? data?.items : [])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, isFetching, track, globalFilter, tab])

    useEffect(() => {
        updateRouteHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    useEffect(() => {
        setTab(getCurrentTab)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCurrentTab])

    useEffect(() => {
        const controller = new AbortController()
        if (conferenceId) {
            getManuscriptStatis(conferenceId, track, controller.signal)
                .then((res) => {
                    setStatisData(res.data)
                })
                .catch(() => {})
                .finally(() => {})
            return () => {
                controller.abort()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId, track, sync])
    useEffect(() => {
        if (stepSelected?.guideLineSelected?.route.includes('manuscript')) {
            if (statisticVisible !== '') {
                const statistic = JSON.parse(statisticVisible)
                setStatisticShow(statistic)
            }
            if (columnVisible !== '') {
                const column = JSON.parse(columnVisible)
                setVisibility(column)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnVisible, statisticVisible])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Paper',
                Cell: ({ row }) => (
                    <Box textAlign="left">
                        <Typography
                            sx={{
                                color: AppStyles.colors['#027A9D'],
                                ':hover': {
                                    textDecoration: 'underline',
                                },
                                cursor: 'pointer',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: tableFontSize,
                            }}
                            onClick={() =>
                                history.push(`/conferences/${conferenceId}/submission-summary/${row.original.paperId}`)
                            }
                        >
                            {row.original.title}
                        </Typography>
                    </Box>
                ),
                filterFn: 'contains',
                size: 180,
            },
            {
                accessorKey: 'trackName',
                header: 'Track',
                size: 120,
                filterFn: 'contains',
            },

            {
                id: 'primarySubjectArea',
                header: 'Primary Subject Area',
                Cell: ({ row }) => (
                    <Box display="flex" flexDirection={'column'}>
                        {row.original?.subjectAreas
                            ?.filter((area) => area.isPrimary)
                            ?.map((area, index) => (
                                <Typography color="primary" key={index} sx={{ fontSize: tableFontSize }}>
                                    {area.subjectAreaName}
                                </Typography>
                            ))}
                    </Box>
                ),
                enableEditing: false,
                size: 200,
            },
            {
                id: 'secondarySubjectArea',
                header: 'Secondary Subject Area',
                Cell: ({ row }) => {
                    return (
                        <Box display="flex" flexDirection={'column'}>
                            {row.original?.subjectAreas
                                ?.filter((area) => !area.isPrimary)
                                ?.map((area, index) => (
                                    <Typography color="secondary" key={index} sx={{ fontSize: tableFontSize }}>
                                        • {area.subjectAreaName}
                                    </Typography>
                                ))}
                        </Box>
                    )
                },
                enableEditing: false,
                size: 220,
                muiTableBodyCellProps: {
                    align: 'left',
                },
            },

            {
                accessorKey: 'authors',
                header: 'Authors',
                Cell: ({ row }) => {
                    return (
                        <Box>
                            {row.original?.authors?.map((author, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Box display={'flex'} alignItems={'center'}>
                                        <Typography textAlign="left" sx={{ fontSize: 12 }}>
                                            •{' '}
                                            <strong>
                                                {author.authorNamePrefix} {author.authorFullName}
                                            </strong>{' '}
                                            ({author.authorEmail}){' '}
                                            <Typography component={'span'} alignItems={'center'}>
                                                {author.hasAccount && (
                                                    <CheckCircle
                                                        sx={{ fontSize: 12, color: AppStyles.colors['#027A9D'] }}
                                                    />
                                                )}
                                            </Typography>
                                        </Typography>
                                    </Box>
                                    <Typography
                                        textAlign="left"
                                        sx={{ fontSize: 12, color: AppStyles.colors['#0D1B3EB3'] }}
                                    >
                                        <b>Organization:</b> {author.authorOrganization}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )
                },
                size: 240,
                enableColumnFilter: false,
            },
            {
                accessorKey: 'firstAuthors',
                header: 'First Authors',
                Cell: ({ row }) => {
                    return (
                        <Box>
                            {row.original?.firstAuthors?.map((author, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Box display={'flex'} alignItems={'center'}>
                                        <Typography textAlign="left" sx={{ fontSize: 12 }}>
                                            •{' '}
                                            <strong>
                                                {author.authorNamePrefix} {author.authorFullName}
                                            </strong>{' '}
                                            ({author.authorEmail}){' '}
                                            <Typography component={'span'} alignItems={'center'}>
                                                {author.hasAccount && (
                                                    <CheckCircle
                                                        sx={{ fontSize: 12, color: AppStyles.colors['#027A9D'] }}
                                                    />
                                                )}
                                            </Typography>
                                        </Typography>
                                    </Box>
                                    <Typography
                                        textAlign="left"
                                        sx={{ fontSize: 12, color: AppStyles.colors['#0D1B3EB3'] }}
                                    >
                                        <b>Organization:</b> {author.authorOrganization}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )
                },
                size: 240,
                enableColumnFilter: false,
            },
            {
                accessorKey: 'correspondingAuthors',
                header: 'Corresponding Authors',
                Cell: ({ row }) => {
                    return (
                        <Box>
                            {row.original?.correspondingAuthors?.map((author, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Box display={'flex'} alignItems={'center'}>
                                        <Typography textAlign="left" sx={{ fontSize: 12 }}>
                                            •{' '}
                                            <strong>
                                                {author.authorNamePrefix} {author.authorFullName}
                                            </strong>{' '}
                                            ({author.authorEmail}){' '}
                                            <Typography component={'span'} alignItems={'center'}>
                                                {author.hasAccount && (
                                                    <CheckCircle
                                                        sx={{ fontSize: 12, color: AppStyles.colors['#027A9D'] }}
                                                    />
                                                )}
                                            </Typography>
                                        </Typography>
                                    </Box>
                                    <Typography
                                        textAlign="left"
                                        sx={{ fontSize: 12, color: AppStyles.colors['#0D1B3EB3'] }}
                                    >
                                        <b>Organization:</b> {author.authorOrganization}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )
                },
                size: 240,
                enableColumnFilter: false,
            },

            {
                accessorKey: 'cameraReadySubmitted',
                header: 'Camera Ready Submitted?',
                Cell: ({ row }) => {
                    return (
                        <Typography sx={{ fontSize: 16 }}>
                            {row.original.cameraReadySubmitted === true ? 'Yes' : 'No'}
                        </Typography>
                    )
                },
                size: 200,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                enableColumnFilter: false,
            },
            {
                accessorKey: 'isRegistered',
                header: 'Registered',
                Cell: ({ row }) => {
                    return (
                        <Typography sx={{ fontSize: 16 }}>
                            {row.original.isRegistered === true ? 'Yes' : 'No'}
                        </Typography>
                    )
                },
                size: 180,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                enableColumnFilter: false,
            },

            {
                accessorKey: 'registrationOption',
                header: 'Register Option',
                size: 200,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                enableColumnFilter: false,
            },
            {
                accessorKey: 'order',
                header: 'Order',
                Cell: ({ row }) => {
                    return (
                        <Box display="flex" justifyContent="center">
                            {row.original.order ? (
                                <Button
                                    variant="text"
                                    sx={{ color: AppStyles.colors['#027A9D'] }}
                                    endIcon={<RequestQuoteOutlined />}
                                    onClick={() => {
                                        handleOpenModal(row.original)
                                    }}
                                >
                                    View Order
                                </Button>
                            ) : (
                                'Currently no order'
                            )}
                        </Box>
                    )
                },
                enableColumnFilter: false,
                size: 180,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },

            {
                accessorKey: 'registrant',
                header: 'Registrant',
                Cell: ({ row }) => {
                    return (
                        <Box>
                            {row.original?.registrant && (
                                <Box>
                                    <Box display={'flex'} alignItems={'center'}>
                                        <Typography textAlign="left" sx={{ fontSize: 12 }}>
                                            <strong>
                                                {row.original?.registrant?.registrantNamePrefix}{' '}
                                                {row.original?.registrant?.registrantFullName}
                                            </strong>{' '}
                                            {row.original?.registrant.registrantEmail &&
                                                '(' + row.original?.registrant.registrantEmail + ')'}{' '}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        textAlign="left"
                                        sx={{ fontSize: 12, color: AppStyles.colors['#0D1B3EB3'] }}
                                    >
                                        {row.original?.registrant?.registrantOrganization && (
                                            <p>
                                                <b>Organization:</b> {row.original?.registrant?.registrantOrganization}
                                            </p>
                                        )}
                                        {row.original?.registrant?.registrantCountry && (
                                            <p>
                                                <b>Country:</b> {row.original?.registrant?.registrantCountry}
                                            </p>
                                        )}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )
                },
                size: 240,
                enableColumnFilter: false,
            },

            {
                accessorKey: 'isRequestedForPresentation',
                header: 'Requested for Presentation?',
                Cell: ({ row }) => {
                    return (
                        <Select
                            size="small"
                            onChange={(event) => handleRequestPresentation(event.target.value, row)}
                            value={row.original.isRequestedForPresentation}
                            disabled={(loading.status && row.original.paperId === loading.rowId) || !row.original.order}
                        >
                            <MenuItemMUI value={true}>Yes</MenuItemMUI>
                            <MenuItemMUI value={false}>No</MenuItemMUI>
                        </Select>
                    )
                },
                size: 200,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                enableColumnFilter: false,
            },
            {
                accessorKey: 'isPresentationSubmitted',
                header: 'Presentation Submitted?',
                Cell: ({ row }) => {
                    return (
                        <Typography sx={{ fontSize: 16 }}>
                            {row.original.isPresentationSubmitted === true ? 'Yes' : 'No'}
                        </Typography>
                    )
                },
                size: 200,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                enableColumnFilter: false,
            },

            {
                accessorKey: 'presenters',
                header: 'Presenters',
                Cell: ({ row }) => {
                    return (
                        <Box>
                            {row.original?.presenters?.map((author, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Box display={'flex'} alignItems={'center'}>
                                        <Typography textAlign="left" sx={{ fontSize: 12 }}>
                                            •{' '}
                                            <strong>
                                                {author.authorNamePrefix} {author.authorFullName}
                                            </strong>{' '}
                                            ({author.authorEmail}){' '}
                                            <Typography component={'span'} alignItems={'center'}>
                                                {author.hasAccount && (
                                                    <CheckCircle
                                                        sx={{ fontSize: 12, color: AppStyles.colors['#027A9D'] }}
                                                    />
                                                )}
                                            </Typography>
                                        </Typography>
                                    </Box>
                                    <Typography
                                        textAlign="left"
                                        sx={{ fontSize: 12, color: AppStyles.colors['#0D1B3EB3'] }}
                                    >
                                        <b>Organization:</b> {author.authorOrganization}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )
                },
                size: 240,
                enableColumnFilter: false,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [tableData, loading.status]
    )

    return (
        <ConferenceDetail>
            {openProof && <PaymentProofSearchUser open={openProof} handleClose={handleCloseProof} />}
            {openPaperModal && <OrderInfoModal open={openPaperModal} handleClose={handleCloseModal} row={paperInfo} />}
            {openConfirmModal && (
                <ConfirmPopup
                    open={openConfirmModal}
                    handleClose={handleCloseConfirmModal}
                    deleteCameraReady={deleteCameraReady}
                    row={paperInfo}
                />
            )}
            <Container maxWidth="xl">
                <Box mb={2}>
                    <Grid container display={'flex'} justifyContent={'space-between'}>
                        <Grid item md={12}>
                            <Box mb={2} display="flex" justifyContent="space-between">
                                <Typography sx={{ fontSize: 28, fontWeight: 600 }}>Conference Manuscript</Typography>
                                <Box display="flex" alignItems={'center'}>
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
                                                <ArrowDropDown
                                                    fontSize="medium"
                                                    sx={{ color: AppStyles.colors['#FFFFFF'] }}
                                                />
                                            </Button>
                                        }
                                    >
                                        <MenuItem onClick={() => handleOpenProof()}>Register Payment Proof</MenuItem>
                                        <MenuDivider />
                                        {roleName === ROLES_NAME.TRACK_CHAIR ? (
                                            <MenuItem
                                                onClick={() => {
                                                    setLoading((prev) => ({ ...prev, status: true }))
                                                    bulkAllRequestPresentation({
                                                        conferenceId,
                                                        trackId,
                                                        isRequest: true,
                                                    }).finally(() => {
                                                        setSync(uuid())
                                                        setLoading((prev) => ({ ...prev, status: false }))
                                                    })
                                                }}
                                            >
                                                Presentation Bulk Enable
                                            </MenuItem>
                                        ) : (
                                            <SubMenu label="Presentation Bulk Enable">
                                                <MenuItem
                                                    onClick={() => {
                                                        setLoading((prev) => ({ ...prev, status: true }))
                                                        bulkAllRequestPresentation({
                                                            conferenceId,
                                                            trackId: null,
                                                            isRequest: true,
                                                        }).finally(() => {
                                                            setSync(uuid())
                                                            setLoading((prev) => ({ ...prev, status: false }))
                                                        })
                                                    }}
                                                >
                                                    All Tracks
                                                </MenuItem>
                                                {tracks?.map((track) => (
                                                    <MenuItem
                                                        onClick={() => {
                                                            setLoading((prev) => ({ ...prev, status: true }))
                                                            bulkAllRequestPresentation({
                                                                conferenceId,
                                                                trackId: track.id,
                                                                isRequest: true,
                                                            }).finally(() => {
                                                                setSync(uuid())
                                                                setLoading((prev) => ({ ...prev, status: false }))
                                                            })
                                                        }}
                                                        key={track.id}
                                                    >
                                                        {track.name}
                                                    </MenuItem>
                                                ))}
                                            </SubMenu>
                                        )}

                                        {roleName === ROLES_NAME.TRACK_CHAIR ? (
                                            <MenuItem
                                                onClick={() => {
                                                    setLoading((prev) => ({ ...prev, status: true }))
                                                    bulkAllRequestPresentation({
                                                        conferenceId,
                                                        trackId,
                                                        isRequest: false,
                                                    }).finally(() => {
                                                        setSync(uuid())
                                                        setLoading((prev) => ({ ...prev, status: false }))
                                                    })
                                                }}
                                            >
                                                Presentation Bulk Disable
                                            </MenuItem>
                                        ) : (
                                            <SubMenu label="Presentation Bulk Disable">
                                                <MenuItem
                                                    onClick={() => {
                                                        setLoading((prev) => ({ ...prev, status: true }))
                                                        bulkAllRequestPresentation({
                                                            conferenceId,
                                                            trackId: null,
                                                            isRequest: false,
                                                        }).finally(() => {
                                                            setSync(uuid())
                                                            setLoading((prev) => ({ ...prev, status: false }))
                                                        })
                                                    }}
                                                >
                                                    All Tracks
                                                </MenuItem>
                                                {tracks?.map((track) => (
                                                    <MenuItem
                                                        onClick={() => {
                                                            setLoading((prev) => ({ ...prev, status: true }))
                                                            bulkAllRequestPresentation({
                                                                conferenceId,
                                                                trackId: track.id,
                                                                isRequest: false,
                                                            }).finally(() => {
                                                                setSync(uuid())
                                                                setLoading((prev) => ({ ...prev, status: false }))
                                                            })
                                                        }}
                                                        key={track.id}
                                                    >
                                                        {track.name}
                                                    </MenuItem>
                                                ))}
                                            </SubMenu>
                                        )}
                                    </Menu>
                                    <SyncComponent
                                        setSync={() => {
                                            setSync(uuid())
                                            refetch()
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Box ml={1} mb={2}>
                                <ListItem
                                    itemName="Conference name"
                                    value={conferenceFullName}
                                    itemWidth={1.5}
                                    valueWidth={10.5}
                                    outerStyle={{ boxShadow: 'none', my: 1 }}
                                />
                                <ListItem
                                    itemName="Short name"
                                    value={conferenceName}
                                    itemWidth={1.5}
                                    valueWidth={10.5}
                                    outerStyle={{ boxShadow: 'none', my: 1 }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Box
                        sx={{
                            mb: 2,
                            backgroundColor: AppStyles.colors['#F5F5F5'],
                            px: 2,
                            py: 2,
                            borderRadius: 2,
                            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',
                        }}
                    >
                        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Camera Ready</Typography>
                        <Box display="flex" justifyContent={'space-between'} mb={1}>
                            <Button
                                onClick={() => {
                                    if (clickFilter.cameraReadyRequest === false) {
                                        setTab(TAB_MANUSCRIPT.CAMERA_READY)
                                        setAggreType('requestedforcameraready')
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            cameraReadyRequest: true,
                                            cameReadySubmitted: false,
                                            cameraReadyNotSubmitted: false,
                                            registerPapers: false,
                                            notRegisterPapers: false,
                                            presentationRequest: false,
                                            presentationSubmitted: false,
                                            presentationNotSubmitted: false,
                                        }))
                                    } else {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            cameraReadyRequest: false,
                                        }))
                                    }
                                }}
                                variant={clickFilter.cameraReadyRequest ? 'contained' : 'outlined'}
                                disableElevation
                                sx={{
                                    textTransform: 'none',
                                    boxShadow: statisticShow?.NumberOfCameraReadies && '#1976D2 2.4px 2.4px 3.2px',
                                    ':disabled': {
                                        boxShadow: statisticShow?.NumberOfCameraReadies && '#1976D2 2.4px 2.4px 3.2px',
                                    },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfCameraReadyRequestedPapers === 0}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of camera ready requested papers"
                                    placement="bottom"
                                >
                                    <Info
                                        fontSize="small"
                                        color={
                                            statisData?.numberOfCameraReadyRequestedPapers !== 0 ? 'primary' : 'inherit'
                                        }
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                Number of Camera Ready Requested Papers:{' '}
                                {statisData?.numberOfCameraReadyRequestedPapers
                                    ? statisData?.numberOfCameraReadyRequestedPapers
                                    : 0}
                            </Button>

                            <Button
                                onClick={() => {
                                    if (clickFilter.cameReadySubmitted === false) {
                                        changeIndexHandler(null, TAB_MANUSCRIPT.ALL)
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            cameraReadyRequest: false,
                                            cameReadySubmitted: true,
                                            cameraReadyNotSubmitted: false,
                                            registerPapers: false,
                                            notRegisterPapers: false,
                                            presentationRequest: false,
                                            presentationSubmitted: false,
                                            presentationNotSubmitted: false,
                                        }))
                                    } else {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            cameReadySubmitted: false,
                                        }))
                                    }
                                }}
                                variant={clickFilter.cameReadySubmitted ? 'contained' : 'outlined'}
                                disableElevation
                                sx={{
                                    textTransform: 'none',
                                    // boxShadow: statisticShow?.NumberOfCameraReadies && '#1976D2 2.4px 2.4px 3.2px',
                                    ':disabled': {
                                        // boxShadow: statisticShow?.NumberOfCameraReadies && '#1976D2 2.4px 2.4px 3.2px',
                                    },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfPapersWithCameraReadySubmitted === 0}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of papers with camera ready submitted"
                                    placement="bottom"
                                >
                                    <Info
                                        color={
                                            statisData?.numberOfPapersWithCameraReadySubmitted !== 0
                                                ? 'primary'
                                                : 'inherit'
                                        }
                                        fontSize="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                Number of Papers with Camera Ready Submitted:{' '}
                                {statisData?.numberOfPapersWithCameraReadySubmitted
                                    ? statisData?.numberOfPapersWithCameraReadySubmitted
                                    : 0}
                            </Button>

                            <Button
                                onClick={() => {
                                    if (clickFilter.cameraReadyNotSubmitted === false) {
                                        setTab(TAB_MANUSCRIPT.CAMERA_READY)
                                        setAggreType('camerareadynotyetsubmitted')
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            cameraReadyRequest: false,
                                            cameReadySubmitted: false,
                                            cameraReadyNotSubmitted: true,
                                            registerPapers: false,
                                            notRegisterPapers: false,
                                            presentationRequest: false,
                                            presentationSubmitted: false,
                                            presentationNotSubmitted: false,
                                        }))
                                    } else {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            cameraReadyNotSubmitted: false,
                                        }))
                                    }
                                }}
                                variant={clickFilter.cameraReadyNotSubmitted ? 'contained' : 'outlined'}
                                disableElevation
                                sx={{
                                    textTransform: 'none',
                                    // boxShadow: statisticShow?.NumberOfCameraReadies && '#1976D2 2.4px 2.4px 3.2px',
                                    ':disabled': {
                                        // boxShadow: statisticShow?.NumberOfCameraReadies && '#1976D2 2.4px 2.4px 3.2px',
                                    },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfPapersWithCameraReadyNotYetSubmitted === 0}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of papers with camera ready not yet submitted = Number of camera ready requested papers - Number of papers with camera ready submitted"
                                    placement="bottom"
                                >
                                    <Info
                                        color={
                                            statisData?.numberOfPapersWithCameraReadyNotYetSubmitted !== 0
                                                ? 'primary'
                                                : 'inherit'
                                        }
                                        fontSize="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                Number of Papers with Camera Ready not yet Submitted:{' '}
                                {statisData?.numberOfPapersWithCameraReadyNotYetSubmitted
                                    ? statisData?.numberOfPapersWithCameraReadyNotYetSubmitted
                                    : 0}
                            </Button>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent={'space-between'}>
                        <Box
                            width="26%"
                            sx={{
                                mb: 2,
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                px: 2,
                                py: 2,
                                borderRadius: 2,
                                boxShadow:
                                    'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',
                            }}
                        >
                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Registration</Typography>
                            <Box display="flex" justifyContent={'space-between'} mb={1}>
                                <Button
                                    onClick={() => {
                                        if (clickFilter.registerPapers === false) {
                                            changeIndexHandler(null, TAB_MANUSCRIPT.REGISTERED)
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                cameraReadyRequest: false,
                                                cameReadySubmitted: false,
                                                cameraReadyNotSubmitted: false,
                                                registerPapers: true,
                                                notRegisterPapers: false,
                                                presentationRequest: false,
                                                presentationSubmitted: false,
                                                presentationNotSubmitted: false,
                                            }))
                                        } else {
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                registerPapers: false,
                                            }))
                                        }
                                    }}
                                    variant={clickFilter.registerPapers ? 'contained' : 'outlined'}
                                    disableElevation
                                    sx={{
                                        textTransform: 'none',
                                        boxShadow:
                                            statisticShow?.NumberOfSuccessfullyRegisteredManuscripts &&
                                            '#1976D2 2.4px 2.4px 3.2px',
                                        ':disabled': {
                                            boxShadow:
                                                statisticShow?.NumberOfSuccessfullyRegisteredManuscripts &&
                                                '#1976D2 2.4px 2.4px 3.2px',
                                        },
                                        position: 'relative',
                                    }}
                                    disabled={statisData?.numberOfRegisteredPapers === 0}
                                >
                                    <Tooltip
                                        TransitionComponent={Zoom}
                                        title="Number of registered papers"
                                        placement="bottom"
                                    >
                                        <Info
                                            color={statisData?.numberOfRegisteredPapers !== 0 ? 'primary' : 'inherit'}
                                            fontSize="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                transform: `translate(50%, -50%)`,
                                            }}
                                        />
                                    </Tooltip>
                                    Registered Papers:{' '}
                                    {statisData?.numberOfRegisteredPapers ? statisData?.numberOfRegisteredPapers : 0}
                                </Button>

                                <Button
                                    onClick={() => {
                                        if (clickFilter.notRegisterPapers === false) {
                                            setTab(TAB_MANUSCRIPT.CAMERA_READY)
                                            setAggreType('unregistered')
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                cameraReadyRequest: false,
                                                cameReadySubmitted: false,
                                                cameraReadyNotSubmitted: false,
                                                registerPapers: false,
                                                notRegisterPapers: true,
                                                presentationRequest: false,
                                                presentationSubmitted: false,
                                                presentationNotSubmitted: false,
                                            }))
                                        } else {
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                notRegisterPapers: false,
                                            }))
                                        }
                                    }}
                                    variant={clickFilter.notRegisterPapers ? 'contained' : 'outlined'}
                                    disableElevation
                                    sx={{
                                        textTransform: 'none',
                                        // boxShadow:
                                        //     statisticShow?.NumberOfSuccessfullyRegisteredManuscripts &&
                                        //     '#1976D2 2.4px 2.4px 3.2px',
                                        ':disabled': {
                                            // boxShadow:
                                            //     statisticShow?.NumberOfSuccessfullyRegisteredManuscripts &&
                                            //     '#1976D2 2.4px 2.4px 3.2px',
                                        },
                                        position: 'relative',
                                    }}
                                    disabled={statisData?.numberOfUnregisteredPapers === 0}
                                >
                                    <Tooltip
                                        TransitionComponent={Zoom}
                                        title="Number of unregistered papers = Number of papers with camera ready submitted - Number of registered papers"
                                        placement="bottom"
                                    >
                                        <Info
                                            color={statisData?.numberOfUnregisteredPapers !== 0 ? 'primary' : 'inherit'}
                                            fontSize="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                transform: `translate(50%, -50%)`,
                                            }}
                                        />
                                    </Tooltip>
                                    Unregistered Papers:{' '}
                                    {statisData?.numberOfUnregisteredPapers
                                        ? statisData?.numberOfUnregisteredPapers
                                        : 0}
                                </Button>
                            </Box>
                        </Box>
                        <Box
                            width="65%"
                            sx={{
                                mb: 2,
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                px: 2,
                                py: 2,
                                borderRadius: 2,
                                boxShadow:
                                    'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',
                            }}
                        >
                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Presentation</Typography>
                            <Box display="flex" justifyContent={'space-between'} mb={1}>
                                <Button
                                    onClick={() => {
                                        if (clickFilter.presentationRequest === false) {
                                            changeIndexHandler(null, TAB_MANUSCRIPT.REGISTER_PRESENTATION)
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                cameraReadyRequest: false,
                                                cameReadySubmitted: false,
                                                cameraReadyNotSubmitted: false,
                                                registerPapers: false,
                                                notRegisterPapers: false,
                                                presentationRequest: true,
                                                presentationSubmitted: false,
                                                presentationNotSubmitted: false,
                                            }))
                                        } else {
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                presentationRequest: false,
                                            }))
                                        }
                                    }}
                                    variant={clickFilter.presentationRequest ? 'contained' : 'outlined'}
                                    disableElevation
                                    sx={{
                                        textTransform: 'none',
                                        boxShadow:
                                            statisticShow?.NumberOfPresentationRequestedManuscripts &&
                                            '#1976D2 2.4px 2.4px 3.2px',
                                        ':disabled': {
                                            boxShadow:
                                                statisticShow?.NumberOfPresentationRequestedManuscripts &&
                                                '#1976D2 2.4px 2.4px 3.2px',
                                        },
                                        position: 'relative',
                                    }}
                                    disabled={statisData?.numberOfPresentationRequestedPapers === 0}
                                >
                                    <Tooltip
                                        TransitionComponent={Zoom}
                                        title="Number of presentation requested papers"
                                        placement="bottom"
                                    >
                                        <Info
                                            color={
                                                statisData?.numberOfPresentationRequestedPapers !== 0
                                                    ? 'primary'
                                                    : 'inherit'
                                            }
                                            fontSize="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                transform: `translate(50%, -50%)`,
                                            }}
                                        />
                                    </Tooltip>
                                    Presentation Requested Papers:{' '}
                                    {statisData?.numberOfPresentationRequestedPapers
                                        ? statisData?.numberOfPresentationRequestedPapers
                                        : 0}
                                </Button>

                                <Button
                                    onClick={() => {
                                        if (clickFilter.presentationSubmitted === false) {
                                            changeIndexHandler(null, TAB_MANUSCRIPT.PRESENTED)
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                cameraReadyRequest: false,
                                                cameReadySubmitted: false,
                                                cameraReadyNotSubmitted: false,
                                                registerPapers: false,
                                                notRegisterPapers: false,
                                                presentationRequest: false,
                                                presentationSubmitted: true,
                                                presentationNotSubmitted: false,
                                            }))
                                        } else {
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                presentationSubmitted: false,
                                            }))
                                        }
                                    }}
                                    variant={clickFilter.presentationSubmitted ? 'contained' : 'outlined'}
                                    disableElevation
                                    sx={{
                                        textTransform: 'none',
                                        boxShadow:
                                            statisticShow?.NumberOfPresentationSubmittedManuscripts &&
                                            '#1976D2 2.4px 2.4px 3.2px',
                                        ':disabled': {
                                            boxShadow:
                                                statisticShow?.NumberOfPresentationSubmittedManuscripts &&
                                                '#1976D2 2.4px 2.4px 3.2px',
                                        },
                                        position: 'relative',
                                    }}
                                    disabled={statisData?.numberOfPapersWithPresentationSubmitted === 0}
                                >
                                    <Tooltip
                                        TransitionComponent={Zoom}
                                        title="Number of papers with presentation submitted"
                                        placement="bottom"
                                    >
                                        <Info
                                            color={
                                                statisData?.numberOfPapersWithPresentationSubmitted !== 0
                                                    ? 'primary'
                                                    : 'inherit'
                                            }
                                            fontSize="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                transform: `translate(50%, -50%)`,
                                            }}
                                        />
                                    </Tooltip>
                                    Papers with Presentation Submitted:{' '}
                                    {statisData?.numberOfPapersWithPresentationSubmitted
                                        ? statisData?.numberOfPapersWithPresentationSubmitted
                                        : 0}
                                </Button>

                                <Button
                                    onClick={() => {
                                        if (clickFilter.presentationNotSubmitted === false) {
                                            setTab(TAB_MANUSCRIPT.CAMERA_READY)
                                            setAggreType('presentationnotyetsubmitted')
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                cameraReadyRequest: false,
                                                cameReadySubmitted: false,
                                                cameraReadyNotSubmitted: false,
                                                registerPapers: false,
                                                notRegisterPapers: false,
                                                presentationRequest: false,
                                                presentationSubmitted: false,
                                                presentationNotSubmitted: true,
                                            }))
                                        } else {
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                presentationNotSubmitted: false,
                                            }))
                                        }
                                    }}
                                    variant={clickFilter.presentationNotSubmitted ? 'contained' : 'outlined'}
                                    disableElevation
                                    sx={{
                                        textTransform: 'none',
                                        // boxShadow:
                                        //     statisticShow?.NumberOfPresentationSubmittedManuscripts &&
                                        //     '#1976D2 2.4px 2.4px 3.2px',
                                        ':disabled': {
                                            // boxShadow:
                                            //     statisticShow?.NumberOfPresentationSubmittedManuscripts &&
                                            //     '#1976D2 2.4px 2.4px 3.2px',
                                        },
                                        position: 'relative',
                                    }}
                                    disabled={statisData?.numberOfPapersWithPresentationNotYetSubmitted === 0}
                                >
                                    <Tooltip
                                        TransitionComponent={Zoom}
                                        title="Number of papers with presentation not yet submitted = Number of presentation requested papers - Number of papers with presentation submitted"
                                        placement="bottom"
                                    >
                                        <Info
                                            color={
                                                statisData?.numberOfPapersWithPresentationNotYetSubmitted !== 0
                                                    ? 'primary'
                                                    : 'inherit'
                                            }
                                            fontSize="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                transform: `translate(50%, -50%)`,
                                            }}
                                        />
                                    </Tooltip>
                                    Papers with Presentation not yet Submitted:{' '}
                                    {statisData?.numberOfPapersWithPresentationNotYetSubmitted
                                        ? statisData?.numberOfPapersWithPresentationNotYetSubmitted
                                        : 0}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <TabContext value={tab}>
                    <TabList onChange={changeIndexHandler} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab
                            label={
                                clickFilter.cameraReadyNotSubmitted
                                    ? 'Papers not submitted Camera ready'
                                    : clickFilter.notRegisterPapers
                                    ? 'Unregistered Papers'
                                    : clickFilter.presentationNotSubmitted
                                    ? 'Papers not submitted Presentation'
                                    : 'Request for camera ready'
                            }
                            value={TAB_MANUSCRIPT.CAMERA_READY}
                            sx={{
                                minWidth: 100,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 500,
                                color: AppStyles.colors['#333333'],
                            }}
                        />
                        <Tab
                            label="All manuscripts"
                            value={TAB_MANUSCRIPT.ALL}
                            sx={{
                                minWidth: 100,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 500,
                                color: AppStyles.colors['#333333'],
                            }}
                        />
                        <Tab
                            label="All registered manuscripts"
                            value={TAB_MANUSCRIPT.REGISTERED}
                            sx={{
                                minWidth: 100,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 500,
                                color: AppStyles.colors['#333333'],
                            }}
                        />
                        <Tab
                            label="Request for presentation"
                            value={TAB_MANUSCRIPT.REGISTER_PRESENTATION}
                            sx={{
                                minWidth: 100,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 500,
                                color: AppStyles.colors['#333333'],
                            }}
                        />
                        <Tab
                            label="Presentation-submitted manuscripts"
                            value={TAB_MANUSCRIPT.PRESENTED}
                            sx={{
                                minWidth: 100,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 500,
                                color: AppStyles.colors['#333333'],
                            }}
                        />
                    </TabList>
                    <TabPanel value={TAB_MANUSCRIPT.CAMERA_READY} sx={{ p: 0, pt: 2 }}>
                        <ManuscriptTable
                            columns={columns}
                            tableData={tableData}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            setGlobalFilter={setGlobalFilter}
                            pagination={pagination}
                            loading={!!isLoading}
                            tab={tab}
                            isRefetching={!!isFetching || loading.status}
                            buttonLoading={buttonLoading}
                            handleDownload={handleDownload}
                            setVisibility={setVisibility}
                            columnVisibility={columnVisibility}
                            handleOpenConfirmModal={handleOpenConfirmModal}
                        />
                    </TabPanel>
                    <TabPanel value={TAB_MANUSCRIPT.ALL} sx={{ p: 0, pt: 2 }}>
                        <ManuscriptTable
                            columns={columns}
                            tableData={tableData}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            setGlobalFilter={setGlobalFilter}
                            pagination={pagination}
                            loading={!!isLoading}
                            tab={tab}
                            isRefetching={!!isFetching || loading.status}
                            buttonLoading={buttonLoading}
                            handleDownload={handleDownload}
                            setVisibility={setVisibility}
                            columnVisibility={columnVisibility}
                            handleOpenConfirmModal={handleOpenConfirmModal}
                        />
                    </TabPanel>
                    <TabPanel value={TAB_MANUSCRIPT.REGISTERED} sx={{ p: 0, pt: 2 }}>
                        <ManuscriptTable
                            columns={columns}
                            tableData={tableData}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            setGlobalFilter={setGlobalFilter}
                            pagination={pagination}
                            loading={!!isLoading}
                            tab={tab}
                            isRefetching={!!isFetching || loading.status}
                            buttonLoading={buttonLoading}
                            handleDownload={handleDownload}
                            setVisibility={setVisibility}
                            columnVisibility={columnVisibility}
                            handleOpenConfirmModal={handleOpenConfirmModal}
                        />
                    </TabPanel>
                    <TabPanel value={TAB_MANUSCRIPT.REGISTER_PRESENTATION} sx={{ p: 0, pt: 2 }}>
                        <ManuscriptTable
                            columns={columns}
                            tableData={tableData}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            setGlobalFilter={setGlobalFilter}
                            pagination={pagination}
                            loading={!!isLoading}
                            isRefetching={!!isFetching || loading.status}
                            tab={tab}
                            buttonLoading={buttonLoading}
                            handleDownload={handleDownload}
                            setVisibility={setVisibility}
                            columnVisibility={columnVisibility}
                            handleOpenConfirmModal={handleOpenConfirmModal}
                        />
                    </TabPanel>
                    <TabPanel value={TAB_MANUSCRIPT.PRESENTED} sx={{ p: 0, pt: 2 }}>
                        <ManuscriptTable
                            columns={columns}
                            tableData={tableData}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            setGlobalFilter={setGlobalFilter}
                            pagination={pagination}
                            loading={!!isLoading}
                            isRefetching={!!isFetching || loading.status}
                            tab={tab}
                            buttonLoading={buttonLoading}
                            handleDownload={handleDownload}
                            setVisibility={setVisibility}
                            columnVisibility={columnVisibility}
                            handleOpenConfirmModal={handleOpenConfirmModal}
                        />
                    </TabPanel>
                </TabContext>
            </Container>
        </ConferenceDetail>
    )
}

export default Manuscript
