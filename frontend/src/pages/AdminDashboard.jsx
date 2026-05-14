import { useState, useEffect } from 'react'
import {
  Container, Typography, Box, Paper, Grid, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { appointmentService, medicalRecordService } from '../utils/api'

const AdminDashboard = () => {
  const { logout } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0,
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const appointmentsResponse = await appointmentService.getAll()
      setAppointments(appointmentsResponse.data)
      setStats({
        totalAppointments: appointmentsResponse.data.length,
        totalPatients: 150,
        totalDoctors: 25,
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Button variant="outlined" color="error" onClick={logout}>
          Logout
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Appointments
              </Typography>
              <Typography variant="h3">{stats.totalAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Patients
              </Typography>
              <Typography variant="h3">{stats.totalPatients}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Doctors
              </Typography>
              <Typography variant="h3">{stats.totalDoctors}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>
          Recent Appointments
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.slice(0, 10).map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}
                  </TableCell>
                  <TableCell>
                    Dr. {appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}
                  </TableCell>
                  <TableCell>{new Date(appointment.appointmentDateTime).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip label={appointment.status} color="primary" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  )
}

export default AdminDashboard
