import { useState } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'
import { useParams } from 'react-router-dom'

import { DownloadOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, LinearProgress, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import DashboardBox from '~/components/DashboardBox'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const Reports = () => {
    const showSnackbar = useSnackbar()
    const { conferenceId } = useParams()
    const {
        trackConference: { trackId },
        roleConference: { roleName },
        conference: { conferenceName },
    } = useAppSelector((state) => state.conference)
    const [buttonLoading, setButtonLoading] = useState(false)

    const track = roleName === ROLES_NAME.CHAIR ? null : trackId

    const handleDownload = () => {
        setButtonLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/conference-presentations-aggregation-file`,
            method: 'GET',
            responseType: 'blob',
            params: {
                conferenceId: conferenceId,
                trackId: track,
            },
        })
            .then((response) => {
                saveAs(response.data, `${conferenceName}_presentations.zip`)
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

    // useEffect(() => {
    //     axios({
    //         url: `${APP_API_URL}/submissions/conference-presentations-aggregation-file`,
    //         method: 'GET',
    //         responseType: 'blob',
    //     })
    //         .then((response) => {
    //             if (response.data.size) {
    //                 const zip = new JSZip()
    //                 return zip.loadAsync(response.data).then((zip) => {
    //                     const filesPromises = []
    //                     Object.keys(zip.files).forEach((filename) => {
    //                         const filePromise = zip.files[filename]
    //                             .async('blob')
    //                             .then((fileData) => {
    //                                 const newBlob = new Blob([fileData], { type: 'application/octet-stream' })
    //                                 return new File([newBlob], filename, { type: 'application/octet-stream' })
    //                             })
    //                             .catch(() => {
    //                                 return null
    //                             })
    //                         filesPromises.push(filePromise)
    //                     })
    //                     console.log(filesPromises)
    //                 })
    //             }
    //         })
    //         .catch(() => {
    //             showSnackbar({
    //                 severity: 'error',
    //                 children: 'Can not download file. Please try again later',
    //             })
    //         })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])
    return (
        <Box sx={{ mt: 3 }}>
            <DashboardBox header={'DOWNLOAD REPORTS'} contentStyle={{ px: 4, py: 3 }}>
                <Box display="flex" alignItems="center">
                    <Typography
                        fontWeight={500}
                        sx={{
                            color: grey[600],
                        }}
                        fontSize="1.2rem"
                        width={300}
                    >
                        Conference Presentation Aggregation File:
                    </Typography>
                    <Box>
                        <LoadingButton
                            variant="outlined"
                            sx={{
                                height: 36,
                                color: AppStyles.colors['#027A9D'],
                                borderColor: AppStyles.colors['#027A9D'],
                                ':hover': {
                                    borderColor: AppStyles.colors['#027A9D'],
                                },
                            }}
                            size="small"
                            startIcon={<DownloadOutlined />}
                            disabled={buttonLoading}
                            loadingPosition="start"
                            onClick={() => handleDownload()}
                        >
                            Download Presentation File
                        </LoadingButton>
                        {buttonLoading && (
                            <Box
                                mt={1}
                                sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                                maxWidth={400}
                            >
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                                <Box sx={{ minWidth: 35, mt: 0.5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        This might take several minutes...
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
                {/* <Box display="flex" alignItems="center" mt={3}>
                    <Typography
                        fontWeight={500}
                        sx={{
                            color: grey[600],
                        }}
                        fontSize="1.2rem"
                        width={250}
                    >
                        Conference Archive:
                    </Typography>
                    <LoadingButton
                        variant="outlined"
                        sx={{
                            color: AppStyles.colors['#027A9D'],
                            height: 48,
                            borderColor: AppStyles.colors['#027A9D'],
                            ':hover': {
                                borderColor: AppStyles.colors['#027A9D'],
                            },
                        }}
                        startIcon={<DownloadOutlined />}
                        loading={buttonLoading}
                        loadingPosition="start"
                    >
                        Download Archive
                    </LoadingButton>
                </Box> */}
            </DashboardBox>
        </Box>
    )
}

export default Reports
