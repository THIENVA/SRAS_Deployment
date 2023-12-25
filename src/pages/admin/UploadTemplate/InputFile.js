import React, { useRef, useState } from 'react'

import { v4 as uuid } from 'uuid'

import { UploadFile } from '@mui/icons-material'
import { Box, Button, InputLabel } from '@mui/material'

const InputFile = ({ uploadTemplate, setFilesInfo }) => {
    const [file, setFile] = useState(null)
    const formRef = useRef(null)

    const handleChooseFile = (event) => {
        const newFile = event.target.files[0]
        if (newFile) {
            const getFile = { name: newFile.name, id: uuid(), size: (newFile.size / 1024).toFixed(2) }
            setFilesInfo([{ ...getFile }])
            setFile(newFile)
            formRef.current.reset()
        }
    }

    const handleUploadFile = () => {
        uploadTemplate(file, resetInputField)
    }

    const resetInputField = () => {
        setFile(null)
    }

    return (
        <React.Fragment>
            <Box component="form" ref={formRef} display="flex" alignItems="center">
                <InputLabel htmlFor="upload" sx={{ display: 'inline-block' }}>
                    <input
                        onChange={handleChooseFile}
                        required
                        style={{ opacity: 0, maxWidth: 0.5 }}
                        id="upload"
                        type="file"
                        accept="text/html"
                    />
                    <Button variant="outlined" component="span" startIcon={<UploadFile />} size="small">
                        Choose Files
                    </Button>
                </InputLabel>
                <Button variant="contained" color="info" size="small" sx={{ ml: 2 }} onClick={handleUploadFile}>
                    Upload
                </Button>
            </Box>
        </React.Fragment>
    )
}

export default InputFile
