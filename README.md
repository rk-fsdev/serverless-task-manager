# Task Manager - Full-Stack Serverless App

Hey there! 👋 This is a task management app I built to help people stay organized. Think of it as your personal to-do list that actually looks good and works smoothly across all your devices.

## What's Inside

### The Backend (The Brain 🧠)

I went with AWS Serverless because honestly, who wants to manage servers these days? Here's what's powering everything:

- **Serverless Framework** - Makes deploying to AWS actually enjoyable
- **AWS Lambda** - Your functions run only when needed (and you only pay for what you use!)
- **DynamoDB** - Super fast NoSQL database that scales automatically
- **API Gateway** - Handles all the HTTP requests and CORS headaches
- **AWS Cognito** - Takes care of user authentication so you don't have to
- **S3 + CloudFront** - Serves the frontend with global CDN for speed
- **GitHub Actions** - Deploys everything automatically when you push code

### The Frontend (The Pretty Face 😍)

Built with React because it's just so much fun to work with:

- **React 18** - Latest and greatest with hooks that make life easier
- **Tailwind CSS** - Styling that doesn't make you want to cry
- **Responsive Design** - Looks great on your phone, tablet, laptop, or whatever
- **Real-time Updates** - Changes show up instantly without page refreshes
- **Smooth UX** - Loading states, error handling, and all that good stuff

### What You Can Actually Do

- ✅ **Create** tasks (obviously)
- ✅ **Read** your tasks with smart pagination
- ✅ **Update** tasks when priorities change
- ✅ **Delete** tasks you're done with (or never started)

## How It All Fits Together

Here's the big picture of how everything talks to each other:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   API Gateway   │    │   Lambda        │
│   (Frontend)    │◄──►│   (REST API)    │◄──►│   Functions     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │   DynamoDB      │
         │                       │              │   (Database)    │
         │                       │              └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   S3 +          │    │   Cognito       │
│   CloudFront    │    │   (Auth)        │
└─────────────────┘    └─────────────────┘
```

Pretty clean, right? The React app talks to API Gateway, which triggers Lambda functions, and they store everything in DynamoDB. Simple and scalable.

## What You'll Need

Before we get started, make sure you have these installed:

- **Node.js 18+** - The JavaScript runtime (obviously)
- **AWS CLI** - For talking to AWS (configure it with your credentials)
- **Serverless Framework** - Makes AWS deployments less painful
- **Git** - For version control (you probably have this already)

## Getting Started

Alright, let's get this thing running! Here's the step-by-step process:

### 1. Get the Code

First things first, clone this repo:

```bash
git clone <repository-url>
cd serverless-task-manager
```

### 2. Install All the Dependencies

Time to install everything (this might take a minute):

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set Up AWS

You'll need to configure AWS CLI with your credentials:

```bash
# Configure AWS CLI (it'll ask for your access key, secret key, and region)
aws configure

# Or set environment variables if you prefer
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=us-east-1
```

### 4. Deploy the Backend

Now let's get the backend up and running:

```bash
cd backend

# Deploy to development (this creates all the AWS resources)
npm run deploy:dev

# Or deploy to production when you're ready
npm run deploy:prod
```

This will create your DynamoDB table, Lambda functions, API Gateway, Cognito user pool, and all that good stuff.

### 5. Configure the Frontend

After the backend is deployed, you'll get some output with URLs and IDs. Copy those into your frontend config:

```bash
cd frontend

# Copy the environment template
cp env.example .env

# Then edit .env with the values from your backend deployment
REACT_APP_AWS_REGION=us-east-1
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_CLIENT_ID=your-user-pool-client-id
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/dev
```

### 6. Start Developing

Now you can start the frontend and see your app in action:

```bash
# Start the React development server
npm start

# If you want to test the backend locally (optional)
cd ../backend
npm run offline
```

The app should open in your browser at `http://localhost:3000`. Pretty cool, right?

## Deployment

### Automatic Deployment (The Easy Way)

I've set up GitHub Actions to automatically deploy everything when you push to the main branch. Just push your code and watch the magic happen! 🪄

### Manual Deployment (If You're Feeling Adventurous)

Sometimes you want to deploy things manually, and that's totally fine:

#### Backend

```bash
cd backend

# Deploy to development
serverless deploy --stage dev

# Deploy to production
serverless deploy --stage prod
```

#### Frontend

```bash
cd frontend

# Build the React app
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Tell CloudFront to refresh its cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

The manual way gives you more control, but honestly, the automatic deployment is pretty sweet.

## Configuration

### Environment Variables

You'll need to set up some environment variables to make everything work together:

#### Backend (.env)

```bash
STAGE=dev
REGION=us-east-1
TASKS_TABLE=task-manager-backend-tasks-dev
USER_POOL_ID=your-user-pool-id
USER_POOL_CLIENT_ID=your-user-pool-client-id
```

#### Frontend (.env)

```bash
REACT_APP_AWS_REGION=us-east-1
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_CLIENT_ID=your-user-pool-client-id
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/dev
```

### GitHub Secrets (For CI/CD)

If you want the automatic deployment to work, you'll need to add these secrets to your GitHub repository:

```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_ACCESS_KEY_ID_PROD=your-prod-access-key
AWS_SECRET_ACCESS_KEY_PROD=your-prod-secret-key
S3_BUCKET_NAME=your-s3-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=your-cloudfront-distribution-id
```

Go to your GitHub repo → Settings → Secrets and variables → Actions, then add each one.

## How to Use It

### Getting Started

1. **Sign Up** - Create an account with your email and password
2. **Sign In** - Log in and you're ready to go!
3. **Start Adding Tasks** - Click "New Task" and fill in the details

### Managing Your Tasks

- **Create** - Add new tasks with titles, descriptions, priorities, and due dates
- **View** - See all your tasks in a nice, organized list
- **Edit** - Click on any task to modify it
- **Delete** - Remove tasks you're done with (or never started)

### Cool Features

- **Works Everywhere** - Desktop, tablet, phone - it all looks great
- **Instant Updates** - Changes show up immediately
- **Smart Search** - Find tasks quickly with the search bar
- **Priority Levels** - Mark tasks as High, Medium, or Low priority
- **Status Tracking** - Move tasks from Pending → In Progress → Completed
- **Due Dates** - Set deadlines so you don't forget important stuff

## Testing

I've included tests because, well, they're pretty important:

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# See how much of your code is covered
npm run test:coverage

# Watch mode (runs tests when files change)
npm run test:watch
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Check test coverage
npm run test:coverage
```

## API Endpoints

If you want to integrate with this app or build something on top of it, here are the endpoints:

### Authentication

- `POST /auth` - Register or login users

### Tasks

- `GET /tasks` - Get all your tasks (with pagination)
- `GET /tasks/{id}` - Get a specific task
- `POST /tasks` - Create a new task
- `PUT /tasks/{id}` - Update an existing task
- `DELETE /tasks/{id}` - Delete a task

## Security

I've tried to make this as secure as possible:

- **Authentication** - AWS Cognito handles user auth with JWT tokens
- **Authorization** - Users can only see their own tasks
- **Input Validation** - All inputs are validated before processing
- **CORS** - Properly configured for the frontend domain
- **HTTPS** - Everything is encrypted in transit

## Monitoring

### CloudWatch Logs

- All Lambda function logs go to CloudWatch
- API Gateway logs for debugging
- Error tracking and performance monitoring

### Metrics

- Request counts and response times
- Error rates
- User activity patterns

## Development

### Project Structure

Here's how the code is organized:

```
serverless-task-manager/
├── backend/                 # The serverless backend
│   ├── src/
│   │   ├── handlers/       # Lambda function handlers
│   │   ├── utils/          # Utility functions
│   │   └── models/         # Data models
│   ├── tests/              # Backend tests
│   └── serverless.yml      # Serverless configuration
├── frontend/               # The React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── .github/workflows/      # CI/CD pipeline
└── README.md              # This file
```

### Code Style

I've set up some tools to keep the code clean:

- **ESLint** - Catches bugs and enforces style
- **Prettier** - Formats code automatically
- **Jest** - For testing (obviously)
- **Conventional Commits** - Makes commit messages consistent

## CI/CD Pipeline

### GitHub Actions Workflow

The pipeline does this automatically when you push code:

1. **Test** - Runs all the tests to make sure nothing broke
2. **Deploy Dev** - Deploys to the development environment
3. **Deploy Prod** - Deploys to production (if tests pass)
4. **Deploy Frontend** - Uploads the React app to S3 + CloudFront

### Deployment Stages

- **Development** - `dev` stage for testing new features
- **Production** - `prod` stage for the live application

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Want to help make this better? Awesome! Here's how:

1. Fork the repository
2. Create a feature branch (something like `feature/awesome-new-thing`)
3. Make your changes
4. Add tests for your changes
5. Submit a pull request

## Support

Having issues? Here's where to get help:

- Create an issue in the repository
- Check the documentation
- Look at the code examples
- Ask questions in the discussions

## Roadmap

Here are some ideas for future improvements:

- [ ] Real-time notifications when tasks are updated
- [ ] Task categories and tags for better organization
- [ ] File attachments for tasks
- [ ] Team collaboration features
- [ ] Mobile app (React Native?)
- [ ] Advanced analytics and reporting

## Acknowledgments

Big thanks to:

- AWS Serverless Framework team
- React and Tailwind CSS communities
- AWS Cognito for making auth easy
- GitHub Actions for CI/CD
- All the open-source contributors who made this possible

---

**Built with ❤️ using AWS Serverless and React**

_Hope you find this useful! If you have any questions or suggestions, feel free to reach out._
