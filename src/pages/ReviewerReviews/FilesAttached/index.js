import React from 'react'

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

import { AppStyles } from '~/constants/colors'

const FilesAttached = ({ filesAttached, handleUploadFiles, handleDeleteFile }) => {
    return (
        <React.Fragment>
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 1,
                    backgroundColor: (theme) => theme.palette.primary.main,
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: AppStyles.colors['#F7F7F7'],
                        textTransform: 'uppercase',
                    }}
                >
                    Details Research Paper Review Criteria
                </Typography>
            </Box>
            <Box mb={3} mt={2}>
                <Typography variant="body2" sx={{ color: AppStyles.colors['#ffa500'] }}>
                    You can upload 1 files. Maximum file size is 10 Mb. We accept
                    <strong> doc, docx, pdf</strong> formats.
                </Typography>
                {filesAttached.length !== 0 && (
                    <TableContainer sx={{ my: 2 }} component={Paper}>
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
                                    <TableCell sx={{ fontWeight: 'bold' }}>File Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Size (KB)</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                                        Upload date
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                        Action
                                    </TableCell>
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
                <InputLabel disabled={filesAttached.length === 1} htmlFor="upload" sx={{ display: 'inline-block' }}>
                    <input
                        onChange={handleUploadFiles}
                        required
                        style={{ opacity: 0, maxWidth: 0.5 }}
                        id="upload"
                        type="file"
                    />
                    <Button
                        disabled={filesAttached.length === 1}
                        variant="outlined"
                        component="span"
                        startIcon={<UploadFile />}
                        size="small"
                    >
                        Upload Files
                    </Button>
                </InputLabel>
            </Box>
        </React.Fragment>
    )
}

export default FilesAttached
