import { useEffect, useState } from 'react'

import { Box, Button, TextField } from '@mui/material'

const InputChildNavbar = ({ childNav, handleAddingSubNav, openAddSubNav, isAdd, selectedNavbar }) => {
    const [navbarName, setNavbarName] = useState(childNav)

    const textChangeHandler = (event) => {
        setNavbarName(event.target.value)
    }

    useEffect(() => {
        setNavbarName(childNav)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [childNav])

    return (
        <Box display="flex" alignItems="center" flex={1} mt={2}>
            <TextField
                size="small"
                placeholder="Navbar name"
                variant="outlined"
                fullWidth
                value={navbarName}
                onChange={textChangeHandler}
                sx={{ flex: 1 }}
            />
            <Button
                onClick={() => {
                    handleAddingSubNav(navbarName)
                    setNavbarName('')
                }}
                variant="contained"
                sx={{ ml: 2 }}
                disabled={!selectedNavbar}
            >
                {isAdd.status === true ? 'Add Sub Navbar' : 'Edit'}
            </Button>
            {!isAdd.status && (
                <Button sx={{ ml: 2 }} variant="outlined" color="error" onClick={openAddSubNav}>
                    Cancel
                </Button>
            )}
        </Box>
    )
}

export default InputChildNavbar
