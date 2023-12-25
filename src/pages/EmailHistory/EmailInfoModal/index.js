import { Grid, Typography } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import ModalInfo from '~/components/ModalInfo'

import { AppStyles } from '~/constants/colors'
import { formatDateTime } from '~/utils/commonFunction'

const EmailInfoModal = ({ open, handleClose, row }) => {
    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Email Details'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
        >
            <Grid container spacing={2}>
                <ListItemPopupInfo
                    itemName="Sent Time"
                    value={formatDateTime(row?.sentTime)}
                    itemWidth={5}
                    valueWidth={7}
                />
                <ListItemPopupInfo itemName="Email Status" value={row?.status} itemWidth={5} valueWidth={7} />
                <ListItemPopupInfo itemName="From Name" value={row?.senderFullName} itemWidth={5} valueWidth={7} />
                <ListItemPopupInfo itemName="From Email" value={row?.senderEmail} itemWidth={5} valueWidth={7} />
                <ListItemPopupInfo itemName="From Role" value={row?.senderRoleName} itemWidth={5} valueWidth={7} />
                <ListItemPopupInfo itemName="To Name" value={row?.recipientName} itemWidth={5} valueWidth={7} />
                <ListItemPopupInfo itemName="To Email" value={row?.recipientEmail} itemWidth={5} valueWidth={7} />
                <ListItemPopupInfo itemName="Subject" value={row?.subject} itemWidth={5} valueWidth={7} />
                <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                    <Grid item xs={12}>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>Body</Typography>
                    </Grid>
                    <Grid
                        item
                        sx={{
                            mt: 1,
                            backgroundColor: AppStyles.colors['#F5F5F5'],
                            border: '1px solid rgba(0, 0, 0, 0.15)',
                            p: 1,
                            borderRadius: 1,
                            width: '100%',
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
                            {row?.body}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </ModalInfo>
    )
}

export default EmailInfoModal
