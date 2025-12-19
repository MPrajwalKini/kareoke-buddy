# Kareoke Buddy

**The ultimate AI-driven, hybrid karaoke companion.**

Kareoke Buddy helps you organize, queue, and play your karaoke library seamlessly. Whether you have thousands of local video files or rely on YouTube, this app unifies them into a single, beautiful interface that works on your Laptop, Tablet, and Android Phone.

## Features

*   **Hybrid Playback**: Mix local video files (`.mp4`, `.mkv`, etc.) and YouTube videos in the same queue.
*   **Drag & Drop Import**: Simply drag your entire karaoke folder or individual files into the app.
*   **Smart Queue**: Reorder songs, remove them, or play immediately. The queue persists even if you close the app.
*   **Mobile Optimized**: Fully responsive design that works as a Native Android App (via Capacitor) or a Web App.
*   **Glassmorphism UI**: A modern, dark-themed aesthetic with dynamic background effects.

## Architecture

This project is a monorepo built with modern web technologies:

*   **Client**: `kareoke-buddy` (Next.js 15, React 19, TailwindCSS)
*   **Mobile Runtime**: Capacitor 7 (Wraps the Next.js static export for Android)
*   **State Management**: Zustand (for persistent queue management)

## Getting Started

### Web & Development
To run the app in your browser for development or desktop use:

1.  Navigate to the project folder:
    ```bash
    cd kareoke-buddy
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000).

### Android Mobile App
To build and install the native Android application:

1.  **Prerequisites**:
    *   **Android Studio** (Latest version recommended)
    *   **Java 21** (Required for Gradle 8.5+)
    *   **Node.js 20+**

2.  **Build Process**:
    Run this command whenever you change the code. It builds the website and syncs it to the Android project:
    ```bash
    cd kareoke-buddy
    npm run build
    npx cap sync
    ```

3.  **Run on Device**:
    Open the project in Android Studio:
    ```bash
    npx cap open android
    ```
    *   Wait for Gradle to finish syncing.
    *   Connect your phone (enable USB Debugging) or create an Emulator.
    *   Click the green **Play (▶)** button.

<<<<<<< HEAD
### ☁️ Vercel Deployment (Web)
This app is optimized for Vercel.

1.  **Framework Preset**: Next.js
2.  **Build Command**: `next build`
3.  **Output Directory**: `out` (Important! This differs from default).
4.  **Root Directory**: `kareoke-buddy`

## Typical Workflow

1.  **Coding**: Make changes in `kareoke-buddy/src`. The web version (`npm run dev`) has Hot Module Replacement (HMR) for fast feedback.
2.  **Testing Mobile**: Use Chrome DevTools (Device Mode) to simulate mobile viewports.
3.  **Deploying to Phone**: Run `npm run build && npx cap sync`, then hitting Play in Android Studio is only needed if you changed native config. usually just re-running the app updates the web content if configured for live reload, but for static apps, a rebuild is required.

## Usage Notes

*   **Importing Folders on Android**: Due to security restrictions in Android WebViews, the "Select Folder" button may not work on some devices. Use "Add Files" and select multiple files (long press) instead.
*   **Excel Playlists**: The app supports importing `.xlsx` files with columns: `Order`, `Source`, `Song Name`, `Artist`, etc.

