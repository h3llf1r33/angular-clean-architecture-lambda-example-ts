# Angular Posts Lambda Example

This Angular application provides a user interface for managing posts, featuring search capabilities, pagination, and real-time editing. It connects to a serverless backend built with AWS Lambda and DynamoDB.

## Features

- View posts in a responsive grid layout
- Create random posts with Lorem Ipsum content
- Edit existing posts with inline editing
- Delete posts
- Search posts by field with various operators
- Pagination support with sorting
- Loading state simulation for better UX
- Switch between data sources (DynamoDB and JSONPlaceholder)

## Prerequisites

- Node.js (LTS version recommended)
- Angular CLI
- AWS account with necessary permissions
- Deployed backend from [serverless-clean-architecture-lambda-example-ts](https://github.com/h3llf1r33/serverless-clean-architecture-lambda-example-ts)

## Setup Instructions

1. First, deploy the backend:
   ```bash
   # Clone the backend repository
   git clone https://github.com/h3llf1r33/serverless-clean-architecture-lambda-example-ts
   cd serverless-clean-architecture-lambda-example-ts
   
   # Follow the repository's README for deployment instructions
   ```

2. After deploying the backend, note down your AWS API Gateway URL.

3. Clone and set up the frontend application:
   ```bash
   # Clone this repository
   git clone <your-repository-url>
   cd <your-repository-name>
   
   # Install dependencies
   npm install
   ```

4. Configure the API Gateway URL:

- Open the environment configuration file
- Set the `awsApiGatewayBaseUrl` constant to your deployed API Gateway URL

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Usage Guide

### Post Management

- **View Posts**: Posts are displayed in a grid layout with title and body
- **Create Posts**: Click "Create random post" to generate a new post with Lorem Ipsum content
- **Edit Posts**: Click the edit icon on a post to enable inline editing
- **Delete Posts**: Click the delete icon to remove a post

### Search Functionality

The search panel allows you to:

- Select a field to search (title, body, id, etc.)
- Choose an operator (=, <, >, like, etc.)
- Enter a search value
- Sort results by any field in ascending or descending order
- Click "Search post" to filter results

### Data Source

Toggle between:

- DynamoDB: Your AWS backend
- JSONPlaceholder: Public API for testing

### Pagination

Use the paginator at the bottom to:

- Navigate between pages
- Change the number of posts per page
- View total post count

### Loading Simulation

The application includes a configurable minimum loading time (default: 500ms) to enhance user experience and prevent UI flickering. This can be adjusted through the `MIN_LOADING_TIME` injection token:

```typescript
{
  provide: MIN_LOADING_TIME,
    useValue
:
  500  // Configure minimum loading time in milliseconds
}
```

## Technologies Used

- Angular 17+
- Angular Material
- RxJS
- Clean Architecture principles
- Tailwind CSS
- NgRx for state management

## Architecture

The application follows clean architecture principles with:

- Clear separation of concerns
- Repository pattern for data access
- Service layer for business logic
- Reactive state management using NgRx
- Component-based UI architecture
- Server-Side Rendering (SSR) support with TransferState

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🌟 Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [MIT](LICENSE) licensed.
