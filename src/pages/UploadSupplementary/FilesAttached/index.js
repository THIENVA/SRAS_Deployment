import { forwardRef } from 'react'

import { Clear, UploadFile } from '@mui/icons-material'
import {
    Box,
    Button,
    FormHelperText,
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

const FilesAttached = forwardRef(
    ({ filesAttached, handleUploadFiles, handleDeleteFile, config, error, messageError }, ref) => {
        return (
            <Box mb={3}>
                <TitleSection>FILES</TitleSection>
                <Box mt={2}>
                    <Typography variant="body2" sx={{ color: AppStyles.colors['#ffa500'] }}>
                        {config
                            ? `You must upload at least ${config.supplementaryMaterialSettings[2].value} file(s) `
                            : 'You may not have to upload file'}
                        {config ? `up to ${config.supplementaryMaterialSettings[1].value} file(s) ` : ''}. Maximum file
                        size is {config ? config.supplementaryMaterialSettings[3].value : 'No limit '}
                        Mb
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
                    {error && <FormHelperText error={error}>{messageError}</FormHelperText>}
                    <Box component="form" ref={ref}>
                        <InputLabel
                            disabled={
                                config ? filesAttached.length === config.supplementaryMaterialSettings[1].value : false
                            }
                            htmlFor="upload"
                            sx={{ display: 'inline-block', mt: 1 }}
                        >
                            <input
                                onChange={handleUploadFiles}
                                required
                                style={{ opacity: 0, maxWidth: 0.5 }}
                                id="upload"
                                type="file"
                            />
                            <Button
                                disabled={
                                    config
                                        ? filesAttached.length === config.supplementaryMaterialSettings[1].value
                                        : false
                                }
                                variant="outlined"
                                component="span"
                                startIcon={<UploadFile />}
                                size="small"
                            >
                                Upload Files
                            </Button>
                        </InputLabel>
                    </Box>
                </Box>
            </Box>
        )
    }
)

export default FilesAttached
