import React, { useRef, useState } from 'react'

import { CloudUpload, Delete, Image } from '@mui/icons-material'
import { Box, FormHelperText, IconButton, Typography } from '@mui/material'

import TitleSection from '../TitleSection'

const ConferenceLogo = ({
    handleImageChange,
    image,
    fileName,
    resetImage,
    messageError,
    error,
    setMessageError,
    setError,
    setImage,
    setFileName,
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const [errorImage, setErrorImage] = useState({ error: false, message: '' })
    const formRef = useRef(null)

    const onDragOver = (event) => {
        event.preventDefault()
        setIsDragging(true)
        setErrorImage({ error: false, message: '' })
        event.dataTransfer.dropEffect = 'copy'
    }

    const onDragLeave = (event) => {
        event.preventDefault()
        setIsDragging(false)
    }

    const onDragDrop = (event) => {
        event.preventDefault()
        setIsDragging(false)
        const files = event.dataTransfer.files
        if (files.length > 1) {
            setErrorImage({ error: true, message: 'You can only select 1 file' })
        } else if (!files[0].type.startsWith('image/')) {
            setErrorImage({ error: true, message: 'You can only select the image.' })
        } else {
            const imageUrl = URL.createObjectURL(files[0])
            const selectedFile = files[0]
            setFileName(files[0].name)
            setImage({ file: selectedFile, src: imageUrl })
            setMessageError((prev) => ({ ...prev, ['file']: '' }))
            setError((prev) => ({ ...prev, ['file']: false }))
            formRef.current.reset()
        }
    }

    return (
        <React.Fragment>
            <TitleSection>CONFERENCE LOGO</TitleSection>
            <Box ref={formRef} component="form">
                <Box
                    sx={{
                        mt: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '2px dashed #1475cf',
                        height: 200,
                        cursor: 'pointer',
                        borderRadius: 2,
                        p: 1,
                    }}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDragDrop}
                    component="label"
                    id="upload-file"
                >
                    <input
                        id="upload-file"
                        type="file"
                        accept="image/*"
                        className="input-field"
                        hidden
                        onChange={handleImageChange}
                    />
                    {image.src ? (
                        <img
                            src={image.src}
                            alt={fileName}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    ) : (
                        <React.Fragment>
                            <CloudUpload fontSize="large" sx={{ color: '#1475cf' }} />
                            {isDragging ? (
                                <Typography variant="subtitle1">Drop images here</Typography>
                            ) : (
                                <React.Fragment>
                                    {(() => {
                                        switch (errorImage.error) {
                                            case false:
                                                return (
                                                    <Typography variant="subtitle1">
                                                        Drop your image here, or{' '}
                                                        <span style={{ fontWeight: 600, color: '#1a84ed' }}>
                                                            Browse
                                                        </span>
                                                    </Typography>
                                                )
                                            case true:
                                                return (
                                                    <Typography variant="subtitle1" color="error">
                                                        {errorImage.message}
                                                    </Typography>
                                                )
                                        }
                                    })()}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </Box>
            </Box>
            {error.file && <FormHelperText error={error.file}>{messageError.file}</FormHelperText>}
            <Box
                sx={{
                    mt: 2,
                    mb: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    backgroundColor: '#e9f0ff',
                }}
            >
                <Image sx={{ color: '#1475cf' }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {fileName} -
                    <IconButton onClick={resetImage}>
                        <Delete />
                    </IconButton>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default ConferenceLogo
