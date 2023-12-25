import { useEffect, useState } from 'react'

// import MaterialReactTable from 'material-react-table'
import { useHistory, useParams } from 'react-router-dom'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, TextField, Typography } from '@mui/material'
import InputField from '~/components/InputField'

import ConferenceDetail from '../ConferenceDetail'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useUser } from '~/api/common/user'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const EditQuota = (props) => {
    const conferenceDetails = props.location.state || {}

    const { userId } = useAppSelector((state) => state.auth)
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { conferenceId, trackId } = useParams()
    const history = useHistory()
    const showSnackbar = useSnackbar()
    const { addReviewerQuota } = useUser()
    const [quota, setQuota] = useState(conferenceDetails.quota ? conferenceDetails.quota : 0)
    const [isDisable, setDisable] = useState(false)
    const [isChecked, setCheck] = useState(conferenceDetails.quota !== null ? true : false)

    const handleCheck = (event) => {
        setCheck(event.target.checked)
    }

    const handleSubmit = () => {
        // if (quota) {
        setDisable(true)
        addReviewerQuota(userId, conferenceId, trackId, isChecked ? quota : null)
            .then(() => {
                roleName === ROLES_NAME.REVIEWER
                    ? history.push(`/conferences/${conferenceId}/my-reviewing`)
                    : history.push(`/conferences`)
                // showSnackbar({
                //     severity: 'success',
                //     children: 'Quota successfully saved.',
                // })
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, cannot upload question image.',
                })
            })
            .finally(() => {
                setDisable(false)
            })
        // }
    }

    const handleQuotaChange = (event) => {
        const regex = /^[0-9\b]+$/
        if (event.target.value === '' || regex.test(event.target.value)) {
            if (event.target.value === '' || event.target.value < 1) {
                setQuota(0)
            } else {
                setQuota(parseInt(event.target.value))
            }
        }
    }

    useEffect(() => {
        if (Object.keys(conferenceDetails).length === 0) {
            history.push('/conferences')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Typography mb={3} sx={{ fontSize: 28, fontWeight: 600 }}>
                    Edit Quota
                </Typography>
                <InputField
                    text="Track name"
                    isRequire={false}
                    textStyle={{ fontSize: 18 }}
                    boxStyle={{ display: 'flex', alignItems: 'center', mb: 2 }}
                    textBoxStyle={{ width: 200 }}
                >
                    <Box>
                        <Typography sx={{ fontSize: 18 }}>{conferenceDetails.trackName}</Typography>
                    </Box>
                </InputField>
                <InputField
                    text="Conference name"
                    isRequire={false}
                    textStyle={{ fontSize: 18 }}
                    boxStyle={{ display: 'flex', alignItems: 'center', mb: 2 }}
                    textBoxStyle={{ width: 200 }}
                >
                    <Box>
                        <Typography sx={{ fontSize: 18 }}>{conferenceDetails.conferenceName}</Typography>
                    </Box>
                </InputField>
                <InputField
                    text="Quota"
                    isRequire={false}
                    textStyle={{ fontSize: 18 }}
                    boxStyle={{ display: 'flex', mb: 3 }}
                    textBoxStyle={{ width: 200 }}
                >
                    <Box maxWidth={160}>
                        <TextField
                            placeholder="Quota"
                            variant="outlined"
                            sx={{ height: 42 }}
                            size="small"
                            disabled={!isChecked}
                            value={quota}
                            onChange={handleQuotaChange}
                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                        />
                        <FormControl component="fieldset">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        // defaultChecked={isChecked}
                                        checked={isChecked}
                                        onChange={handleCheck}
                                    />
                                }
                                label="Adjust quota"
                            />
                        </FormControl>
                    </Box>
                </InputField>

                <Box
                    sx={{
                        mt: 4,
                        px: 2,
                        py: 2,
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                        backgroundColor: AppStyles.colors['#F8F9FA'],
                        display: 'flex',
                    }}
                >
                    <Box ml={6}>
                        <Button
                            color="error"
                            variant="contained"
                            sx={{ textTransform: 'none', height: 36 }}
                            onClick={() => history.push(`/conferences/${conferenceId}/my-reviewing`)}
                        >
                            Go Back
                        </Button>
                    </Box>
                    <Box ml={4}>
                        <LoadingButton
                            sx={{ textTransform: 'none', height: 36 }}
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isDisable}
                            loading={isDisable}
                            loadingPosition="start"
                            startIcon={<Save />}
                        >
                            Save Changes
                        </LoadingButton>
                    </Box>
                </Box>
            </Container>
        </ConferenceDetail>
    )
}

export default EditQuota
