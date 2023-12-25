import { enGB } from 'date-fns/locale'
import moment from 'moment'

import { RestartAlt } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { AppBar, Box, Container, FormControl, MenuItem, Select, TextField, Toolbar, Typography } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import SyncComponent from '~/components/SyncComponent'

import { AppStyles } from '~/constants/colors'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
            width: 800,
        },
    },
}

const HeaderSysDate = ({
    value,
    handleChange,
    handleResetTime,
    handleConferenceChange,
    conferences,
    conference,
    track,
    handleTrackChange,
    tracks,
    handleUpdateTime,
    timeLoading,
    minDate,
    handleSyncData,
}) => {
    const { reset, update } = timeLoading
    return (
        <AppBar position="fixed" sx={{ backgroundColor: AppStyles.colors['#FAFBFF'] }}>
            <Toolbar disableGutters>
                <Container
                    sx={{
                        display: 'flex',
                        py: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                    maxWidth="xl"
                >
                    <Box display="flex" alignItems={'center'}>
                        <Typography sx={{ color: AppStyles.colors['#004DFF'], fontWeight: 'bold', fontSize: 28 }}>
                            AppTime:
                        </Typography>
                        <Typography
                            sx={{ color: AppStyles.colors['#333333'], ml: 2, fontWeight: 'bold', fontSize: 24 }}
                        >
                            {moment(value).format('DD/MM/YYYY, h:mm A')}
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="flex-start" flexDirection="column" my={1}>
                        <Box display="flex" alignItems={'center'}>
                            <Typography
                                width={140}
                                sx={{ color: AppStyles.colors['#333333'], fontWeight: 'bold', fontSize: 16 }}
                            >
                                Set App Time:{' '}
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                                <DateTimePicker
                                    ampm={true}
                                    label="Set App Time"
                                    value={value}
                                    onChange={handleChange}
                                    minDate={minDate}
                                    renderInput={(params) => (
                                        <TextField {...params} size="small" sx={{ maxWidth: 220 }} />
                                    )}
                                />
                            </LocalizationProvider>
                            <LoadingButton
                                variant="contained"
                                loading={update}
                                disabled={update}
                                sx={{ textTransform: 'none', ml: 1 }}
                                onClick={() => handleUpdateTime()}
                            >
                                Update
                            </LoadingButton>
                        </Box>
                        <Box display="flex" alignItems={'center'} mt={1}>
                            <Typography width={140} sx={{ color: AppStyles.colors['#333333'], fontWeight: 'bold' }}>
                                Reset to Now:{' '}
                            </Typography>
                            <LoadingButton
                                loading={reset}
                                loadingPosition="end"
                                disabled={reset}
                                variant="outlined"
                                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                endIcon={<RestartAlt />}
                                onClick={() => handleResetTime()}
                            >
                                Reset
                            </LoadingButton>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="flex-start" flexDirection="column">
                        <Box display="flex" alignItems={'center'}>
                            <Typography width={140} sx={{ color: AppStyles.colors['#333333'], fontWeight: 'bold' }}>
                                Conference:{' '}
                            </Typography>
                            <FormControl sx={{ width: 240 }}>
                                <Select
                                    size="small"
                                    value={conference}
                                    onChange={handleConferenceChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                >
                                    {conferences.map(
                                        (value, index) =>
                                            value.conferenceStatus !== 'Finished' &&
                                            value.conferenceStatus !== 'Overdue' && (
                                                <MenuItem key={index} value={value.id}>
                                                    {value.fullName} ({value.shortName})
                                                </MenuItem>
                                            )
                                    )}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box display="flex" alignItems={'center'} mt={1}>
                            <Typography width={140} sx={{ color: AppStyles.colors['#333333'], fontWeight: 'bold' }}>
                                Track Name:{' '}
                            </Typography>
                            <FormControl sx={{ width: 240 }}>
                                <Select
                                    size="small"
                                    disabled={!conference}
                                    value={track}
                                    onChange={handleTrackChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {tracks.map((value, index) => (
                                        <MenuItem key={index} value={value.id}>
                                            {value.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box w="1" display="flex" justifyContent="flex-end" mt={1}>
                            <SyncComponent setSync={handleSyncData} buttonStyle={{ ml: 0 }} />
                        </Box>
                    </Box>
                </Container>
            </Toolbar>
        </AppBar>
    )
}

export default HeaderSysDate
