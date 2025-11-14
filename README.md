# Firebase Studio - HealthSync

This is a Next.js starter app called HealthSync, created in Firebase Studio. It's a personal health companion that helps you track your medical history.

## Features

- **Timeline View**: Visualize your health journey with a chronological timeline of events like diagnoses, vaccinations, and prescriptions. You can add your own events.
- **AI Family History Analysis**: Engage in an interactive chat with an AI to build your family's medical history. The AI will then provide a summary of potential health risk factors based on the conversation.
- **Local Storage**: All your data is stored securely in your browser's local storage. No data is sent to a server for storage.
- **Dark Mode**: Switch between light and dark themes.

## Getting Started

To get started, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result. You can start by exploring the **Timeline View** or the **Family History** sections.

## Deployment

This application is set up for easy deployment with **Firebase App Hosting**.

1.  **Install the Firebase CLI**: If you haven't already, install the Firebase command-line tools:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**:
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in your project**:
    From your project's root directory, run:
    ```bash
    firebase init hosting
    ```
    - When prompted, select **"Use an existing project"** and choose your Firebase project.
    - It will detect that you have a Next.js app. When it asks if you want to use App Hosting, say **Yes**.
    - Follow the prompts. It should recognize your app and configure everything automatically based on `apphosting.yaml`.

4.  **Deploy your app**:
    After initialization is complete, deploy your application with a single command:
    ```bash
    firebase deploy
    ```

After the deployment finishes, the CLI will provide you with the URL to your live application.

For more details, see the [Firebase App Hosting documentation](https://firebase.google.com/docs/hosting/frameworks/nextjs).

    