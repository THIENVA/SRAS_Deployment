import { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory } from 'react-router-dom'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Grid, Skeleton, Typography } from '@mui/material'
import InputField from '~/components/InputField'

import ConferenceDetail from '../ConferenceDetail'
import SelectSubject from './SelectSubject'

import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useSubjectArea } from '~/api/common/subjectArea'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const SelectSubjectAreas = (props) => {
    const conferenceDetails = props.location.state || {}
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)

    const { conferenceId } = useParams()
    const { getSubjectAreas, reviewerSubjectArea } = useSubjectArea()
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const [checkboxes, setCheckboxes] = useState([])
    const [isDisable, setDisable] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const handleSubmit = () => {
        setDisable(true)
        const updatedCheckboxes = cloneDeep(checkboxes)
        const filteredArray = updatedCheckboxes.filter((item) => item.primary || item.secondary)
        const postData = filteredArray.map(({ id, primary }) => ({
            subjectAreaId: id,
            isPrimary: primary,
        }))
        const info = {
            accountId: conferenceDetails.accountId,
            conferenceId: conferenceId,
            trackId: conferenceDetails.trackId,
            subjectAreas: postData,
        }

        if (postData) {
            reviewerSubjectArea(info)
                .then(() => {
                    // const data = response.data
                    roleName === ROLES_NAME.REVIEWER
                        ? history.push(`/conferences/${conferenceId}/my-reviewing`)
                        : history.push(`/conferences`)
                    // showSnackbar({ severity: 'success', children: `${data.message}` })
                })
                .catch((err) => {
                    showSnackbar({
                        severity: 'error',
                        children: `${err.message}`,
                    })
                })
                .finally(() => {
                    setDisable(false)
                })
        }
    }

    const handleCheckboxChange = (index, type) => {
        if (type === 'primary') {
            const updatedCheckboxes = cloneDeep(checkboxes)
            Object.keys(updatedCheckboxes).forEach((key) => {
                updatedCheckboxes[key].primary = key === index
                if (key === index) {
                    updatedCheckboxes[key].secondary = false
                }
            })

            setCheckboxes(updatedCheckboxes)
        } else if (type === 'secondary') {
            const updatedCheckboxes = cloneDeep(checkboxes)
            if (updatedCheckboxes[index].primary === false) {
                updatedCheckboxes[index].secondary = !updatedCheckboxes[index].secondary
            }
            setCheckboxes(updatedCheckboxes)
        }
    }

    useEffect(() => {
        if (Object.keys(conferenceDetails).length === 0) {
            history.push('/conferences')
        }
        setLoading(true)
        const controller = new AbortController()
        const signal = controller.signal
        if (conferenceDetails.trackId) {
            getSubjectAreas(conferenceDetails.trackId, signal)
                .then((response) => {
                    const data = response.data.map(({ id, name }) => ({
                        id: id,
                        name: name,
                        primary: false,
                        secondary: false,
                    }))
                    if (conferenceDetails.subjectAreas) {
                        for (const conference of conferenceDetails.subjectAreas) {
                            const matchingData = data.find((item) => item.name === conference.subjectAreaName)
                            if (matchingData) {
                                if (conference.isPrimary) {
                                    matchingData.primary = true
                                } else {
                                    matchingData.secondary = true
                                }
                            }
                        }
                    }
                    setCheckboxes(data)
                })
                .catch((err) => {
                    const error = err.response.data.error.code
                        ? err.response.data.error.code
                        : 'Something went wrong, please try again later'
                    showSnackbar({
                        severity: 'error',
                        children: `${error}`,
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ConferenceDetail>
            <Box maxWidth="lg" m="0 auto">
                <Typography mb={3} sx={{ fontSize: 28, fontWeight: 600 }}>
                    Select Subject Areas
                </Typography>
                <InputField
                    text="Track"
                    isRequire={false}
                    textStyle={{ fontSize: 18 }}
                    boxStyle={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    textBoxStyle={{ width: 80 }}
                >
                    <Box ml={3}>
                        <Typography sx={{ fontSize: 18 }}>{conferenceDetails.trackName}</Typography>
                    </Box>
                </InputField>
                <InputField
                    text="User"
                    isRequire={false}
                    textStyle={{ fontSize: 18 }}
                    boxStyle={{ display: 'flex', alignItems: 'center', mb: 3 }}
                    textBoxStyle={{ width: 80 }}
                >
                    <Box ml={3}>
                        <Typography sx={{ fontSize: 18 }}>
                            {conferenceDetails.firstName} {conferenceDetails.lastName} {conferenceDetails.middleName}
                        </Typography>
                    </Box>
                </InputField>
                {isLoading ? (
                    <Skeleton variant="rounded" height={250} width={800} />
                ) : (
                    <Box
                        sx={{
                            px: 2,
                            py: 1,
                            width: 800,
                            boxShadow:
                                'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05)  0px 0.25em 1em',
                        }}
                    >
                        <Grid container sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                            <Grid item xs={4}>
                                <Typography sx={{ color: AppStyles.colors['#495057'], fontWeight: 'bold' }}>
                                    Primary
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography sx={{ color: AppStyles.colors['#495057'], fontWeight: 'bold' }}>
                                    Secondary
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography sx={{ color: AppStyles.colors['#495057'], fontWeight: 'bold' }}>
                                    Title
                                </Typography>
                            </Grid>
                        </Grid>
                        {Object.entries(checkboxes).map(([index, values]) => (
                            <Box key={index}>
                                <SelectSubject
                                    values={values}
                                    handleCheckboxChange={handleCheckboxChange}
                                    index={index}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
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
            </Box>
        </ConferenceDetail>
    )
}

export default SelectSubjectAreas
