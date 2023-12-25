import { Skeleton, TableCell, TableRow } from '@mui/material'

const TableRowsLoader = ({ rowsNum }) => {
    return [...Array(rowsNum)].map((_, index) => (
        <TableRow key={index}>
            <TableCell component="th" scope="row">
                <Skeleton animation="wave" variant="rounded" />
            </TableCell>
            <TableCell>
                <Skeleton animation="wave" variant="rounded" />
            </TableCell>
        </TableRow>
    ))
}

export default TableRowsLoader
