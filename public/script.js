const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.setAttribute('aria-expanded', !hamburger.getAttribute('aria-expanded') === 'true');
  navLinks.classList.toggle('active');
});
const emaildata = {};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch email data
    await fetch('/emailjs')
      .then(response => response.json())
      .then(data => {
        emaildata.EMAILJS_PUBLIC_KEY = data.EMAILJS_PUBLIC_KEY;
        emaildata.EMAILJS_SERVICE_ID = data.EMAILJS_SERVICE_ID;
        emaildata.EMAILJS_TEMPLATE_ID = data.EMAILJS_TEMPLATE_ID;

      })
      .catch(error => {
        console.error('Error fetching email data:', error);
        throw new Error('Failed to initialize email data.');
      });

    // Initialize AOS and EmailJS after fetching data
    AOS.init();
    emailjs.init(emaildata.EMAILJS_PUBLIC_KEY); // Now the key is available
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
    const response = await emailjs.send(
      emaildata.EMAILJS_SERVICE_ID,
      emaildata.EMAILJS_TEMPLATE_ID,
      templateParams
    );

    

    // Save to the database
    const savetodb = await fetch('/contactus', {
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


const resourceForm = document.getElementById("resourceForm");
const resourcesGrid = document.getElementById("resourcesGrid");

// Handle form submission
resourceForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Gather form data
  const formData = new FormData(resourceForm);
  const newResource = {
    image: formData.get("image"),
    alt: formData.get("alt"),
    tag: formData.get("tag"),
    title: formData.get("title"),
    link: formData.get("link"),
  };

  try {
    const response = await fetch("/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newResource),
    });

    if (response.ok) {
      // console.log("Resource saved successfully");
      // Handle successful response...
    } else {
      alert("Error saving the resource");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error saving the resource");
  }
  // Clear the form
  resourceForm.reset();
});

const applyjobForm = document.getElementById("applyjob");
if (applyjobForm) {
applyjobForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevents the form from submitting the usual way (which causes redirection)

  const formData = new FormData(applyjobForm);
  
  try {
    const response = await fetch("/applyjob", {
      method: "POST",
      body: formData, // Sending FormData directly to the server
    });

    if (response.ok) {
    
      alert("Application submitted successfully!");
    } else {
      alert("Failed to submit application");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while submitting the application");
  }

  applyjobForm.reset(); // Reset the form after submission
});
};











document.querySelectorAll(".job-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const jobId = e.target.dataset.jobId;
    // Fetch job details based on jobId (mock for now)
    document.getElementById("job-description").style.display = "block";
    document.getElementById("apply-job").style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to all job links
  const jobLinks = document.querySelectorAll(".job-link");

  jobLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default anchor behavior

      // Get the corresponding h4 text
      const jobCard = this.closest(".job-card");
      const jobTitle = jobCard.querySelector("h4").textContent;

      // Update the job title in the Job Description section
      const jobTitleElement = document.querySelector("#job-title");
      jobTitleElement.textContent = jobTitle;

      // Show the job description section
      const showJobDescription = document.getElementById("job-description");
      showJobDescription.style.display = "block";

      // Ensure page layout updates before scrolling
      setTimeout(() => {
        showJobDescription.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    });
  });
});

const addjobForm = document.getElementById("addjob");
if(addjobForm){
addjobForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(addjobForm);
  const newResource = Object.fromEntries(formData);

  try {
    const response = await fetch("/addjob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newResource),
    });

    if (response.ok) {
      console.log("Job posted successfully");
      alert("Job posted successfully");
      addjobForm.reset();
    } else {
      const errorText = await response.text();
      console.error("Error saving the job:", errorText);
      alert("Error saving the job: " + errorText);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error saving the job: " + error.message);
  }
});
};
// Function to hide all forms
function hideAllForms() {
  // Hide all forms by selecting them with querySelectorAll
  document
    .querySelectorAll(
      ".form-container, .job-posting-form, .update-positions-form"
    )
    .forEach((form) => {
      form.style.display = "none";
    });
  document.getElementById("websiteAnalytics").style.display = "none";
}

// Function to show a specific form based on its ID
function showForm(formId) {
  // Hide all forms first
  hideAllForms();

  // Show the desired form by ID
  const form = document.getElementById(formId);
  if (form) {
    form.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  event.preventDefault()
  const updatePositionsForm = document.getElementById("update-positions-form");

  // Check if the form exists before attaching the event listener
  if (updatePositionsForm) {
    updatePositionsForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from submitting normally

      const category = document.getElementById("category").value;
      const openPositions = document.getElementById("open-positions").value;

      if (category && openPositions !== "") {
        // Here, you would typically update the backend with the new positions
        alert(`Updated ${category} with ${openPositions} open positions.`);

        // Optionally, reset the form
        this.reset();
      }
    });
  }
});

// Function to show the websiteAnalytics iframe
function showWebsiteAnalytics() {
  hideAllForms(); // Hide other forms
  document.getElementById("websiteAnalytics").style.display = "block"; // Show the analytics iframe
}



