import { useState } from 'react'

import { useHistory } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Box, Button, Container, InputBase, Typography } from '@mui/material'
import SyncComponent from '~/components/SyncComponent'

import AdminPage from '../AdminPage'
import Conferences from './Conferences'

const Dashboard = () => {
    const history = useHistory()
    const [totalCount, setTotalCount] = useState(0)
    const [searchInput, setSearchInput] = useState('')
    const [unique, setUnique] = useState(uuid())

    return (
        <AdminPage>
            <Container maxWidth="xl">
                <Box my={4} display="flex" justifyContent="space-between">
                    <Typography variant="h4" fontWeight={500}>
                        Conferences ({totalCount ? totalCount : 0})
                    </Typography>
                    <Box display="flex">
                        <Button
                            sx={{ ml: 2 }}
                            onClick={() => history.push('/admin/create-conference')}
                            variant="contained"
                        >
                            Create conference
                        </Button>
                    </Box>
                </Box>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Box
                        sx={{
                            px: 1,
                            alignItems: 'center',
                            borderRadius: 2,
                            border: '1px solid #0077CC',
                            width: 300,
                        }}
                    >
                        <InputBase
                            name="searchValue"
                            onChange={(event) => setSearchInput(event.target.value)}
                            value={searchInput}
                            placeholder="type to search..."
                            sx={{ width: '100%' }}
                        />
                    </Box>
                    <SyncComponent setSync={() => setUnique(uuid())} />
                </Box>
                <Conferences
                    unique={unique}
                    searchInput={searchInput}
                    setTotalCount={setTotalCount}
                    setUnique={setUnique}
                />
            </Container>
        </AdminPage>
    )
}

export default Dashboard
