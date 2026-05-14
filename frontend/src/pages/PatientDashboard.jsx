import { useState, useEffect } from 'react'
import {
  Container, Typography, Box, Paper, Grid, Button, Card, CardContent,
  Tabs, Tab, List, ListItem, ListItemText, Divider, Chip, IconButton,
  Avatar, ListItemIcon, Alert, Link, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Snackbar, Badge, Tooltip, Switch,
  FormControlLabel, InputAdornment, CircularProgress, LinearProgress
} from '@mui/material'
import {
  CalendarToday, Description, LocalPharmacy, Videocam, Assessment,
  History, MedicalServices, Person, AccessTime, Event, CheckCircle,
  Close, AccessAlarm, Notes, Message, Chat, Notifications, Download,
  Share, Visibility, Email, Phone, Star, RateReview, Edit, Save,
  Cancel, HealthAndSafety, TrendingUp, Warning, Info, Favorite,
  LocalHospital, Psychology, FitnessCenter, Hotel, WaterDrop, WarningAmber,
  Lightbulb
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { appointmentService, medicalRecordService, prescriptionService, videoService, doctorService, medicalReviewService } from '../utils/api'
import { useNavigate } from 'react-router-dom'

const PatientDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [appointments, setAppointments] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [messages, setMessages] = useState([])
  const [openBookingDialog, setOpenBookingDialog] = useState(false)
  const [openRecordDialog, setOpenRecordDialog] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [selectedDateTime, setSelectedDateTime] = useState('')
  const [appointmentReason, setAppointmentReason] = useState('')
  const [appointmentType, setAppointmentType] = useState('VIDEO_CONSULTATION')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [openRatingDialog, setOpenRatingDialog] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [openMessageDialog, setOpenMessageDialog] = useState(false)
  const [selectedDoctorForMessage, setSelectedDoctorForMessage] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [doctors, setDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState('')
  
  // New state for enhanced features
  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false)
  const [editProfileData, setEditProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    bloodGroup: '',
    gender: '',
    address: '',
    emergencyContact: '',
    emergencyContactRelation: ''
  })
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome to HealthSphere!', time: 'Just now', read: false, type: 'info' },
    { id: 2, message: 'Your appointment has been confirmed', time: '2 hours ago', read: false, type: 'success' },
    { id: 3, message: 'New health tip: Stay hydrated!', time: '1 day ago', read: true, type: 'tip' }
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [healthMetrics, setHealthMetrics] = useState({
    appointmentsThisMonth: 0,
    completedAppointments: 0,
    activePrescriptions: 0,
    healthScore: 85
  })

  useEffect(() => {
    console.log('PatientDashboard mounted, user:', user)
    if (!user || !user.id) {
      console.error('No user found, redirecting to login')
      navigate('/login')
      return
    }
    loadAppointments()
    loadMedicalRecords()
    loadPrescriptions()
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true)
      const response = await doctorService.getAll()
      setDoctors(response.data)
      console.log('Doctors loaded:', response.data)
    } catch (error) {
      console.error('Error loading doctors:', error)
      setSnackbar({
        open: true,
        message: 'Failed to load doctors list',
        severity: 'error'
      })
    } finally {
      setLoadingDoctors(false)
    }
  }

  const loadAppointments = async () => {
    try {
      console.log('Loading appointments for user ID:', user.id)
      const response = await appointmentService.getByPatient(user.id)
      console.log('Appointments response:', response.data)
      setAppointments(response.data)
    } catch (error) {
      console.error('Error loading appointments:', error)
      setSnackbar({
        open: true,
        message: 'Failed to load appointments',
        severity: 'error'
      })
    }
  }

  const loadMedicalRecords = async () => {
    try {
      console.log('Loading medical records for user ID:', user.id)
      const response = await medicalRecordService.getByPatient(user.id)
      console.log('Medical records response:', response.data)
      setMedicalRecords(response.data)
    } catch (error) {
      console.error('Error loading medical records:', error)
    }
  }

  const loadPrescriptions = async () => {
    try {
      console.log('Loading prescriptions for user ID:', user.id)
      const response = await prescriptionService.getByPatient(user.id)
      console.log('Prescriptions response:', response.data)
      setPrescriptions(response.data)
      
      // Update health metrics
      setHealthMetrics(prev => ({
        ...prev,
        activePrescriptions: response.data.filter(p => p.status === 'ACTIVE').length
      }))
    } catch (error) {
      console.error('Error loading prescriptions:', error)
    }
  }

  const handleOpenEditProfile = () => {
    setEditProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      dateOfBirth: '',
      bloodGroup: '',
      gender: '',
      address: '',
      emergencyContact: '',
      emergencyContactRelation: ''
    })
    setOpenEditProfileDialog(true)
  }

  const handleCloseEditProfile = () => {
    setOpenEditProfileDialog(false)
  }

  const handleProfileChange = (e) => {
    setEditProfileData({
      ...editProfileData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveProfile = async () => {
    try {
      // TODO: Call backend API to update profile
      console.log('Saving profile:', editProfileData)
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      })
      setOpenEditProfileDialog(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      })
    }
  }

  const handleMarkNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleClearNotifications = () => {
    setNotifications([])
  }

  const handleJoinConsultation = async () => {
    try {
      if (!selectedDoctor) {
        setSnackbar({
          open: true,
          message: 'Please select a doctor first!',
          severity: 'warning'
        })
        return
      }
      const response = await videoService.generateRoom()
      navigate(`/video/${response.data.roomId}`)
    } catch (error) {
      console.error('Error generating video room:', error)
      setSnackbar({
        open: true,
        message: 'Failed to start video consultation',
        severity: 'error'
      })
    }
  }

  const handleOpenBookingDialog = () => {
    setOpenBookingDialog(true)
  }

  const handleCloseBookingDialog = () => {
    setOpenBookingDialog(false)
    setSelectedDoctor('')
    setAppointmentReason('')
    setAppointmentType('VIDEO_CONSULTATION')
    setSelectedDateTime('')
  }

  const handleBookAppointment = async () => {
    try {
      const appointmentData = {
        patientId: user.id,
        doctorId: parseInt(selectedDoctor),
        appointmentDateTime: selectedDateTime,
        reason: appointmentReason,
        type: appointmentType
      }
      
      console.log('Booking appointment:', appointmentData)
      await appointmentService.create(appointmentData)
      setSnackbar({
        open: true,
        message: 'Appointment booked successfully! You can now view it in your appointments tab.',
        severity: 'success'
      })
      handleCloseBookingDialog()
      loadAppointments()
    } catch (error) {
      console.error('Error booking appointment:', error)
      setSnackbar({
        open: true,
        message: 'Failed to book appointment. Please try again.',
        severity: 'error'
      })
    }
  }

  const handleViewRecord = (record) => {
    setSelectedRecord(record)
    setOpenRecordDialog(true)
  }

  const handleSendMessage = async () => {
    try {
      // In a real app, this would call an API to send message
      const newMessage = {
        id: Date.now(),
        doctorId: selectedDoctorForMessage.id,
        doctorName: selectedDoctorForMessage.name,
        text: messageText,
        timestamp: new Date().toISOString(),
        fromPatient: true
      }
      setMessages([...messages, newMessage])
      setMessageText('')
      setOpenMessageDialog(false)
      setSnackbar({
        open: true,
        message: 'Message sent successfully!',
        severity: 'success'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message',
        severity: 'error'
      })
    }
  }

  const handleRateDoctor = async () => {
    try {
      // Find the doctor from the last completed appointment
      const completedAppointments = appointments.filter(a => a.status === 'COMPLETED')
      const doctorId = completedAppointments.length > 0 ? completedAppointments[0].doctor?.id : doctors[0]?.id
      
      const reviewData = {
        patientId: user.id,
        doctorId: doctorId,
        rating: rating,
        reviewText: reviewText
      }
      
      await medicalReviewService.create(reviewData)
      setSnackbar({
        open: true,
        message: 'Thank you for your feedback! Your review has been submitted.',
        severity: 'success'
      })
      setOpenRatingDialog(false)
      setRating(0)
      setReviewText('')
    } catch (error) {
      console.error('Error submitting review:', error)
      setSnackbar({
        open: true,
        message: 'Failed to submit rating',
        severity: 'error'
      })
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Welcome, {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Patient Portal - Manage your health records
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Notifications Badge */}
          <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
            <IconButton onClick={() => setShowNotifications(!showNotifications)} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
              <Notifications />
            </IconButton>
          </Badge>
          
          {/* Edit Profile Button */}
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleOpenEditProfile}
            startIcon={<Edit />}
            sx={{ borderRadius: 2 }}
          >
            Edit Profile
          </Button>
          
          {/* Logout Button */}
          <Button variant="outlined" color="error" onClick={logout} startIcon={<Person />}>
            Logout
          </Button>
        </Box>
      </Box>
      
      {/* Notifications Dropdown */}
      {showNotifications && (
        <Paper sx={{ p: 2, mb: 3, maxHeight: 300, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Notifications</Typography>
            <Button size="small" onClick={handleClearNotifications}>Clear All</Button>
          </Box>
          {notifications.length === 0 ? (
            <Typography color="textSecondary" align="center">No notifications</Typography>
          ) : (
            <List>
              {notifications.map((notification) => (
                <ListItem 
                  key={notification.id}
                  sx={{ 
                    bgcolor: notification.read ? 'transparent' : 'primary.light',
                    borderRadius: 1,
                    mb: 1
                  }}
                  onClick={() => handleMarkNotificationRead(notification.id)}
                >
                  <ListItemIcon>
                    {notification.type === 'info' && <Info color="info" />}
                    {notification.type === 'success' && <CheckCircle color="success" />}
                    {notification.type === 'warning' && <Warning color="warning" />}
                    {notification.type === 'tip' && <Lightbulb color="primary" />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={notification.message}
                    secondary={notification.time}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            borderRadius: 3,
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {appointments.length}
                  </Typography>
                  <Typography variant="body2">Total Appointments</Typography>
                </Box>
                <CalendarToday sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            bgcolor: 'success.main', 
            color: 'white',
            borderRadius: 3,
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {medicalRecords.length}
                  </Typography>
                  <Typography variant="body2">Medical Records</Typography>
                </Box>
                <Description sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            bgcolor: 'warning.main', 
            color: 'white',
            borderRadius: 3,
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {prescriptions.length}
                  </Typography>
                  <Typography variant="body2">Active Prescriptions</Typography>
                </Box>
                <LocalPharmacy sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Health Score Card */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            <HealthAndSafety sx={{ mr: 1, verticalAlign: 'middle' }} />
            Health Score Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Overall Health Score
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={healthMetrics.healthScore} 
                  sx={{ height: 10, borderRadius: 5 }}
                  color={healthMetrics.healthScore > 80 ? 'success' : healthMetrics.healthScore > 50 ? 'warning' : 'error'}
                />
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {healthMetrics.healthScore}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h5" fontWeight="bold">{appointments.length}</Typography>
                    <Typography variant="body2">This Month</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h5" fontWeight="bold">{healthMetrics.completedAppointments}</Typography>
                    <Typography variant="body2">Completed</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Health Tips Section */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2, bgcolor: 'info.light' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
            Daily Health Tips
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <WaterDrop color="info" />
                <Box>
                  <Typography variant="body2" fontWeight="bold">Stay Hydrated</Typography>
                  <Typography variant="caption">Drink 8 glasses of water daily</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FitnessCenter color="success" />
                <Box>
                  <Typography variant="body2" fontWeight="bold">Exercise Regularly</Typography>
                  <Typography variant="caption">30 minutes of activity daily</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Hotel color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight="bold">Hotel Well</Typography>
                  <Typography variant="caption">7-8 hours of quality Hotel</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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
              onClick={handleJoinConsultation}
              sx={{ py: 2 }}
            >
              Video Consultation
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<Event />}
              onClick={handleOpenBookingDialog}
              sx={{ py: 2 }}
            >
              Book Appointment
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={<Description />}
              onClick={() => setTabValue(1)}
              sx={{ py: 2 }}
            >
              View Records
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              color="success"
              fullWidth
              startIcon={<LocalPharmacy />}
              onClick={() => setTabValue(2)}
              sx={{ py: 2 }}
            >
              Prescriptions
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} centered>
          <Tab icon={<CalendarToday />} iconPosition="start" label="Appointments" />
          <Tab icon={<Description />} iconPosition="start" label="Medical Records" />
          <Tab icon={<LocalPharmacy />} iconPosition="start" label="Prescriptions" />
          <Tab icon={<Message />} iconPosition="start" label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              Messages
              {messages.length > 0 && (
                <Badge badgeContent={messages.length} color="error" sx={{ ml: 1 }} />
              )}
            </Box>
          } />
        </Tabs>
      </Paper>

      {/* Appointments Tab */}
      {tabValue === 0 && (
        <Box>
          {appointments.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              No appointments scheduled. Book your first appointment to get started!
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {appointments.map((appointment) => (
                <Grid item xs={12} md={6} key={appointment.id}>
                  <Card sx={{ '&:hover': { boxShadow: 6 }, transition: '0.3s' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <MedicalServices />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            Dr. {appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {appointment.doctor?.specialization}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTime sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          {new Date(appointment.appointmentDateTime).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Reason:</strong> {appointment.reason}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Chip
                          label={appointment.status}
                          color={appointment.status === 'SCHEDULED' ? 'success' : appointment.status === 'COMPLETED' ? 'primary' : 'default'}
                          size="small"
                        />
                        <Box>
                          <Tooltip title="Join Video Call">
                            <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                              <Videocam fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Message Doctor">
                            <IconButton 
                              size="small" 
                              color="secondary" 
                              sx={{ mr: 1 }}
                              onClick={() => {
                                const doc = doctors.find(d => d.id === appointment.doctor?.id)
                                if (doc) {
                                  setSelectedDoctorForMessage(doc)
                                  setOpenMessageDialog(true)
                                }
                              }}
                            >
                              <Message fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {appointment.status === 'COMPLETED' && (
                            <Tooltip title="Rate Doctor">
                              <IconButton 
                                size="small" 
                                color="warning"
                                onClick={() => setOpenRatingDialog(true)}
                              >
                                <Star fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Medical Records Tab */}
      {tabValue === 1 && (
        <Box>
          {medicalRecords.length === 0 ? (
            <Alert severity="info">No medical records available yet.</Alert>
          ) : (
            <Paper sx={{ p: 3 }}>
              <List>
                {medicalRecords.map((record, index) => (
                  <Box key={record.id}>
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ListItemIcon>
                              <Description color="primary" />
                            </ListItemIcon>
                            <Typography variant="h6" fontWeight="bold">
                              {record.diagnosis}
                            </Typography>
                          </Box>
                          <Button size="small" variant="outlined" startIcon={<Visibility />} onClick={() => handleViewRecord(record)}>
                            View Details
                          </Button>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="textSecondary">
                              <strong>Date:</strong> {new Date(record.recordDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <strong>Symptoms:</strong> {record.symptoms}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mt: { xs: 1, sm: 0 } }}>
                              <strong>Treatment:</strong> {record.treatment}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <strong>Medications:</strong> {record.medications}
                            </Typography>
                          </Grid>
                        </Grid>
                        {record.labResults && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="body2">
                              <strong>Lab Results:</strong> {record.labResults}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Tooltip title="Download Medical Record">
                            <Button size="small" variant="contained" color="primary" startIcon={<Download />}>
                              Download
                            </Button>
                          </Tooltip>
                          <Tooltip title="Share with Another Doctor">
                            <Button size="small" variant="outlined" startIcon={<Share />}>
                              Share
                            </Button>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                    {index < medicalRecords.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      )}

      {/* Prescriptions Tab */}
      {tabValue === 2 && (
        <Box>
          {prescriptions.length === 0 ? (
            <Alert severity="info">No prescriptions available.</Alert>
          ) : (
            <Grid container spacing={3}>
              {prescriptions.map((prescription) => (
                <Grid item xs={12} md={6} key={prescription.id}>
                  <Card sx={{ '&:hover': { boxShadow: 6 }, transition: '0.3s', borderLeft: '4px solid', borderColor: prescription.status === 'ACTIVE' ? 'success.main' : 'grey.300' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                          <LocalPharmacy />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {prescription.medicationName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Prescribed by Dr. {prescription.doctor?.user?.firstName}
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
                      {prescription.pharmacyName && (
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2">
                            <strong>Pharmacy:</strong> {prescription.pharmacyName}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Chip
                          label={prescription.status}
                          color={prescription.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                          icon={<CheckCircle />}
                        />
                        <Box>
                          <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                            Refill
                          </Button>
                          <Button size="small" variant="text">
                            History
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Messages Tab */}
      {tabValue === 3 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                <Chat sx={{ mr: 1, verticalAlign: 'middle' }} />
                Messages with Doctors
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Email />}
                onClick={() => setOpenMessageDialog(true)}
              >
                New Message
              </Button>
            </Box>
            <Divider />
          </Paper>
          
          {messages.length === 0 ? (
            <Alert severity="info">
              No messages yet. Start a conversation with your doctor!
            </Alert>
          ) : (
            <Box>
              {messages.map((message) => (
                <Paper 
                  key={message.id} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: message.fromPatient ? 'primary.light' : 'grey.100',
                    color: message.fromPatient ? 'white' : 'text.primary',
                    ml: message.fromPatient ? 'auto' : 0,
                    mr: message.fromPatient ? 0 : 'auto',
                    maxWidth: '70%'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {message.doctorName || 'You'}
                    </Typography>
                    <Typography variant="caption" color={message.fromPatient ? 'white' : 'textSecondary'}>
                      {new Date(message.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {message.text}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Medical Resources Section */}
      <Paper sx={{ mt: 4, p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          <MedicalServices sx={{ mr: 1, verticalAlign: 'middle' }} />
          Medical Resources & Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold">WHO Guidelines</Typography>
                <Link href="https://www.who.int/health-topics" target="_blank" underline="hover">
                  Visit WHO Health Topics
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold">Mayo Clinic</Typography>
                <Link href="https://www.mayoclinic.org/" target="_blank" underline="hover">
                  Medical Information
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold">WebMD</Typography>
                <Link href="https://www.webmd.com/" target="_blank" underline="hover">
                  Health Resources
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold">Healthline</Typography>
                <Link href="https://www.healthline.com/" target="_blank" underline="hover">
                  Medical News
                </Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Book Appointment Dialog */}
      <Dialog open={openBookingDialog} onClose={handleCloseBookingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Event sx={{ mr: 1, color: 'primary.main' }} />
              Book New Appointment
            </Box>
            <IconButton onClick={handleCloseBookingDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Select Doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              sx={{ mb: 3 }}
              required
              disabled={loadingDoctors}
            >
              {loadingDoctors ? (
                <MenuItem disabled>Loading doctors...</MenuItem>
              ) : (
                doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    <Box>
                      <Typography variant="body1">
                        Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {doctor.specialization} - {doctor.department}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              fullWidth
              label="Appointment Date & Time"
              type="datetime-local"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              required
            />

            <TextField
              select
              fullWidth
              label="Consultation Type"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              sx={{ mb: 3 }}
              required
            >
              <MenuItem value="VIDEO_CONSULTATION">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Videocam sx={{ mr: 1 }} />
                  Video Consultation
                </Box>
              </MenuItem>
              <MenuItem value="IN_PERSON">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  In-Person Visit
                </Box>
              </MenuItem>
              <MenuItem value="PHONE_CONSULTATION">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime sx={{ mr: 1 }} />
                  Phone Consultation
                </Box>
              </MenuItem>
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason for Visit"
              value={appointmentReason}
              onChange={(e) => setAppointmentReason(e.target.value)}
              placeholder="Describe your symptoms or reason for the appointment..."
              required
              InputProps={{
                startAdornment: (
                  <Notes sx={{ mr: 1, color: 'action.active', mt: 1 }} />
                )
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseBookingDialog} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleBookAppointment} 
            variant="contained" 
            color="primary"
            disabled={!selectedDoctor || !appointmentReason}
            startIcon={<CheckCircle />}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Medical Record Dialog */}
      <Dialog open={openRecordDialog} onClose={() => setOpenRecordDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Description sx={{ mr: 1, color: 'primary.main' }} />
            Medical Record Details
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRecord && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {selectedRecord.diagnosis}
                  </Typography>
                  <Chip label={new Date(selectedRecord.recordDate).toLocaleDateString()} color="primary" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Doctor:</Typography>
                  <Typography variant="body2">
                    Dr. {selectedRecord.doctor?.user?.firstName} {selectedRecord.doctor?.user?.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Symptoms:</Typography>
                  <Typography variant="body2">{selectedRecord.symptoms}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Treatment:</Typography>
                  <Typography variant="body2">{selectedRecord.treatment}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Medications:</Typography>
                  <Typography variant="body2">{selectedRecord.medications}</Typography>
                </Grid>
                {selectedRecord.labResults && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight="bold">Lab Results:</Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
                      <Typography variant="body2">{selectedRecord.labResults}</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRecordDialog(false)}>Close</Button>
          <Button variant="contained" color="primary" startIcon={<Download />}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Doctor Dialog */}
      <Dialog open={openMessageDialog} onClose={() => setOpenMessageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Message sx={{ mr: 1, color: 'primary.main' }} />
            {selectedDoctorForMessage ? `Message to ${selectedDoctorForMessage.name}` : 'New Message'}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {!selectedDoctorForMessage && (
            <TextField
              select
              fullWidth
              label="Select Doctor"
              value={selectedDoctorForMessage?.id || ''}
              onChange={(e) => {
                const doc = doctors.find(d => d.id === parseInt(e.target.value))
                setSelectedDoctorForMessage(doc)
              }}
              sx={{ mb: 2 }}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  Dr. {doctor.user?.firstName} {doctor.user?.lastName} - {doctor.specialization}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Your Message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message to the doctor..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessageDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained" 
            color="primary"
            startIcon={<Email />}
            disabled={!messageText || !selectedDoctorForMessage}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rate Doctor Dialog */}
      <Dialog open={openRatingDialog} onClose={() => setOpenRatingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Star sx={{ mr: 1, color: 'warning.main' }} />
            Rate Your Doctor
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" gutterBottom>
              How was your experience?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 3 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  onClick={() => setRating(star)}
                  color={rating >= star ? 'warning' : 'default'}
                  size="large"
                >
                  <Star fontSize="large" />
                </IconButton>
              ))}
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''} selected` : 'Select a rating'}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review (Optional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this doctor..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRatingDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRateDoctor} 
            variant="contained" 
            color="warning"
            disabled={rating === 0}
            startIcon={<RateReview />}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Edit Profile Dialog */}
      <Dialog open={openEditProfileDialog} onClose={handleCloseEditProfile} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1, color: 'primary.main' }} />
            Edit Profile
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={editProfileData.firstName}
                onChange={handleProfileChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={editProfileData.lastName}
                onChange={handleProfileChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={editProfileData.email}
                onChange={handleProfileChange}
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editProfileData.phone}
                onChange={handleProfileChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                value={editProfileData.dateOfBirth}
                onChange={handleProfileChange}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            {/* Medical Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Medical Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Blood Group"
                name="bloodGroup"
                value={editProfileData.bloodGroup}
                onChange={handleProfileChange}
              >
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={editProfileData.gender}
                onChange={handleProfileChange}
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={editProfileData.address}
                onChange={handleProfileChange}
                multiline
                rows={2}
              />
            </Grid>
            
            {/* Emergency Contact */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Emergency Contact
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Number"
                name="emergencyContact"
                value={editProfileData.emergencyContact}
                onChange={handleProfileChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Relationship"
                name="emergencyContactRelation"
                value={editProfileData.emergencyContactRelation}
                onChange={handleProfileChange}
                placeholder="e.g., Spouse, Parent, Sibling"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEditProfile} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile} 
            variant="contained" 
            color="primary"
            startIcon={<Save />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default PatientDashboard
