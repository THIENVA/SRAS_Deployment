import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import TableRowsLoader from '../FilesSkeleton'

import { AppStyles } from '~/constants/colors'

const FilesTemplate = ({ filesAttached, isLoading }) => {
    return (
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
                        <TableCell>File Name</TableCell>
                        <TableCell>Size (KB)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {isLoading ? (
                        <TableRowsLoader rowsNum={1} />
                    ) : (
                        filesAttached.map((file) => (
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
                                <TableCell align="left">{file.size}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default FilesTemplate
