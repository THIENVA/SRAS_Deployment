import React, { useEffect, useState } from 'react'

import { v4 as uuid } from 'uuid'

import { Box, Container, InputBase, Paper, Tab, Tabs, Typography } from '@mui/material'
import Header from '~/components/Common/Header'
import SyncComponent from '~/components/SyncComponent'

import AllConference from './AllConference'
import CallForPaperConference from './CallForPaperConference'
import MyConference from './MyConference'

import { useConference } from '~/api/common/conference'
import { AppStyles } from '~/constants/colors'
import { reset } from '~/features/conference'
import { resetTrackSteps } from '~/features/guidelines'
import { resetMessages } from '~/features/message'
import { reset as resetTrackForChair } from '~/features/track-for-chair'
import { useAppDispatch, useAppSelector } from '~/hooks/redux-hooks'

const TabPanel = (props) => {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ mt: 3 }}>{children}</Box>}
        </div>
    )
}

const Conferences = () => {
    const dispatch = useAppDispatch()
    const [tab, setTab] = React.useState(0)
    const [myConferenceCount, setMyConferenceCount] = useState(0)
    const [AllConferenceCount, setAllConferenceCount] = useState(0)
    const [callPaperConferenceCount, setCallPaperConferenceCount] = useState(0)
    // const showSnackbar = useSnackbar()
    const { userId } = useAppSelector((state) => state.auth)
    const { getConferences } = useConference()
    const [searchInput, setSearchInput] = useState('')
    const [uniqueId, setUnique] = useState(uuid())

    const handleChange = (_, newValue) => {
        setTab(newValue)
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const thirdController = new AbortController()
        const myConferenceGet = getConferences(userId, controller.signal)
        const allConferenceGet = getConferences(null, secondController.signal)
        const callForPaperConference = getConferences(null, thirdController.signal, null, null, null, true)

        Promise.all([myConferenceGet, allConferenceGet, callForPaperConference])
            .then((response) => {
                if (response[2].data) {
                    const callForPaperConferenceTotal = response[2].data.totalCount
                    setCallPaperConferenceCount(callForPaperConferenceTotal)
                }
                if (response[0].data) {
                    const myConferenceTotal = response[0].data.totalCount
                    setMyConferenceCount(myConferenceTotal)
                }
                if (response[1].data) {
                    const allConferenceTotal = response[1].data.totalCount
                    setAllConferenceCount(allConferenceTotal)
                }
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })

        dispatch(reset())
        dispatch(resetTrackSteps())
        dispatch(resetTrackForChair())
        dispatch(resetMessages())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <React.Fragment>
            <Header />
            <Container maxWidth="xl">
                <Box display="flex" alignItems="baseline" justifyContent="space-between">
                    <Typography fontWeight={600} variant="h5" sx={{ mt: 2, color: '#282828' }}>
                        Conferences
                    </Typography>
                    <SyncComponent setSync={() => setUnique(uuid())} />
                </Box>
                <Box sx={{ width: '100%', mt: 2, bgcolor: (theme) => theme.palette.primary.main }}>
                    <Box display="flex" alignItems={'center'} justifyContent={'space-between'}>
                        <Tabs
                            value={tab}
                            onChange={handleChange}
                            sx={{
                                '& .MuiTab-root': {
                                    color: AppStyles.colors['#F7F7F7'],
                                },
                                '& .Mui-selected': {
                                    color: AppStyles.colors['#004DFF'],
                                    backgroundColor: AppStyles.colors['#F7F7F7'],
                                },
                            }}
                        >
                            <Tab label={`My conferences (${myConferenceCount})`} />
                            <Tab label={`All conferences (${AllConferenceCount})`} />
                            <Tab label={`Open For Submission (${callPaperConferenceCount})`} />
                        </Tabs>
                        <Paper
                            component="form"
                            sx={{
                                mr: 3,
                                px: 1,
                                alignItems: 'center',
                                borderRadius: 2,
                                border: '1px solid #0077CC',
                                width: 300,
                            }}
                        >
                            <InputBase
                                name="searchValue"
                                onChange={(event) => setSearchInput(event.target.value)}
                                value={searchInput}
                                placeholder="type to search..."
                            />
                        </Paper>
                    </Box>
                </Box>
                <TabPanel value={tab} index={0}>
                    <MyConference uniqueId={uniqueId} searchInput={searchInput} />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <AllConference uniqueId={uniqueId} searchInput={searchInput} />
                </TabPanel>
                <TabPanel value={tab} index={2}>
                    <CallForPaperConference uniqueId={uniqueId} searchInput={searchInput} />
                </TabPanel>
            </Container>
        </React.Fragment>
    )
}

export default Conferences
