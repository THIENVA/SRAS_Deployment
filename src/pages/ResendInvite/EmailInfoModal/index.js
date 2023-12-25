import { Grid, Typography } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import ModalInfo from '~/components/ModalInfo'

import { AppStyles } from '~/constants/colors'

const EmailInfoModal = ({ open, handleClose, row, handleSubmit }) => {
    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Email Details'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Send Invites"
            handleSubmit={handleSubmit}
            enableActions={true}
        >
            <Grid container spacing={2}>
                <ListItemPopupInfo
                    itemName="From"
                    value={'Anh Nguyen Dang Truong <anhndtse150640@fpt.edu.vn>'}
                    itemWidth={2}
                    valueWidth={10}
                />
                <ListItemPopupInfo
                    itemName="To"
                    value={'Dương Hoàng Mai <duongmhse140196@fpt.edu.vn>'}
                    itemWidth={2}
                    valueWidth={10}
                />
                <ListItemPopupInfo itemName="Subject" value={row.subject} itemWidth={2} valueWidth={10} />
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
