<div align="center">

  <h2>⚠️ Heavily in development (POC stage)</h2>

  <img height="170x" src=".github/assets/icon.png" />

  <h1>Accounting</h1>

  <p>
    <strong>Customisable Accounting Software</strong>
  </p>

  <p>
    <!-- <a href="https://github.com/lnxcz/accounting/actions"><img alt="CI" src="https://img.shields.io/github/workflow/status/lnxcz/accounting/%F0%9F%94%A5%20CI/main?color=blue&label=%F0%9F%94%A5%20CI%20" /></a> -->
    <a href="https://wakatime.com/badge/user/5a193983-d8c2-4f90-acc2-b1f41cfe8941/project/4b8e9fbd-ea88-4f3b-8b83-776a85214bbc"><img src="https://wakatime.com/badge/user/5a193983-d8c2-4f90-acc2-b1f41cfe8941/project/4b8e9fbd-ea88-4f3b-8b83-776a85214bbc.svg" alt="wakatime"></a>
    <img alt="Accounting top language" src="https://img.shields.io/github/languages/top/lnxcz/accounting">
    <a href="https://opensource.org/licenses/Apache-2.0"><img alt="License" src="https://img.shields.io/github/license/lnxcz/accounting?color=blue" /></a>
    <a href="https://deepsource.io/gh/lnxcz/accounting/?ref=repository-badge}" target="_blank"><img alt="DeepSource" title="DeepSource" src="https://deepsource.io/gh/lnxcz/accounting.svg/?label=active+issues&show_trend=true&token=3xXa6npD95aic4uoRExbchlH"/></a>
  </p>
</div>


## Overview

The Accounting App is a desktop application built with Tauri, SolidJS and TypeScript. It is designed to help small businesses manage their finances, invoices and accounting.
![Screenshot 2024-09-05 at 16 54 24](https://github.com/user-attachments/assets/bb0f3b4c-eb73-4aa6-9654-cd16fe8b02a2)

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

## License

Accounting is licensed under [GPL-3.0 license](./LICENSE).

## Project Analytics

![Alt](https://repobeats.axiom.co/api/embed/d93a104357975a3d30a2e4d93b388c6fec7c9cf2.svg "Repobeats analytics image")

## Credits

[Microsoft Fluent Emojis](https://github.com/microsoft/fluentui-emoji)
