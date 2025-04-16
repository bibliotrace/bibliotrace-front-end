# Bibliotrace Front End

Bibliotrace is a webapp designed for use with tracking library book data for the Primary Childrens' Hospital on-campus libraries. 

## Frontend deployment notes 

The frontend application is packaged with Vite into a single page application, which is uploaded to AWS S3. The domain bibliotrace.com is hosted in AWS Route 53 with the AWS Cloudfront CDN providing a path to the application in S3.  

### Frontend workflows 

There are two workflows configured for the frontend repository through GitHub Actions. There are currently no frontend workflows for tests or auditing. 

The first workflow is titled “Deployment Pipeline” and deploys the frontend to GitHub Pages at https://bibliotrace.github.io/bibliotrace-front-end/. This workflow currently does not serve up a live webpage since we changed the repository owner from a single account to a GitHub organization, but it is still possible to run the frontend locally (described later). 

The second workflow is titled “S3 Deployment Pipeline” and does the following: 

- Compiles the project into a single page application with Vite, 
- Replaces all references to localhost in the compiled project with references to the backend service URL running in AWS, 
- Creates an OIDC token to authenticate to AWS,  
- Pushes the compiled application to an S3 bucket (as well as a 404 page for when CloudFront can’t find a URL before the React router gets to a bad URL). 
- This workflow rarely takes longer than a minute to run and is only triggered when a pull request is merged into the main branch. 

## Local frontend development 

Running npm run dev within the frontend repository on your machine will compile the application and serve the page on https://localhost:5173 using Vite. The backend will need to be running separately for the API calls from the frontend to function properly. 

Vite is responsive enough that if you have a frontend instance running locally and a change is made to the frontend application code that the change will be displayed dynamically in the browser. 

## Environment secrets 

Both the frontend and backend deployment scripts rely on a number of environment secrets that are stored within GitHub to avoid accidentally exposing API keys, etc. without needing a .env file stored somewhere in the cloud. These secrets can be accessed and modified by selecting the Settings tab in the GitHub navigation bar for the site repository, then opening the Secrets and Variables menu in the left sidebar and selecting the Actions option. These secrets are primarily related to the resource URLs for the services stored in AWS. 

There are also environment secrets stored in the container task definition of AWS. Note that any changes to these secrets will necessitate redeploying the container in ECS and making sure that the service is associated with the most recent task definition.

## Etc..

For more details about how this application works, you can refer to the bibliotrace-back-end repo in the bibliotrace github org. 