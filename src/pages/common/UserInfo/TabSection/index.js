import { Box } from '@mui/material'
import TabsCompo from '~/components/TabsCompo'

import tabs from '~/constants/tabs'

const TabSection = ({ value, handleChange }) => {
    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <TabsCompo tabs={tabs} value={value} handleChange={handleChange} />
        </Box>
    )
}

export default TabSection
