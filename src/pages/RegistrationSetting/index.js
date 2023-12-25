import { Fragment, useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Container, FormControlLabel, Grid, Switch, Typography, styled } from '@mui/material'
import EmptyData from '~/components/EmptyData'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import ExtraPage from './ExtraPage'
import Member from './Member'
import NewOption from './NewOption'
import RegisterConfig from './RegisterConfig'
import SectionLayout from './SectionLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useRegistration from '~/api/common/registration'
import { AppStyles } from '~/constants/colors'
import { checkForErrors } from '~/utils/commonFunction'

const FreeSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main)
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&:after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main)
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
    },
}))

const freeOption = {
    isZeroVNDPriceTable: true,
    maxValidNumberOfPages: 2147483647,
    isEarlyRegistrationEnabled: false,
    earlyRegistrationDeadline: null,
    maxNumberOfExtraPapers: 0,
    rows: [
        {
            option: 'Free-of-Charge Option',
            earlyRegistration: null,
            regularRegistration: 0,
        },
    ],
}

const RegistrationSetting = () => {
    const showSnackbar = useSnackbar()
    const { conferenceId } = useParams()
    const { getRegistrationSetting, createRegistrationSetting } = useRegistration()
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [openPaperModal, setOpenPaperModal] = useState(false)
    const [registerConfig, setRegisterConfig] = useState({
        maxValidNumberOfPages: 0,
        isEarlyRegistrationEnabled: false,
        maxNumberOfExtraPapers: 0,
    })
    const [earlyRegister, setEarlyRegister] = useState()
    const [memberPrice, setMemberPrice] = useState([])
    const [extraPage, setExtraPage] = useState([
        {
            option: 'Charge: One Extra Page',
            earlyRegistration: null,
            regularRegistration: null,
            isEnabled: false,
            helperRegular: '',
            errorRegular: false,
            helperEarly: '',
            errorEarly: false,
        },
        {
            option: 'Charge: One Extra Paper',
            earlyRegistration: null,
            regularRegistration: null,
            isEnabled: false,
            helperRegular: '',
            errorRegular: false,
            helperEarly: '',
            errorEarly: false,
        },
        {
            option: 'Charge: Two Extra Paper',
            earlyRegistration: null,
            regularRegistration: null,
            isEnabled: false,
            helperRegular: '',
            errorRegular: false,
            helperEarly: '',
            errorEarly: false,
        },
    ])
    const [error, setError] = useState({
        earlyDeadline: false,
        numberPage: false,
    })

    const [messageError, setMessageError] = useState({
        earlyDeadline: '',
        numberPage: '',
    })
    const [isChecked, setCheck] = useState(true)

    const handleOpenModal = () => {
        setOpenPaperModal(true)
    }

    const handleCloseModal = () => {
        setOpenPaperModal(false)
    }

    const handleCheck = (event) => {
        setCheck(event.target.checked)
    }

    const handleSaveRegistration = () => {
        setButtonLoading(true)
        const extraClone = cloneDeep(extraPage)
        const memberClone = cloneDeep(memberPrice)

        const memberSubmit = memberClone.map((item) => ({
            option: item.option,
            earlyRegistration:
                registerConfig.isEarlyRegistrationEnabled === true ? parseInt(item.earlyRegistration) : null,
            regularRegistration: parseInt(item.regularRegistration),
        }))
        const extraSubmit = extraClone
            .filter((item) => item.isEnabled === true)
            .map((item) => ({
                option: item.option,
                earlyRegistration:
                    registerConfig.isEarlyRegistrationEnabled === true ? parseInt(item.earlyRegistration) : null,
                regularRegistration: parseInt(item.regularRegistration),
            }))

        const errorDataTable = checkForErrors(memberClone) || checkForErrors(extraClone)
        const emptyMember = memberSubmit.length === 0

        const inValidDate = moment(earlyRegister).format() < moment(new Date()).format()

        const errorDeadline = registerConfig.isEarlyRegistrationEnabled === true && earlyRegister === null

        const inValidNumberPage = registerConfig.maxValidNumberOfPages < 1

        const validRegisterInfo =
            !errorDeadline &&
            !isNaN(registerConfig.maxValidNumberOfPages) &&
            !inValidDate &&
            !inValidNumberPage &&
            !errorDataTable

        if (isChecked) {
            createRegistrationSetting(conferenceId, freeOption, false)
                .then(() => {
                    showSnackbar({
                        severity: 'success',
                        children: 'Save registration successfully.',
                    })
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                })
                .finally(() => {
                    setButtonLoading(false)
                })
        } else {
            if (!validRegisterInfo) {
                setButtonLoading(false)
                setMessageError({
                    earlyDeadline: inValidDate ? 'Date cannot less than today' : 'Deadline cannot be empty',
                    numberPage: inValidNumberPage ? 'Number must ≥ 1' : 'Page cannot be empty',
                })
                setError({
                    earlyDeadline: errorDeadline || inValidDate,
                    numberPage: isNaN(registerConfig.maxValidNumberOfPages) || inValidNumberPage,
                })
            } else if (emptyMember) {
                setButtonLoading(false)
                showSnackbar({
                    severity: 'error',
                    children: 'Customization option cannot be empty',
                })
            } else {
                const rows = memberSubmit.concat(extraSubmit)
                const info = {
                    isZeroVNDPriceTable: false,
                    maxValidNumberOfPages: registerConfig.maxValidNumberOfPages,
                    isEarlyRegistrationEnabled: registerConfig.isEarlyRegistrationEnabled,
                    earlyRegistrationDeadline: earlyRegister,
                    maxNumberOfExtraPapers: registerConfig.maxNumberOfExtraPapers,
                    rows: rows,
                }
                createRegistrationSetting(conferenceId, info, false)
                    .then(() => {
                        showSnackbar({
                            severity: 'success',
                            children: 'Save registration successfully.',
                        })
                    })
                    .catch(() => {
                        // showSnackbar({
                        //     severity: 'error',
                        //     children: 'Something went wrong, please try again later.',
                        // })
                    })
                    .finally(() => {
                        setButtonLoading(false)
                    })
            }
        }
    }

    useEffect(() => {
        const checkNumberExtraPage = extraPage.slice(-2).filter((item) => item.isEnabled === true).length
        setRegisterConfig((prev) => ({
            ...prev,
            maxNumberOfExtraPapers: checkNumberExtraPage,
        }))
    }, [extraPage])

    useEffect(() => {
        const controller = new AbortController()
        const updateExtraPage = cloneDeep(extraPage)
        getRegistrationSetting(conferenceId, controller.signal)
            .then((response) => {
                const data = response.data
                const rows = data.rows ? data.rows : []
                const isZeroVNDPriceTable = data.isZeroVNDPriceTable

                setRegisterConfig((prev) => ({
                    ...prev,
                    maxValidNumberOfPages: data.maxValidNumberOfPages === 2147483647 ? 4 : data.maxValidNumberOfPages,
                    isEarlyRegistrationEnabled: data.isEarlyRegistrationEnabled,
                    maxNumberOfExtraPapers: data.maxNumberOfExtraPapers,
                }))

                const getMember = rows.filter((item) => {
                    return !updateExtraPage.some((extraItem) => extraItem.option === item.option)
                })
                const updateMember = getMember.map((obj) => ({
                    ...obj,
                    id: uuid(),
                    isEnabled: false,
                    helperOption: '',
                    errorOption: false,
                    helperRegular: '',
                    errorRegular: false,
                    helperEarly: '',
                    errorEarly: false,
                }))

                rows.forEach((item) => {
                    const optionExists = updateExtraPage.some((extraItem) => extraItem.option === item.option)
                    if (optionExists) {
                        updateExtraPage.forEach((extraItem) => {
                            if (extraItem.option === item.option) {
                                extraItem.isEnabled = true
                                extraItem.earlyRegistration = item.earlyRegistration
                                extraItem.regularRegistration = item.regularRegistration
                            }
                        })
                    }
                })
                setEarlyRegister(data.earlyRegistrationDeadline)
                setCheck(isZeroVNDPriceTable)
                setExtraPage(updateExtraPage)
                setMemberPrice(!isZeroVNDPriceTable ? updateMember : [])
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setLoading(false)
            })

        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ConferenceDetail>
            {openPaperModal && (
                <NewOption
                    open={openPaperModal}
                    handleClose={handleCloseModal}
                    memberPrice={memberPrice}
                    setMemberPrice={setMemberPrice}
                    registerConfig={registerConfig}
                />
            )}
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Box display="flex" alignItems={'center'}>
                            <Typography variant="h5" fontWeight={700}>
                                Registration
                            </Typography>
                            <FormControlLabel
                                sx={{ ml: 2 }}
                                control={<FreeSwitch checked={isChecked} onChange={handleCheck} />}
                                label="Free Charge"
                            />
                        </Box>
                        {loading ? (
                            <Loading height="70vh" />
                        ) : (
                            <Fragment>
                                {isChecked ? (
                                    <Fragment>
                                        <SectionLayout title="FREE OF CHARGE">
                                            <EmptyData
                                                textAbove={'Registration has been set to Free'}
                                                textBelow={
                                                    'With free registration selected Authors can register their papers without payment'
                                                }
                                                image={'https://static.thenounproject.com/png/3820373-200.png'}
                                                imgStyle={{ width: 140, height: 140, opacity: '45%', mt: 0 }}
                                                boxStyle={{ mb: 2 }}
                                            />
                                        </SectionLayout>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <SectionLayout title="REGISTRATION CONFIGURATION">
                                            <RegisterConfig
                                                registerConfig={registerConfig}
                                                setRegisterConfig={setRegisterConfig}
                                                setEarlyRegister={setEarlyRegister}
                                                earlyRegister={earlyRegister}
                                                error={error}
                                                messageError={messageError}
                                                setError={setError}
                                                setMessageError={setMessageError}
                                                setExtraPage={setExtraPage}
                                                setMemberPrice={setMemberPrice}
                                                memberPrice={memberPrice}
                                                extraPage={extraPage}
                                            />
                                        </SectionLayout>
                                        <SectionLayout title="CHARGE OPTION" style={{ mt: 5 }}>
                                            <ExtraPage
                                                extraPage={extraPage}
                                                setExtraPage={setExtraPage}
                                                registerConfig={registerConfig}
                                            />
                                        </SectionLayout>
                                        <SectionLayout
                                            title="CUSTOMIZATION OPTION"
                                            style={{ mt: 5 }}
                                            onClick={() => handleOpenModal()}
                                        >
                                            <Member
                                                setMemberPrice={setMemberPrice}
                                                memberPrice={memberPrice}
                                                registerConfig={registerConfig}
                                            />
                                        </SectionLayout>
                                    </Fragment>
                                )}
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="flex-end"
                                    sx={{
                                        backgroundColor: AppStyles.colors['#F5F5F5'],
                                        mt: 2,
                                        p: 2,
                                        borderRadius: 2,
                                    }}
                                >
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ textTransform: 'none', height: 36 }}
                                        loading={buttonLoading}
                                        loadingPosition="start"
                                        startIcon={<Save />}
                                        onClick={() => handleSaveRegistration()}
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </Box>
                            </Fragment>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </ConferenceDetail>
    )
}

export default RegistrationSetting
