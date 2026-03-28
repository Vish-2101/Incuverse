# EcoCred

EcoCred is a Green Credits Payment App. It is built as a cross-platform mobile application using React Native (Expo) for the frontend and a Node.js/Express based backend with a MongoDB database.

## 🚀 Features

- **Green Credits Payment & Tracking:** Make payments and track your green credits effectively.
- **Barcode & QR Scanning:** Integrated expo-camera and expo-barcode-scanner for quick transactions.
- **User Authentication:** Secure JWT-based authentication with bcrypt hashing.
- **SMS & Email Notifications:** Integration with Twilio, Vonage, and Nodemailer for updates.
- **Modern UI:** Built with React Native Paper, React Native Elements, and Reanimated for smooth animations.
- **Dark Mode Support:** Configured for both light and dark modes natively.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React Native with Expo (`expo start`)
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack, Bottom Tabs)
- **UI & Animations:** React Native Paper, React Native Elements, Reanimated
- **Storage:** React Native Async Storage
- **Tools:** Expo Camera, Expo Barcode Scanner

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose)
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Communication Services:** Twilio, Vonage, Nodemailer
- **Environment Management:** dotenv

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally or run via `npx`
- MongoDB instance (local or Atlas) set up

### Installation & Setup

#### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd EcoCred
```

#### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` directory. Add your environment credentials (e.g., `PORT`, `MONGODB_URI`, `JWT_SECRET`, Twilio/Vonage/Nodemailer credentials).
- Start the development server:
```bash
npm run dev
```
The server will start using `nodemon`.

#### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
- Start the Expo development server:
```bash
npm start
```
- Press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with the Expo Go app on your physical device.

---

## 📂 Project Structure

```
EcoCred/
├── backend/
│   ├── config/          # Configurations and DB setup
│   ├── controllers/     # Route logic handling
│   ├── middleware/      # Custom middlewares e.g. JWT Auth
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express API routes
│   └── server.js        # Server entry point
└── frontend/
    ├── assets/          # Static app assets
    ├── src/             # Main frontend source code
    ├── App.tsx          # Root component
    ├── app.json         # Expo config
    └── tsconfig.json    # TypeScript configurations
```

## 📝 License

This project is licensed under the ISC License.
