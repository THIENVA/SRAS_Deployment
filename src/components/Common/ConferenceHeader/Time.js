import { useEffect, useState } from 'react'

import moment from 'moment'
import { v4 as uuid } from 'uuid'

import { ArrowDropDown, Circle, Sync } from '@mui/icons-material'
import { Box, Button, IconButton, Tooltip, Typography, Zoom } from '@mui/material'

import { useSysDate } from '~/api/common/sysdate'
import { AppStyles } from '~/constants/colors'

const Time = ({ conferenceFullName, conferenceName, conferenceStatus, openConferenceMenu, openConference }) => {
    const { getSysTime } = useSysDate()
    const [value, setValue] = useState(new Date())
    const [uniqueId, setUniqueId] = useState(uuid())

    useEffect(() => {
        const controller = new AbortController()

        const getSysDate = getSysTime(controller.signal)

        Promise.all([getSysDate]).then((response) => {
            const sysDate = response[0].data
            setValue(new Date(sysDate))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uniqueId])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setValue((prevTime) => new Date(prevTime.getTime() + 1000)) // Increment by 1 second
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uniqueId])

    return (
        <Box mb={1} display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
                <Typography sx={{ color: AppStyles.colors['#F7F7F7'], ml: 2, fontWeight: 'bold', fontSize: 24 }}>
                    {moment(value).format('DD/MM/YYYY, h:mm:ss A')}
                </Typography>
                <IconButton
                    onClick={() => setUniqueId(uuid())}
                    size="small"
                    sx={{ border: '0.5px solid #f7f7f7', ml: 2, color: '#f7f7f7' }}
                >
                    <Sync fontSize="small" sx={{ color: '#f7f7f7' }} />
                </IconButton>
            </Box>
            <Box display="flex" alignItems="center">
                <Tooltip title={`Status: ${conferenceStatus}`} TransitionComponent={Zoom} placement="left">
                    <Circle
                        fontSize="small"
                        sx={{
                            color:
                                conferenceStatus === 'Ongoing'
                                    ? '#f57c00'
                                    : conferenceStatus === 'Overdue'
                                    ? '#aa2e25'
                                    : conferenceStatus === 'Finished'
                                    ? '#689f38'
                                    : '#e0e0e0',
                        }}
                    />
                </Tooltip>
                <Box display="flex" alignItems="center">
                    <Typography sx={{ color: AppStyles.colors['#F7F7F7'], ml: 1, fontWeight: 'bold' }} variant="body1">
                        {conferenceFullName ? `${conferenceFullName}` : ''}
                    </Typography>
                    {conferenceName && (
                        <Box ml={1}>
                            <Button
                                sx={{
                                    color: (theme) =>
                                        `${
                                            openConferenceMenu
                                                ? theme.palette.primary.main
                                                : AppStyles.colors['#F7F7F7']
                                        }`,
                                    backgroundColor: (theme) =>
                                        `${
                                            openConferenceMenu
                                                ? AppStyles.colors['#F7F7F7']
                                                : theme.palette.primary.main
                                        }`,
                                    fontWeight: 'bold',
                                    fontSize: 15,
                                }}
                                onClick={openConference}
                                endIcon={<ArrowDropDown />}
                            >
                                ({conferenceName})
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default Time
