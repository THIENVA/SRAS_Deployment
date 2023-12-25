import { forwardRef } from 'react'

import { Clear, UploadFile } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'

import TitleSection from '../TitleSection'

import { AppStyles } from '~/constants/colors'

const CopyRightFiles = forwardRef(({ filesAttached, handleUploadFiles, handleDeleteFile, config }, ref) => {
    return (
        <Box mb={3}>
            <TitleSection>COPYRIGHT FILES</TitleSection>
            <Box mt={2}>
                <Typography variant="body2" sx={{ color: AppStyles.colors['#ffa500'] }}>
                    You must upload 1 files, Maximum file size is{' '}
                    {config ? config.copyRightFileSetting[1].value : 'No limit '} MB. We accept
                    <strong>
                        {config
                            ? config.copyRightFileSetting[0].value.length > 0 &&
                              config.copyRightFileSetting[0].value.map((item) => `${item}, `)
                            : 'doc, docx, pdf'}
                    </strong>{' '}
                    formats.
                </Typography>
                {filesAttached.length !== 0 && (
                    <TableContainer sx={{ mt: 2, mb: 1 }} component={Paper}>
                        <Table
                            sx={{
                                width: '100%',
                                overflow: 'hidden',
                            }}
                        >
                            <TableHead>
                                <TableRow
                                    sx={{
                                        'td, th': {
                                            borderRight: '1px solid #cecdcd',
                                            py: 1,
                                            px: 2,
                                        },
                                    }}
                                >
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Size (KB)</TableCell>
                                    <TableCell align="left">Upload date</TableCell>
                                    <TableCell align="left">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                                {filesAttached.map((file) => (
                                    <TableRow
                                        hover
                                        sx={{
                                            'td, th': {
                                                borderRight: '1px solid #cecdcd',
                                                py: 1,
                                                px: 2,
                                            },
                                        }}
                                        key={file.id}
                                    >
                                        <TableCell>{file.name}</TableCell>
                                        <TableCell>{file.size}</TableCell>
                                        <TableCell align="left">{file.date}</TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" onClick={() => handleDeleteFile(file.id)}>
                                                <Clear fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Box component={'form'} ref={ref}>
                    <InputLabel htmlFor="upload-copy" sx={{ display: 'inline-block', mt: 1 }}>
                        <input
                            onChange={handleUploadFiles}
                            required
                            disabled={filesAttached.length === 1}
                            style={{ opacity: 0, maxWidth: 0.5 }}
                            id="upload-copy"
                            type="file"
                            accept={
                                config
                                    ? config.copyRightFileSetting[0].value.length > 0 &&
                                      config.copyRightFileSetting[0].value.map((item) => `.${item}, `)
                                    : '.doc, .docx, .pdf'
                            }
                        />
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<UploadFile />}
                            size="small"
                            disabled={filesAttached.length === 1}
                        >
                            Upload Files
                        </Button>
                    </InputLabel>
                </Box>
            </Box>
        </Box>
    )
})

export default CopyRightFiles
