// // const hamburger = document.getElementById('hamburger');
// // const navLinks = document.getElementById('nav-links');

// // hamburger.addEventListener('click', () => {
// //   hamburger.setAttribute('aria-expanded', !hamburger.getAttribute('aria-expanded') === 'true');
// //   navLinks.classList.toggle('active');
// // });
// const hamburger = document.getElementById('hamburger');
// const navLinks = document.getElementById('nav-links');

// // Function to add the event listener for hamburger toggle
// const addHamburgerEventListener = () => {
//   if (hamburger) {
//     hamburger.addEventListener('click', () => {
//       // Toggle the aria-expanded attribute
//       const currentExpanded = hamburger.getAttribute('aria-expanded') === 'true';
//       hamburger.setAttribute('aria-expanded', !currentExpanded);
//       navLinks.classList.toggle('active');
//     });
//   }
// };

// // Media query to detect mobile view (adjust the max-width as needed)
// const mobileViewQuery = window.matchMedia('(max-width: 768px)');

// // Function to handle mobile view and add event listener
// const handleMobileView = (event) => {
//   if (event.matches) {
//     // Mobile view: add the event listener
//     addHamburgerEventListener();
//   } else {
//     // Not mobile view: remove event listener (if needed, to prevent memory leaks)
//     hamburger.removeEventListener('click', addHamburgerEventListener);
//   }
// };

// // Initial check and set up
// handleMobileView(mobileViewQuery);

// // Add listener for changes in the viewport
// mobileViewQuery.addEventListener('change', handleMobileView);

// const resourceForm = document.getElementById("resourceForm");
// const resourcesGrid = document.getElementById("resourcesGrid");

// // Handle form submission'
// if(resourceForm){
// resourceForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   // Gather form data
//   const formData = new FormData(resourceForm);
//   const newResource = {
//     image: formData.get("image"),
//     alt: formData.get("alt"),
//     tag: formData.get("tag"),
//     title: formData.get("title"),
//     link: formData.get("link"),
//   };

//   try {
//     const response = await fetch("/api/resources", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newResource),
//     });

//     if (response.ok) {
//       // console.log("Resource saved successfully");
//       // Handle successful response...
//     } else {
//       alert("Error saving the resource");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("Error saving the resource");
//   }
//   // Clear the form
//   resourceForm.reset();
// });
// }
// const applyjobForm = document.getElementById("applyjob");
// if (applyjobForm) {
// applyjobForm.addEventListener("submit", async (event) => {
//   event.preventDefault(); // Prevents the form from submitting the usual way (which causes redirection)

//   const formData = new FormData(applyjobForm);
  
//   try {
//     const response = await fetch("/api/applyjob", {
//       method: "POST",
//       body: formData, // Sending FormData directly to the server
//     });

//     if (response.ok) {
    
//       alert("Application submitted successfully!");
//     } else {
//       alert("Failed to submit application");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("An error occurred while submitting the application");
//   }

//   applyjobForm.reset(); // Reset the form after submission
// });
// };











// document.querySelectorAll(".job-link").forEach((link) => {
//   link.addEventListener("click", (e) => {
//     e.preventDefault();
//     const jobId = e.target.dataset.jobId;
//     // Fetch job details based on jobId (mock for now)
//     document.getElementById("job-description").style.display = "block";
//     document.getElementById("apply-job").style.display = "none";
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   // Add event listener to all job links
//   const jobLinks = document.querySelectorAll(".job-link");

//   jobLinks.forEach((link) => {
//     link.addEventListener("click", function (event) {
//       event.preventDefault(); // Prevent default anchor behavior

//       // Get the corresponding h4 text
//       const jobCard = this.closest(".job-card");
//       const jobTitle = jobCard.querySelector("h4").textContent;

//       // Update the job title in the Job Description section
//       const jobTitleElement = document.querySelector("#job-title");
//       jobTitleElement.textContent = jobTitle;

//       // Show the job description section
//       const showJobDescription = document.getElementById("job-description");
//       showJobDescription.style.display = "block";

//       // Ensure page layout updates before scrolling
//       setTimeout(() => {
//         showJobDescription.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }, 50);
//     });
//   });
// });

// const addjobForm = document.getElementById("addjob");
// if(addjobForm){
// addjobForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const formData = new FormData(addjobForm);
//   const newResource = Object.fromEntries(formData);

//   try {
//     const response = await fetch("/api/addjob", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newResource),
//     });

//     if (response.ok) {
//       console.log("Job posted successfully");
//       alert("Job posted successfully");
//       addjobForm.reset();
//     } else {
//       const errorText = await response.text();
//       console.error("Error saving the job:", errorText);
//       alert("Error saving the job: " + errorText);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("Error saving the job: " + error.message);
//   }
// });
// };
// // Function to hide all forms
// function hideAllForms() {
//   // Hide all forms by selecting them with querySelectorAll
//   document
//     .querySelectorAll(
//       ".form-container, .job-posting-form, .update-positions-form"
//     )
//     .forEach((form) => {
//       form.style.display = "none";
//     });
//   document.getElementById("websiteAnalytics").style.display = "none";
// }

// // Function to show a specific form based on its ID
// function showForm(formId) {
//   // Hide all forms first
//   hideAllForms();

//   // Show the desired form by ID
//   const form = document.getElementById(formId);
//   if (form) {
//     form.style.display = "block";
//   }
// }

// document.addEventListener("DOMContentLoaded", (event) => {
//   event.preventDefault()
//   const updatePositionsForm = document.getElementById("update-positions-form");

//   // Check if the form exists before attaching the event listener
//   if (updatePositionsForm) {
//     updatePositionsForm.addEventListener("submit", function (event) {
//       event.preventDefault(); // Prevent the form from submitting normally

//       const category = document.getElementById("category").value;
//       const openPositions = document.getElementById("open-positions").value;

//       if (category && openPositions !== "") {
//         // Here, you would typically update the backend with the new positions
//         alert(`Updated ${category} with ${openPositions} open positions.`);

//         // Optionally, reset the form
//         this.reset();
//       }
//     });
//   }
// });

// // Function to show the websiteAnalytics iframe
// function showWebsiteAnalytics() {
//   hideAllForms(); // Hide other forms
//   document.getElementById("websiteAnalytics").style.display = "block"; // Show the analytics iframe
// }
// Utility function for DOM element selection
function setCondition(serviceId) {
  // Hide all sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.add('hidden'));

  // Show the selected section
  const selectedSection = document.getElementById(serviceId);
  if (selectedSection) {
    selectedSection.classList.remove('hidden');
    // Scroll to the selected section
    selectedSection.scrollIntoView({
      behavior: 'smooth', // Smooth scrolling
      block: 'start',     // Align to the top of the section
    });
  } else {
    console.error(`Section with ID "${serviceId}" not found.`);
  }
}

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Hamburger menu functionality
const setupHamburgerMenu = () => {
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');

  if (hamburger && navLinks) {
    const toggleMenu = () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);

    // Media query for mobile view
    const mobileViewQuery = window.matchMedia('(max-width: 768px)');
    const handleMobileView = (event) => {
      if (!event.matches) {
        hamburger.removeEventListener('click', toggleMenu);
      } else {
        hamburger.addEventListener('click', toggleMenu);
      }
    };

    mobileViewQuery.addListener(handleMobileView);
    handleMobileView(mobileViewQuery);
  }
};

// Form submission helper
const submitForm = async (url, formData, successMessage) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (response.ok) {
      alert(successMessage);
      return true;
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
    return false;
  }
};

// Setup form submissions
const setupForms = () => {
  const forms = {
    resourceForm: { url: '/api/resources', success: 'Resource saved successfully' },
    applyjob: { url: '/api/applyjob', success: 'Application submitted successfully!' },
    addjob: { url: '/api/addjob', success: 'Job posted successfully' },
  };

  Object.entries(forms).forEach(([formId, { url, success }]) => {
    const form = $(`#${formId}`);
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        if (await submitForm(url, formData, success)) {
          form.reset();
        }
      });
    }
  });
};

// Job listing functionality
const setupJobListings = () => {
  $$('.job-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const jobCard = e.target.closest('.job-card');
      const jobTitle = jobCard.querySelector('h4').textContent;
      $('#job-title').textContent = jobTitle;
      $('#job-description').style.display = 'block';
      $('#apply-job').style.display = 'none';
      setTimeout(() => {
        $('#job-description').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  });
};

// Form visibility management
const setupFormVisibility = () => {
  const hideAllForms = () => {
    $$('.form-container, .job-posting-form, .update-positions-form, #websiteAnalytics').forEach(el => el.style.display = 'none');
  };

  window.showForm = (formId) => {
    hideAllForms();
    document.getElementById(formId).style.display = 'block';
};


  window.showWebsiteAnalytics = () => {
    hideAllForms();
    $('#websiteAnalytics').style.display = 'block';
  };
};

// Update positions form
const setupUpdatePositionsForm = () => {
  const form = $('#update-positions-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const category = $('#category').value;
      const openPositions = $('#open-positions').value;
      if (category && openPositions !== '') {
        alert(`Updated ${category} with ${openPositions} open positions.`);
        form.reset();
      }
    });
  }
};

// Main initialization function
const initializeApp = () => {
  setupHamburgerMenu();
  setupForms();
  setupJobListings();
  setupFormVisibility();
  setupUpdatePositionsForm();
};

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);




