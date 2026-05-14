import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, Typography, TextField, Button, Paper, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { authService } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PATIENT',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      console.log('Attempting registration with:', formData)
      const response = await authService.register(formData)
      console.log('Registration response:', response)
      
      // Decode JWT token to get user information
      const decodedToken = jwtDecode(response.token)
      console.log('Decoded token:', decodedToken)
      
      const userData = {
        id: decodedToken.userId,
        email: decodedToken.sub,
        firstName: decodedToken.firstName || '',
        lastName: decodedToken.lastName || '',
        role: decodedToken.authorities ? decodedToken.authorities.replace('ROLE_', '') : 'PATIENT',
      }
      
      console.log('User data:', userData)
      
      // Auto-login after registration
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
      console.error('Registration error:', err)
      console.error('Error message:', err.message)
      console.error('Error response:', err.response)
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registration failed. Please try again.')
      } else {
        setError('Registration failed: ' + err.message)
      }
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
            <PersonAddIcon sx={{ fontSize: 50, color: 'primary.main' }} />
            <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
              HealthSphere Register
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
                id="firstName"
                label="First Name"
                name="firstName"
                autoFocus
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value="PATIENT">Patient</MenuItem>
                  <MenuItem value="DOCTOR">Doctor</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Register
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/login')}
              >
                Already have an account? Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Register
