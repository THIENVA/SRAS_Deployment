import React, { useMemo, useState } from 'react'

import MaterialReactTable from 'material-react-table'

import { VisibilityOutlined } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography, Zoom } from '@mui/material'

import InfoModal from './InfoModal'

import { AppStyles } from '~/constants/colors'

const ReviewerTable = ({ sendEmails, statusName }) => {
    const [openPaperModal, setOpenPaperModal] = useState(false)
    const [paperInfo, setPaperInfo] = useState()

    const handleOpenPaperModal = (row) => {
        setPaperInfo(row)
        setOpenPaperModal(true)
    }

    const columns = useMemo(
        () => [
            {
                id: 'fromName',
                accessorKey: 'fromName',
                header: 'From Name',
            },
            {
                id: 'fromEmail',
                accessorKey: 'fromEmail',
                header: 'From Email',
            },
            {
                id: 'toFullName',
                accessorKey: 'toFullName',
                header: 'To Name',
            },
            {
                id: 'toEmail',
                accessorKey: 'toEmail',
                header: 'To Email',
            },
            {
                id: 'subject',
                accessorKey: 'subject',
                header: 'Subject',
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const handleClosePaperModal = () => setOpenPaperModal(false)

    return (
        sendEmails.length > 0 && (
            <React.Fragment>
                <InfoModal open={openPaperModal} handleClose={handleClosePaperModal} row={paperInfo} />

                <MaterialReactTable
                    columns={columns}
                    data={sendEmails}
                    enableColumnFilterModes
                    enableColumnResizing
                    enableStickyHeader
                    enableColumnActions={false}
                    positionToolbarAlertBanner="bottom"
                    enableRowActions
                    enableHiding={false}
                    enablePinning={false}
                    enableDensityToggle={false}
                    positionActionsColumn="last"
                    muiTableBodyProps={{
                        sx: () => ({
                            '& tr:nth-of-type(4n+1)': {
                                backgroundColor: AppStyles.colors['#F7FCFF'],
                            },
                        }),
                    }}
                    renderDetailPanel={({ row }) => (
                        <Box
                            ml={4}
                            sx={{
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                border: '1px solid rgba(0, 0, 0, 0.15)',
                                p: 1,
                                borderRadius: 1,
                            }}
                        >
                            <Typography
                                component={'pre'}
                                sx={{
                                    fontSize: 14,
                                    color: AppStyles.colors['#586380'],
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'monospace',
                                }}
                            >
                                {row.original.body}
                            </Typography>
                        </Box>
                    )}
                    initialState={{ pagination: { pageSize: 5 }, density: 'compact' }}
                    renderTopToolbarCustomActions={() => {
                        return <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>{statusName}</Typography>
                    }}
                    renderRowActions={({ row }) => (
                        <React.Fragment>
                            <Tooltip TransitionComponent={Zoom} title="View Email Details" placement="bottom-start">
                                <IconButton onClick={() => handleOpenPaperModal(row.original)}>
                                    <VisibilityOutlined fontSize="small" sx={{ color: AppStyles.colors['#027A9D'] }} />
                                </IconButton>
                            </Tooltip>
                        </React.Fragment>
                    )}
                />
            </React.Fragment>
        )
    )
}

export default ReviewerTable
