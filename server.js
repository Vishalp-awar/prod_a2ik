
require('dotenv').config();
const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const MongoClient = mongodb.MongoClient;

app.use(cors());
app.use(express.json());

let db;

MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    db = client.db('analytics');
  })
  .catch(error => console.error(error));

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
      page.avgTime = (page.avgTime / 1000).toFixed(2); // Convert to seconds
    });

    const last6Months = Array.from({length: 6}, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toISOString().slice(0, 7); // YYYY-MM format
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

