# Music Player App

A modern music player application built with React Native and Expo, featuring a beautiful UI and essential music playback functionality.

## Features

- Dynamic greeting based on time of day
- Search functionality for songs and artists
- Categories for different music genres
- Favorites system for saving preferred songs
- Beautiful player interface with progress bar
- Playback controls (play/pause, next, previous)
- Volume control
- Time display

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd music-player
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

## Required Dependencies

The app requires the following main dependencies:

```json
{
  "dependencies": {
    "@expo/vector-icons": "^13.0.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "expo": "~50.0.0",
    "expo-av": "~13.10.0",
    "expo-linear-gradient": "~12.7.0",
    "react": "18.2.0",
    "react-native": "0.73.2",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0"
  }
}
```

## Running the App

1. Start the development server:

```bash
npx expo start
```

2. Run on your preferred platform:

- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
music-player/
├── app/
│   ├── components/         # Reusable components
│   ├── context/           # React Context providers
│   ├── data/             # Data files (playlist)
│   ├── screens/          # Screen components
│   ├── types/            # TypeScript type definitions
│   └── assets/           # Images and other assets
├── App.tsx               # Main app component
└── package.json          # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
