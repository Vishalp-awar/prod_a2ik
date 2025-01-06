const emaildatavar = {};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch email data
    await fetch('/api/emailjs')
      .then(response => response.json())
      .then(data => {
        emaildatavar.EMAILJS_PUBLIC_KEY = data.EMAILJS_PUBLIC_KEY;
        emaildatavar.EMAILJS_SERVICE_ID = data.EMAILJS_SERVICE_ID;
        emaildatavar.EMAILJS_TEMPLATE_ID = data.EMAILJS_TEMPLATE_ID;

      })
      .catch(error => {
        console.error('Error fetching email data:', error);
        throw new Error('Failed to initialize email data.');
      });

    // Initialize AOS and EmailJS after fetching data
    AOS.init();
    emailjs.init(emaildatavar.EMAILJS_PUBLIC_KEY); // Now the key is available
  } catch (error) {
    console.error('Initialization failed:', error);
  }
});

// Handle form submission
document.getElementById("contact-form").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get form values
  const name = document.getElementById("namejs").value;
  const email = document.getElementById("emailjs").value;
  const message = document.getElementById("message").value;

  // Prepare the data for EmailJS
  const templateParams = {
    from_name: name,
    from_email: email,
    message: message,
  };


  try {
    // Send the email using EmailJS
    const response = await emaildatavar.send(
        emaildatavar.EMAILJS_SERVICE_ID,
        emaildatavar.EMAILJS_TEMPLATE_ID,
      templateParams
    );

    

    // Save to the database
    const savetodb = await fetch('/api/contactus', {
      method: 'POST',
      body: JSON.stringify(templateParams),
      headers: { 'Content-Type': 'application/json' },
    });

    if (savetodb.ok) {
      document.getElementById("status").innerText =
        "Your message has been sent successfully!";
      document.getElementById("namejs").value = "";
      document.getElementById("emailjs").value = "";
      document.getElementById("message").value = "";
    } else {
      throw new Error('Failed to save message to database.');
    }
  } catch (error) {
    console.error('Error sending email or saving to DB:', error);
    document.getElementById("status").style.color = "red";
    document.getElementById("status").innerText =
      "There was an error sending your message. Please try again later.";
  }
});

