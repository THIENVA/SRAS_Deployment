import { Box, Container, TextField } from '@mui/material'
import InputField from '~/components/InputField'

import TitleSection from '../TitleSection'

import { ROLES_NAME } from '~/constants/conferenceRoles'

const TitleAbstract = ({ titleAbstract, handleTitleAbstractChange, roleName }) => {
    const { title, abstract } = titleAbstract
    return (
        <Box mb={3}>
            <TitleSection>TITLE AND ABSTRACT</TitleSection>
            <Container maxWidth="lg">
                <InputField
                    text="Title"
                    boxStyle={{ display: 'flex', alignItems: 'baseline', mb: 2, justifyContent: 'center' }}
                    textBoxStyle={{ mr: 2 }}
                    isRequire={true}
                    textStyle={{ fontSize: 16, width: 75, textAlign: 'right' }}
                >
                    <TextField
                        placeholder="Title"
                        size="small"
                        sx={{ width: 700 }}
                        required
                        value={title}
                        onChange={handleTitleAbstractChange}
                        name="title"
                        disabled={roleName !== ROLES_NAME.CHAIR && roleName !== ROLES_NAME.TRACK_CHAIR}
                    />
                </InputField>
                <InputField
                    text="Abstract"
                    boxStyle={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}
                    textBoxStyle={{ mr: 2 }}
                    isRequire={true}
                    textStyle={{ fontSize: 16, width: 75, textAlign: 'right' }}
                >
                    <TextField
                        placeholder="Abstract"
                        rows={6}
                        multiline
                        size="small"
                        sx={{ width: 700 }}
                        value={abstract}
                        onChange={handleTitleAbstractChange}
                        name="abstract"
                        disabled={roleName !== ROLES_NAME.CHAIR && roleName !== ROLES_NAME.TRACK_CHAIR}
                    />
                </InputField>
            </Container>
        </Box>
    )
}

export default TitleAbstract
