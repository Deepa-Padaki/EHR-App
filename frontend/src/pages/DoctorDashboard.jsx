import { useState, useEffect } from 'react'
import {
  Container, Typography, Box, Paper, Grid, Button, Card, CardContent,
  Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip,
  Avatar, IconButton, Link, Alert, ListItemIcon
} from '@mui/material'
import {
  CalendarToday, Description, LocalPharmacy, Videocam, Assessment,
  History, MedicalServices, Person, AccessTime, Event, CheckCircle,
  People, TrendingUp, Schedule, NoteAdd
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { appointmentService, medicalRecordService, prescriptionService, videoService } from '../utils/api'
import { useNavigate } from 'react-router-dom'

const DoctorDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [appointments, setAppointments] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  useEffect(() => {
    loadAppointments()
    loadMedicalRecords()
    loadPrescriptions()
  }, [])

  const loadAppointments = async () => {
    try {
      const response = await appointmentService.getByDoctor(user.id)
      setAppointments(response.data)
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  const loadMedicalRecords = async () => {
    try {
      const response = await medicalRecordService.getByDoctor(user.id)
      setMedicalRecords(response.data)
    } catch (error) {
      console.error('Error loading medical records:', error)
    }
  }

  const loadPrescriptions = async () => {
    try {
      const response = await prescriptionService.getByDoctor(user.id)
      setPrescriptions(response.data)
    } catch (error) {
      console.error('Error loading prescriptions:', error)
    }
  }

  const handleJoinConsultation = async (appointment) => {
    try {
      const response = await videoService.generateRoom()
      navigate(`/video/${response.data.roomId}`)
    } catch (error) {
      console.error('Error generating video room:', error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Welcome, Dr. {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Doctor Portal - Manage your patients
          </Typography>
        </Box>
        <Button variant="outlined" color="error" onClick={logout} startIcon={<Person />}>
          Logout
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {appointments.length}
                  </Typography>
                  <Typography variant="body2">Appointments Today</Typography>
                </Box>
                <CalendarToday sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {medicalRecords.length}
                  </Typography>
                  <Typography variant="body2">Patient Records</Typography>
                </Box>
                <Description sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {prescriptions.length}
                  </Typography>
                  <Typography variant="body2">Prescriptions</Typography>
                </Box>
                <LocalPharmacy sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {appointments.filter(a => a.status === 'CONFIRMED').length}
                  </Typography>
                  <Typography variant="body2">Confirmed</Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<Videocam />}
              sx={{ py: 2 }}
            >
              Start Consultation
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<NoteAdd />}
              sx={{ py: 2 }}
            >
              Add Medical Record
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={<LocalPharmacy />}
              sx={{ py: 2 }}
            >
              Write Prescription
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              color="success"
              fullWidth
              startIcon={<People />}
              sx={{ py: 2 }}
            >
              View Patients
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} centered>
          <Tab icon={<CalendarToday />} iconPosition="start" label="Appointments" />
          <Tab icon={<Description />} iconPosition="start" label="Patient Records" />
          <Tab icon={<LocalPharmacy />} iconPosition="start" label="Prescriptions" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}</TableCell>
                  <TableCell>{new Date(appointment.appointmentDateTime).toLocaleString()}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                    <Chip label={appointment.status} color={appointment.status === 'CONFIRMED' ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleJoinConsultation(appointment)}
                    >
                      Join Consultation
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {medicalRecords.map((record) => (
            <Grid item xs={12} key={record.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    Patient: {record.patient?.user?.firstName} {record.patient?.user?.lastName}
                  </Typography>
                  <Typography color="textSecondary">
                    Date: {new Date(record.recordDate).toLocaleDateString()}
                  </Typography>
                  <Typography>Diagnosis: {record.diagnosis}</Typography>
                  <Typography>Symptoms: {record.symptoms}</Typography>
                  <Typography>Treatment: {record.treatment}</Typography>
                  <Typography>Medications: {record.medications}</Typography>
                  {record.labResults && <Typography>Lab Results: {record.labResults}</Typography>}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          {prescriptions.length === 0 ? (
            <Alert severity="info">No prescriptions created yet.</Alert>
          ) : (
            prescriptions.map((prescription) => (
              <Grid item xs={12} md={6} key={prescription.id}>
                <Card sx={{ '&:hover': { boxShadow: 6 }, transition: '0.3s' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                        <LocalPharmacy />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Patient: {prescription.patient?.user?.firstName} {prescription.patient?.user?.lastName}
                        </Typography>
                        <Typography variant="subtitle1" color="primary">
                          {prescription.medicationName}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Dosage:</strong> {prescription.dosage}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Frequency:</strong> {prescription.frequency}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Duration:</strong> {prescription.duration}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Instructions:</strong> {prescription.instructions}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip
                        label={prescription.status}
                        color={prescription.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                        icon={<CheckCircle />}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {new Date(prescription.prescriptionDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Medical Resources Section */}
      <Paper sx={{ mt: 4, p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          <MedicalServices sx={{ mr: 1, verticalAlign: 'middle' }} />
          Medical Resources & Reference
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold">PubMed</Typography>
                <Link href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" underline="hover">
                  Research Database
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold">MedlinePlus</Typography>
                <Link href="https://medlineplus.gov/" target="_blank" underline="hover">
                  Drug Information
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold">CDC Guidelines</Typography>
                <Link href="https://www.cdc.gov/" target="_blank" underline="hover">
                  Health Guidelines
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold">UpToDate</Typography>
                <Link href="https://www.uptodate.com/" target="_blank" underline="hover">
                  Clinical Reference
                </Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default DoctorDashboard
