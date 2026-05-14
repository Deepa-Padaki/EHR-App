import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Box, Typography, Button, Paper, Grid } from '@mui/material'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import CallEndIcon from '@mui/icons-material/CallEnd'

const VideoConsultation = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  useEffect(() => {
    startLocalVideo()
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  const joinRoom = async () => {
    setIsConnected(true)
    console.log('Connected to room:', roomId)
  }

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    navigate(-1)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Video Consultation - Room: {roomId}
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<CallEndIcon />}
          onClick={endCall}
        >
          End Call
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: '#000' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'white' }}>
              Your Video
            </Typography>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: '#000' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'white' }}>
              Doctor's Video
            </Typography>
            <video
              ref={remoteVideoRef}
              autoPlay
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Paper>
        </Grid>
      </Grid>

      {!isConnected && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<VideoCallIcon />}
            onClick={joinRoom}
            size="large"
          >
            Join Consultation
          </Button>
        </Box>
      )}

      {isConnected && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="success.main">
            Connected to consultation
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default VideoConsultation
