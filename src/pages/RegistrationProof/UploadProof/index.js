import { Fragment, useRef, useState } from 'react'

import { v4 as uuid } from 'uuid'

import { ArrowCircleLeft, FileUpload } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'

import OrderDetails from '../OrderDetails'
import ImageProof from './ImageProof'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useOrder from '~/api/common/order'
import { AppStyles } from '~/constants/colors'

const UploadProof = ({ order, handleBack, handleNext }) => {
    const showSnackbar = useSnackbar()
    const { createOrder, uploadProof } = useOrder()
    const [loading, setLoading] = useState(false)

    const formRef = useRef(null)
    const [files, setFiles] = useState([])
    const [filesAttached, setFilesAttached] = useState([])

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (file.name.includes('png')) {
                if (filesAttached.length === 0) {
                    const fileSizeKb = (file.size / 1024).toFixed(2)
                    const fileName = file.name
                    const dateUploaded = new Date().toLocaleString()
                    const newId = uuid()
                    const imageUrl = URL.createObjectURL(event.target.files[0])
                    const newFile = { id: newId, name: fileName, size: fileSizeKb, date: dateUploaded, src: imageUrl }
                    setFilesAttached((prev) => [...prev, newFile])
                    setFiles((prev) => [...prev, { id: newId, file: file }])
                } else {
                    const filePosition = filesAttached.findIndex((fileItem) => fileItem.name === file.name)
                    if (filePosition === -1) {
                        const fileSizeKb = (file.size / 1024).toFixed(2)
                        const fileName = file.name
                        const dateUploaded = new Date().toLocaleString()
                        const newId = uuid()
                        const imageUrl = URL.createObjectURL(event.target.files[0])
                        const newFile = {
                            id: newId,
                            name: fileName,
                            size: fileSizeKb,
                            date: dateUploaded,
                            src: imageUrl,
                        }
                        setFilesAttached((prev) => [...prev, newFile])
                        setFiles((prev) => [...prev, { id: newId, file: file }])
                    } else {
                        showSnackbar({
                            severity: 'error',
                            children: 'This file has been added, please add another file',
                        })
                    }
                }
            } else {
                showSnackbar({
                    severity: 'error',
                    children: 'Proof file must be image.',
                })
            }
        }
    }
    const resetImage = (id) => {
        const updatedFiles = filesAttached.filter((file) => file.id !== id)
        const updatedFilesUpload = files.filter((file) => file.id !== id)
        setFilesAttached(updatedFiles)
        setFiles(updatedFilesUpload)
    }
    const submitProofImage = (event) => {
        event.preventDefault()
        setLoading(true)
        const info = {
            registration: order.registration,
            order: order.order,
            totalWholeAmount: order.orderDetails.total,
            status: 'Completed',
        }

        const formData = new FormData()
        files.forEach((file) => formData.append('files', file.file))
        createOrder(info)
            .then((res) => {
                uploadProof(res.data?.paymentId, formData).then(() => {
                    handleNext()
                    showSnackbar({
                        severity: 'success',
                        children: 'Submit Proof Successfully.',
                    })
                })
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, please try again later!',
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <Box maxWidth={'lg'} sx={{ m: '0 auto', mt: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                    variant="text"
                    sx={{ textTransform: 'none', height: 36 }}
                    onClick={handleBack}
                    startIcon={<ArrowCircleLeft />}
                >
                    Go back
                </Button>
                <Typography
                    textAlign="center"
                    sx={{ mb: 2, fontSize: 36, fontWeight: 600, color: AppStyles.colors['#333333'] }}
                >
                    Payment Proof
                </Typography>
                <Box></Box>
            </Box>
            <Fragment>
                <OrderDetails orderData={order.orderDetails} />
            </Fragment>

            <ImageProof
                filesAttached={filesAttached}
                handleDeleteFile={resetImage}
                handleUploadFiles={handleImageChange}
                files={files}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
                <LoadingButton
                    onClick={submitProofImage}
                    startIcon={<FileUpload />}
                    loadingPosition="start"
                    loading={loading}
                    disabled={files.length === 0}
                    variant="contained"
                    type="submit"
                    size="large"
                    sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                >
                    Submit Proof Image
                </LoadingButton>
            </Box>
        </Box>
    )
}

export default UploadProof
