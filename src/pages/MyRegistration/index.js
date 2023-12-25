import { useEffect, useMemo, useState } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'
import { useHistory, useParams } from 'react-router-dom'

import { CheckCircle, RequestQuoteOutlined } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Container, Grid, Tab, Typography } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import SyncComponent from '~/components/SyncComponent'

import ConferenceDetail from '../ConferenceDetail'
import ManuscriptTable from './ManuscriptTable'
import OrderInfoModal from './OrderInfoModal'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useGetRegistrationQuery } from '~/api/common/RTKQuery/MyRegistration'
import { useConference } from '~/api/common/conference'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const MyRegistration = () => {
    const tableFontSize = 14
    const { userId } = useAppSelector((state) => state.auth)
    const history = useHistory()
    const showSnackbar = useSnackbar()
    const { getPhase } = useConference()
    const { conferenceId } = useParams()

    const {
        conference: { conferenceName, conferenceFullName },
    } = useAppSelector((state) => state.conference)

    const [buttonLoading, setButtonLoading] = useState(false)
    const [paperInfo, setPaperInfo] = useState(null)
    const [openPaperModal, setOpenPaperModal] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    })
    const [columnVisibility, setVisibility] = useState({
        primarySubjectArea: false,
        secondarySubjectArea: false,
        authors: false,
        isRegistered: true,
        registrationOption: true,
        order: true,
        registrant: true,
        isPresentationSubmitted: false,
        presenters: false,
    })
    const [phase, setPhase] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')

    const track = null

    const { pageIndex, pageSize } = pagination

    const [tab, setTab] = useState('all')

    const {
        data = { items: [], totalCount: 0 },
        isFetching,
        isLoading,
        refetch,
    } = useGetRegistrationQuery({
        aggregationType: tab,
        InclusionText: globalFilter === undefined ? '' : globalFilter,
        conferenceId: conferenceId,
        trackId: track,
        accountId: userId,
        skipCount: pageIndex * pageSize,
        maxResultCount: pageSize,
    })

    const changeIndexHandler = (_, value) => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        setGlobalFilter('')
        // setLoading(true)
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

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        if (conferenceId) {
            getPhase(conferenceId, null, signal)
                .then((response) => {
                    const data = response.data
                    setPhase(data)
                    let maxFactorItem = null
                    let currentDeadlineName

                    data?.forEach((item) => {
                        if (item.currentPhases && item.currentPhases.length > 0) {
                            const maxFactorPhase = item.currentPhases.reduce((prev, current) => {
                                return prev.factor > current.factor ? prev : current
                            })

                            if (!maxFactorItem || maxFactorPhase.factor > maxFactorItem.maxFactor) {
                                maxFactorItem = {
                                    ...item,
                                    maxFactor: maxFactorPhase.factor,
                                }
                            }
                        }
                    })
                    currentDeadlineName = maxFactorItem?.currentPhases
                        ? maxFactorItem.currentPhases[0].deadlineName
                        : ''

                    if (currentDeadlineName !== '') {
                        if (
                            currentDeadlineName === 'Presentation Submission Deadline' ||
                            currentDeadlineName === 'End Date'
                        ) {
                            setVisibility((prev) => ({
                                ...prev,
                                isRegistered: false,
                                registrationOption: false,
                                order: false,
                                registrant: false,
                                isPresentationSubmitted: true,
                                presenters: true,
                            }))
                        }
                    }
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                })
        }
        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId])

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
                        {row.original.subjectAreas
                            .filter((area) => area.isPrimary)
                            .map((area, index) => (
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
                            {row.original.subjectAreas
                                .filter((area) => !area.isPrimary)
                                .map((area, index) => (
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
                        <Typography sx={{ fontSize: 16 }}>
                            {row.original.isRequestedForPresentation === true ? 'Yes' : 'No'}
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
                accessorKey: 'isPresentationSubmitted',
                header: 'Presentation Completely',
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
        []
    )

    return (
        <ConferenceDetail>
            {openPaperModal && <OrderInfoModal open={openPaperModal} handleClose={handleCloseModal} row={paperInfo} />}

            <Container maxWidth="xl">
                <Box mb={2}>
                    <Grid container>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography sx={{ fontSize: 28, fontWeight: 600 }}>My Registration</Typography>
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

                            <SyncComponent setSync={() => refetch()} buttonStyle={{ ml: 0, mt: 1 }} />
                        </Grid>
                        {/* <Grid item xs={7} md={7} lg={7}> */}
                        {/* <Typography color="primary" sx={{ fontSize: 18, fontWeight: 600 }}>
                                Conference Phases
                            </Typography>
                            <PhaseTable phase={phase} /> */}
                        {/* </Grid> */}
                    </Grid>
                </Box>
                <TabContext value={tab}>
                    <TabList onChange={changeIndexHandler} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab
                            label="All manuscripts"
                            value={'all'}
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
                            value={'registered'}
                            sx={{
                                minWidth: 100,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 500,
                                color: AppStyles.colors['#333333'],
                            }}
                        />
                        <Tab
                            label="All presentation"
                            value={'requestedforpresentation'}
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
                            value={'presented'}
                            sx={{
                                minWidth: 100,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 500,
                                color: AppStyles.colors['#333333'],
                            }}
                        />
                    </TabList>
                    <TabPanel value={'all'} sx={{ p: 0, pt: 2 }}>
                        <ManuscriptTable
                            columns={columns}
                            tableData={data?.items ?? []}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            setGlobalFilter={setGlobalFilter}
                            pagination={pagination}
                            loading={!!isLoading}
                            tab={tab}
                            isRefetching={!!isFetching}
                            buttonLoading={buttonLoading}
                            handleDownload={handleDownload}
                            setVisibility={setVisibility}
                            columnVisibility={columnVisibility}
                        />
                    </TabPanel>
                    <TabPanel value={'registered'} sx={{ p: 0, pt: 2 }}>
                        <ManuscriptTable
                            columns={columns}
                            tableData={data?.items ?? []}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            setGlobalFilter={setGlobalFilter}
                            pagination={pagination}
                            loading={!!isLoading}
                            tab={tab}
                            isRefetching={!!isFetching}
                            buttonLoading={buttonLoading}
                            handleDownload={handleDownload}
                            setVisibility={setVisibility}
                            columnVisibility={columnVisibility}
                        />
                    </TabPanel>
                    <TabPanel value={'requestedforpresentation'} sx={{ p: 0, pt: 2 }}>
                        <ManuscriptTable
                            columns={columns}
                            tableData={data?.items ?? []}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            setGlobalFilter={setGlobalFilter}
                            pagination={pagination}
                            loading={!!isLoading}
                            isRefetching={!!isFetching}
                            tab={tab}
                            buttonLoading={buttonLoading}
                            handleDownload={handleDownload}
                            setVisibility={setVisibility}
                            columnVisibility={columnVisibility}
                        />
                    </TabPanel>
                    <TabPanel value={'presented'} sx={{ p: 0, pt: 2 }}>
                        <ManuscriptTable
                            columns={columns}
                            tableData={data?.items ?? []}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            setGlobalFilter={setGlobalFilter}
                            pagination={pagination}
                            loading={!!isLoading}
                            isRefetching={!!isFetching}
                            tab={tab}
                            buttonLoading={buttonLoading}
                            handleDownload={handleDownload}
                            setVisibility={setVisibility}
                            columnVisibility={columnVisibility}
                        />
                    </TabPanel>
                </TabContext>
            </Container>
        </ConferenceDetail>
    )
}

export default MyRegistration
