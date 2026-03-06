# Finance Tracker

A full-stack personal finance management application that allows users to track expenses, manage items, and analyze spending.
The project demonstrates a scalable React + TypeScript frontend architecture with authentication, protected routes, reusable hooks, and modular service layers.

This project was built as a portfolio application to showcase modern frontend development practices, clean architecture, and integration with a REST API backend.

## Features

- User authentication (login / register)
- Role-based protected routes
- Expense tracking
- Item management
- Pagination for large datasets
- Confirmation dialogs for destructive actions
- Modular service layer for API communication
- Reusable custom React hooks
- Context + reducer state management for authentication

## Screenshot
![image](https://github.com/AlexSPWN/finance-tracker/blob/main/src/assets/Screenshot.png)

## Tech Stack
### Frontend

- React 19
- TypeScript
- React Router
- Context API + Reducer
- Custom Hooks architecture

### Backend

- ASP.NET Core 8 Web API
- JWT authentication
- PostgreSQL database

#### Backend Repository
[FinTrack-API](https://github.com/AlexSPWN/fintrack-api).


### Other

- REST API architecture
- Modular service layer
- Role-based authorization
- Environment-based configuration

## Project Architecture
```bash
src
├── api            # API communication layer
├── services       # Business logic layer
├── hooks          # Reusable React hooks
├── context        # Global state management
├── components     # Reusable UI components
├── pages          # Application pages
├── router         # Application routing
├── types          # TypeScript types
└── utils          # Helper utilities
```
Typical data flow:

Component → Hook → Service → API → Backend

This structure helps keep components clean and makes the application easier to scale and maintain.

## Authentication Flow

The application uses JWT-based authentication.

1. User logs in
2. Backend returns access token
3. Auth state is stored in React Context
4. Protected routes check authentication and user role

## Key React Concepts DemonstratedCustom hooks for logic reuse

- Context API for global state management
- Reducer pattern for predictable state updates
- Separation of API and service layers
- Protected and role-based routes
- Modular component architecture

## Installation

Clone the repository:
```bash
git clone git@github.com:AlexSPWN/finance-tracker.git
cd finance-tracker
```

Install dependencies:
```bash
npm install
```
Run the development server:
```bash
npm run dev
```
## Future Improvements

- Expense search, filtering
- Category management
- Budget tracking
- Chart
- Improving Sign Up
- Improving Pagination
- Mobile responsive design
- Admin and Manager pages

## Author

Oleksii Sandulskyi