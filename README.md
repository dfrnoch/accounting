# Finance App Documentation

## Overview

The Finance App is a desktop application built with Tauri, SolidJS and TypeScript. It is designed to help small businesses manage their finances, invoices and accounting.

## Tech Stack

- **Tauri** - Rust framework for building desktop apps 
- **SolidJS** - JavaScript UI library for building user interfaces
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Build tool for faster development

## Architecture

The app is structured into two main parts:

### Frontend (src directory)

- **App** - Root SolidJS component 
- **Screens** - Different screens/views of the app
 - Dashboard - Main screen with sidebar navigation
 - SetupWizard - Initial setup flow for new users
- **Components** - Reusable UI components
- **Utils** - Shared utility functions and hooks
- **Services** - Data services that interface with the backend
- **Bindings** - Tauri bindings to access native APIs

### Backend (src-tauri directory)

- **main.rs** - Entry point and app lifecycle handlers
- **Cargo.toml** - Rust dependencies
- **tauri.conf.json** - Tauri config 
- **Prisma** - Database ORM

## Features

The app includes the following features:

- **Onboarding flow** - Wizard to setup company info and admin user
- **Dashboard** - Overview of finances and metrics
- **Invoices** - Create, view and manage invoices
- **Expenses** - Track spending and expenses
- **Customers** - Manage customers and client information
- **Reports** - Generate financial reports

## Getting Started

To run the app locally:

1. Clone the repository
2. Run `bun install` to install dependencies
3. Run `bun run tauri dev` to start dev server
4. An app window should open up automatically

## Contributing

Pull requests are welcome! Feel free to open issues to discuss new features or improvements.
