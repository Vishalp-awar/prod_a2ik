# A2IK Global Solutions

# Dependencies
   The following libraries are used in this project:

   1. bcrypt: For hashing passwords and securing sensitive data.
   2. cloudinary: To handle image uploads and storage in the cloud.
   3. cors: Middleware for handling Cross-Origin Resource Sharing.
   4. dotenv: To manage environment variables securely.
   5. ejs: A templating engine for rendering dynamic HTML pages.
   6. emailjs: For sending emails programmatically.
   7. express: The primary web framework used for building the server.
   8. express-fileupload: Middleware for handling file uploads in forms.
   9. express-session: To manage session data for users.
   10. mongodb: MongoDB driver for connecting to and interacting with the database.
   11. swagger-jsdoc: To generate API documentation using JSDoc comments.
   12. swagger-ui-express: To serve Swagger UI for API documentation.


# Installation

1. Clone the repository:
    ```env
   git init
   git clone https://github.com/admina2ik/a2ik.git
   cd a2ik

3. Install dependencies:
    ```env
   npm install

5. Set up the environment variables:
    ```env
   PORT=3000
   
   MONGODB_URI=

   DASHBOARD_PASSWORD=a2ik

   EMAILJS_PUBLIC_KEY=

   EMAILJS_SERVICE_ID=

   EMAILJS_TEMPLATE_ID=

   BASE_URL=http://localhost:

6. Start the development server:
    ```env
   node server.js
   
8. Usage:
   Open your browser and navigate to http://localhost:3000 to view the application.
   Use the Swagger UI at http://localhost:3000/api-docs to test the API endpoints

# API Documentation
   Provide a brief overview of the API endpoints and mention how users can explore them.
   The project includes API documentation available at /api-docs, powered by Swagger UI.
 
