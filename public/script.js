// const hamburger = document.getElementById('hamburger');
// const navLinks = document.getElementById('nav-links');

// hamburger.addEventListener('click', () => {
//   console.log('Nav Button clicked');
//   navLinks.classList.toggle('active');
// });
// const hamburger = document.getElementById('hamburger');
// const navLinks = document.getElementById('nav-links');

// hamburger.addEventListener('click', () => {
//     console.log('Nav Button clicked');
//     navLinks.classList.toggle('active');
//     console.log(navLinks.classList); // Debugging line
// });
// const hamburger = document.getElementById('hamburger');
// const navLinks = document.getElementById('nav-links');

// hamburger.addEventListener('click', () => {
// console.log('Hamburger clicked');
// navLinks.classList.toggle('active');
// });
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.setAttribute('aria-expanded', !hamburger.getAttribute('aria-expanded') === 'true');
  navLinks.classList.toggle('active');
});
  

document.addEventListener("DOMContentLoaded", () => {
  AOS.init();
  emailjs.init("rkpynpwmbwkXF7tyZ"); // Replace with your actual public key
});

// show data
function setCondition(condition) {
  document
    .querySelectorAll(".section")
    .forEach((section) => section.classList.add("hidden"));
  const targetSection = document.getElementById(condition);
  targetSection.classList.remove("hidden");

  targetSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// send email
(function () {
  emailjs.init("rkpynpwmbwkXF7tyZ"); // Replace with your actual public key
})();
// Handle the form submission
document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    // Get form values
    var name = document.getElementById("namejs").value;
    var email = document.getElementById("emailjs").value;
    var message = document.getElementById("message").value;

    // Prepare the data to send to EmailJS
    var templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    // Log the data to verify
    console.log(templateParams);

    // Send the email using EmailJS
    emailjs.send("service_yvzqjh6", "template_xm45s8m", templateParams).then(
      async function (response) {
        console.log("Email sent successfully:", response);
        const savetodb = await fetch('/contactus' , {
          method: 'POST',
          body: JSON.stringify({
            from_name: name,
            from_email: email,
            message: message,
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if(savetodb.ok){
        document.getElementById("status").innerText =
          "Your message has been sent successfully!";

        // Reset form fields
        document.getElementById("namejs").value = "";
        document.getElementById("emailjs").value = "";
        document.getElementById("message").value = "";
        }else{
          document.getElementById("status").style = "color: red; "
          document.getElementById("status").innerText =
          "Error sending mail!";

        }
      },
      function (error) {
        console.log("Error sending email:", error);
        document.getElementById("status").style.color = "red";
        document.getElementById("status").innerText =
          "There was an error sending your message. Please try again later.";
      }
    );
  });

// async function fetchAndRenderResources() {
//   try {
//     const response = await fetch("/resources");
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json();

//     // Ensure 'resources' is defined in the response
//     if (!data.resources) {
//       throw new Error("Invalid response format: missing resources");
//     }

//     console.log("Fetched resources:", data.resources);

//     // Render the resources in your UI
//     renderResources(data.resources); // Update this function to manipulate the DOM
//   } catch (error) {
//     console.error("Error fetching resources:", error);
//   }
// }

// Example render function
// function renderResources(resources) {
//   const resourceContainer = document.getElementById("resourceContainer");
//   resourceContainer.innerHTML = ""; // Clear previous entries

//   resources.forEach((resource) => {
//     const resourceElement = document.createElement("div");
//     resourceElement.innerHTML = `
//       <img src="${resource.image}" alt="${resource.alt}">
//       <h3>${resource.title}</h3>
//       <p>${resource.tag}</p>
//       <a href="${resource.link}">Learn more</a>
//     `;
//     resourceContainer.appendChild(resourceElement);
//   });
// }

// // Call the function to fetch and render resources
// fetchAndRenderResources();

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
      console.log("Resource saved successfully");
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



// const applyjob = document.getElementById("applyjob");
// applyjob.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const formData = new FormData(applyjob); // Collect form data

//   try {
//     const response = await fetch("/applyjob", {
//       method: "POST",
//       body: formData, // Send form data directly
//     });

//     if (response.ok) {
//       console.log("Application submitted successfully");
//       alert("Application submitted successfully!");
//     } else {
//       alert("Error submitting the application");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("Error submitting the application");
//   }

//   applyjob.reset();
// });


// const applyjobForm = document.getElementById("applyjob");
// if (applyjobForm) {
// applyjobForm.addEventListener("submit", async (event) => {
//   event.preventDefault(); // Prevents the form from submitting the usual way (which causes redirection)

//   const formData = new FormData(applyjobForm);
  
//   try {
//     const response = await fetch("/applyjob", {
//       method: "POST",
//       body: formData, // Sending FormData directly to the server
//     });

//     if (response.ok) {
//       console.log("Application submitted successfully");
//       document.getElementById("apply-job").innerHTML = "<h3>Thank you for your application!</h3>";

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

// // Handle the form submission for updating positions
// document
//   .getElementById("update-positions-form")
//   .addEventListener("submit", function (event) {
//     event.preventDefault(); // Prevent the form from submitting normally

//     const category = document.getElementById("category").value;
//     const openPositions = document.getElementById("open-positions").value;

//     if (category && openPositions !== "") {
//       // Here, you would typically update the backend with the new positions
//       alert(`Updated ${category} with ${openPositions} open positions.`);

//       // Optionally, reset the form
//       this.reset();
//     }
//   });
document.addEventListener("DOMContentLoaded", () => {
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
  } else {
    console.log("The form with id 'update-positions-form' was not found in the DOM.");
  }
});

// Function to show the websiteAnalytics iframe
function showWebsiteAnalytics() {
  hideAllForms(); // Hide other forms
  document.getElementById("websiteAnalytics").style.display = "block"; // Show the analytics iframe
}





// document.querySelector('.btn-primary').addEventListener('click', () => {
//   document.getElementById('job-description').style.display = 'none';
//   document.getElementById('apply-job').style.display = 'block';
// });

// show apply job form
// document.addEventListener("DOMContentLoaded", function() {
//   const applyButton = document.querySelector(".btn.btn-primary");
//   const applyForm = document.getElementById("apply-job");

//   applyButton.addEventListener("click", function(event) {
//       event.preventDefault(); // Prevent default anchor behavior
//       applyForm.style.display = "block"; // Show the form
//       applyForm.scrollIntoView({ behavior: "smooth" }); // Scroll to the form
//       setTimeout(() => {
//           showJobDescription.scrollIntoView({ behavior: "smooth", block: "start" });
//       }, 50);
//   });
// });

//       // need resource
//       const resourcesData = [
//         {
//             image: "https://www.shutterstock.com/image-photo/authentication-by-facial-recognition-concept-260nw-1456783511.jpg",
//             alt: "Data visualization",
//             tag: "Brochure",
//             title: "Transform Experience across Stakeholder Spectrum with Cognitive Prior Authorization",
//             link: "#",
//         },
//         {
//             image: "https://www.shutterstock.com/image-photo/ai-brain-motif-centered-on-600w-2500501245.jpg",
//             alt: "Brain visualization",
//             tag: "Brochure",
//             title: "DeepInsights™ Model the World, Model the Mind",
//             link: "#",
//         },
//         {
//             image: "https://www.shutterstock.com/image-photo/technology-robot-robotic-engineering-connected-600w-1159539946.jpg",
//             alt: "Technology interface",
//             tag: "Brochure",
//             title: "Next-Gen Data Services Discover 360-degree Value in the Data-to-Action Journey",
//             link: "#",
//         },
//         {
//           image: "https://www.shutterstock.com/image-photo/technology-robot-robotic-engineering-connected-600w-1159539946.jpg",
//           alt: "Technology in  interface",
//           tag: "Brochure",
//           title: "Next-Gen Data Services Discover 360-degree Value in the Data-to-Action Journey",
//           link: "#",
//       },
//     ];

//       // resource
//       const resourcesGrid = document.getElementById("resourcesGrid");

// resourcesData.forEach((resource) => {
//     const resourceCard = `
//         <article class="resource-card" data-aos="fade-up" data-aos-offset="250" data-aos-easing="ease-in-sine">
//             <div class="resource-card__image">
//                 <img src="${resource.image}" alt="${resource.alt}">
//                 <span class="resource-card__tag">${resource.tag}</span>
//             </div>
//             <div class="resource-card__content">
//                 <h3 class="resource-card__title">${resource.title}</h3>
//                 <a href="${resource.link}" class="resource-card__link">KNOW MORE</a>
//             </div>
//         </article>
//     `;
//     resourcesGrid.innerHTML += resourceCard;
// });

// const fetchAndRenderResources = async () => {
//   try {
//     const response = await fetch('http://localhost:3000/resources')
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((error) => console.error('Error fetching resources:', error));

//     if (data.success) { // Check the 'success' field
//       const resourcesGrid = document.querySelector('.resources__grid');
//       resourcesGrid.innerHTML = ''; // Clear existing content

//       // Render each resource card
//       data.resources.forEach((resource) => {
//         const resourceCard = `
//           <article class="resource-card" data-aos="fade-up" data-aos-offset="250" data-aos-easing="ease-in-sine">
//             <div class="resource-card__image">
//               <img src="${resource.image}" alt="${resource.alt}">
//               <span class="resource-card__tag">${resource.tag}</span>
//             </div>
//             <div class="resource-card__content">
//               <h3 class="resource-card__title">${resource.title}</h3>
//               <a href="${resource.link}" class="resource-card__link">KNOW MORE</a>
//             </div>
//           </article>
//         `;
//         resourcesGrid.innerHTML += resourceCard;
//       });
//     } else {
//       console.error('Failed to fetch resources:', data.message);
//     }
//   } catch (error) {
//     console.error('Error fetching resources:', error);
//   }
// };

// // Initial fetch
// fetchAndRenderResources();

// const resourcesData = [
//   {
//       image: "https://www.shutterstock.com/image-photo/authentication-by-facial-recognition-concept-260nw-1456783511.jpg",
//       alt: "Data visualization",
//       tag: "Brochure",
//       title: "Transform Experience across Stakeholder Spectrum with Cognitive Prior Authorization",
//       link: "#",
//   },
//   {
//       image: "https://www.shutterstock.com/image-photo/ai-brain-motif-centered-on-600w-2500501245.jpg",
//       alt: "Brain visualization",
//       tag: "Brochure",
//       title: "DeepInsights™ Model the World, Model the Mind",
//       link: "#",
//   },
//   {
//       image: "https://www.shutterstock.com/image-photo/technology-robot-robotic-engineering-connected-600w-1159539946.jpg",
//       alt: "Technology interface",
//       tag: "Brochure",
//       title: "Next-Gen Data Services Discover 360-degree Value in the Data-to-Action Journey",
//       link: "#",
//   },
//   {
//       image: "https://www.shutterstock.com/image-photo/technology-robot-robotic-engineering-connected-600w-1159539946.jpg",
//       alt: "Technology in interface",
//       tag: "Brochure",
//       title: "Next-Gen Data Services Discover 360-degree Value in the Data-to-Action Journey",
//       link: "#",
//   },
// ];

// // Function to render a single resource card
// const renderResourceCard = (resource) => {
//   const resourceCard = `
//       <article class="resource-card" data-aos="fade-up" data-aos-offset="250" data-aos-easing="ease-in-sine">
//           <div class="resource-card__image">
//               <img src="${resource.image}" alt="${resource.alt}">
//               <span class="resource-card__tag">${resource.tag}</span>
//           </div>
//           <div class="resource-card__content">
//               <h3 class="resource-card__title">${resource.title}</h3>
//               <a href="${resource.link}" class="resource-card__link">KNOW MORE</a>
//           </div>
//       </article>
//   `;
//   resourcesGrid.innerHTML += resourceCard; // Append new card
// };

// // Initially render all resources from resourcesData
// resourcesData.forEach((resource) => {
//   renderResourceCard(resource);
// });
