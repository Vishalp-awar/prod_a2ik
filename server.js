require("dotenv").config(); 
const express = require("express");

const cors = require("cors");
const path = require("path");
const bcrypt = require('bcrypt');
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const apiRoutes = require("./api/index"); // Path to your API index file
const connectToDatabase = require("./lib/db");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const port = process.env.PORT || 3000;
// Middleware declarations
app.use(cors({
  origin: "https://a2ik-vishalp-awars-projects.vercel.app/", // Update to your specific domain if needed
  methods: "POST",
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    debug: true,
  })
);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "A2IK API",
      version: "1.0.0",
      description: "API documentation for A2IK",
    },
    servers: [
      {
        url: `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}`,
      },
    ],
  },
  apis: [path.join(__dirname, "/api/index.js")], // Point to your API routes file for annotations
};

 // Parses form data
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Setup Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// app.use(
//   session({
//     secret: "67613fe1ca9cf7b5bebabf91", // Replace with a strong, unique key
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Use secure: true in production with HTTPS
//   })
// );

app.use(
  session({
    secret: "67613fe1ca9cf7b5bebabf91", // Replace with a strong, unique key
    resave: false,
    saveUninitialized: false, // Changed to false
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Your MongoDB connection string
      ttl: 14 * 24 * 60 * 60, // = 14 days. Default
    }),
    cookie: { 
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
    },
  })
);
app.use("/api", apiRoutes);

// cloudinary.config({
//   cloud_name: "dhyelfsdz",
//   api_key: "822689461397169",
//   api_secret: "efAL8AJ7noJPEAhKlDyKcFL3tiM",
// });  
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/favicon.ico", (req, res) => res.status(204).end());


const ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect("/login");
};
  
  const WebsiteAnalyticAuthenticated = (req, res, next) => {
    console.log(req.session);
    console.log(req.session.isAuthenticated);
    if (req.session && req.session.isAuthenticated) {
      return next(); // Proceed if authenticated
    }
    res.redirect("/login"); // Redirect to login if not authenticated
  };

const password = process.env.DASHBOARD_PASSWORD;
console.log(password)

app.get("/", async (req, res) => {
  try {
    const apiUrl = `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}/api/resources`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch resources: ${response.statusText}`);
    }

    const { resources } = await response.json();
    res.render("index", {
      resources,
    });
  } catch (error) {
    console.error("Error fetching resources", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/web",async (req, res) => {
  try {
    const apiUrl = `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}/api/analytics`;

    const pageviews = await fetch(apiUrl);

    if (!pageviews.ok) {
      throw new Error(`Failed to fetch resources: ${pageviews.statusText}`);
    }
    const data = await pageviews.json();

    res.render("web", { data });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res
      .status(500)
      .render("error", { message: "Error fetching analytics data" });
  }
});
app.get("/about", async (req, res) => {
  res.render("about");
});
app.get("/contact", async (req, res) => {
  res.render("contact");
});
app.get("/blog", async (req, res) => {
  try {
    const apiUrl = `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}/api/resources`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch resources: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response structure
    if (!data.success || !Array.isArray(data.resources)) {
      throw new Error("Invalid resources data format");
    }

    const resources = data.resources.map((resource) => ({
      ...resource,
      _id: resource._id?.toString(), // Convert _id to string if needed
    }));

    res.render("blog", { resources });
  } catch (error) {
    console.error("Error fetching blog data:", error.message);
    res.status(500).send("Error fetching blog data");
  }
});

app.get("/login", (req, res) => {
  res.render("login"); 
});

// app.post("/login", async (req, res) => {
//   try {
//     const { password } = req.body;

//     if (!password) {
//       return res.status(400).send("Password is required.");
//     }

//     const db = await connectToDatabase();
//     // Retrieve the correct password from the database
//     const admin = await db.collection("admin").findOne({ role: "admin" });

//     // If no admin or password mismatch, respond with an error
//     if (!admin) {
//       return res.status(401).send("Invalid password.");
//     }

//     // Use bcrypt.compare to compare the stored hash with the provided password
//     const isMatch = await bcrypt.compare(password, admin.password);

//     if (!isMatch) {
//       return res.status(401).send("Invalid password.");
//     }

//     // Save the authenticated status in the session
//     req.session.isAuthenticated = true;

//     // Redirect to the dashboard
//     res.redirect("/dashboard");
//   } catch (error) {
//     console.error("Authentication error:", error);
//     res.status(500).send("Internal server error.");
//   }
// });

// Update your login route
app.post("/login", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).send("Password is required.");
    }

    const db = await connectToDatabase();
    const admin = await db.collection("admin").findOne({ role: "admin" });

    if (!admin) {
      return res.status(401).send("Invalid password.");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).send("Invalid password.");
    }

    // Set user information in the session
    req.session.user = { role: "admin" };
    req.session.isAuthenticated = true;

    // Save the session before redirecting
    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).send("Error logging in");
      }
      res.redirect("/dashboard");
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send("Internal server error.");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Unable to log out");
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.redirect("/login"); // Redirect to login page
  });
});

app.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {

   const iframeSrc = "/web";
    // Fetch job data from the API
    const apiUrl = `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}/api/addjob`;

    const responsejob = await fetch(apiUrl);
    if (!responsejob.ok) {
      throw new Error(`Failed to fetch jobs: ${responsejob.statusText}`);
    }

    // Parse responsejob data
    const datajob = await responsejob.json();

    // Validate response structure
    if (!datajob.success || !Array.isArray(datajob.jobs)) {
      throw new Error("Invalid job datajob format");
    }

    // Transform job array
    const job = datajob.jobs.map((job) => ({
      ...job,
      _id: job._id.toString(),
    }));

    const apiUrl2 = `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}/api/resources`;

    const responseresources = await fetch(apiUrl2);
    if (!responseresources.ok) {
      throw new Error(
        `Failed to fetch resources: ${responseresources.statusText}`
      );
    }

    const dataresources = await responseresources.json();

    // Validate the responseresources structure
    if (!dataresources.success || !Array.isArray(dataresources.resources)) {
      throw new Error("Invalid resources data format");
    }

    const resource = dataresources.resources.map((resource) => ({
      ...resource,
      _id: resource._id?.toString(), // Convert _id to string if needed
    }));

   const apiUrl3 = `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}/api/jobboard`;

    const responseJobBoards = await fetch(apiUrl3);
    if (!responseJobBoards.ok) {
      throw new Error(
        `Failed to fetch job boards: ${responseJobBoards.statusText}`
      );
    }

    const dataJobBoards = await responseJobBoards.json();

    // Validate the jobBoards structure
    if (!dataJobBoards.success || !Array.isArray(dataJobBoards.jobBoard)) {
      throw new Error("Invalid job boards data format");
    }

    // Access the jobBoard array and map the data
    const jobboards = dataJobBoards.jobBoard.map((jobBoard) => ({
      ...jobBoard,
      _id: jobBoard._id?.toString(), // Convert _id to string if needed
    }));

    // Now you can use 'jobboards' in your application logic
    const apiUrl4= `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}/api/contactus`;

    const responseContactUs = await fetch(apiUrl4);
  
      if (!responseContactUs.ok) {
      throw new Error(
        `Failed to fetch contact submissions: ${responseContactUs.statusText}`
      );
    }

    const dataContactUs = await responseContactUs.json();

    // Validate the structure of the contact submissions data
    if (!dataContactUs.success || !Array.isArray(dataContactUs.submissions)) {
      throw new Error("Invalid contact submissions data format");
    }

    // Map the submissions to ensure the correct data format if needed
 const submissions = dataContactUs.submissions.map((submission) => ({
  ...submission,
  _id: submission._id?.toString(), // Convert _id to string if needed
}));

    // Pass 'submissions' to the view
    res.render("dashboard", {
      iframeSrc,
      job,
      resource,
      jobboards,
      submissions,
      env: {
        BASE_URL: process.env.BASE_URL,
        PORT: process.env.PORT,
      },
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard.");
  }
});

app.get("/careers", async (req, res) => {
  try {
    // Fetch job board data from /jobboard API
    const apiUrl = `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}/api/jobboard`;

    const jobBoardResponse = await fetch(apiUrl);
    if (!jobBoardResponse.ok) {
      throw new Error(
        `Failed to fetch job boards: ${jobBoardResponse.statusText}`
      );
    }
    const jobBoardData = await jobBoardResponse.json();
    if (!jobBoardData.success || !Array.isArray(jobBoardData.jobBoard)) {
      throw new Error("Invalid job boards data format");
    }
    const jobBoard = jobBoardData.jobBoard;

    // Fetch job data from /jobs API
    const apiUrl2 = `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}/api/addjob`;

    const jobResponse = await fetch(apiUrl2);
    if (!jobResponse.ok) {
      throw new Error(`Failed to fetch jobs: ${jobResponse.statusText}`);
    }
    const jobData = await jobResponse.json();
    if (!jobData.success || !Array.isArray(jobData.jobs)) {
      throw new Error("Invalid jobs data format");
    }
    const job = jobData.jobs.map((job) => ({
      ...job,
      _id: job._id?.toString(), // Ensure _id is a string
    }));

    // Render careers page with fetched data
    res.render("careers", {
      jobBoard,
      job,
      env: {
        BASE_URL: process.env.BASE_URL,
        PORT: process.env.PORT,
      },
    });
  } catch (error) {
    console.error("Error fetching career data:", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
});

app.get("/careers", (req, res) => {
  res.render(path.join(__dirname, "/pages/careers.html"));
});

app.get("/dashboard", (req, res) => {
  
  res.render(path.join(__dirname, "dashboard.html"));
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    title: "404 - Page Not Found",
    message: "The page you are looking for does not exist.",
    status: 404,
  });
});


(async () => {
  try {
    await connectToDatabase();
    console.log("Database connection initialized during server startup");
    // Start your server after the database is connected
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database connection error:", error);
    process.exit(1); // Exit the process with an error code
  }
})();
