# VeloChat - Frontend ⚛️

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-22534F?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDBDNS4zNzI1OCA2LjkwNzY1IDAgMTIgMCAxMkwxMiAyNEwyNCAxMkMxMiAxMiAxOC42Mjc0IDYuOTA3NjUgMTIgMCIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K&logoColor=white)](https://zustand-bear.pmnd.rs/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/docs/v4/client-api/)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity/oauth2/web/guides/use-token-model)
[![React Hot Toast](https://img.shields.io/badge/React_Hot_Toast-000000?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://react-hot-toast.com/)
[![React Loading Skeleton](https://img.shields.io/badge/Loading_Skeleton-60A5FA?style=for-the-badge&logo=react&logoColor=white)](https://www.npmjs.com/package/react-loading-skeleton)
[![date-fns](https://img.shields.io/badge/date--fns-243A5A?style=for-the-badge&logo=date-fns&logoColor=white)](https://date-fns.org/)

[README.md](README-en.md) English Ver.

Welcome to the frontend directory of the VeloChat application. This section is responsible for all user interfaces (UI) and user experience (UX) that users see and interact with. The application is built as a **Single-Page Application (SPA)** using **React** and **Vite** to ensure a fast development process and optimized build output.

## Table of Contents

- [Key Frontend Features](#key-frontend-features)
- [Technologies Used](#technologies-used)
- [Applied Concepts](#applied-concepts)
- [Project Structure](#project-structure)
- [Environment Variable Setup](#environment-variable-setup-env)
- [Installation & Running](#installation--running)
- [Deployment](#deployment)
- [Screenshot](#screenshot)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Key Frontend Features

- **Authentication Interface:** Provides Login and Register pages with input validation, along with a "Login with Google" button.
- **Main Chat Page:** A responsive two-column layout displaying the conversation list on one side and the active chat area on the other, with mobile-friendly support.
- **Friendship Management:**
  - Pop-up modal to search for new users by email with a debounce mechanism for optimized search performance.
  - Button to send friend requests.
  - Notification popover showing incoming friend requests with "Accept" and "Decline" buttons.
- **Real-time Chat Interactions:**
  - Instant display of new messages without requiring a page refresh.
  - Accurate display and hiding of the "typing..." indicator.
  - Notification badges on conversations with unread messages.
  - Real-time message status (sent/read) indicators.
- **Profile Management:**
  - Dedicated page for users to change their name and password.
  - Interface to select, preview, and upload a new profile picture.
- **User Experience (UX):**
  - Use of **Toast** notifications for success/error feedback.
  - Implementation of **Skeleton Loaders** during data loading for a smoother experience.
  - Protected routing, ensuring only authenticated users can access the main page.

## Technologies Used

- **Core Framework:** [**React**](https://reactjs.org/) (with Vite)
- **Routing:** [**React Router DOM**](https://reactrouter.com/)
- **Styling:** [**Tailwind CSS**](https://tailwindcss.com/)
- **State Management:** [**Zustand**](https://github.com/pmndrs/zustand)
- **Communication & Data:** [**Axios**](https://axios-http.com/), [**Socket.IO Client**](https://socket.io/)
- **Authentication:** [**@react-oauth/google**](https://www.npmjs.com/package/@react-oauth/google)
- **UI & UX:** [**React Hot Toast**](https://react-hot-toast.com/), [**React Loading Skeleton**](https://www.npmjs.com/package/react-loading-skeleton)
- **Utilities:** [**date-fns**](https://date-fns.org/)

## Applied Concepts

- **Component-Based Architecture:** Building the UI from reusable and isolated components (e.g., `Header`, `ChatBox`, `SearchModal`).
- **Single-Page Application (SPA):** Utilizing React Router for client-side navigation, creating a fast experience without full page refreshes.
- **Centralized State Management:** Leveraging Zustand to manage global state, such as user information (`userStore`) and chat data (`chatStore`), making data accessible across components.
- **React Hooks:** Extensive use of hooks like `useState`, `useEffect`, `useCallback`, and `useRef` for local state management, side effects (e.g., API calls and socket listeners), and memoization.
- **"Lifting State Up" Pattern:** Centralizing complex state and logic (e.g., socket connections and chat lists) in parent components (`ChatPage`) and passing them to child components as props.
- **Asynchronous Operations:** Handling API calls and time-consuming operations with `async/await` for cleaner code.
- **Protected Routes:** Implementing wrapper components (`ProtectedRoute`, `PublicRoute`) to control access to specific pages based on user authentication status.
- **Debouncing:** Implementing debounce on the contact search function to reduce API calls and improve app performance by delaying execution until the user finishes typing (300ms delay).

## Project Structure

The main folder structure within `/src` is organized as follows:

```
/frontend
└── /src
    ├── /api             # Centralized functions for backend API interactions
    ├── /components      # Reusable UI components typically without complex app state
    |    ├── /auth       # Authentication-related components (Login, Register)
    |    ├── /chat       # Chat-specific components (ChatBox, MyChats)
    |    ├── /common     # General components used across multiple areas (Button, Modal)
    |    └── /ui         # Low-level components focused on basic visual elements and styling
    ├── /layouts         # Layout components defining the general page structure of the app (MainLayout)
    ├── /pages           # Main components serving as separate pages within the app (ChatPage, ProfilePage)
    ├── /store           # Global state management configuration, where 'slices' or 'modules' for app state are defined (userStore, chatStore)
    ├── /utils           # Collection of utility or helper functions not tied to specific components or features (chatUtils)
    └── main.jsx         # Main entry point of the app, where the root React rendering, routing configuration, and global providers are set up
```

## Environment Variable Setup (`.env`)

Create a file named `.env` in the root `/frontend` directory. This file is required to store the public Google Client ID.

Populate the `.env` file with the following variables:

```env
# Replace with your Google Cloud Platform Client ID
VITE_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
```

**Note:** Ensure the `.env` file is added to `.gitignore` to prevent it from being uploaded to a public repository.

## Installation & Running

1. **Navigate to Folder**
   From the root project directory, enter the frontend folder:

   ```bash
   cd frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The application will run at **http://localhost:5173** (or another port if 5173 is in use).

### Available Scripts

- `npm run dev`: Runs the app in development mode with hot reloading.
- `npm run build`: Builds the app for production into the `/dist` folder.
- `npm run preview`: Runs the production build locally for testing.

## Screenshot

**Login Page**

![image](public/images/loginpage.png)

**Register Page**

![image](public/images/registerpage.png)

**Main Page**

![image](public/images/utama.png)

**Profile Page**

![image](public/images/profile.png)

**Add Contact Page**

![image](public/images/findcontact.png)

## Deployment

To deploy the frontend to a production environment, follow these steps:

1. **Build the Project**
   Run `npm run build` to generate production files in the `/dist` folder.

2. **Deploy to a Hosting Platform**

   - Use **Vercel** for quick and automated deployment:
     - Connect your Git repository to Vercel.
     - Configure environment variables (`VITE_GOOGLE_CLIENT_ID`) in the Vercel dashboard.
     - Deploy with a click on "Deploy".
   - Alternatives: Use **Netlify** or **GitHub Pages** with similar configurations.

3. **Verify Deployment**
   After deployment, ensure the deployment URL is tested with a running backend (e.g., on Railway).

**Note:** Ensure the backend (Node.js/Express) is deployed and its URL is correctly configured in the frontend (e.g., via Axios baseURL).

## Contributing

We warmly welcome contributions from the community! To contribute to the VeloChat frontend, follow these steps:

1. **Fork the Repository**
   Fork this repository on GitHub.

2. **Clone the Repository**

   ```bash
   git clone https://github.com/<your-username>/velochat-fullstack-webApp.git
   cd frontend
   ```

3. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Install Dependencies and Make Changes**

   ```bash
   npm install
   npm run dev
   ```

   Implement your code changes and test locally.

5. **Commit and Push**

   ```bash
   git commit -m "Add your-feature-name"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   Open a Pull Request on the main repository and provide a detailed description of your changes.

### Code Guidelines

- Adhere to the [Code of Conduct](https://github.com/ichramsyah/velochat-fullstack-webApp/blob/main/CODE_OF_CONDUCT.md).
- Follow consistent coding style with ESLint and Prettier (configurations are included).
- Add documentation for new features in the README or relevant code.

### Contribution Ideas

- Add support for group chats.
- Integrate file-sharing features (images, documents).
- Enhance UI responsiveness for smaller screens.
- Add transition animations for a smoother experience.

## Troubleshooting

- **Error: "VITE_GOOGLE_CLIENT_ID is undefined"**
  - Ensure the `.env` file is created and the `VITE_GOOGLE_CLIENT_ID` variable is correctly filled. Restart the development server after modifying `.env`.
- **Socket.IO Connection Fails**
  - Verify that the backend is running at `http://localhost:5000` or adjust the `ENDPOINT` in `ChatPage.jsx` to match your backend URL.
- **Build Fails**
  - Delete the `node_modules` and `package-lock.json` folders, then run `npm install` again.
- **Notifications Not Appearing**
  - Ensure the socket is properly connected and event listeners are correctly set up in `Header.jsx` and `ChatBox.jsx`.

If issues persist, open an issue on GitHub or contact [ichramsyahabdurrachman@gmail.com](mailto:ichramsyahabdurrachman@gmail.com).

## License

This project is licensed under the [MIT License](https://github.com/ichramsyah/velochat-fullstack-webApp/blob/main/LICENSE). You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, provided you include the copyright notice and this permission notice in all copies or substantial portions of the software.

For further questions, please contact [Ichramsyah Abdurrachman](mailto:ichramsyahabdurrachman@gmail.com).
