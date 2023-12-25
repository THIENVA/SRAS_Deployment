import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import { LoadingButton } from '@mui/lab'
import { Box, Button, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material'

import TableAcceptance from './TableAcceptance'
import TablePrice from './TablePrice'
import './index.css'

import useOrder from '~/api/common/order'
import useRegistration from '~/api/common/registration'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const Registration = ({
    option,
    setOption,
    loadingButton,
    setLoadingButton,
    errorPaper,
    setErrorPaper,
    dataSettings,
    // setDataSettings,
    dataRegistrablePapers,
    // setDataRegistrablePapers,
    ListFilterDrop,
    setListFilterDrop,
    ListDrop,
    // setListDrop,
    dataListPage,
    setDataListPage,
    setOrder,
    handleNext,
    setActiveStep,
}) => {
    const { conferenceId, userIdProof } = useParams()
    const { userId } = useAppSelector((state) => state.auth)
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { createRegistration } = useRegistration()
    const { createOrder } = useOrder()
    // const showSnackbar = useSnackbar()
    const handleChange = (event) => {
        setOption(event.target.value)
    }
    const getUserId = roleName === ROLES_NAME.AUTHOR ? userId : userIdProof
    const handleClickPay = () => {
        setLoadingButton(true)
        const updatedDataList = dataListPage.map((item) => {
            const { ...updatedItem } = item
            return updatedItem
        })
        const newDataList = []
        dataListPage.forEach((_, index) => {
            const newData = {
                mainPaper: {
                    submissionId: updatedDataList[index].paper,
                    numberOfPages: +updatedDataList[index].numberOfPage,
                    numberOfExtraPages: +updatedDataList[index].numberOfExtraPage,
                },
                extraPapers: updatedDataList[index].extraPapers
                    ? updatedDataList[index].extraPapers
                          .map((item) => {
                              if (item.extraPaper === '') {
                                  return ''
                              } else {
                                  return {
                                      submissionId: item.extraPaper,
                                      numberOfPages: +item.numberOfPage,
                                      numberOfExtraPages: +item.numberOfExtraPage,
                                  }
                              }
                          })
                          .filter((item) => item !== '')
                    : [],
            }

            newDataList.push(newData)
        })
        createRegistration(getUserId, conferenceId, option, newDataList)
            .then((response) => {
                setOrder({
                    order: response.data.order,
                    orderDetails: response.data.orderDetails,
                    registration: response.data.registration,
                    registeredPapers: response.data.registeredPapers,
                })
                if (dataSettings.isZeroVNDPriceTable) {
                    const info = {
                        registration: response.data.registration,
                        order: response.data.order,
                        totalWholeAmount: response.data.orderDetails.total,
                        status: 'Completed',
                    }
                    createOrder(info).then(() => {
                        handleNext()
                    })
                } else {
                    setLoadingButton(false)
                    if (response.data.orderDetails.total > 0) {
                        handleNext()
                    } else {
                        const info = {
                            registration: response.data.registration,
                            order: response.data.order,
                            totalWholeAmount: response.data.orderDetails.total,
                            status: 'Completed',
                        }
                        createOrder(info).then(() => {
                            setActiveStep(3)
                        })
                    }
                }
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setLoadingButton(false)
            })
    }

    const handleClickAddItemInDataList = () => {
        const newArrayList = [...dataListPage]
        const newId = uuid()
        const newDataList = {
            id: newId,
            paper: '',
            numberOfPage: '',
            numberOfExtraPage: '',
            extraPapers:
                dataSettings.maxNumberOfExtraPapers == 2
                    ? [
                          { extraPaper: '', numberOfPage: '', numberOfExtraPage: '' },
                          { extraPaper: '', numberOfPage: '', numberOfExtraPage: '' },
                      ]
                    : dataSettings.maxNumberOfExtraPapers == 1
                    ? [{ extraPaper: '', numberOfPage: '', numberOfExtraPage: '' }]
                    : [],
        }
        newArrayList.push(newDataList)
        setDataListPage(cloneDeep(newArrayList))
    }

    const handleClickDelete = (_, index) => {
        const newArrayList = [...dataListPage]
        newArrayList.splice(index, 1)
        const dataListPageValues = [
            dataListPage[index].paper,
            ...dataListPage[index].extraPapers.map((item) => item.extraPaper),
        ]
        const updatedArr2 = ListFilterDrop.filter((value) => !dataListPageValues.includes(value))
        setListFilterDrop(updatedArr2)
        setDataListPage(newArrayList)
    }
    let isAllValid = false

    for (let i = 0; i < dataListPage.length; i++) {
        const item = dataListPage[i]

        if (item.paper === '' || item.paper === 0) {
            isAllValid = true
            break
        }
    }

    return (
        <div className="main">
            <div className="grid-container">
                <div className="grid-item">
                    <TablePrice dataSettings={dataSettings} />
                </div>
                <div className="grid-item">
                    <TableAcceptance dataRegistrablePapers={dataRegistrablePapers} ListFilterDrop={ListFilterDrop} />
                </div>
            </div>
            <div
                style={{
                    borderRadius: '8px',
                    padding: 24,
                    marginRight: 16,
                    marginLeft: 16,
                    background: 'rgb(220 220 220 / 26%)',
                    boxShadow:
                        '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
                }}
            >
                <Box mb={2} className="text-blue-700">
                    <div className="form-header">Paper Registration Form</div>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Option:</Typography>
                    <FormControl fullWidth>
                        <Select sx={{ bgcolor: 'white' }} size="small" onChange={handleChange} value={option}>
                            {dataSettings && dataSettings.rows && dataSettings.rows.length > 0
                                ? dataSettings.rows
                                      .filter(
                                          (data) =>
                                              data.option !== 'Charge: One Extra Page' &&
                                              data.option !== 'Charge: One Extra Paper' &&
                                              data.option !== 'Charge: Two Extra Paper'
                                      )
                                      .slice(0)
                                      .map((item, index) => (
                                          <MenuItem key={index} value={item.option}>
                                              {item.option}
                                          </MenuItem>
                                      ))
                                : null}
                        </Select>
                    </FormControl>
                </Box>
                <div
                    style={{
                        background: 'white',
                        padding: 15,
                    }}
                >
                    <div style={{ fontSize: '18px', marginTop: 10 }}>
                        {dataListPage.map((item, index) => (
                            <div key={index}>
                                <div style={{ display: 'flex' }}>
                                    <Typography fontWeight={550} variant="subtitle1">
                                        Basic Author Registration {index + 1}
                                    </Typography>
                                    <Button
                                        disabled={dataListPage.length > 1 ? false : true}
                                        onClick={(e) => handleClickDelete(e, index)}
                                        style={{ marginLeft: 'auto', cursor: 'pointer' }}
                                    >
                                        <ClearIcon />
                                    </Button>
                                </div>
                                <div
                                    style={{
                                        marginLeft: '5%',
                                        marginRight: '5%',
                                        paddingTop: 10,
                                    }}
                                >
                                    <div
                                        style={{
                                            paddingLeft: 20,
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(5, 1fr)',
                                            marginBottom: 20,
                                            gap: 15,
                                        }}
                                    >
                                        <div style={{ marginLeft: '30px', fontSize: '18px', textAlign: 'right' }}>
                                            Paper
                                        </div>
                                        <Box sx={{ minWidth: 350, marginLeft: '16px', gridColumn: 'span 4' }}>
                                            <FormControl fullWidth>
                                                <Select
                                                    size="small"
                                                    value={dataListPage[index].paper}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    onChange={(e) => {
                                                        const selectedValue = e.target.value
                                                        const updatedArr2 = ListFilterDrop.filter(
                                                            (value) => value !== dataListPage[index].paper
                                                        )
                                                        const newArr2 = updatedArr2.concat(selectedValue)
                                                        if (e.target.value != 0) {
                                                            setListFilterDrop(newArr2)
                                                        } else {
                                                            setListFilterDrop(updatedArr2)
                                                        }
                                                        const updatedDataList = [...dataListPage]
                                                        updatedDataList[index].paper = e.target.value
                                                        updatedDataList[index].numberOfPage = '0'
                                                        updatedDataList[index].numberOfExtraPage = '0'
                                                        setDataListPage(updatedDataList)
                                                    }}
                                                    sx={{
                                                        marginRight: 20,
                                                        background: 'white',
                                                    }}
                                                >
                                                    {ListDrop.map((item, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={item.submissionId}
                                                            disabled={ListFilterDrop.includes(item.submissionId)}
                                                        >
                                                            {item.submissionTitle}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>

                                        <div style={{ marginLeft: '30px', fontSize: '18px', textAlign: 'right' }}>
                                            Number of Pages
                                        </div>
                                        <Box
                                            sx={{
                                                minWidth: 350,
                                                marginLeft: '16px',
                                                gridColumn: 'span 4',
                                                marginRight: 20,
                                            }}
                                        >
                                            <TextField
                                                fullWidth
                                                sx={{
                                                    background: 'white',
                                                }}
                                                size="small"
                                                type="number"
                                                inputProps={{ min: 0 }}
                                                value={dataListPage[index].numberOfPage}
                                                onChange={(e) => {
                                                    const updatedDataList = [...dataListPage]
                                                    updatedDataList[index].numberOfPage = e.target.value
                                                    if (e.target.value > dataSettings.maxValidNumberOfPages) {
                                                        updatedDataList[index].numberOfExtraPage =
                                                            e.target.value - dataSettings.maxValidNumberOfPages
                                                    } else {
                                                        updatedDataList[index].numberOfExtraPage = 0
                                                    }
                                                    setDataListPage(updatedDataList)
                                                }}
                                                id="outlined-basic"
                                                variant="outlined"
                                            />
                                        </Box>

                                        <div style={{ marginLeft: '30px', fontSize: '18px', textAlign: 'right' }}>
                                            Number of Extra Pages
                                        </div>
                                        <Box
                                            sx={{
                                                minWidth: 350,
                                                marginLeft: '16px',
                                                gridColumn: 'span 4',
                                                marginRight: 20,
                                            }}
                                        >
                                            <TextField
                                                fullWidth
                                                type="number"
                                                disabled
                                                size="small"
                                                value={dataListPage[index].numberOfExtraPage}
                                                onChange={(e) => {
                                                    setErrorPaper(false)
                                                    const updatedDataList = [...dataListPage]
                                                    updatedDataList[index].numberOfExtraPage = e.target.value
                                                    setDataListPage(updatedDataList)
                                                    if (
                                                        parseInt(dataListPage[index].numberOfExtraPage) >
                                                        parseInt(dataListPage[index].numberOfPage)
                                                    ) {
                                                        setErrorPaper(true)
                                                    }
                                                }}
                                                sx={{
                                                    background: 'white',
                                                }}
                                                id="outlined-basic"
                                                variant="outlined"
                                            />
                                            {parseInt(dataListPage[index].numberOfExtraPage) >
                                                parseInt(dataListPage[index].numberOfPage) && (
                                                <p style={{ color: 'red' }}>Extra Pages can not greater than paper</p>
                                            )}
                                        </Box>
                                    </div>
                                    {item.extraPapers.length > 0 && <hr />}
                                    <div
                                        style={{
                                            marginTop: 15,
                                        }}
                                    >
                                        <div style={{ textAlign: 'center', fontSize: '25px', fontWeight: 500 }}>
                                            {item.extraPapers.length > 0 && 'Extra Paper'}
                                        </div>
                                        {item.extraPapers != null && item.extraPapers.length === 1 ? (
                                            <div style={{ paddingRight: '' }}>
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                                        gap: 20,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            marginTop: 15,
                                                            display: 'grid',
                                                            marginBottom: 20,
                                                            fontSize: '18px',
                                                            gridTemplateRows: 'repeat(3, 1fr)',
                                                            gap: 15,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: '18px',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            Extra Paper 1
                                                        </div>

                                                        <div
                                                            style={{
                                                                fontSize: '18px',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            Number of Pages
                                                        </div>

                                                        <div
                                                            style={{
                                                                fontSize: '18px',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            Number of Extra Pages
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            marginTop: 15,
                                                            display: 'grid',
                                                            marginBottom: 20,
                                                            fontSize: '18px',
                                                            gridTemplateRows: 'repeat(3, 1fr)',
                                                            gap: 15,
                                                            gridColumn: 'span 2',
                                                            marginRight: 200,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                minWidth: 350,
                                                            }}
                                                        >
                                                            <FormControl fullWidth>
                                                                <Select
                                                                    value={
                                                                        dataListPage[index].extraPapers[0].extraPaper
                                                                    }
                                                                    size="small"
                                                                    fullWidth
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    onChange={(e) => {
                                                                        const selectedValue = e.target.value
                                                                        const updatedArr2 = ListFilterDrop.filter(
                                                                            (value) =>
                                                                                value !==
                                                                                dataListPage[index].extraPapers[0]
                                                                                    .extraPaper
                                                                        )
                                                                        const newArr2 =
                                                                            updatedArr2.concat(selectedValue)
                                                                        if (e.target.value != 0) {
                                                                            setListFilterDrop(newArr2)
                                                                        } else {
                                                                            setListFilterDrop(updatedArr2)
                                                                        }

                                                                        const updatedDataList = [...dataListPage]
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[0].extraPaper = e.target.value
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[0].numberOfPage = '0'
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[0].numberOfExtraPage = '0'
                                                                        setDataListPage(updatedDataList)
                                                                    }}
                                                                    style={{
                                                                        background: 'white',
                                                                    }}
                                                                >
                                                                    {ListDrop.map((item, index) => (
                                                                        <MenuItem
                                                                            key={index}
                                                                            value={item.submissionId}
                                                                            disabled={ListFilterDrop.includes(
                                                                                item.submissionId
                                                                            )}
                                                                        >
                                                                            {item.submissionTitle}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Box>

                                                        <div>
                                                            <TextField
                                                                type="number"
                                                                fullWidth
                                                                size="small"
                                                                value={dataListPage[index].extraPapers[0].numberOfPage}
                                                                inputProps={{ min: 0 }}
                                                                onChange={(e) => {
                                                                    const updatedDataList = [...dataListPage]
                                                                    updatedDataList[index].extraPapers[0].numberOfPage =
                                                                        e.target.value
                                                                    if (
                                                                        e.target.value >
                                                                        dataSettings.maxValidNumberOfPages
                                                                    ) {
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[0].numberOfExtraPage =
                                                                            e.target.value -
                                                                            dataSettings.maxValidNumberOfPages
                                                                    } else {
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[0].numberOfExtraPage = 0
                                                                    }
                                                                    setDataListPage(updatedDataList)
                                                                }}
                                                                style={{ background: 'white' }}
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                            />
                                                        </div>

                                                        <div>
                                                            <TextField
                                                                type="number"
                                                                fullWidth
                                                                disabled
                                                                size="small"
                                                                value={
                                                                    dataListPage[index].extraPapers[0].numberOfExtraPage
                                                                }
                                                                onChange={(e) => {
                                                                    setErrorPaper(false)
                                                                    const updatedDataList = [...dataListPage]
                                                                    updatedDataList[
                                                                        index
                                                                    ].extraPapers[0].numberOfExtraPage = e.target.value
                                                                    setDataListPage(updatedDataList)
                                                                    if (
                                                                        parseInt(
                                                                            dataListPage[index].extraPapers[0]
                                                                                .numberOfExtraPage
                                                                        ) >
                                                                        parseInt(
                                                                            dataListPage[index].extraPapers[0]
                                                                                .numberOfPage
                                                                        )
                                                                    ) {
                                                                        setErrorPaper(true)
                                                                    }
                                                                }}
                                                                style={{ background: 'white' }}
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                            />
                                                        </div>
                                                    </div>
                                                    {parseInt(dataListPage[index].extraPapers[0].numberOfExtraPage) >
                                                        parseInt(dataListPage[index].extraPapers[0].numberOfPage) && (
                                                        <div
                                                            style={{
                                                                textAlign: 'center',
                                                                marginTop: '-50px',
                                                                paddingLeft: '50px',
                                                                gridColumn: 'span 3',
                                                            }}
                                                        >
                                                            <p style={{ color: 'red' }}>
                                                                Extra Pages can not greater than paper
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : item.extraPapers != null && item.extraPapers.length === 2 ? (
                                            <div style={{ paddingRight: '' }}>
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                                        gap: 20,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            marginTop: 15,
                                                            display: 'grid',
                                                            marginBottom: 20,
                                                            fontSize: '18px',
                                                            gridTemplateRows: 'repeat(3, 1fr)',
                                                            gap: 15,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: '18px',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            Extra Paper 1
                                                        </div>

                                                        <div
                                                            style={{
                                                                fontSize: '18px',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            Number of Pages
                                                        </div>

                                                        <div
                                                            style={{
                                                                fontSize: '18px',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            Number of Extra Pages
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            marginTop: 15,
                                                            display: 'grid',
                                                            marginBottom: 20,
                                                            fontSize: '18px',
                                                            gridTemplateRows: 'repeat(3, 1fr)',
                                                            gap: 15,
                                                            gridColumn: 'span 2',
                                                            marginRight: 200,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                minWidth: 350,
                                                            }}
                                                        >
                                                            <FormControl fullWidth>
                                                                <Select
                                                                    value={
                                                                        dataListPage[index].extraPapers[0].extraPaper
                                                                    }
                                                                    size="small"
                                                                    fullWidth
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    onChange={(e) => {
                                                                        const selectedValue = e.target.value
                                                                        const updatedArr2 = ListFilterDrop.filter(
                                                                            (value) =>
                                                                                value !==
                                                                                dataListPage[index].extraPapers[0]
                                                                                    .extraPaper
                                                                        )
                                                                        const newArr2 =
                                                                            updatedArr2.concat(selectedValue)
                                                                        if (e.target.value != 0) {
                                                                            setListFilterDrop(newArr2)
                                                                        } else {
                                                                            setListFilterDrop(updatedArr2)
                                                                        }

                                                                        const updatedDataList = [...dataListPage]
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[0].extraPaper = e.target.value
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[0].numberOfPage = '0'
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[0].numberOfExtraPage = '0'
                                                                        setDataListPage(updatedDataList)
                                                                    }}
                                                                    style={{
                                                                        background: 'white',
                                                                    }}
                                                                >
                                                                    {ListDrop.map((item, index) => (
                                                                        <MenuItem
                                                                            key={index}
                                                                            value={item.submissionId}
                                                                            disabled={ListFilterDrop.includes(
                                                                                item.submissionId
                                                                            )}
                                                                        >
                                                                            {item.submissionTitle}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Box>

                                                        <div>
                                                            <TextField
                                                                type="number"
                                                                fullWidth
                                                                size="small"
                                                                value={dataListPage[index].extraPapers[0].numberOfPage}
                                                                inputProps={{ min: 0 }}
                                                                onChange={(e) => {
                                                                    const updatedDataList = [...dataListPage]
                                                                    updatedDataList[index].extraPapers[0].numberOfPage =
                                                                        e.target.value
                                                                    if (
                                                                        e.target.value >
                                                                        dataSettings.maxValidNumberOfPages
                                                                    ) {
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[0].numberOfExtraPage =
                                                                            e.target.value -
                                                                            dataSettings.maxValidNumberOfPages
                                                                    } else {
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[0].numberOfExtraPage = 0
                                                                    }
                                                                    setDataListPage(updatedDataList)
                                                                }}
                                                                style={{ background: 'white' }}
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                            />
                                                        </div>

                                                        <div>
                                                            <TextField
                                                                type="number"
                                                                fullWidth
                                                                disabled
                                                                size="small"
                                                                value={
                                                                    dataListPage[index].extraPapers[0].numberOfExtraPage
                                                                }
                                                                onChange={(e) => {
                                                                    setErrorPaper(false)
                                                                    const updatedDataList = [...dataListPage]
                                                                    updatedDataList[
                                                                        index
                                                                    ].extraPapers[0].numberOfExtraPage = e.target.value
                                                                    setDataListPage(updatedDataList)
                                                                    if (
                                                                        parseInt(
                                                                            dataListPage[index].extraPapers[0]
                                                                                .numberOfExtraPage
                                                                        ) >
                                                                        parseInt(
                                                                            dataListPage[index].extraPapers[0]
                                                                                .numberOfPage
                                                                        )
                                                                    ) {
                                                                        setErrorPaper(true)
                                                                    }
                                                                }}
                                                                style={{ background: 'white' }}
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                            />
                                                        </div>
                                                    </div>
                                                    {parseInt(dataListPage[index].extraPapers[0].numberOfExtraPage) >
                                                        parseInt(dataListPage[index].extraPapers[0].numberOfPage) && (
                                                        <div
                                                            style={{
                                                                textAlign: 'center',
                                                                marginTop: '-50px',
                                                                paddingLeft: '50px',
                                                                gridColumn: 'span 3',
                                                            }}
                                                        >
                                                            <p style={{ color: 'red' }}>
                                                                Extra Pages can not greater than paper
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <hr />
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                                        gap: 15,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            marginTop: 15,
                                                            display: 'grid',
                                                            marginBottom: 20,
                                                            fontSize: '18px',
                                                            gridTemplateRows: 'repeat(3, 1fr)',
                                                            gap: 15,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: '18px',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            Extra Paper 2
                                                        </div>

                                                        <div
                                                            style={{
                                                                fontSize: '18px',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            Number of Pages
                                                        </div>

                                                        <div
                                                            style={{
                                                                fontSize: '18px',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            Number of Extra Pages
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            marginTop: 15,
                                                            display: 'grid',
                                                            marginBottom: 20,
                                                            fontSize: '18px',
                                                            gridTemplateRows: 'repeat(3, 1fr)',
                                                            gap: 15,
                                                            gridColumn: 'span 2',
                                                            marginRight: 200,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                minWidth: 350,
                                                            }}
                                                        >
                                                            <FormControl fullWidth>
                                                                <Select
                                                                    value={
                                                                        dataListPage[index].extraPapers[1].extraPaper
                                                                    }
                                                                    size="small"
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    onChange={(e) => {
                                                                        const selectedValue = e.target.value
                                                                        const updatedArr2 = ListFilterDrop.filter(
                                                                            (value) =>
                                                                                value !==
                                                                                dataListPage[index].extraPapers[1]
                                                                                    .extraPaper
                                                                        )
                                                                        const newArr2 =
                                                                            updatedArr2.concat(selectedValue)
                                                                        if (e.target.value != 0) {
                                                                            setListFilterDrop(newArr2)
                                                                        } else {
                                                                            setListFilterDrop(updatedArr2)
                                                                        }

                                                                        const updatedDataList = [...dataListPage]
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[1].extraPaper = e.target.value
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[1].numberOfPage = '0'
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[1].numberOfExtraPage = '0'
                                                                        setDataListPage(updatedDataList)
                                                                    }}
                                                                    style={{
                                                                        background: 'white',
                                                                    }}
                                                                >
                                                                    {ListDrop.map((item, index) => (
                                                                        <MenuItem
                                                                            key={index}
                                                                            value={item.submissionId}
                                                                            disabled={ListFilterDrop.includes(
                                                                                item.submissionId
                                                                            )}
                                                                        >
                                                                            {item.submissionTitle}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Box>

                                                        <div>
                                                            <TextField
                                                                type="number"
                                                                fullWidth
                                                                size="small"
                                                                inputProps={{ min: 0 }}
                                                                value={dataListPage[index].extraPapers[1].numberOfPage}
                                                                onChange={(e) => {
                                                                    const updatedDataList = [...dataListPage]
                                                                    updatedDataList[index].extraPapers[1].numberOfPage =
                                                                        e.target.value
                                                                    if (
                                                                        e.target.value >
                                                                        dataSettings.maxValidNumberOfPages
                                                                    ) {
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[1].numberOfExtraPage =
                                                                            e.target.value -
                                                                            dataSettings.maxValidNumberOfPages
                                                                    } else {
                                                                        updatedDataList[
                                                                            index
                                                                        ].extraPapers[1].numberOfExtraPage = 0
                                                                    }
                                                                    setDataListPage(updatedDataList)
                                                                }}
                                                                style={{ background: 'white' }}
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                            />
                                                        </div>

                                                        <div>
                                                            <TextField
                                                                type="number"
                                                                fullWidth
                                                                disabled
                                                                size="small"
                                                                value={
                                                                    dataListPage[index].extraPapers[1].numberOfExtraPage
                                                                }
                                                                onChange={(e) => {
                                                                    setErrorPaper(false)
                                                                    const updatedDataList = [...dataListPage]
                                                                    updatedDataList[
                                                                        index
                                                                    ].extraPapers[1].numberOfExtraPage = e.target.value
                                                                    setDataListPage(updatedDataList)
                                                                    if (
                                                                        parseInt(
                                                                            dataListPage[index].extraPapers[1]
                                                                                .numberOfExtraPage
                                                                        ) >
                                                                        parseInt(
                                                                            dataListPage[index].extraPapers[1]
                                                                                .numberOfPage
                                                                        )
                                                                    ) {
                                                                        setErrorPaper(true)
                                                                    }
                                                                }}
                                                                style={{ background: 'white' }}
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                            />
                                                        </div>
                                                    </div>
                                                    {parseInt(dataListPage[index].extraPapers[1].numberOfExtraPage) >
                                                        parseInt(dataListPage[index].extraPapers[1].numberOfPage) && (
                                                        <div
                                                            style={{
                                                                textAlign: 'center',
                                                                marginTop: '-30px',
                                                                paddingLeft: '50px',
                                                                gridColumn: 'span 3',
                                                            }}
                                                        >
                                                            <p style={{ color: 'red' }}>
                                                                Extra Pages can not greater than paper
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <hr style={{ marginBottom: 10, marginTop: 10 }} />
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right' }}>
                        <Button
                            startIcon={<AddIcon />}
                            // disabled={dataListPage.length == disabledAdd ? true : false}
                            onClick={handleClickAddItemInDataList}
                            color="success"
                            className="btn-choose-car"
                            variant="contained"
                            sx={{
                                textAlign: 'center',
                            }}
                        >
                            Add
                        </Button>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <LoadingButton
                        startIcon={<AddIcon />}
                        onClick={handleClickPay}
                        disabled={!option || loadingButton || errorPaper || isAllValid}
                        loading={loadingButton}
                        loadingPosition="start"
                        color="info"
                        variant="contained"
                        sx={{
                            textAlign: 'center',
                        }}
                    >
                        Checkout
                    </LoadingButton>
                </div>
            </div>
        </div>
    )
}

export default Registration
