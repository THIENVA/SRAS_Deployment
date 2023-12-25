import { Box } from '@mui/material'

import LeftPage from './LeftPage'
import RightPage from './RightPage'

const NotFound = ({ status = '404' }) => {
    return (
        <Box display="flex" height="87vh" overflow="hidden">
            <Box
                flexBasis="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="1"
                flexDirection="column"
            >
                <LeftPage status={status} />
            </Box>
            <Box flexBasis="50%">
                <RightPage />
            </Box>
        </Box>
    )
}

export default NotFound
