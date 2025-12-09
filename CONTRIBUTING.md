# Contributing to HostelHub

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to **HostelHub**. These are mostly guidelines, not rules. Use your best judgment and feel free to propose changes to this document in a pull request.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Project Setup](#project-setup)
   - [Backend](#backend-setup)
   - [Frontend](#frontend-setup)
3. [Environment Variables](#environment-variables)
4. [Branching Guidelines](#branching-guidelines)
5. [Commit Message Style](#commit-message-style)
6. [Pull Requests](#pull-requests)

---

## 🚀 Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/<your-username>/HostelHub.git
    cd HostelHub
    ```
3.  **Add the upstream remote**:
    ```bash
    git remote add upstream https://github.com/<original-owner>/HostelHub.git
    ```

## 🛠 Project Setup

### Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Generate Prisma Client:
    ```bash
    npx prisma generate
    ```

### Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## 🔐 Environment Variables

You must set up environment variables for both backend and frontend. Create `.env.local` files in respective directories.

**Backend (`/backend/.env.local`)**:
```env
PORT=5000
DATABASE_URL="mysql://user:pass@localhost:3306/hostelhub"
HOSTELHUB_SECRET_JWT="super_secret_key"
```

**Frontend (`/frontend/.env.local`)**:
```env
EXPO_PUBLIC_API_URL="http://localhost:5000/api"
```

## 🌿 Branching Guidelines

We follow a structured branching model:

*   `main` - Production-ready code. Do not push directly here.
*   `develop` - Development branch. All Features merge here first.
*   `feature/<feature-name>` - For new features (e.g., `feature/qr-scanner`).
*   `fix/<bug-name>` - For bug fixes (e.g., `fix/login-crash`).
*   `docs/<topic>` - For documentation updates.

**Create a branch:**
```bash
git checkout -b feature/my-awesome-feature
```

## 📝 Commit Message Style

We follow the **Conventional Commits** specification:

*   `feat`: A new feature
*   `fix`: A bug fix
*   `docs`: Documentation only changes
*   `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
*   `refactor`: A code change that neither fixes a bug nor adds a feature
*   `perf`: A code change that improves performance
*   `test`: Adding missing tests or correcting existing tests
*   `chore`: Changes to the build process or auxiliary tools

**Example:**
```
feat: add QR code generation logic for leave pass
fix: resolve crash on notification tap
```

## 📥 Pull Requests

1.  Ensure your code passes all linting/tests.
2.  Update the `README.md` with details of changes if applicable.
3.  Open a Pull Request against the `develop` (or `main`) branch.
4.  Provide a clear description of the changes and link any relevant issues.
