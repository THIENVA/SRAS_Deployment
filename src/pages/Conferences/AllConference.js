import { memo, useEffect, useState } from 'react'

import TableRender from './TableRender'

import { useConference } from '~/api/common/conference'

const columns = [
    { id: 'name', label: 'Name', minWidth: 300, align: 'left', type: 'link' },
    { id: 'startDate', label: 'Start Date', minWidth: 75, align: 'left', type: 'text' },
    { id: 'endDate', label: 'End Date', minWidth: 75, align: 'left', type: 'text' },
    { id: 'location', label: 'Location', minWidth: 160, align: 'left', type: 'text' },
    { id: 'websiteLink', label: 'Website Link', minWidth: 100, align: 'left', type: 'link' },
    { id: 'submittableTracks', label: 'Open For Submission', minWidth: 150, align: 'left', type: 'text' },
    { id: 'conferenceStatus', label: 'Status', minWidth: 100, align: 'left', type: 'text' },
]

const AllConference = ({ searchInput, uniqueId }) => {
    const { getConferences } = useConference()
    // const showSnackbar = useSnackbar()
    const [page, setPage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [conferences, setConferences] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [total, setTotal] = useState(0)

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
                    setTotal(response.data.totalCount ? response.data.totalCount : 0)
                    const formatData = !response.data?.items
                        ? []
                        : response.data?.items.map((conference) => {
                              const {
                                  fullName,
                                  startDate,
                                  city,
                                  country,
                                  websiteLink,
                                  id,
                                  shortName,
                                  endDate,
                                  conferenceStatus,
                                  submittableTracks,
                              } = conference

                              return {
                                  name: fullName,
                                  startDate,
                                  location: `${city}, ${country}`,
                                  websiteLink,
                                  id,
                                  shortName,
                                  endDate,
                                  conferenceStatus,
                                  submittableTracks: submittableTracks ? submittableTracks : [],
                              }
                          })
                    setConferences(formatData)
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }, 1000)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, searchInput, uniqueId])
    return (
        <TableRender
            rows={conferences}
            columns={columns}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            loading={isLoading}
            total={total}
        />
    )
}

export default memo(AllConference)
