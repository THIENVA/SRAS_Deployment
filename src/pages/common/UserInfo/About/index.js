import { Box, Chip, Stack, Typography } from '@mui/material'

import CardLayout from '../Layout/CardLayout'
import ContentBlock from './ContentBlock'

import { AppStyles } from '~/constants/colors'

const skills = [
    'Wireless',
    'Ad Hoc Network',
    'VANET',
    'Deep Learning',
    'Wireless Communications',
    'Optimization Methods',
    'Algorithms',
]

const About = () => {
    return (
        <CardLayout title="Overview" nameModal="Edit">
            <ContentBlock title="Phone Number" content="0385376482" />
            <ContentBlock title="Mobile Phone" content="0902193849" />
            <ContentBlock title="Fax" content="(480) 387-6028" />
            <ContentBlock title="Date of Birth" content="20/06/2001" />
            <ContentBlock title="Gender" content="Male" />
            <ContentBlock
                title="Subject Categories"
                content="Telecommunications Engineering Computer Science Automation"
            />
            <ContentBlock
                title="Introduction"
                content="I received the B.Eng and M.Eng degrees in Telecommunications Engineering from Ho Chi Minh City University of Technology, Vietnam, in 2005 and 2007, respectively and the Ph.D. degree in Computer Engineering from Kyung Hee University, Korea, in 2014. My research interests include the MAC protocols in Wireless Ad hoc Networks and Vehicular Ad hoc Networks.
"
            />
            <Box mt={2}>
                <Typography width={200} variant="h6" fontWeight={500} sx={{ color: AppStyles.colors['#333333'] }}>
                    Skill and Expertise
                </Typography>
                <Stack mt={1.5} direction="row" flexWrap="wrap" gap={1}>
                    {skills.map((skill, index) => (
                        <Chip key={index} label={skill} variant="outlined" />
                    ))}
                </Stack>
            </Box>
        </CardLayout>
    )
}

export default About
