import { Box, TextField } from '@mui/material'

const LoginInfo = ({ loginInfo, handleLoginInfoChange, messageError, error }) => {
    return (
        <Box mt={1}>
            <TextField
                required
                margin="normal"
                fullWidth
                variant="outlined"
                label="Email"
                name="email"
                value={loginInfo.email}
                onChange={handleLoginInfoChange}
                size="small"
                error={error.email}
                helperText={error.email ? messageError.email : ''}
            />
            <TextField
                required
                margin="normal"
                fullWidth
                variant="outlined"
                label="Password"
                name="password"
                value={loginInfo.password}
                onChange={handleLoginInfoChange}
                size="small"
                inputProps={{ type: 'password' }}
                error={error.password}
                helperText={error.password ? messageError.password : ''}
            />
            <TextField
                required
                margin="normal"
                fullWidth
                variant="outlined"
                label="Confirm Password"
                name="confirmPassword"
                value={loginInfo.confirmPassword}
                onChange={handleLoginInfoChange}
                size="small"
                inputProps={{ type: 'password' }}
                error={error.confirmPassword}
                helperText={error.confirmPassword ? messageError.confirmPassword : ''}
            />
        </Box>
    )
}

export default LoginInfo
