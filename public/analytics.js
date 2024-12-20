
(function() {
    function generateVisitorId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  
    let visitorId = localStorage.getItem('visitorId');
    console.log(visitorId);
    if (!visitorId) {
      visitorId = generateVisitorId();
      localStorage.setItem('visitorId', visitorId);
    }
  
    let startTime = Date.now();
    let hasBounced = true;
  
    function getTrafficSource() {
      const referrer = document.referrer;
      if (!referrer || referrer === '') return 'direct'; 
      if (referrer.includes('google.com')) return 'google';
      if (referrer.includes('facebook.com')) return 'facebook';
      if (referrer.includes('twitter.com')) return 'twitter';
      return 'other';
    }
  
    function sendAnalytics() {
      const timeOnPage = Date.now() - startTime;
      fetch('http://localhost:3000/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: window.location.pathname,
          timestamp: new Date().toISOString(),
          visitorId: visitorId,
          timeOnPage: timeOnPage,
          bounced: hasBounced,
          source: getTrafficSource()
        }),
      }).then(response => {
        if (!response.ok) {
          console.error('Failed to send analytics:', response.statusText);
        }
      })
      .catch(error => console.error('Error:', error));
    }
  
    // Send analytics data when the page is about to unload
    window.addEventListener('beforeunload', sendAnalytics);
  
    // Mark the visit as non-bounce after 30 seconds
    setTimeout(() => {
      hasBounced = false;
    }, 30000);
  
  })();
  
  