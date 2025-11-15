# MediJournal: Your Personal Health Story

MediJournal is a privacy-first personal health companion that empowers users to securely track, manage, and visualize their entire medical journey on their own device.

## Key Features for Judges

- **Interactive Life Timeline**: A unique, collapsible timeline view that visualizes a user's entire health history, grouped by age, making complex medical histories easy to understand at a glance.
- **Specialized Health Views**: Dedicated sections for Doctor Visits, Medications, and Diseases, allowing users to quickly access and manage specific types of health information.
- **AI-Powered Family History Analysis**: An integrated AI chat to help users build a structured family medical history and identify potential hereditary risk factors (Note: AI features are disabled in the demo to manage costs).
- **Secure PDF Export**: Users can generate a comprehensive, shareable PDF summary of their health record to take to their doctor, ensuring they always have their information when they need it.
- **100% Client-Side**: A fully featured application that runs entirely in the browser with no backend server dependency.

## Privacy & Data Storage

For this hackathon prototype, **MediJournal uses the browser's local storage exclusively**. This means all data is stored securely on the user's own device, and no personal health information is ever transmitted to a server. This demonstrates our commitment to a privacy-centric architecture.

In a real-world application, this model would be extended to use a secure, HIPAA-compliant database where user data would be stored with robust encryption and anonymization techniques to ensure absolute privacy and security at scale.

## Getting Started

To get started, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

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
