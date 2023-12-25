import { useEffect } from 'react'

import parse from 'html-react-parser'
import { useParams } from 'react-router-dom'

import { Box, Typography } from '@mui/material'

import LocalStorageUtils from '~/utils/LocalStorageUtils'

const Preview = () => {
    const { unique } = useParams()
    const content = LocalStorageUtils.getPreviewContent(`${unique}`)

    useEffect(() => {
        const handleBeforeUnload = () => {
            const isPageRefresh = performance.navigation.type === 1
            if (!isPageRefresh) {
                LocalStorageUtils.deletePreviewContent(unique)
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [unique])

    return content ? (
        parse(content)
    ) : (
        <Box height="100vh" alignItems="center" justifyContent="center" display="flex">
            <Typography variant="h4">This site can not access!</Typography>
        </Box>
    )
}

export default Preview
