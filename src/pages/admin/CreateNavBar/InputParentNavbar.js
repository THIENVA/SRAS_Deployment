import { useEffect, useState } from 'react'

import { Box, Button, TextField } from '@mui/material'

const InputParentNavbar = ({ parentNav, modifyNavbarHandler, cancelEditingHandler, isAdd }) => {
    const [navbarName, setNavbarName] = useState(parentNav.name)

    const textChangeHandler = (event) => {
        setNavbarName(event.target.value)
    }

    useEffect(() => {
        setNavbarName(parentNav.name)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentNav])

    return (
        <Box display="flex" alignItems="center" flex={1} mb={2}>
            <TextField
                size="small"
                placeholder="Navbar name"
                variant="outlined"
                fullWidth
                value={navbarName}
                onChange={textChangeHandler}
                sx={{ flex: 1 }}
            />
            <Button variant="contained" sx={{ ml: 1 }} onClick={() => modifyNavbarHandler(navbarName)}>
                {isAdd.status === true ? 'Add Navbar' : 'Edit'}
            </Button>
            {!isAdd.status && (
                <Button sx={{ ml: 1 }} variant="outlined" color="error" onClick={cancelEditingHandler}>
                    Cancel
                </Button>
            )}
        </Box>
    )
}

export default InputParentNavbar
