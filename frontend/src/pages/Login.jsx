import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, Typography, TextField, Button, Paper, Alert, Divider } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { authService } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await authService.login(formData)
      
      // Decode JWT token to get user information
      const decodedToken = jwtDecode(response.token)
      const userData = {
        id: decodedToken.userId,
        email: decodedToken.sub,
        firstName: decodedToken.firstName || '',
        lastName: decodedToken.lastName || '',
        role: decodedToken.authorities.replace('ROLE_', ''),
      }
      
      console.log('Logged in user data:', userData)
      
      // Store user data and token
      login(userData, response.token)

      // Navigate based on role
      if (userData.role === 'PATIENT') {
        navigate('/patient')
      } else if (userData.role === 'DOCTOR') {
        navigate('/doctor')
      } else {
        navigate('/admin')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LockOutlinedIcon sx={{ fontSize: 50, color: 'primary.main' }} />
            <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
              HealthSphere Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Sign In
              </Button>
              <Divider />
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigate('/register')}
              >
                Create New Account
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
