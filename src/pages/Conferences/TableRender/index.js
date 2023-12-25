import { Fragment } from 'react'

import { useHistory } from 'react-router-dom'

import { OpenInNew } from '@mui/icons-material'
import {
    Box,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
    Zoom,
} from '@mui/material'

import TableRowsLoader from '../TableSkeleton'

import { AppStyles } from '~/constants/colors'
import { chooseConference } from '~/features/conference'
import { useAppDispatch } from '~/hooks/redux-hooks'

const TableRender = ({
    columns,
    rows,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    loading,
    total,
}) => {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const handleRedirect = (conferenceId, conferenceName, conferenceFullName) => {
        dispatch(chooseConference({ conference: { conferenceId, conferenceName, conferenceFullName } }))
        history.push(`/conferences/redirect/${conferenceId}`)
    }

    const noneEvent = () => {}

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow
                            sx={{
                                'td, th': {
                                    borderRight: `1px solid ${AppStyles.colors['#ddd']}`,
                                    py: 1,
                                    px: 2,
                                },
                            }}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            '& tr:nth-of-type(odd)': {
                                backgroundColor: AppStyles.colors['#F7FCFF'],
                            },
                        }}
                    >
                        {loading ? (
                            <TableRowsLoader rowsNum={4} />
                        ) : (
                            <Fragment>
                                {rows.length === 0 ? (
                                    <Fragment>
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            sx={{
                                                'td, th': {
                                                    borderRight: `1px solid ${AppStyles.colors['#ddd']}`,
                                                    py: 1,
                                                    px: 2,
                                                },
                                            }}
                                        >
                                            <TableCell colSpan={7}>
                                                <Typography textAlign={'center'} sx={{ fontStyle: 'italic' }}>
                                                    No records to display
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        {rows.map((row, index) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={index}
                                                    sx={{
                                                        'td, th': {
                                                            borderRight: `1px solid ${AppStyles.colors['#ddd']}`,
                                                            py: 1,
                                                            px: 2,
                                                        },
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Box
                                                            sx={{
                                                                textDecoration:
                                                                    row.conferenceStatus === 'Finished' ||
                                                                    row.conferenceStatus === 'Overdue'
                                                                        ? 'none'
                                                                        : 'underline',
                                                                color:
                                                                    row.conferenceStatus === 'Finished' ||
                                                                    row.conferenceStatus === 'Overdue'
                                                                        ? '#333'
                                                                        : AppStyles.colors['#004DFF'],
                                                                cursor:
                                                                    row.conferenceStatus === 'Finished' ||
                                                                    row.conferenceStatus === 'Overdue'
                                                                        ? 'text'
                                                                        : 'pointer',
                                                                pointerEvents:
                                                                    row.conferenceStatus === 'Finished' ||
                                                                    row.conferenceStatus === 'Overdue'
                                                                        ? 'none'
                                                                        : 'visible',
                                                            }}
                                                            onClick={() =>
                                                                row.conferenceStatus === 'Finished' ||
                                                                row.conferenceStatus === 'Overdue'
                                                                    ? noneEvent()
                                                                    : handleRedirect(row.id, row.shortName, row.name)
                                                            }
                                                        >
                                                            {row.name} ({row.shortName})
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(row.startDate).toLocaleDateString('en-GB')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(row.endDate).toLocaleDateString('en-GB')}
                                                    </TableCell>
                                                    <TableCell>{row.location}</TableCell>
                                                    <TableCell>
                                                        {row.websiteLink ? (
                                                            <Link
                                                                sx={{
                                                                    color: AppStyles.colors['#027A9D'],
                                                                    cursor: 'pointer',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                }}
                                                                underline="none"
                                                                href={row.websiteLink}
                                                                target="_blank"
                                                            >
                                                                <Tooltip
                                                                    placement="top"
                                                                    title={row.websiteLink}
                                                                    TransitionComponent={Zoom}
                                                                >
                                                                    <Box display={'flex'} alignItems={'center'}>
                                                                        Go to Page
                                                                        <OpenInNew
                                                                            fontSize="small"
                                                                            sx={{
                                                                                ml: 1,
                                                                                color: AppStyles.colors['#027A9D'],
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                </Tooltip>
                                                            </Link>
                                                        ) : (
                                                            <Typography sx={{ fontSize: 14, fontStyle: 'italic' }}>
                                                                Link not provided
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.submittableTracks.length > 0 ? (
                                                            row.submittableTracks.map((item, index) => (
                                                                <Typography
                                                                    sx={{
                                                                        color: AppStyles.colors['#027A9D'],
                                                                        cursor: 'pointer',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                    }}
                                                                    key={index}
                                                                    onClick={() =>
                                                                        history.push(
                                                                            `/conferences/${row.id}/submission/${item.trackId}/create-new-paper`
                                                                        )
                                                                    }
                                                                >
                                                                    {item.trackName} -{' '}
                                                                    {new Date(item.deadline).toLocaleDateString(
                                                                        'en-GB'
                                                                    )}
                                                                </Typography>
                                                            ))
                                                        ) : (
                                                            <Typography sx={{ fontSize: 14, fontStyle: 'italic' }}>
                                                                Currently no Calling for papers
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            color:
                                                                row.conferenceStatus === 'Finished'
                                                                    ? '#689f38'
                                                                    : row.conferenceStatus === 'Overdue'
                                                                    ? '#aa2e25'
                                                                    : row.conferenceStatus === 'Ongoing'
                                                                    ? '#f57c00'
                                                                    : '#333',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {row.conferenceStatus}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </Fragment>
                                )}
                            </Fragment>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15, 25, 50]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default TableRender
