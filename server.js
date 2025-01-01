require('dotenv').config(); // Load environment variables
const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const MongoClient = mongodb.MongoClient;
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const session = require('express-session');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(fileUpload({
  useTempFiles:true
}))
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'A2IK API',
      version: '1.0.0',
      description: 'API documentation for A2IK',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Base URL for your API
      },
    ],
  },
  apis: [path.join(__dirname, 'server.js')], // Point to the current file for Swagger annotations
};


app.use(express.urlencoded({ extended: true })); // Parses form data
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Setup Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(
  session({
    secret: '67613fe1ca9cf7b5bebabf91', // Replace with a strong, unique key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Use secure: true in production with HTTPS
  })
);

/**
 * @swagger
 * /api/emailjs:
 *   get:
 *     summary: Retrieve EmailJS configuration keys.
 *     description: Returns the public key, service ID, and template ID for EmailJS.
 *     tags:
 *       - EmailJS
 *     responses:
 *       200:
 *         description: Successfully retrieved EmailJS configuration keys.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EMAILJS_SERVICE_ID:
 *                   type: string
 *                   description: The service ID for EmailJS.
 *                   example: service_yvzqjh6
 *                 EMAILJS_TEMPLATE_ID:
 *                   type: string
 *                   description: The template ID for EmailJS.
 *                   example: template_12345abc
 *                 EMAILJS_PUBLIC_KEY:
 *                   type: string
 *                   description: The public key for EmailJS.
 *                   example: rkpynpwmbwkXF7tyZ
 *       500:
 *         description: Failed to retrieve EmailJS configuration keys.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Internal Server Error
 */

app.get('/api/emailjs', (req, res) => {
  res.json({
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY
  });
});


cloudinary.config({ 
  cloud_name: 'dhyelfsdz', 
  api_key: '822689461397169', 
  api_secret: 'efAL8AJ7noJPEAhKlDyKcFL3tiM'
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

let db;

MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    db = client.db('analytics');
  })
  .catch(error => console.error(error));

// The plain-text password you want to hash
const password = process.env.DASHBOARD_PASSWORD;
app.get('/', async (req, res) => {
  try {
    // Check if the admin password is already set
    const existingAdmin = await db.collection('admin').findOne({ role: 'admin' });

    if (!existingAdmin) {
      // If no admin exists, hash the password and insert it into the database
      const password = process.env.DASHBOARD_PASSWORD;

      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
        } else {
         
          // Store hashed password in your database
          await db.collection('admin').insertOne({
            role: 'admin',
            password: hashedPassword
          });
        }
      });
    } else {
    }

         // Fetch resources from the API
    //  const response = await fetch('http://localhost:3000/resources');
    //  if (!response.ok) {
    //    throw new Error(`Failed to fetch resources: ${response.statusText}`);
    //  }
 
    //  const { resources } = await response.json();
    //  console.log('Fetched resources:', resources);
    // Render the page with the resources
    // Fetch resources for the page
    const resources = await db.collection('resources').find().toArray();

    res.render('index', {
      resources
    });
  } catch (error) {
    console.error('Error fetching resources or processing password:', error);
    res.status(500).send('Internal Server Error');
  }
});


// app.get('/form',(req,res) =>{
//   res.render('form');
// });

// app.post('/applyjob', async (req, res) => {
//   const resume = req.files?.resume;
//   const { "full-name": fullname, email, phone, "cover-letter": coverletter } = req.body;


 
//   if (!resume) {
//     return res.status(400).send('No resume file uploaded');
//   }

//   try {
//     cloudinary.uploader.upload(
//       resume.tempFilePath,
//       { resource_type: 'raw' },
//       async (err, result) => {
//         if (err) {
//           console.error("Error uploading file:", err);
//           return res.status(500).send("Error uploading file");
//         }

//         const resumeUrl = result.secure_url;

//         const data = {
//           fullname,
//           email,
//           phone,
//           resume: resumeUrl,
//           coverletter,
//         };

//         try {
//           await db.collection('applyjob').insertOne(data);
//           res.status(201).send("Application submitted successfully");
//         } catch (error) {
//           console.error("Error inserting data:", error);
//           res.status(500).send("Error inserting application data");
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error occurred while saving form data:", error);
//     res.status(500).send("Server error");
//   }
// });


/**
 * @swagger
 * /applyjob:
 *   post:
 *     summary: Submit a job application
 *     description: Allows a user to submit a job application including personal details, resume, and cover letter.
 *     tags:
 *       - Job Applications
 *     requestBody:
 *       description: The job application data submitted by the user.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full-name:
 *                 type: string
 *                 description: The full name of the applicant.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The email address of the applicant.
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 description: The phone number of the applicant.
 *                 example: "123-456-7890"
 *               cover-letter:
 *                 type: string
 *                 description: The cover letter of the applicant.
 *                 example: "I am excited to apply for the position!"
 *               jobTitle:
 *                 type: string
 *                 description: The job title the applicant is applying for.
 *                 example: "Software Engineer"
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: The resume file of the applicant.
 *     responses:
 *       201:
 *         description: Successfully submitted the job application.
 *       400:
 *         description: No resume file uploaded.
 *       500:
 *         description: Error uploading file or saving application data.
 */
app.post('/applyjob', async (req, res) => {
  const resume = req.files?.resume;
  const { "full-name": fullname, email, phone, "cover-letter": coverletter, "jobTitle": jobTitle } = req.body;
  if (!resume) {
    return res.status(400).send('No resume file uploaded');
  }

  try {
    cloudinary.uploader.upload(
      resume.tempFilePath,
      { resource_type: 'raw' },
      async (err, result) => {
        if (err) {
          console.error("Error uploading file:", err);
          return res.status(500).send("Error uploading file");
        }

        const resumeUrl = result.secure_url;

        const data = {
          fullname,
          email,
          phone,
          resume: resumeUrl,
          coverletter,
          jobTitle,
        };

        try {
          await db.collection('applyjob').insertOne(data);
          res.status(201).send("Application submitted successfully");
        } catch (error) {
          console.error("Error inserting data:", error);
          res.status(500).send("Error inserting application data");
        }
      }
    );
  } catch (error) {
    console.error("Error occurred while saving form data:", error);
    res.status(500).send("Server error");
  }
});
/**
 * @swagger
 * /applyjob:
 *   get:
 *     summary: Retrieve all job applications
 *     description: Fetches all job applications submitted by users including their details and resume URLs.
 *     tags:
 *       - Job Applications
 *     responses:
 *       200:
 *         description: A list of all job applications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the job application.
 *                     example: "60a5b3d9f7a8f4b123456789"
 *                   fullname:
 *                     type: string
 *                     description: The full name of the applicant.
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     description: The email address of the applicant.
 *                     example: "john.doe@example.com"
 *                   phone:
 *                     type: string
 *                     description: The phone number of the applicant.
 *                     example: "123-456-7890"
 *                   resume:
 *                     type: string
 *                     description: The URL of the applicant's resume.
 *                     example: "https://res.cloudinary.com/xyz/image/upload/v1234567890/resume.pdf"
 *                   coverletter:
 *                     type: string
 *                     description: The cover letter of the applicant.
 *                     example: "I am excited to apply for the position!"
 *                   jobTitle:
 *                     type: string
 *                     description: The job title the applicant is applying for.
 *                     example: "Software Engineer"
 *       500:
 *         description: Error fetching job application data.
 */
app.get('/applyjob', async (req, res) => {
  try {
    const applyjob = await db.collection('applyjob').find().toArray();
    res.status(200).send(applyjob);
  } catch (error) {
    console.error('Error fetching applyjob data:', error);
    res.status(500).send('Internal Server Error');
  }
});

const ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next(); // Proceed if authenticated
  }
  res.redirect('/login'); // Redirect to login if not authenticated
};


app.get('/web', ensureAuthenticated, async (req, res) => 
  {
  // This is where you would normally fetch data from your database or API
  try {
    const pageviews = await db.collection('pageviews').find().toArray();
    const totalVisits = pageviews.length;
    const uniqueVisitors = new Set(pageviews.map(pv => pv.visitorId)).size;
    const pageViews = totalVisits;
    const bounceRate = (pageviews.filter(pv => pv.bounced).length / totalVisits * 100).toFixed(1);

    const topPages = await db.collection('pageviews').aggregate([
      { $group: { 
        _id: '$path', 
        views: { $sum: 1 },
        avgTime: { $avg: '$timeOnPage' }
      }},
      { $sort: { views: -1 } },
      { $limit: 5 }
    ]).toArray();

    topPages.forEach(page => {
      page.avgTime = (page.avgTime / 1000).toFixed(2); 
    });

    const last6Months = Array.from({length: 6}, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toISOString().slice(0, 7);
    }).reverse();

    const trafficOverTime = await Promise.all(last6Months.map(async (month) => {
      const count = await db.collection('pageviews').countDocuments({
        timestamp: { $regex: `^${month}` }
      });
      return { month, count };
    }));
    
    const trafficSources = await db.collection('pageviews').aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ]).toArray();

    const data = {
      totalVisits,
      uniqueVisitors,
      pageViews,
      bounceRate,
      topPages,
      trafficOverTime,
      trafficSources
    };

    res.render('web', { data });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).render('error', { message: 'Error fetching analytics data' });
  }
});
app.get('/about', async (req, res) => {

  res.render('about');
 
});
app.get('/contact', async (req, res) => {

  res.render('contact');
 
});
app.get('/blog', async (req, res) => {
  const resources  = await db.collection('resources').find().toArray();
  res.render('blog',{resources });
 
});

app.get('/login', (req, res) => {
  res.render('login'); // Render the login form view
});

app.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    console.log("Received form data:", req.body); // Debug log

    if (!password) {
      return res.status(400).send("Password is required.");
    }

    // Retrieve the correct password from the database
    const admin = await db.collection("admin").findOne({ role: "admin" });
    
    // If no admin or password mismatch, respond with an error
    if (!admin) {
      return res.status(401).send("Invalid password.");
    }

    // Use bcrypt.compare to compare the stored hash with the provided password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).send("Invalid password.");
    }

    // Save the authenticated status in the session
    req.session.isAuthenticated = true;

    // Redirect to the dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send("Internal server error.");
  }
});




app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Unable to log out');
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.redirect('/login'); // Redirect to login page
  });
});

app.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const iframeSrc = '/web';
    const job = await db.collection("jobs")
      .find()
      .map((job) => ({
        ...job,
        _id: job._id.toString(),
      }))
      .toArray();

    const resource = await db.collection('resources').find().toArray();
    const jobboards = await db.collection('jobboards').find().toArray();
    const submissions = await db.collection('contactus').find().toArray(); // Ensure this line is correct

    // Pass 'submissions' to the view
    res.render('dashboard', { iframeSrc, job, resource, jobboards, submissions });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard.");
  }
});

app.get('/careers', async (req, res) => {
  try {
    const jobBoard = await db.collection('jobboards').find().toArray();
    console.log(jobBoard);
    if (!jobBoard) {
      return res.status(404).send('Job board not found');
    }

    const job = await db
    .collection("jobs")
    .find()
    .map((job) => ({
      ...job,
      _id: job._id.toString(), 
    }))
    .toArray();
     


    res.render('careers', {
      jobBoard, job 
    });
  } catch (error) {
    console.error('Error fetching job board data:', error);
    res.status(500).send('Error fetching data: ' + error.message);
  }
});



app.get('/careers', (req, res) => {
  res.render(path.join(__dirname, '/pages/careers.html'));
});


app.get('/dashboard', (req, res) => {
  res.render(path.join(__dirname, 'dashboard.html'));
});



/**
 * @swagger
 * /analytics:
 *   post:
 *     summary: Submit Analytics Data
 *     description: Collects and stores analytics data for page views and user interactions.
 *     tags:
 *       - Analytics
 *     requestBody:
 *       description: Analytics data to be saved
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: The URL path of the page being viewed.
 *                 example: "/home"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: The time the page was visited.
 *                 example: "2024-12-27T14:30:00Z"
 *               visitorId:
 *                 type: string
 *                 description: A unique identifier for the visitor.
 *                 example: "abc123"
 *               timeOnPage:
 *                 type: number
 *                 description: The time spent on the page in seconds.
 *                 example: 120
 *               bounced:
 *                 type: boolean
 *                 description: Indicates whether the user bounced from the page.
 *                 example: false
 *               source:
 *                 type: string
 *                 description: The referral source or campaign that led the user to the page.
 *                 example: "google"
 *     responses:
 *       201:
 *         description: Successfully stored the analytics data.
 *       500:
 *         description: Error saving analytics data.
 */
app.post('/analytics', async (req, res) => {
  try {
    const { path, timestamp, visitorId, timeOnPage, bounced,source } = req.body;
    await db.collection('pageviews').insertOne({ path, timestamp, visitorId, timeOnPage, bounced,source});
    res.status(201).send('Analytics data received');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving analytics data');
  }
});

/**
 * @swagger
 * /contactus:
 *   post:
 *     summary: Submit Contact Us Data
 *     description: Collects and stores user-submitted contact information such as name, email, and message.
 *     tags:
 *       - Contact Us
 *     requestBody:
 *       description: The contact form data submitted by the user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from_name:
 *                 type: string
 *                 description: The name of the person submitting the contact form.
 *                 example: "John Doe"
 *               from_email:
 *                 type: string
 *                 description: The email address of the person submitting the contact form.
 *                 example: "john.doe@example.com"
 *               message:
 *                 type: string
 *                 description: The message submitted by the user in the contact form.
 *                 example: "I would like to inquire about your services."
 *     responses:
 *       201:
 *         description: Successfully stored the contact form data.
 *       500:
 *         description: Error saving contact form data.
 */
app.post('/contactus', async (req, res) => {
  try {
    const {from_name,from_email,message } = req.body;
    await db.collection('contactus').insertOne({ from_name,from_email,message});
    res.status(201).send('contactus data received');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving contactus data');
  }
});
/**
 * @swagger
 * /contactus:
 *   get:
 *     summary: Retrieve all Contact Us submissions
 *     description: Fetches all user-submitted contact information such as name, email, and message.
 *     tags:
 *       - Contact Us
 *     responses:
 *       200:
 *         description: A list of contact form submissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the contact submission.
 *                     example: "60a5b3d9f7a8f4b123456789"
 *                   from_name:
 *                     type: string
 *                     description: The name of the person who submitted the contact form.
 *                     example: "John Doe"
 *                   from_email:
 *                     type: string
 *                     description: The email address of the person who submitted the contact form.
 *                     example: "john.doe@example.com"
 *                   message:
 *                     type: string
 *                     description: The message submitted by the user in the contact form.
 *                     example: "I would like to inquire about your services."
 *       500:
 *         description: Error fetching contact form data.
 */
app.get('/contactus', async (req, res) => {
  try {
    const submissions = await db.collection('contactus').find().toArray();
    console.log(submissions);  // Log the data to verify it's coming from the database
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching contactus data');
  }
});



/**
 * @swagger
 * /resources:
 *   post:
 *     summary: Submit Resources Data to db with image upload
 *     description: Collects and stores Admin-submitted Resources information such as alt, tag, title, link, and image file (PNG).
 *     tags:
 *       - Resources
 *     requestBody:
 *       description: The Resources form data submitted by the admin only, including an image file.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the resource form.
 *                 example: "Ai Is Not Coming"
 *               tag:
 *                 type: string
 *                 description: The tag of the resource form.
 *                 example: "AI"
 *               alt:
 *                 type: string
 *                 description: The alt text for the image of the resource form.
 *                 example: "AI image"
 *               link:
 *                 type: string
 *                 description: The URL for redirecting to the blog page.
 *                 example: "blog"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file (PNG) associated with the resource.
 *                 example: "file"
 *     responses:
 *       201:
 *         description: Successfully stored the resource data.
 *       500:
 *         description: Error saving resource data.
 */
app.post('/resources', async (req, res) => {
  try {
    // Ensure the file is available
    const file = req.files?.image;
    if (!file) {
      return res.status(400).send('Image file is required');
    }

    // Upload the image to Cloudinary
    cloudinary.uploader.upload(file.tempFilePath, async (err, uploadResult) => {
      if (err) {
        console.error('Error uploading image:', err);
        return res.status(500).send('Error uploading image: ' + err.message);
      }

      console.log('Received resource data:', req.body);
      const { alt, tag, title, link } = req.body;

      // Validate required fields (excluding `image` as it’s uploaded)
      if (!alt || !tag || !title || !link) {
        console.log('Missing required fields:', { alt, tag, title, link });
        return res.status(400).send('Missing required fields');
      }

      // Save to the database
      const dbResult = await db.collection('resources').insertOne({
        image: uploadResult.url, // Use the Cloudinary URL
        alt,
        tag,
        title,
        link: link || 'blog',
      });

      console.log('Inserted resource:', dbResult.insertedId);
      res.status(201).send('Resource added successfully');
    });
  } catch (error) {
    console.error('Error saving resource:', error);
    res.status(500).send('Error saving resource: ' + error.message);
  }
});
/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Retrieve all resources
 *     description: Fetches all resources along with their details such as title, tag, alt text, link, and image URL.
 *     tags:
 *       - Resources
 *     responses:
 *       200:
 *         description: Successfully retrieved the resources.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The title of the resource.
 *                     example: "AI Is Not Coming"
 *                   tag:
 *                     type: string
 *                     description: The tag of the resource.
 *                     example: "AI"
 *                   alt:
 *                     type: string
 *                     description: The alt text for the image.
 *                     example: "AI image"
 *                   link:
 *                     type: string
 *                     description: The URL for redirecting to the blog page.
 *                     example: "https://example.com/blog"
 *                   image:
 *                     type: string
 *                     description: The URL or path of the uploaded image.
 *                     example: "https://example.com/uploads/ai-image.png"  # Or the Cloudinary URL if you're using cloud storage
 *       500:
 *         description: Error retrieving resources.
 */
// app.get('/resources', async (req, res) => {
//   console.log('GET /resources hit'); // Log to confirm the route is accessed
//   try {
//     const resources = await db.collection('resources').find().toArray();
//     console.log('Resources fetched:', resources); // Log the fetched resources
//     res.json({ success: true, resources }); // Send response as JSON
//   } catch (error) {
//     console.error('Error fetching resources:', error);
//     res.status(500).json({ success: false, message: 'Error fetching resources' });
//   }
// });

// Resources API Endpoint
app.get('/resources', async (req, res) => {
  console.log('GET /resources hit');
  try {
    const resources = await db.collection('resources').find().toArray();
    console.log('Resources fetched:', resources);
    res.json({ success: true, resources }); // Send response as JSON
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ success: false, message: 'Error fetching resources' });
  }
});


/**
 * @swagger
 * /resources:
 *   put:
 *     summary: Update a resource
 *     description: Updates a resource's details such as image, alt text, tag, title, and link.
 *     tags:
 *       - Resources
 *     requestBody:
 *       description: The updated resource data.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resourceId:
 *                 type: string
 *                 description: The ID of the resource to be updated.
 *                 example: "60d1a4b3e6f3a8a8a8a8a8a8"
 *               alt:
 *                 type: string
 *                 description: The updated alt text for the image.
 *                 example: "Updated AI image"
 *               tag:
 *                 type: string
 *                 description: The updated tag of the resource.
 *                 example: "Updated AI"
 *               title:
 *                 type: string
 *                 description: The updated title of the resource.
 *                 example: "Updated AI Is Not Coming"
 *               link:
 *                 type: string
 *                 description: The updated URL for redirecting to the blog page.
 *                 example: "https://example.com/updated-blog"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The updated image file (PNG).
 *                 example: "file"
 *     responses:
 *       200:
 *         description: Successfully updated the resource.
 *       400:
 *         description: Missing required fields or invalid resource ID.
 *       404:
 *         description: Resource not found.
 *       500:
 *         description: Error updating resource.
 */
app.put('/resources',async (req , res) => {
  try {
    const { resourceId, alt, tag, title, link } = req.body;
    const file = req.files?.image;
    if (!file) {
      return res.status(400).send('Image file is required');
    }

    // Upload the image to Cloudinary
    cloudinary.uploader.upload(file.tempFilePath, async (err, uploadResult) => {
      if (err) {
        console.error('Error uploading image:', err);
        return res.status(500).send('Error uploading image: ' + err.message);
      }
      
      if (!resourceId) {
        return res.status(400).send('Resource ID is required');
      }
  
      const updateData = {};
      updateData.image = uploadResult.url;
       if (alt) updateData.alt = alt;
       if (tag) updateData.tag = tag;
       if (title) updateData.title = title;
       if (link) updateData.link = link;
   
       const result = await db.collection('resources').updateOne(
         { _id: new mongodb.ObjectId(resourceId) },
         { $set: updateData }
       );
   
       if (result.matchedCount === 0) {
         return res.status(404).send('Resource not found');
       }
   
       res.status(200).send('Resource updated successfully');
    });
   
   
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).send('Error updating resource');
  }
});

/**
 * @swagger
 * /resources:
 *   delete:
 *     summary: Delete a resource
 *     description: Deletes a resource based on its ID.
 *     tags:
 *       - Resources
 *     requestBody:
 *       description: The resource ID to be deleted.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resourceId:
 *                 type: string
 *                 description: The ID of the resource to be deleted.
 *                 example: "60d1a4b3e6f3a8a8a8a8a8a8"
 *     responses:
 *       200:
 *         description: Successfully deleted the resource.
 *       400:
 *         description: Resource ID is required.
 *       404:
 *         description: Resource not found.
 *       500:
 *         description: Error deleting resource.
 */
app.delete("/resources", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log incoming data

    const { resourceId } = req.body;

    if (!resourceId) {
      return res.status(400).send("Resource ID is required");
    }

    const result = await db.collection("resources").deleteOne({ _id: new mongodb.ObjectId(resourceId) });

    if (result.deletedCount === 0) {
      return res.status(404).send("Resource not found");
    }

    res.status(200).send("Resource deleted successfully");
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).send("Error deleting resource");
  }
});

/**
 * @swagger
 * /addjob:
 *   post:
 *     summary: Add a new job listing
 *     description: Creates a new job listing with the provided details.
 *     tags:
 *       - Jobs
 *     requestBody:
 *       description: The job details to be added.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 description: The title of the job.
 *                 example: "Software Engineer"
 *               jobLocation:
 *                 type: string
 *                 description: The location of the job.
 *                 example: "New York, NY"
 *               jobAbout:
 *                 type: string
 *                 description: A brief description about the job.
 *                 example: "We are looking for a software engineer to join our team."
 *               jobResponsibilities:
 *                 type: string
 *                 description: The responsibilities of the job.
 *                 example: "Develop, test, and deploy software applications."
 *               jobRequirements:
 *                 type: string
 *                 description: The requirements for the job.
 *                 example: "Bachelor's degree in Computer Science or equivalent."
 *               jobExperiencelevel:
 *                 type: string
 *                 description: The experience level required for the job.
 *                 example: "Mid-level"
 *               jobContractType:
 *                 type: string
 *                 description: The type of contract for the job.
 *                 example: "Full-time"
 *     responses:
 *       201:
 *         description: Job added successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Error saving job.
 */
app.post('/addjob', async (req, res) => {
  try {
    console.log('Received job data:', req.body);
    const { jobTitle, jobLocation, jobAbout, jobResponsibilities, jobRequirements,jobExperiencelevel,jobContractType } = req.body;
    
    if (!jobTitle || !jobLocation || !jobAbout || !jobResponsibilities || !jobRequirements || !jobExperiencelevel || !jobContractType ) {
      console.log('Missing required fields:', { jobTitle, jobLocation, jobAbout, jobResponsibilities, jobRequirements, jobExperiencelevel,jobContractType });
      return res.status(400).send('Missing required fields');
    }
    
    const result = await db.collection('jobs').insertOne({ jobTitle, jobLocation, jobAbout, jobResponsibilities, jobRequirements,jobExperiencelevel,jobContractType  });
    console.log('Inserted job:', result.insertedId);
    res.status(201).send('Job added successfully');
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).send('Error saving job: ' + error.message);
  }
});

/**
 * @swagger
 * /addjob:
 *   get:
 *     summary: Get all job listings
 *     description: Retrieves all available job listings.
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the retrieval was successful.
 *                   example: true
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobTitle:
 *                         type: string
 *                         description: The title of the job.
 *                         example: "Software Engineer"
 *                       jobLocation:
 *                         type: string
 *                         description: The location of the job.
 *                         example: "New York, NY"
 *                       jobAbout:
 *                         type: string
 *                         description: A brief description about the job.
 *                         example: "We are looking for a software engineer to join our team."
 *                       jobResponsibilities:
 *                         type: string
 *                         description: The responsibilities of the job.
 *                         example: "Develop, test, and deploy software applications."
 *                       jobRequirements:
 *                         type: string
 *                         description: The requirements for the job.
 *                         example: "Bachelor's degree in Computer Science or equivalent."
 *                       jobExperiencelevel:
 *                         type: string
 *                         description: The experience level required for the job.
 *                         example: "Mid-level"
 *                       jobContractType:
 *                         type: string
 *                         description: The type of contract for the job.
 *                         example: "Full-time"
 *       500:
 *         description: Error fetching jobs.
 */
app.get('/addjob', async (req, res) => {
  try {
   const jobs = await db
  .collection("jobs")
  .find()
  .map((job) => ({
    ...job,
    _id: job._id.toString(),
  }))
  .toArray();
  console.log(jobs);
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Error fetching jobs' });
  }
});

/**
 * @swagger
 * /addjob:
 *   put:
 *     summary: Update an existing job listing
 *     description: Updates a job listing based on the provided job title (ID) and new details.
 *     tags:
 *       - Jobs
 *     requestBody:
 *       description: The job details to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 description: The title of the job (used as the identifier).
 *                 example: "Software Engineer"
 *               jobLocation:
 *                 type: string
 *                 description: The updated location of the job.
 *                 example: "San Francisco, CA"
 *               jobAbout:
 *                 type: string
 *                 description: The updated description about the job.
 *                 example: "Looking for an experienced software engineer to join our innovative team."
 *               jobResponsibilities:
 *                 type: string
 *                 description: The updated responsibilities of the job.
 *                 example: "Lead projects, mentor junior engineers, and ensure software quality."
 *               jobRequirements:
 *                 type: string
 *                 description: The updated requirements for the job.
 *                 example: "5+ years of experience in software development."
 *               jobExperiencelevel:
 *                 type: string
 *                 description: The updated experience level required for the job.
 *                 example: "Senior-level"
 *               jobContractType:
 *                 type: string
 *                 description: The updated type of contract for the job.
 *                 example: "Contract"
 *     responses:
 *       200:
 *         description: Job updated successfully.
 *       400:
 *         description: Job title is required to update a job.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Error updating the job.
 */

// Update Job Endpoint
// app.put('/addjob', async (req, res) => {
//   try {
//     const {
//       jobTitle,
//       jobLocation,
//       jobAbout,
//       jobResponsibilities,
//       jobRequirements,
//       jobExperiencelevel,
//       jobContractType,
//     } = req.body;

//     // Ensure the `jobTitle` (or equivalent ID) is provided for identification
//     if (!jobTitle) {
//       return res.status(400).send('Job title or ID is required to update a job.');
//     }

//     console.log(jobTitle);
//     const updateData = {};
//     if (jobLocation) updateData.jobLocation = jobLocation;
//     if (jobAbout) updateData.jobAbout = jobAbout;
//     if (jobResponsibilities) updateData.jobResponsibilities = jobResponsibilities;
//     if (jobRequirements) updateData.jobRequirements = jobRequirements;
//     if (jobExperiencelevel) updateData.jobExperiencelevel = jobExperiencelevel;
//     if (jobContractType) updateData.jobContractType = jobContractType;

//     const result = await db.collection('jobs').updateOne(
//       { _id: new mongodb.ObjectId(jobTitle) }, // Replace `jobTitle` with `_id` as it should be the unique identifier
//       { $set: updateData }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).send('Job not found.');
//     }

//     res.status(200).send('Job updated successfully.');
//   } catch (error) {
//     console.error('Error updating job:', error);
//     res.status(500).send('Error updating job.');
//   }
// });
app.put('/addjob', async (req, res) => {
  try {
    const {
      jobTitle,  // Job title that needs to be matched
      jobLocation,
      jobAbout,
      jobResponsibilities,
      jobRequirements,
      jobExperiencelevel,
      jobContractType,
    } = req.body;

    // Ensure the `jobTitle` is provided for identification
    if (!jobTitle) {
      return res.status(400).send('Job title is required to update a job.');
    }

    console.log('Updating job with title:', jobTitle);

    // Prepare the update data
    const updateData = {};
    if (jobLocation) updateData.jobLocation = jobLocation;
    if (jobAbout) updateData.jobAbout = jobAbout;
    if (jobResponsibilities) updateData.jobResponsibilities = jobResponsibilities;
    if (jobRequirements) updateData.jobRequirements = jobRequirements;
    if (jobExperiencelevel) updateData.jobExperiencelevel = jobExperiencelevel;
    if (jobContractType) updateData.jobContractType = jobContractType;

    // Perform the update using the jobTitle to find the correct job
    const result = await db.collection('jobs').updateOne(
      { jobTitle: jobTitle },  // Matching by jobTitle instead of _id
      { $set: updateData }
    );

    // If no job matches, return 404
    if (result.matchedCount === 0) {
      return res.status(404).send('Job not found.');
    }

    // Send success response
    res.status(200).send('Job updated successfully.');
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).send('Error updating job.');
  }
});

/**
 * @swagger
 * /addjob:
 *   delete:
 *     summary: Delete a job listing
 *     description: Deletes a specific job listing based on its unique ID.
 *     tags:
 *       - Jobs
 *     requestBody:
 *       description: The job ID to be deleted.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 description: The title of the job to be deleted.
 *                 example: "Software Engineer level 2"
 *     responses:
 *       200:
 *         description: Successfully deleted the job.
 *       400:
 *         description: Job ID is required.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Error deleting the job.
 */

app.delete('/addjob', async (req, res) => {
  try {
    const { jobTitle } = req.body;

    if (!jobTitle) {
      return res.status(400).send("Job Title is required");
    }

    // Assuming your MongoDB connection is set up
    const result = await db.collection('jobs').deleteOne({ jobTitle: jobTitle });

    if (result.deletedCount === 0) {
      return res.status(404).send("Job not found");
    }

    res.status(200).send("Job deleted successfully");
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).send("Error deleting job");
  }
});



// app.post('/jobboard', async (req, res) => {
//   try {
//     const { category, openPositions } = req.body;

//     if (!category || openPositions === undefined) {
//       return res.status(400).send('Missing required fields: category or openPositions');
//     }

//     // Map form categories to database fields
//     const categoryMapping = {
//       technology: 'Technology',
//       'sales-marketing': 'SalesMarketing',
//       operations: 'Operations',
//       'human-resources': 'HumanResources',
//     };

//     const fieldToUpdate = categoryMapping[category];
//     if (!fieldToUpdate) {
//       return res.status(400).send('Invalid category');
//     }

//     const positions = parseInt(openPositions, 10);
//     if (isNaN(positions)) {
//       return res.status(400).send('Invalid number for openPositions');
//     }

//     const result = await db.collection('jobboards').updateOne(
//       { _id: new mongodb.ObjectId("67613fe1ca9cf7b5bebabf91") }, 
//       { $set: { [fieldToUpdate]: positions } }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).send('No document found to update');
//     }

//     res.status(200).send('Job board updated successfully');
//   } catch (error) {
//     console.error('Error updating job board:', error);
//     res.status(500).send('Error updating job board: ' + error.message);
//   }
// });
/**
 * @swagger
 * /jobboard:
 *   post:
 *     summary: Add a new job board
 *     description: Adds a new job board by creating a category and setting the number of open positions.
 *     tags:
 *       - Job Board
 *     requestBody:
 *       description: The category and number of open positions to add to the job board.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category of the job board.
 *                 example: "design"
 *               openposition:
 *                 type: integer
 *                 description: The number of open positions for the category.
 *                 example: 10
 *     responses:
 *       200:
 *         description: Job board added successfully.
 *       400:
 *         description: Missing required fields or invalid values (category or openposition).
 *       500:
 *         description: Error adding the job board.
 */

app.post("/jobboard", async (req, res) => {
  try {
    const { category, openposition } = req.body; // Example: { "category": "design", "openPositions": 10 }
    
    console.log(category,openposition);
    if (!category || openposition === undefined) {
      return res.status(400).send("Missing required fields: category or openPositions");
    }

   

    // Update the document dynamically
    const result = await db.collection("jobboards").insertOne(
     {category ,openposition}// Dynamically sets "design": 10
    );

    if(result){

      res.status(200).send("Field added successfully");
    }

  } catch (error) {
    console.error("Error updating the document:", error);
    res.status(500).send("Error updating the document: " + error.message);
  }
});
/**
 * @swagger
 * /jobboard:
 *   put:
 *     summary: Update job board open positions
 *     description: Updates the number of open positions for an existing job board category.
 *     tags:
 *       - Job Board
 *     requestBody:
 *       description: The category and the new number of open positions to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category of the job board to update.
 *                 example: "design"
 *               openposition:
 *                 type: integer
 *                 description: The new number of open positions for the specified category.
 *                 example: 12
 *     responses:
 *       200:
 *         description: Job board updated successfully.
 *       400:
 *         description: Missing required fields or invalid values (category or openposition).
 *       404:
 *         description: Job board category not found.
 *       500:
 *         description: Error updating the job board.
 */

app.put("/jobboard", async (req, res) => {
  try {
    let { category, openposition } = req.body;

    if (!category || openposition === undefined) {
      return res.status(400).send("Missing required fields: category or openposition");
    }

    // Ensure `openposition` is stored as a number
    openposition = Number(openposition);
    if (isNaN(openposition)) {
      return res.status(400).send("Invalid value for openposition. Must be a number.");
    }

    const filter = { category: category };
    const update = { $set: { openposition: openposition } };

    const result = await db.collection("jobboards").updateOne(filter, update);

    if (result.matchedCount === 0) {
      return res.status(404).send("Category not found in the document.");
    }

    if (result.modifiedCount === 0) {
      return res.status(200).send("Field already up-to-date. No changes made.");
    }

    res.status(200).send("jobboards updated successfully.");
  } catch (error) {
    console.error("Error updating the document:", error);
    res.status(500).send("Error updating the document: " + error.message);
  }
});

/**
 * @swagger
 * /jobboard:
 *   delete:
 *     summary: Delete a job board by category
 *     description: Deletes a job board based on the selected category.
 *     tags:
 *       - Job Board
 *     requestBody:
 *       description: The category of the job board to be deleted.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category to be deleted.
 *                 example: "engineering"
 *     responses:
 *       200:
 *         description: Job board deleted successfully.
 *       400:
 *         description: ID or category is missing.
 *       404:
 *         description: Job board not found.
 *       500:
 *         description: Error deleting the job board.
 */
app.delete('/jobboard', async (req, res) => {
  const { category } = req.body; // Expect category as the identifier

  if (!category) {
    return res.status(400).send('Category is required');
  }

  try {
    const result = await db.collection('jobboards').deleteOne({ category });

    if (result.deletedCount === 0) {
      return res.status(404).send('Job board not found');
    }

    res.status(200).send('Job board deleted successfully');
  } catch (error) {
    console.error('Error deleting job board:', error);
    res.status(500).send('Error deleting job board: ' + error.message);
  }
});

/**
 * @swagger
 * /jobboard:
 *   get:
 *     summary: Fetch job board data
 *     description: Retrieves the job board data, including categories like Technology, SalesMarketing, Operations, and HumanResources.
 *     tags:
 *       - Job Board
 *     responses:
 *       200:
 *         description: Successfully retrieved job board data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: object id.
 *                   example: "6772977d5bb297a869843789"
 *                 category:
 *                   type: string
 *                   description: job board category.
 *                   example: "HR"
 *                 openposition:
 *                   type: integer
 *                   description: The number of open positions in the Operations category.
 *                   example: 2
 *       404:
 *         description: Job board data not found.
 *       500:
 *         description: Error fetching job board data.
 */
app.get('/jobboard', async (req, res) => {
  try {
    const jobBoard = await db.collection('jobboards').find().toArray();

    if (!jobBoard) {
      return res.status(404).send("Job board data not found");
    }

    // // Return only the relevant fields
    // const { Technology, SalesMarketing, Operations, HumanResources } = jobBoard;
    res.json({jobBoard});
  } catch (error) {
    console.error("Error fetching job board data:", error);
    res.status(500).send("Error fetching job board data");
  }
});
/**
 * @swagger
 * /analytics:
 *   get:
 *     summary: Retrieve website analytics data
 *     description: Fetches various website analytics, including total visits, unique visitors, bounce rate, top pages, traffic over the last 6 months, and traffic sources.
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Returns website analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   totalVisits:
 *                     type: integer
 *                     description: The total number of visits on the website.
 *                     example: 5000
 *                   uniqueVisitors:
 *                     type: integer
 *                     description: The number of unique visitors based on visitor IDs.
 *                     example: 4500
 *                   pageViews:
 *                     type: integer
 *                     description: The total page views on the website.
 *                     example: 5000
 *                   bounceRate:
 *                     type: string
 *                     description: The percentage of visits where users left without interacting further.
 *                     example: "30.5"
 *                   topPages:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The page path.
 *                           example: "/home"
 *                         views:
 *                           type: integer
 *                           description: The total number of views for the page.
 *                           example: 1000
 *                         avgTime:
 *                           type: string
 *                           description: The average time spent on the page (in seconds).
 *                           example: "15.32"
 *                   trafficOverTime:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         month:
 *                           type: string
 *                           description: The month for which the traffic is calculated (in YYYY-MM format).
 *                           example: "2024-06"
 *                         count:
 *                           type: integer
 *                           description: The total count of pageviews in the specified month.
 *                           example: 800
 *                   trafficSources:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The source of the traffic (e.g., direct, referral, search engine).
 *                           example: "google"
 *                         count:
 *                           type: integer
 *                           description: The number of visits from that source.
 *                           example: 1200
 *       500:
 *         description: Internal server error while fetching analytics data.
 */
app.get('/analytics', async (req, res) => {
  try {
    const pageviews = await db.collection('pageviews').find().toArray();
    const totalVisits = pageviews.length;
    const uniqueVisitors = new Set(pageviews.map(pv => pv.visitorId)).size;
    const pageViews = totalVisits;
    const bounceRate = (pageviews.filter(pv => pv.bounced).length / totalVisits * 100).toFixed(1);

    const topPages = await db.collection('pageviews').aggregate([
      { $group: { 
        _id: '$path', 
        views: { $sum: 1 },
        avgTime: { $avg: '$timeOnPage' }
      }},
      { $sort: { views: -1 } },
      { $limit: 5 }
    ]).toArray();

    topPages.forEach(page => {
      page.avgTime = (page.avgTime / 1000).toFixed(2); 
    });

    const last6Months = Array.from({length: 6}, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toISOString().slice(0, 7);
    }).reverse();

    const trafficOverTime = await Promise.all(last6Months.map(async (month) => {
      const count = await db.collection('pageviews').countDocuments({
        timestamp: { $regex: `^${month}` }
      });
      return { month, count };
    }));

    const trafficSources = await db.collection('pageviews').aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ]).toArray();

    res.json({
      totalVisits,
      uniqueVisitors,
      pageViews,
      bounceRate,
      topPages,
      trafficOverTime,
      trafficSources
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching analytics data');
  }
});


app.get('*', (req, res) => {
  res.status(404).send('404 - Page Not Found');
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// POST route for saving resource data
// app.post('/resources', async (req, res) => {
//   try {
//     const { image, alt, tag, title, link } = req.body;
//     if (!image || !alt || !tag || !title || !link) {
//       return res.status(400).send('Missing required fields');
//     }
//     await db.collection('resources').insertOne({ image, alt, tag, title, link });
//     res.status(201).send('Resource added successfully');
//   } catch (error) {
//     console.error('Error saving resource:', error);
//     res.status(500).send('Error saving resource');
//   }
// });
