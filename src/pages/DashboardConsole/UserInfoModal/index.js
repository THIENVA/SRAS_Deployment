import { Grid, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import ListItem from './ListItem'

import { AppStyles } from '~/constants/colors'

const UserInfoModal = ({ open, handleClose, row }) => {
    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'User Details'}
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
                <ListItem itemName="First Name" value={row?.firstName} itemWidth={5} valueWidth={7} />
                <ListItem itemName="Last Name" value={row?.lastName} itemWidth={5} valueWidth={7} />
                <ListItem itemName="User Email" value={row?.email} itemWidth={5} valueWidth={7} />
                <ListItem itemName="Organization" value={row?.department} itemWidth={5} valueWidth={7} />
                <ListItem
                    itemName="External Profile Entered"
                    value={row?.department}
                    valueTxtStyle={{
                        color: AppStyles.colors['#027A9D'],
                        ':hover': {
                            textDecoration: 'underline',
                        },
                        cursor: 'pointer',
                    }}
                    itemWidth={5}
                    valueWidth={7}
                />
                {/* End User Information */}
                <Grid
                    item
                    xs={12}
                    sx={{ backgroundColor: AppStyles.colors['#F8F9FA'], boxShadow: 'inset 0 -1px 0 #edeeef' }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: 18, color: AppStyles.colors['#464646'] }}>
                        Conflicts Information
                    </Typography>
                </Grid>
                <ListItem
                    itemName="Selected Conflicts"
                    value={row?.authorFeedbackSubmit}
                    itemWidth={5}
                    valueWidth={7}
                />
                <ListItem itemName="Conflicts" value={row?.conflicts} itemWidth={5} valueWidth={7} />
                {/* End Conflicts Information */}
                <Grid
                    item
                    xs={12}
                    sx={{ backgroundColor: AppStyles.colors['#F8F9FA'], boxShadow: 'inset 0 -1px 0 #edeeef' }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: 18, color: AppStyles.colors['#464646'] }}>
                        Subject Areas
                    </Typography>
                </Grid>
                <ListItem itemName="Primary Subject" value={row?.primarySubject} itemWidth={5} valueWidth={7} />
                <ListItem itemName="Secondary Subject" value={row?.secondarySubject} itemWidth={5} valueWidth={7} />
                {/* End Subject Areas */}
                <Grid
                    item
                    xs={12}
                    sx={{ backgroundColor: AppStyles.colors['#F8F9FA'], boxShadow: 'inset 0 -1px 0 #edeeef' }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: 18, color: AppStyles.colors['#464646'] }}>
                        Others
                    </Typography>
                </Grid>
                <ListItem itemName="Relevance" value={''} itemWidth={5} valueWidth={7} />
                <ListItem itemName="Quota" value={''} itemWidth={5} valueWidth={7} />
                <ListItem
                    itemName="Number Of Assignments"
                    value={row?.noSubFiles}
                    valueTxtStyle={{
                        color: AppStyles.colors['#027A9D'],
                        ':hover': {
                            textDecoration: 'underline',
                        },
                        cursor: 'pointer',
                    }}
                    itemWidth={5}
                    valueWidth={7}
                />
                <ListItem
                    itemName="Number Of Assignments"
                    value={row?.noSubFiles}
                    valueTxtStyle={{
                        color: AppStyles.colors['#027A9D'],
                        ':hover': {
                            textDecoration: 'underline',
                        },
                        cursor: 'pointer',
                    }}
                    itemWidth={5}
                    valueWidth={7}
                />
                {/* End Paper Status */}
            </Grid>
        </ModalInfo>
    )
}

export default UserInfoModal
