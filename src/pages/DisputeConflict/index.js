import { useMemo, useState } from 'react'

import MaterialReactTable from 'material-react-table'

import { Box, MenuItem, Typography } from '@mui/material'

import ConferenceDetail from '../ConferenceDetail'
import DisputeInfoModal from './DisputeInfoModal'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'
import { trackChairConsole } from '~/mock'

const DisputeConflict = () => {
    const showSnackbar = useSnackbar()
    const [tableData, setTableData] = useState(trackChairConsole)
    const [textField, setTextField] = useState('')
    const [openPaperModal, setOpenPaperModal] = useState(false)
    const [paperInfo, setPaperInfo] = useState()
    const handleOpenModal = (row) => {
        setPaperInfo(row)
        setOpenPaperModal(true)
    }
    const handleCloseModal = () => setOpenPaperModal(false)

    const handleSubmit = () => {
        // showSnackbar({
        //     severity: 'success',
        //     children: 'Dispute successfully.',
        // })
    }
    const handleTextChange = (event) => {
        setTextField(event.target.value)
    }
    const columns = useMemo(
        () => [
            {
                id: 'paperInfo',
                header: 'Paper',
                columns: [
                    {
                        accessorKey: 'paper',
                        header: 'ID',
                        size: 30,
                    },
                    {
                        accessorKey: 'title',
                        header: 'Title',
                    },
                    {
                        accessorKey: 'author',
                        header: 'Authors',
                        enableEditing: false,
                        Cell: ({ row }) => {
                            return (
                                <>
                                    {row.original.author.map((value, index) => (
                                        <Typography key={index}>
                                            {value.firstName} {value.lastName} ({value.department});
                                        </Typography>
                                    ))}
                                </>
                            )
                        },
                    },
                ],
            },
            {
                id: 'track',
                header: '',
                columns: [
                    {
                        accessorKey: 'track',
                        header: 'Track',
                        size: 60,
                    },
                    {
                        accessorKey: 'conflicts',
                        header: 'Conflict Reasons',
                    },
                ],
            },
            {
                id: 'dispute',
                header: 'Dispute',
                columns: [
                    {
                        accessorKey: 'authorFeedbackSubmit',
                        header: 'Status',
                        Cell: ({ row }) => (
                            <Typography sx={{ fontSize: '0.875rem' }}>
                                {row.original.authorFeedbackSubmit === true ? 'Pending' : 'Not Disputed'}
                            </Typography>
                        ),
                        size: 60,
                    },
                    {
                        accessorKey: 'abstract',
                        header: 'Reason',
                        Cell: () => (
                            <Typography sx={{ fontStyle: 'italic' }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore
                            </Typography>
                        ),
                    },
                ],
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return (
        <ConferenceDetail>
            <DisputeInfoModal
                open={openPaperModal}
                handleClose={handleCloseModal}
                row={paperInfo}
                handleSubmit={handleSubmit}
                textField={textField}
                handleTextChange={handleTextChange}
            />
            <Box width={ScreenSize.ScreenWidth} m="0 auto">
                <Box mb={4}>
                    <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                        Dispute Conflict
                    </Typography>
                </Box>
                <MaterialReactTable
                    columns={columns}
                    data={tableData}
                    enableColumnFilterModes
                    enablePinning
                    enableColumnResizing
                    enableStickyHeader
                    positionToolbarAlertBanner="bottom"
                    enableRowActions
                    positionActionsColumn="last"
                    muiTableBodyProps={{
                        sx: () => ({
                            '& tr:nth-of-type(odd)': {
                                backgroundColor: AppStyles.colors['#F7FCFF'],
                            },
                        }),
                    }}
                    renderRowActionMenuItems={({ closeMenu, row }) => [
                        <MenuItem
                            key={1}
                            onClick={() => {
                                handleOpenModal(row.original)
                                closeMenu()
                            }}
                            sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                        >
                            Dispute
                        </MenuItem>,
                        <MenuItem
                            key={2}
                            onClick={() => {
                                closeMenu()
                            }}
                            sx={{ m: 0 }}
                        >
                            Email Chairs
                        </MenuItem>,
                    ]}
                />
            </Box>
        </ConferenceDetail>
    )
}

export default DisputeConflict
