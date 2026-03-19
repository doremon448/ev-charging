# EV Charging Station Locator 🔌⚡

A full-stack web application to help users find and locate electric vehicle (EV) charging stations across India. Built with **React.js** frontend and **Node.js** backend with **PostgreSQL** database.

## 🌟 Features

- ✅ User authentication (Sign up, Login, Logout)
- ✅ Interactive map to view all charging stations
- ✅ Filter stations by availability, charger type, and location
- ✅ Add new charging stations
- ✅ View detailed station information and ratings
- ✅ Search for nearby stations by city
- ✅ Real-time charger availability
- ✅ Book charging slots
- ✅ Responsive design for mobile and desktop

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MYSQL** - Relational database
- **Sequelize** - ORM for PostgreSQL
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Leaflet** - Interactive maps
- **CSS3** - Styling

## 📁 Project Structure

```
ev-charging-station-locator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── stationController.js
│   │   │   └── authController.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── Station.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── stations.js
│   │   │   └── auth.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   ├── Map.js
│   │   │   └── StationDetails.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── ExploreStations.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL (locally installed or using services like Railway, Render)
- npm or yarn

### Step 1: PostgreSQL Setup

**Option A: Local PostgreSQL**
```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Windows - Download from postgresql.org

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Option B: Create PostgreSQL Database**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ev_charging_db;

# Create user (optional)
CREATE USER ev_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ev_charging_db TO ev_user;
```

### Step 2: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ev_charging_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_here
```

Start the backend:
```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  vehicleType VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Stations Table
```sql
CREATE TABLE Stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  chargerType ENUM('AC Slow', 'AC Fast', 'DC Super Fast') NOT NULL,
  availability BOOLEAN DEFAULT true,
  totalChargers INTEGER NOT NULL,
  availableChargers INTEGER NOT NULL,
  pricePerUnit FLOAT NOT NULL,
  rating FLOAT DEFAULT 0,
  reviews TEXT,
  operatingHours VARCHAR(100) DEFAULT '24/7',
  amenities TEXT[],
  userId UUID REFERENCES Users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Stations
- `GET /api/stations` - Get all stations
- `GET /api/stations/:id` - Get station by ID
- `GET /api/stations/search/city/:city` - Search by city
- `POST /api/stations` - Create station (auth required)
- `PUT /api/stations/:id` - Update station (auth required)
- `DELETE /api/stations/:id` - Delete station (auth required)

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile (auth required)
- `POST /api/auth/logout` - Logout

## 📦 Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ev_charging_db
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_secret_key
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes
5. Backend validates token using middleware

## 🎨 Color Scheme

- Primary: `#1abc9c` (Teal)
- Secondary: `#2c3e50` (Dark Blue)
- Accent: `#3498db` (Blue)
- Background: `#f8f9fa` (Light Gray)

## 📝 Sample Station Data

```json
{
  "name": "ABC Charging Hub",
  "address": "123 Main Street, Mumbai",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "chargerType": "DC Super Fast",
  "availability": true,
  "totalChargers": 10,
  "availableChargers": 3,
  "pricePerUnit": 15,
  "rating": 4.5,
  "operatingHours": "24/7",
  "amenities": ["WiFi", "Cafe", "Restroom"]
}
```

## 🚀 Deployment

### Backend (Render or Railway)
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically

### Frontend (Vercel or Netlify)
1. Connect GitHub repo
2. Build command: `npm run build`
3. Deploy automatically

## 📚 Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm start            # Start production server
npm run migrate      # Run database migrations

# Frontend
npm start            # Start development server
npm run build        # Create production build
npm test             # Run tests
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Sahilpatil1389** - Project Creator

## 🙏 Acknowledgments

- React community
- Express.js ecosystem
- Sequelize documentation
- PostgreSQL team
- OpenStreetMap contributors

---

**Made with ❤️ for sustainable transportation**