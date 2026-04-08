# Flowlyt Frontend

A modern, high-performance enterprise dashboard built with React 19, TypeScript, and Vite 8. This project follows industry best practices for state management, internationalization, and scalable styling.

## 🚀 Technology Stack

### Core

- **React 19**: Utilizing the latest concurrent features and hook patterns.
- **Vite 8**: Next-generation frontend tooling for ultra-fast development and builds.
- **TypeScript 5.9**: ensuring type safety across the entire codebase.

### State Management & Persistence

- **Redux Toolkit (v2.11.2)**: Efficient, opinionated Redux logic for global state.
- **React-Redux (v9.2.0)**: Official React bindings for Redux.
- **Redux Persist (v6.0.0)**: Persistent state across browser sessions (localStorage).

### Navigation & Internationalization

- **React Router (v7.13.2)**: Declarative, component-based routing.
- **i18next (v26.0.3)** & **React i18next**: Full internationalization support with JSON-based language resources.

### Forms & Validation

- **Formik (v2.4.9)**: Robust form state management.
- **Yup (v1.7.1)**: Schema-based validation for complex form logic.

### Styling & UI

- **Tailwind CSS (v4.2.2)**: Utility-first CSS framework for rapid UI development.
- **Sonner**: High-quality toast notifications.
- **Dayjs**: Lightweight JavaScript date library for parsing and formatting.

### API & Networking

- **Axios (v1.14.0)**: Promise-based HTTP client with interceptor support.
- **HTTP Status Codes**: Standardized numeric references for API responses.
- **JWT Decode**: Client-side decoding of authentication tokens.

### Quality Tools

- **ESLint 9**: Plugable linting utility for JavaScript and TypeScript.
- **Prettier 3.8**: Opinionated code formatter for consistent styling.
- **Husky 9**: Git hooks for automated linting/formatting before commits.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 20.x or higher recommended)
- [npm](https://www.npmjs.com/) (Standard with Node.js)

---

## 📦 Installation

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd flowlyt-fe
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

---

## 💻 Usage

### Development

Start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

### Production Build

Create an optimized production bundle in the `dist/` directory:

```bash
npm run build
```

### Linting & Formatting

Check for code style and linting issues:

```bash
npm run lint
```

Format the codebase using Prettier:

```bash
npx prettier --write .
```

---

## 📂 Project Structure

- `src/api`: Axios instances and API services.
- `src/components`: Reusable UI components and shared constants.
- `src/i18n`: Translation files and localization logic.
- `src/pages`: Main view components and screen layouts.
- `src/routes`: Route definitions and protection logic.
- `src/store`: Redux slices and store configuration.
- `src/interfaces`: Global TypeScript definitions.

---

## 📜 Development Standards

- **Formatting**: Code is automatically formatted on commit via Husky and Prettier.
- **Naming**: Use PascalCase for components and camelCase for functions/variables.
- **Type Safety**: Avoid using `any`; always define interfaces for API responses and component props.
- **Components**: Keep components focused and modular. Use the `Title` component for page-specific metadata.
- **Responsiveness**: Designs should be created fully responsive from the ground up. It is compulsory to test responsiveness on the following resolutions before pushing: `1920x1200`, `2240x1400`, `2560x1600`, `3440x1440`, including all smaller screens as well.
