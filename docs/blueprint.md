# **App Name**: HealthSync

## Core Features:

- User Authentication: Secure user authentication with options for signing in and signing out.
- Account Management: Allow users to delete their account.
- Tabbed Navigation: Intuitive tabbed navigation for switching between main sections: Private Records, Family History, Health Tips, etc.
- Private Records: Store user specific private health records in a firestore database.
- Family History & Linking: Allow users to link their health records with family members, stored in Firestore, with proper authorization rules to prevent data breaches. Implement an LLM tool that uses shared medical history to highlight potential risk factors.  
- Timeline View: Display a chronological timeline of health events, visually resembling the Duolingo progression.
- Dark/Light Mode Toggle: Implement a toggle for switching between light and dark modes with persistent state.

## Style Guidelines:

- Primary color: Deep indigo (#4F46E5) for a sense of trust and health. 
- Background color: Very light gray (#F9FAFB) to ensure comfortable readability for the light mode, dark charcoal gray (#374151) for the dark mode.
- Accent color: Teal (#009090) to highlight interactive elements and important information.
- Font pairing: 'Inter' for both headlines and body text, to maintain a sleek, consistent look.
- Mobile-first, fully responsive layout with a central padded container for main content.
- Use consistent and recognizable icons to represent health events and actions. Colorized using the accent color.
- Subtle transitions and animations for smooth user experience.