import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth()

  if (!token) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute
