# SafeBee - Disaster Response App with AI Assistance

SafeBee is a disaster response mobile application aimed at connecting people in disaster-affected areas with volunteers and NGOs. The app allows users to report disasters, receive real-time AI-based disaster guidelines, and raise crowdfunding for NGOs. It also enables volunteers to respond to disaster reports in real-time.

## Features

- **Disaster Reporting**: Users can report disasters by clicking on a Mapbox marker, providing their location and other relevant details (e.g., name, blood group, message).
- **Volunteer Alerts**: Volunteers will see real-time alerts for reported disasters and can respond by viewing details such as the user's name, blood group, and location.
- **Crowdfunding**: A page that displays live donation campaigns from NGOs and organizations to help disaster-affected people. Users can donate directly via integrated payment gateways.
- **Push Notifications**: Volunteers receive push notifications for new disaster reports.
- **AI Assistance**: The Gemini API provides users with disaster-specific guidelines until help arrives.
- **Weather Updates**: Integrated real-time weather updates using a weather API.

## Stack

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Firestore, Realtime Database, Authentication)
- **Mapping**: Mapbox for mapping and geolocation
- **AI Assistance**: Gemini API for real-time disaster guidelines
- **Notifications**: Firebase Cloud Messaging (FCM) for push notifications
- **Weather API**: Real-time weather updates for users

## Pages

1. **Home Page**:  
   - Shows real-time weather updates and user options to report a disaster.
   - Bottom navigation for easy access to other sections.

2. **Disaster Reporting Page**:
   - Users click on a marker on the map to report a disaster.
   - Input fields for name, blood group, and a short message.
   - Submit the disaster report, which will be stored in Firebase Realtime Database.

3. **Volunteer Alerts Page** (Visible only to volunteers):
   - Displays a feed of disaster reports, showing details like the reporter's name, blood group, location, and the message.
   - Volunteers can respond to the alerts.
   - Push notifications for new disaster reports.

4. **Crowdfunding Page**:
   - Shows live donation campaigns from NGOs and organizations.
   - Users can donate using integrated payment methods.
   - Displays the progress of each campaign.

5. **Guidelines Page**:
   - Provides AI-powered disaster guidelines based on the user’s situation.

## Installation

Follow these steps to set up and run the SafeBee app on your local machine.

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (>= 14.x.x)
- npm or yarn (Package manager)
- Expo CLI
- Firebase Project with Realtime Database configured
- A Mapbox API key
- Gemini API key for AI Assistance
- A Weather API key (for real-time weather updates)

### 1. Clone the Repository

```bash
git clone https://github.com/yeakiniqra/SafeBee-UAP.git
cd safebee
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
npx expo start
npx run android
```

This will launch the app in development mode. You can run the app on a physical device using the Expo Go app or in an emulator.


### TEAM

- Nazmul Yeakin Iqra 
- Nayeem Islam    
- Maruf Ahammed      