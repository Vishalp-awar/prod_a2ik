
require('dotenv').config();
const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const MongoClient = mongodb.MongoClient;
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(fileUpload({
  useTempFiles:true
}))


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

// app.get('/', (req, res) => {
//   res.render('index');  // Render the index.ejs file
// });
app.get('/', async (req, res) => {
  const resources = await db.collection('resources').find().toArray();
  res.render('index', {
     resources
  });
});

app.get('/form',(req,res) =>{
  res.render('form');
});

// app.post('/applyjob' ,(req ,res) => {

//   const resume = req.files?.resume;
//   const { fullname, email, phone, coverlatter } = req.body;
    
//     try {
      
//       cloudinary.uploader.upload(resume.tempFilePath, (err, result) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send('Error uploading file');
//         }
//         const resumeUrl = result.secure_url;
//         const data = {
//           fullname,
//           email,
//           phone,
//           resume: resumeUrl,
//           coverlatter
//         };
//         db.collection('applyjob').insertOne(data)
//           .then(result => {
//             console.log('Data inserted successfully');
//             res.status(200).send('Data inserted successfully');
//           })
//           .catch(error => {
//             console.error('Error inserting data:', error);
//             res.status(500).send('Error inserting data');
//           });
//       })

//     } catch (error) {
//       console.log("error occured while saving form data");
//     }
  
// });

// app.post('/applyjob', async (req, res) => {
//   const resume = req.files?.resume; // Access uploaded file

//   const { fullname, email, phone, coverlatter } = req.body;

//   if (!resume) {
//     return res.status(400).send('No resume file uploaded');
//   }

//   try {
//     cloudinary.uploader.upload(
//       resume.tempFilePath,
//       { resource_type: 'raw' }, // For PDF and non-image files
//       async (err, result) => {
//         if (err) {
//           console.error("Error uploading file:", err);
//           return res.status(500).send("Error uploading file");
//         }

//         const resumeUrl = result.secure_url;

//         // Save to the database
//         const data = {
//           fullname,
//           email,
//           phone,
//           resume: resumeUrl,
//           coverlatter,
//         };

//         try {
//           await db.collection('applyjob').insertOne(data);
//           console.log("Data inserted successfully");
//           res.status(200).send("Application submitted successfully");
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


app.post('/applyjob', async (req, res) => {
  const resume = req.files?.resume;
  const { fullname, email, phone, coverlatter } = req.body;

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
          coverlatter,
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





app.get('/web', async (req, res) => 
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
app.get('/dashboard', async (req, res) => {
  const iframeSrc = '/web';
  res.render('dashboard', { iframeSrc });
 
});
app.get('/careers', async (req, res) => {
  try {
    const jobBoard = await db.collection('jobboards').findOne({ _id: new mongodb.ObjectId("67613fe1ca9cf7b5bebabf91") });

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
     
   
    const jobs = [
      { jobTitle: "Technology", jobAbout: "Opportunities in technology", jobLocation: "Various", count: jobBoard.Technology },
      { jobTitle: "Sales & Marketing", jobAbout: "Sales and marketing roles", jobLocation: "Various", count: jobBoard.SalesMarketing },
      { jobTitle: "Operations", jobAbout: "Operational roles", jobLocation: "Various", count: jobBoard.Operations },
      { jobTitle: "Human Resources", jobAbout: "HR roles", jobLocation: "Various", count: jobBoard.HumanResources },
    ];

    res.render('careers', {
      jobs, job 
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

app.get('*', (req, res) => {
  res.status(404).send('404 - Page Not Found');
});




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

// app.post('/resources', async (req, res) => {
  
//     const file = req.files.image;
//     cloudinary.uploader.upload(file.tempFilePath,async (err,result) => {
//       try {
//       console.log('Received resource data:', req.body);
//       const { image, alt, tag, title, link } = req.body;
//       if (!image || !alt || !tag || !title || !link) {
//         console.log('Missing required fields:', { image, alt, tag, title, link });
//         return res.status(400).send('Missing required fields');
//       }
//       const result = await db.collection('resources').insertOne({ image:result.url, alt, tag, title, link:'#' });
//       console.log('Inserted resource:', result.insertedId);
//       res.status(201).send('Resource added successfully');
//     } catch (error) {
//       console.error('Error saving resource:', error);
//       res.status(500).send('Error saving resource: ' + error.message);
//     }
//     })
 
// });
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
        link: link || '#',
      });

      console.log('Inserted resource:', dbResult.insertedId);
      res.status(201).send('Resource added successfully');
    });
  } catch (error) {
    console.error('Error saving resource:', error);
    res.status(500).send('Error saving resource: ' + error.message);
  }
});


app.get('/resources', async (req, res) => {
  try {
    const resources = await db.collection('resources').find().toArray();
    res.json({ success: true, resources }); 
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).send('Error fetching resources');
  }
});

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
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Error fetching jobs' });
  }
});

app.post('/jobboard', async (req, res) => {
  try {
    const { category, openPositions } = req.body;

    if (!category || openPositions === undefined) {
      return res.status(400).send('Missing required fields: category or openPositions');
    }

    // Map form categories to database fields
    const categoryMapping = {
      technology: 'Technology',
      'sales-marketing': 'SalesMarketing',
      operations: 'Operations',
      'human-resources': 'HumanResources',
    };

    const fieldToUpdate = categoryMapping[category];
    if (!fieldToUpdate) {
      return res.status(400).send('Invalid category');
    }

    const positions = parseInt(openPositions, 10);
    if (isNaN(positions)) {
      return res.status(400).send('Invalid number for openPositions');
    }

    const result = await db.collection('jobboards').updateOne(
      { _id: new mongodb.ObjectId("67613fe1ca9cf7b5bebabf91") }, 
      { $set: { [fieldToUpdate]: positions } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send('No document found to update');
    }

    res.status(200).send('Job board updated successfully');
  } catch (error) {
    console.error('Error updating job board:', error);
    res.status(500).send('Error updating job board: ' + error.message);
  }
});


app.get('/jobboard-data', async (req, res) => {
  try {
    const jobBoard = await db.collection('jobboards').findOne(
      { _id: new mongodb.ObjectId("67613fe1ca9cf7b5bebabf91") } 
    );

    if (!jobBoard) {
      return res.status(404).send("Job board data not found");
    }

    // Return only the relevant fields
    const { Technology, SalesMarketing, Operations, HumanResources } = jobBoard;
    res.json({ Technology, SalesMarketing, Operations, HumanResources });
  } catch (error) {
    console.error("Error fetching job board data:", error);
    res.status(500).send("Error fetching job board data");
  }
});

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
