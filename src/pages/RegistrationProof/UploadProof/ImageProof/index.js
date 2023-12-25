import { Fragment } from 'react'

import { Clear, Image } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    ImageList,
    ImageListItem,
    InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'

import TitleSection from '../TitleSection'

import { AppStyles } from '~/constants/colors'

const ImageProof = ({ filesAttached, handleUploadFiles, handleDeleteFile }) => {
    return (
        <Box mb={3}>
            <TitleSection>PROOF IMAGES</TitleSection>

            <Box mt={2}>
                {filesAttached.length !== 0 && (
                    <Fragment>
                        <ImageList
                            sx={{
                                height: 200,
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px dashed #1475cf',
                                borderRadius: 2,
                                justifyContent: 'center',
                                px: 2,
                            }}
                            cols={4}
                            rowHeight={164}
                        >
                            {filesAttached.map((file) => (
                                <ImageListItem sx={{ mx: 2 }} key={file.id}>
                                    <img
                                        srcSet={`${file.src}`}
                                        src={`${file.src}`}
                                        alt={file.name}
                                        loading="lazy"
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
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
                    </Fragment>
                )}
                <InputLabel htmlFor="upload" sx={{ display: 'inline-block', mt: 1 }}>
                    <input
                        onChange={handleUploadFiles}
                        required
                        style={{ opacity: 0, maxWidth: 0.5 }}
                        id="upload"
                        accept="image/*"
                        type="file"
                    />
                    <Button variant="outlined" component="span" startIcon={<Image />} size="small">
                        Choose Files
                    </Button>
                </InputLabel>
            </Box>
        </Box>
    )
}

export default ImageProof
