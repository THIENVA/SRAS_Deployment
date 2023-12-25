import { Box, Container, TextField, Typography } from '@mui/material'
import InputField from '~/components/InputField'

import TitleSection from '../TitleSection'

import { AppStyles } from '~/constants/colors'

const DomainConflict = ({ handleDomainChange, domain, error, messageError }) => {
    return (
        <Box mb={3}>
            <TitleSection>DOMAIN CONFLICT</TitleSection>
            <Box sx={{ borderRadius: 2, p: 3, my: 2, backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                <Typography gutterBottom>
                    Please enter the domain of each institution (semicolon separated) that authors have a conflict of
                    interest with (example: mit.edu; ox.ac.uk; microsoft.com). More specifically, please list domains of
                    all institutions authors worked for, or have had very close collaboration with, within the last 3
                    years.
                </Typography>
                <Typography>
                    <strong>Note: </strong> It is important that you also enter the domains of authors&apos; current
                    institutions here since we does not automatically add them to conflicting domains. Please DO NOT
                    enter the domain of email providers such as gmail.com, yahoo.com, hotmail.com and 163.com as
                    institution domains.
                </Typography>
            </Box>
            <Container maxWidth="lg">
                <InputField
                    text="Domain"
                    boxStyle={{ display: 'flex', alignItems: 'baseline', mb: 2, justifyContent: 'center' }}
                    textBoxStyle={{ mr: 2 }}
                    isRequire={true}
                    textStyle={{ fontSize: 16, width: 75, textAlign: 'right' }}
                >
                    <TextField
                        placeholder="Domain conflicts"
                        size="small"
                        sx={{ width: 700 }}
                        required
                        name="title"
                        value={domain}
                        onChange={handleDomainChange}
                        error={error.domain}
                        helperText={error.domain ? messageError.domain : ''}
                    />
                </InputField>
            </Container>
        </Box>
    )
}

export default DomainConflict
