import { Box, Container, TextField } from '@mui/material'
import InputField from '~/components/InputField'

import TitleSection from '../TitleSection'

const TitleAbstract = ({ titleAbstract, handleTitleAbstractChange, error, messageError, config }) => {
    const { title, abstract } = titleAbstract
    return (
        <Box mb={3}>
            <TitleSection>
                TITLE AND ABSTRACT <span style={{ color: 'red' }}>*</span>
            </TitleSection>
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
                        error={error.title}
                        helperText={error.title ? messageError.title : ''}
                    />
                </InputField>
                <InputField
                    text="Abstract"
                    boxStyle={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}
                    textBoxStyle={{ mr: 2 }}
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
                        inputProps={{ maxLength: !config ? 5000 : config.abstractSettings[0].value }}
                        helperText={
                            !config ? 5000 - abstract.length : config.abstractSettings[0].value - abstract.length
                        }
                    />
                </InputField>
            </Container>
        </Box>
    )
}

export default TitleAbstract
