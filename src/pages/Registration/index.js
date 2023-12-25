import { Fragment, useEffect, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Box } from '@mui/material'
import HorizontalLinearStepper from '~/components/StepperCompo'

import ConferenceDetail from '../ConferenceDetail'
import Checkout from '../DraftCreateConference/Draft/Checkout'
import PaymentSuccess from '../DraftCreateConference/Draft/PaymentSuccess'
import Loading from '../Loading'
import RegistrationSummary from '../RegistrationSummary'
import Registration from './Registration'
import './index.css'

import useRegistration from '~/api/common/registration'
import { REGISTER_FREE_PAPER, REGISTER_PRICE_PAPER } from '~/constants/steps'
import { useAppSelector } from '~/hooks/redux-hooks'

const RegistrationPaper = () => {
    const [activeStep, setActiveStep] = useState(0)
    const [order, setOrder] = useState(null)
    const history = useHistory()
    const [option, setOption] = useState('')
    const { conferenceId } = useParams()
    const { userId } = useAppSelector((state) => state.auth)
    const { getRegistrationPapers, getRegistrationSetting } = useRegistration()
    const [loading, setLoading] = useState(true)
    // const showSnackbar = useSnackbar()
    const [loadingButton, setLoadingButton] = useState(false)
    const [errorPaper, setErrorPaper] = useState(false)
    const [dataSettings, setDataSettings] = useState([])
    const [dataRegistrablePapers, setDataRegistrablePapers] = useState([])
    // const [disabledAdd, setDisabledAdd] = useState(0)
    const [ListFilterDrop, setListFilterDrop] = useState([])
    const [ListDrop, setListDrop] = useState([
        {
            id: '',
            title: 'none',
        },
    ])
    const [dataListPage, setDataListPage] = useState([
        {
            id: uuid(),
            paper: '',
            numberOfPage: '',
            numberOfExtraPage: '',
            extraPapers:
                dataSettings.maxNumberOfExtraPapers === 2
                    ? [
                          { extraPaper: '', numberOfPage: '', numberOfExtraPage: '' },
                          { extraPaper: '', numberOfPage: '', numberOfExtraPage: '' },
                      ]
                    : dataSettings.maxNumberOfExtraPapers === 1
                    ? [{ extraPaper: '', numberOfPage: '', numberOfExtraPage: '' }]
                    : '',
        },
    ])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        const secondController = new AbortController()
        const secondSignal = secondController.signal
        const settings = getRegistrationSetting(conferenceId, signal)
        const registrablePapers = getRegistrationPapers(conferenceId, userId, secondSignal)
        Promise.all([settings, registrablePapers])
            .then((response) => {
                setDataSettings(response[0].data)
                setDataRegistrablePapers(response[1].data)
                if (response[1].data.registrablePapers) {
                    // if (response[1].data.registrablePapers.length > 3) {
                    //     setDisabledAdd(Math.ceil(response[1].data.length / 3))
                    // } else {
                    //     setDisabledAdd(1)
                    // }
                    setDataListPage([
                        {
                            id: 1,
                            paper: '',
                            numberOfPage: '',
                            numberOfExtraPage: '',
                            extraPapers:
                                response[1].data.registrablePapers.length == 1
                                    ? []
                                    : response[0].data.maxNumberOfExtraPapers == 2
                                    ? [
                                          { extraPaper: '', numberOfPage: '', numberOfExtraPage: '' },
                                          { extraPaper: '', numberOfPage: '', numberOfExtraPage: '' },
                                      ]
                                    : response[0].data.maxNumberOfExtraPapers == 1
                                    ? [{ extraPaper: '', numberOfPage: '', numberOfExtraPage: '' }]
                                    : '',
                        },
                    ])
                    setListDrop([{ submissionId: '', submissionTitle: 'None' }, ...response[1].data.registrablePapers])
                } else {
                    history.push(`/conferences/${conferenceId}/submission/author`)
                }
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
            secondController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return loading === true ? (
        <Loading />
    ) : (
        <ConferenceDetail>
            {dataSettings.isZeroVNDPriceTable ? (
                <Fragment>
                    <Box sx={{ mx: '10%' }}>
                        <HorizontalLinearStepper
                            activeStep={activeStep}
                            steps={REGISTER_FREE_PAPER}
                            alternativeLabel={false}
                        />
                    </Box>
                    {(() => {
                        switch (activeStep) {
                            case 0:
                                return (
                                    <Registration
                                        option={option}
                                        setOption={setOption}
                                        setDataSettings={setDataSettings}
                                        setLoadingButton={setLoadingButton}
                                        dataSettings={dataSettings}
                                        errorPaper={errorPaper}
                                        setErrorPaper={setErrorPaper}
                                        loadingButton={loadingButton}
                                        dataRegistrablePapers={dataRegistrablePapers}
                                        setDataRegistrablePapers={setDataRegistrablePapers}
                                        ListFilterDrop={ListFilterDrop}
                                        setListFilterDrop={setListFilterDrop}
                                        ListDrop={ListDrop}
                                        setListDrop={setListDrop}
                                        dataListPage={dataListPage}
                                        setDataListPage={setDataListPage}
                                        setOrder={setOrder}
                                        handleNext={handleNext}
                                    />
                                )
                            case 1:
                                return <RegistrationSummary order={order} />
                        }
                    })()}
                </Fragment>
            ) : (
                <Fragment>
                    <Box sx={{ mx: '10%' }}>
                        <HorizontalLinearStepper
                            activeStep={activeStep}
                            steps={REGISTER_PRICE_PAPER}
                            alternativeLabel={false}
                        />
                    </Box>

                    {(() => {
                        switch (activeStep) {
                            case 0:
                                return (
                                    <Registration
                                        option={option}
                                        setOption={setOption}
                                        setDataSettings={setDataSettings}
                                        setLoadingButton={setLoadingButton}
                                        dataSettings={dataSettings}
                                        errorPaper={errorPaper}
                                        setErrorPaper={setErrorPaper}
                                        loadingButton={loadingButton}
                                        dataRegistrablePapers={dataRegistrablePapers}
                                        setDataRegistrablePapers={setDataRegistrablePapers}
                                        ListFilterDrop={ListFilterDrop}
                                        setListFilterDrop={setListFilterDrop}
                                        ListDrop={ListDrop}
                                        setListDrop={setListDrop}
                                        dataListPage={dataListPage}
                                        setDataListPage={setDataListPage}
                                        setOrder={setOrder}
                                        handleNext={handleNext}
                                        setActiveStep={setActiveStep}
                                    />
                                )
                            case 1:
                                return <Checkout order={order} handleBack={handleBack} handleNext={handleNext} />
                            case 2:
                                return <PaymentSuccess order={order} handleNext={handleNext} />
                            case 3:
                                return <RegistrationSummary order={order} />
                        }
                    })()}
                </Fragment>
            )}
        </ConferenceDetail>
    )
}

export default RegistrationPaper
