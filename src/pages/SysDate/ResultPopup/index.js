import { Grid } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import ModalInfo from '~/components/ModalInfo'

import { AppStyles } from '~/constants/colors'

const ResultPopup = ({ open, handleClose, responseInfo, headerScript }) => {
    console.log(responseInfo)
    console.log(headerScript)
    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={headerScript}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="md"
            submitBtnName="OK"
            handleSubmit={handleClose}
            enableActions={true}
        >
            <Grid px={2} container spacing={2}>
                <ListItemPopupInfo itemName="Rows Effected" value={50} itemWidth={4} valueWidth={8} />
                {/* <ListItemPopupInfo itemName="Paper Title" value={row?.title} itemWidth={3} valueWidth={9} /> */}
                {/* <ListItemPopupInfo itemName="Track Name" value={row?.trackName} itemWidth={3} valueWidth={9} /> */}
            </Grid>
        </ModalInfo>
    )
}

export default ResultPopup
