# HealthSphere - EHR & Telemedicine Platform

A HIPAA-compliant Electronic Health Record (EHR) and Telemedicine Platform built with Spring Boot and React.

## Project Overview

HealthSphere is a comprehensive healthcare platform that enables:
- Secure patient data management with HIPAA compliance
- Real-time video consultations using WebRTC
- Electronic health record management
- Dynamic appointment scheduling
- E-prescribing services
- Role-based access control (Patient, Doctor, Admin)

## Tech Stack

### Backend
- Java 17 with Spring Boot 3.2.0
- Spring Security with JWT authentication
- Spring Data JPA with H2 Database
- Maven for dependency management
- RESTful API architecture

### Frontend
- React 18 with Vite
- Material-UI (MUI) for UI components
- React Router for navigation
- Axios for API calls
- FullCalendar for appointment scheduling
- WebRTC for video consultations

## Key Features

1. **HIPAA-Compliant Security**
   - Multi-factor authentication
   - Strict RBAC (Role-Based Access Control)
   - JWT token-based authentication
   - Secure password encryption

2. **Electronic Health Record Management**
   - Create, update, and view patient medical records
   - Track diagnoses, medications, and lab results
   - Maintain comprehensive medical history

3. **Dynamic Appointment Scheduling**
   - Interactive calendar system
   - Book, reschedule, and manage appointments
   - Status tracking (Scheduled, Confirmed, In Progress, Completed)

4. **Telemedicine Module**
   - Secure real-time video and audio conferencing
   - WebRTC-based communication
   - Virtual consultation rooms

5. **E-Prescribing Service**
   - Digital prescription generation
   - Transmit prescriptions to pharmacies
   - Track prescription status

6. **Patient & Doctor Portals**
   - Separate dedicated interfaces
   - Role-specific dashboards
   - Personalized functionality

## Project Structure

```
EHR/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/healthsphere/
│   │       │       ├── config/
│   │       │       ├── controller/
│   │       │       ├── dto/
│   │       │       ├── entity/
│   │       │       ├── repository/
│   │       │       ├── security/
│   │       │       └── service/
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.8 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/authenticate` - Login user

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Delete appointment
- `GET /api/appointments/patient/{patientId}` - Get patient appointments
- `GET /api/appointments/doctor/{doctorId}` - Get doctor appointments

### Medical Records
- `GET /api/medical-records` - Get all records
- `GET /api/medical-records/{id}` - Get record by ID
- `POST /api/medical-records` - Create record (Doctor only)
- `PUT /api/medical-records/{id}` - Update record (Doctor only)
- `DELETE /api/medical-records/{id}` - Delete record (Doctor only)
- `GET /api/medical-records/patient/{patientId}` - Get patient records
- `GET /api/medical-records/doctor/{doctorId}` - Get doctor records

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `GET /api/prescriptions/{id}` - Get prescription by ID
- `POST /api/prescriptions` - Create prescription (Doctor only)
- `PUT /api/prescriptions/{id}` - Update prescription (Doctor only)
- `DELETE /api/prescriptions/{id}` - Delete prescription (Doctor only)
- `GET /api/prescriptions/patient/{patientId}` - Get patient prescriptions
- `GET /api/prescriptions/doctor/{doctorId}` - Get doctor prescriptions

### Video Consultation
- `POST /api/video/generate-room` - Generate video room
- `GET /api/video/room/{roomId}` - Get room details
- `POST /api/video/end-room/{roomId}` - End video room

## User Roles

### Patient
- View and manage own health records
- Book and manage appointments
- View prescriptions
- Join video consultations

### Doctor
- Create and update patient medical records
- Manage appointments
- Issue e-prescriptions
- Conduct video consultations
- View patient history

### Admin
- Monitor system usage
- View all appointments
- Manage users (future enhancement)
- Generate reports (future enhancement)

## Security Features

- JWT token-based authentication
- Password encryption using BCrypt
- Role-based authorization
- CORS configuration
- HIPAA-compliant data handling
- Secure video communication

## Database

The project uses H2 in-memory database for development:
- Database URL: `jdbc:h2:mem:healthsphere_db`
- H2 Console: `http://localhost:8080/h2-console`
- Username: `sa`
- Password: (empty)

## Development Plan

### Week 1
- Setup Spring Boot and React projects
- Implement authentication and authorization
- Create database entities and repositories

### Week 2
- Develop EHR CRUD operations
- Build appointment scheduling system
- Create dashboard layouts

### Week 3
- Implement WebRTC signaling server
- Build video consultation feature
- Develop e-prescribing module

### Week 4
- Add notification service
- Conduct API testing
- Perform security audit
- Final integration and testing

## Contributing

This is a project developed as part of a learning program. Contributions are welcome.

## License

This project is for educational purposes.

## Support

For support and queries, please contact the development team.
