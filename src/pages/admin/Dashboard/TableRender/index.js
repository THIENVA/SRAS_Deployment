import React, { Fragment, useState } from 'react'

import { useHistory } from 'react-router-dom'

import {
    AddLink,
    ContactSupport,
    Delete,
    Edit,
    ImportExport,
    Mode,
    OpenInNew,
    Public,
    PublicOff,
    Warning,
} from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Divider,
    IconButton,
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
import PCMemberContact from '~/components/Common/ConferenceHeader/PCMemberContact'

import TableRowsLoader from '../TableSkeleton'

import { AppStyles } from '~/constants/colors'

const TableRender = ({
    columns,
    rows,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    total,
    loading,
    handleOpenModal,
    buttonLoading,
    exportFinalReport,
    handleOpenConfirm,
}) => {
    const history = useHistory()
    const [openModal, setOpenModal] = useState(false)
    const [conferenceID, setConferenceID] = useState(null)
    const handleOpenPCMember = (id) => {
        setOpenModal(true)
        setConferenceID(id)
    }

    const handleClosePCMember = () => {
        setOpenModal(false)
        setConferenceID(null)
    }
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {openModal && (
                <PCMemberContact open={openModal} handleClose={handleClosePCMember} conferenceID={conferenceID} />
            )}
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
                            <TableRowsLoader rowsNum={5} />
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
                                            <TableCell colSpan={9}>
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
                                                        <Box display="flex" alignItems="center">
                                                            <Typography
                                                                mr={2}
                                                                // onClick={handleOpenPCMember}
                                                                // sx={{
                                                                //     color: AppStyles.colors['#027A9D'],
                                                                //     cursor: 'pointer',
                                                                // }}
                                                            >
                                                                {row.name}
                                                            </Typography>
                                                            {row.havingIssueTracks && (
                                                                <Tooltip
                                                                    placement="top"
                                                                    title={row.havingIssueTracks}
                                                                    TransitionComponent={Zoom}
                                                                >
                                                                    <Warning color="warning" fontSize="small" />
                                                                </Tooltip>
                                                            )}
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
                                                            <Box display="flex" alignItems={'center'}>
                                                                <Link
                                                                    width={110}
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
                                                                <Box display="flex" justifyContent="center" mx={1}>
                                                                    <Divider
                                                                        orientation="vertical"
                                                                        sx={{
                                                                            height: 30,
                                                                            backgroundColor:
                                                                                AppStyles.colors['#586380'],
                                                                            opacity: 0.5,
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Tooltip
                                                                    placement="top"
                                                                    title="Edit Website Link"
                                                                    TransitionComponent={Zoom}
                                                                >
                                                                    <IconButton
                                                                        onClick={() => handleOpenModal(row, index)}
                                                                        size="small"
                                                                        sx={{ color: AppStyles.colors['#027A9D'] }}
                                                                    >
                                                                        <Mode fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        ) : (
                                                            <Box display="flex" alignItems={'center'}>
                                                                <Typography
                                                                    width={110}
                                                                    sx={{ fontSize: 14, fontStyle: 'italic' }}
                                                                >
                                                                    Link not provided
                                                                </Typography>
                                                                <Box mx={1} display="flex" justifyContent="center">
                                                                    <Divider
                                                                        orientation="vertical"
                                                                        sx={{
                                                                            height: 30,
                                                                            backgroundColor:
                                                                                AppStyles.colors['#586380'],
                                                                            opacity: 0.5,
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Tooltip
                                                                    placement="top"
                                                                    title="Add Website Link"
                                                                    TransitionComponent={Zoom}
                                                                >
                                                                    <IconButton
                                                                        onClick={() => handleOpenModal(row, index)}
                                                                        size="small"
                                                                        sx={{ color: AppStyles.colors['#027A9D'] }}
                                                                    >
                                                                        <AddLink fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
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
                                                    <TableCell align="center">
                                                        <React.Fragment>
                                                            {(row.conferenceStatus !== 'Overdue' &&
                                                                row.conferenceStatus !== 'Finished' &&
                                                                row.websiteActions) ||
                                                            row.isDeletingEnable === true ||
                                                            row.isUpdatingEnable === true ? (
                                                                <Box mt={1}>
                                                                    {row.isUpdatingEnable && (
                                                                        <Button
                                                                            sx={{ mb: 1 }}
                                                                            onClick={() =>
                                                                                history.push({
                                                                                    pathname: `/admin/edit-conference/${row.id}`,
                                                                                })
                                                                            }
                                                                            variant="outlined"
                                                                            color="info"
                                                                            size="small"
                                                                            endIcon={<Edit />}
                                                                        >
                                                                            <Typography
                                                                                sx={{
                                                                                    textTransform: 'none',
                                                                                    fontSize: 14,
                                                                                }}
                                                                            >
                                                                                Edit Conference
                                                                            </Typography>
                                                                        </Button>
                                                                    )}
                                                                    {row.isDeletingEnable && (
                                                                        <Button
                                                                            onClick={() => handleOpenConfirm(row)}
                                                                            variant="outlined"
                                                                            color="error"
                                                                            size="small"
                                                                            sx={{ mb: 1 }}
                                                                            endIcon={<Delete />}
                                                                        >
                                                                            <Typography
                                                                                sx={{
                                                                                    textTransform: 'none',
                                                                                    fontSize: 14,
                                                                                }}
                                                                            >
                                                                                Delete Conference
                                                                            </Typography>
                                                                        </Button>
                                                                    )}
                                                                    {row.websiteActions?.includes('CreateWebsite') ? (
                                                                        <Button
                                                                            onClick={() =>
                                                                                history.push({
                                                                                    pathname: `/admin/create-website/${row.id}`,
                                                                                })
                                                                            }
                                                                            variant="contained"
                                                                            color="info"
                                                                            sx={{ mb: 1 }}
                                                                            size="small"
                                                                            endIcon={<Public />}
                                                                        >
                                                                            <Typography
                                                                                sx={{
                                                                                    textTransform: 'none',
                                                                                    fontSize: 14,
                                                                                }}
                                                                            >
                                                                                Create Website
                                                                            </Typography>
                                                                        </Button>
                                                                    ) : (
                                                                        <Fragment>
                                                                            <Box
                                                                                display="flex"
                                                                                justifyContent={'center'}
                                                                                sx={{
                                                                                    border: 'solid 1px #0288d180',
                                                                                    borderRadius: 1,
                                                                                }}
                                                                            >
                                                                                <Button
                                                                                    onClick={() =>
                                                                                        history.push({
                                                                                            pathname: `/admin/create-website/${row.id}`,
                                                                                        })
                                                                                    }
                                                                                    variant="text"
                                                                                    sx={{ mb: 1 }}
                                                                                    color="info"
                                                                                    size="small"
                                                                                    endIcon={<Mode />}
                                                                                >
                                                                                    <Typography
                                                                                        sx={{
                                                                                            textTransform: 'none',
                                                                                            fontSize: 14,
                                                                                        }}
                                                                                    >
                                                                                        Update Website
                                                                                    </Typography>
                                                                                </Button>
                                                                                <Box
                                                                                    display="flex"
                                                                                    justifyContent="center"
                                                                                    mx={1}
                                                                                >
                                                                                    <Divider
                                                                                        orientation="vertical"
                                                                                        sx={{
                                                                                            height: 30,
                                                                                            backgroundColor:
                                                                                                AppStyles.colors[
                                                                                                    '#586380'
                                                                                                ],
                                                                                            opacity: 0.5,
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                                <Tooltip
                                                                                    placement="top"
                                                                                    title="Delete Website"
                                                                                    TransitionComponent={Zoom}
                                                                                >
                                                                                    <IconButton
                                                                                        size="small"
                                                                                        color="error"
                                                                                    >
                                                                                        <PublicOff fontSize="small" />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            </Box>
                                                                        </Fragment>
                                                                    )}
                                                                </Box>
                                                            ) : (
                                                                <Typography sx={{ fontSize: 14, fontStyle: 'italic' }}>
                                                                    There are currently no actions
                                                                </Typography>
                                                            )}
                                                        </React.Fragment>
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.conferenceStatus === 'Overdue' ||
                                                        row.conferenceStatus === 'Finished' ? (
                                                            <LoadingButton
                                                                startIcon={<ImportExport />}
                                                                disabled={
                                                                    buttonLoading.status &&
                                                                    row.id === buttonLoading.rowId
                                                                }
                                                                variant="contained"
                                                                size="small"
                                                                color="success"
                                                                loading={
                                                                    buttonLoading.status &&
                                                                    row.id === buttonLoading.rowId
                                                                }
                                                                loadingPosition="start"
                                                                onClick={() => exportFinalReport(row.id, row.shortName)}
                                                            >
                                                                Export Final Report
                                                            </LoadingButton>
                                                        ) : (
                                                            <Typography sx={{ fontSize: 14, fontStyle: 'italic' }}>
                                                                There are currently no report
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip
                                                            title="PC Member Contacts"
                                                            TransitionComponent={Zoom}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                onClick={() => handleOpenPCMember(row.id)}
                                                                sx={{ mr: 1 }}
                                                            >
                                                                <ContactSupport
                                                                // sx={{ color: AppStyles.colors['#EFEFEF'] }}
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
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
                rowsPerPageOptions={[5, 10, 25]}
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
