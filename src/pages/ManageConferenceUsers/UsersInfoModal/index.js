import { Grid, Typography } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import ModalInfo from '~/components/ModalInfo'

import { AppStyles } from '~/constants/colors'

const UsersInfoModal = ({ open, handleClose, row }) => {
    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Email Details'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
        >
            <Grid container spacing={2}>
                <Grid
                    item
                    xs={12}
                    sx={{ backgroundColor: AppStyles.colors['#F8F9FA'], boxShadow: 'inset 0 -1px 0 #edeeef' }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: 18, color: AppStyles.colors['#464646'] }}>
                        User Information
                    </Typography>
                </Grid>
                <ListItemPopupInfo itemName="First Name" value={row?.firstName} itemWidth={6} valueWidth={6} />
                <ListItemPopupInfo itemName="Last Name" value={row?.lastName} itemWidth={6} valueWidth={6} />
                <ListItemPopupInfo itemName="User Email" value={row?.email} itemWidth={6} valueWidth={6} />
                <ListItemPopupInfo itemName="Organization" value={row?.department} itemWidth={6} valueWidth={6} />
                <ListItemPopupInfo itemName="Country" value={'Vietnam'} itemWidth={6} valueWidth={6} />
                <ListItemPopupInfo itemName="User Roles" value={row?.fromRole} itemWidth={6} valueWidth={6} />
                {/* End User Information */}
                <Grid
                    item
                    xs={12}
                    sx={{ backgroundColor: AppStyles.colors['#F8F9FA'], boxShadow: 'inset 0 -1px 0 #edeeef' }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: 18, color: AppStyles.colors['#464646'] }}>
                        User Profile
                    </Typography>
                </Grid>
                <ListItemPopupInfo
                    itemName="Google Scholar Id Entered"
                    value={'GS'}
                    valueTxtStyle={{
                        color: AppStyles.colors['#027A9D'],
                        ':hover': {
                            textDecoration: 'underline',
                        },
                        cursor: 'pointer',
                    }}
                    itemWidth={6}
                    valueWidth={6}
                />
                <ListItemPopupInfo itemName="Semantic Scholar Id Entered" value={''} itemWidth={6} valueWidth={6} />
                <ListItemPopupInfo itemName="DBLP Id Entered" value={''} itemWidth={6} valueWidth={6} />
                <ListItemPopupInfo itemName="OpenReview Id Entered" value={''} itemWidth={6} valueWidth={6} />
                {/* End User Profile */}
                <Grid
                    item
                    xs={12}
                    sx={{ backgroundColor: AppStyles.colors['#F8F9FA'], boxShadow: 'inset 0 -1px 0 #edeeef' }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: 18, color: AppStyles.colors['#464646'] }}>
                        Conflicts Information
                    </Typography>
                </Grid>
                <ListItemPopupInfo
                    itemName="Domain Conflicts Entered"
                    value={row?.authorFeedbackSubmit === true ? 'Yes' : 'No'}
                    itemWidth={6}
                    valueWidth={6}
                />
                <ListItemPopupInfo
                    itemName="Individual Conflicts Entered"
                    value={row?.cameraReady === true ? 'Yes' : 'No'}
                    itemWidth={6}
                    valueWidth={6}
                />
                <ListItemPopupInfo
                    itemName="Individual Conflicts Attested"
                    value={row?.presentRequest === true ? 'Yes' : 'No'}
                    itemWidth={6}
                    valueWidth={6}
                />
                <ListItemPopupInfo
                    itemName="Last Visit  (Pacific Time)"
                    value={row?.sentOn}
                    itemWidth={6}
                    valueWidth={6}
                />
                {/* End Conflicts Information */}
            </Grid>
        </ModalInfo>
    )
}

export default UsersInfoModal
