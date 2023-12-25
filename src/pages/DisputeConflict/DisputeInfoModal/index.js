import { Grid, TextField, Typography } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import ModalInfo from '~/components/ModalInfo'

import { AppStyles } from '~/constants/colors'

const DisputeInfoModal = ({ open, handleClose, row, handleSubmit, textField, handleTextChange }) => {
    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Dispute Conflict'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Dispute"
            handleSubmit={handleSubmit}
            enableActions={true}
        >
            <Grid container spacing={2}>
                <ListItemPopupInfo itemName="Paper ID" value={row?.paper} itemWidth={5} valueWidth={7} />
                <ListItemPopupInfo itemName="Paper Title" value={row?.title} itemWidth={5} valueWidth={7} />
                <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                    <Grid item xs={5}>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>Authors</Typography>
                    </Grid>
                    <Grid item xs={7}>
                        {row?.author.map((value, index) => (
                            <Typography key={index} sx={{ color: AppStyles.colors['#495057'] }}>
                                {value.firstName} {value.lastName} ({value.department})
                            </Typography>
                        ))}
                    </Grid>
                </Grid>
                <ListItemPopupInfo itemName="Track Name" value={row?.track} itemWidth={5} valueWidth={7} />
                <ListItemPopupInfo itemName="Conflict Reasons" value={row?.conflicts} itemWidth={5} valueWidth={7} />
                <Grid container item>
                    <Grid item xs={5}>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                            Dispute Reason{' '}
                            <Typography component="span" sx={{ color: 'red' }}>
                                *
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            fullWidth={true}
                            placeholder="Dispute Reason"
                            variant="outlined"
                            value={textField.reason}
                            name="reason"
                            onChange={handleTextChange}
                            size="small"
                            multiline
                            rows={4}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </ModalInfo>
    )
}

export default DisputeInfoModal
