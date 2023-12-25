import { Fragment, useEffect, useState } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'

import ConfirmPopup from './ConfirmPopup'
import TableRender from './TableRender'
import UpdateWebLink from './UpdateWebLink'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useConference } from '~/api/common/conference'
import { APP_API_URL } from '~/config'

const columns = [
    { id: 'name', label: 'Name', minWidth: 200, align: 'left', type: 'text' },
    { id: 'startDate', label: 'Start Date', minWidth: 75, align: 'left', type: 'text' },
    { id: 'endDate', label: 'End Date', minWidth: 75, align: 'left', type: 'text' },
    { id: 'location', label: 'Location', minWidth: 150, align: 'left', type: 'text' },
    { id: 'websiteLink', label: 'Website Link', minWidth: 160, align: 'left', type: 'text' },
    { id: 'conferenceStatus', label: 'Status', minWidth: 100, align: 'left', type: 'text' },
    { id: 'action', label: 'Actions', minWidth: 200, align: 'left', type: 'text' },
    { id: 'finalReport', label: 'Final Report', minWidth: 225, align: 'left', type: 'text' },
    { id: 'pcMember', label: 'PC Member', minWidth: 80, align: 'left', type: 'text' },
]

const Conferences = ({ setTotalCount, searchInput, unique, setUnique }) => {
    const { getConferences, deleteConference } = useConference()
    const [page, setPage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [conferences, setConferences] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [total, setTotal] = useState(0)
    const [openPaperModal, setOpenPaperModal] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [paperInfo, setPaperInfo] = useState(null)
    const [updateIndex, setUpdateIndex] = useState(null)
    const [loading, setLoading] = useState({ status: false, rowId: null })
    const showSnackbar = useSnackbar()

    const exportFinalReport = (conferenceId, shortName) => {
        setLoading({ status: true, rowId: conferenceId })
        axios({
            url: `${APP_API_URL}/conferences/${conferenceId}/archive-file`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `final-report-${shortName}`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setLoading({ status: false, rowId: null })
            })
    }

    const handleOpenModal = (row, index) => {
        setPaperInfo(row)
        setUpdateIndex(index)
        setOpenPaperModal(true)
    }

    const handleCloseModal = () => {
        setPaperInfo(null)
        setUpdateIndex(null)
        setOpenPaperModal(false)
    }

    const handleOpenConfirm = (row) => {
        setPaperInfo(row)
        setOpenConfirm(true)
    }

    const handleCloseConfirm = () => {
        setPaperInfo(null)
        setOpenConfirm(false)
    }

    const handleChangePage = (_, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    useEffect(() => {
        const controller = new AbortController()
        setIsLoading(true)
        const timeout = setTimeout(() => {
            getConferences(null, controller.signal, page * rowsPerPage, rowsPerPage, searchInput)
                .then((response) => {
                    setTotalCount(response.data.totalCount)
                    setTotal(response.data.totalCount ? response.data.totalCount : 0)
                    const formatData = !response.data?.items
                        ? []
                        : response.data.items.map((conference) => {
                              const {
                                  fullName,
                                  startDate,
                                  city,
                                  country,
                                  websiteLink,
                                  id,
                                  endDate,
                                  websiteActions,
                                  conferenceStatus,
                                  shortName,
                                  isUpdatingEnable,
                                  isDeletingEnable,
                              } = conference
                              return {
                                  name: fullName,
                                  startDate,
                                  location: `${city}, ${country}`,
                                  websiteLink,
                                  id,
                                  endDate,
                                  websiteActions,
                                  shortName,
                                  conferenceStatus,
                                  isUpdatingEnable,
                                  isDeletingEnable,
                              }
                          })
                    setConferences(formatData)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }, 1000)
        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, searchInput, unique])

    return (
        <Fragment>
            {openPaperModal && (
                <UpdateWebLink
                    open={openPaperModal}
                    row={paperInfo}
                    handleClose={handleCloseModal}
                    updateIndex={updateIndex}
                    conferences={conferences}
                    setConferences={setConferences}
                />
            )}
            {openConfirm && (
                <ConfirmPopup
                    open={openConfirm}
                    row={paperInfo}
                    handleClose={handleCloseConfirm}
                    deleteConference={deleteConference}
                    setUnique={setUnique}
                />
            )}
            <TableRender
                rows={conferences}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                total={total}
                loading={isLoading}
                handleOpenModal={handleOpenModal}
                buttonLoading={loading}
                exportFinalReport={exportFinalReport}
                handleOpenConfirm={handleOpenConfirm}
            />
        </Fragment>
    )
}

export default Conferences
