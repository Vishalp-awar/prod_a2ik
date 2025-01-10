// // Function to handle resource update
// function handleResourceUpdate() {
//     const updateResourceForm = document.getElementById("updateResourceForm");
  
//     updateResourceForm.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const formData = new FormData(updateResourceForm);
  
//       try {
//         const response = await fetch("/resources", {
//           method: "PUT",
//           body: formData,
//         });
  
//         if (response.ok) {
//           alert("Resource updated successfully!");
//         } else {
//           alert("Error updating the resource.");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Error updating the resource.");
//       }
  
//       updateResourceForm.reset();
//     });
//   }
  
//   // Function to handle article deletion
//   function handleArticleDelete() {
//     const deleteArticleForm = document.getElementById("deleteArticleForm");
  
//     deleteArticleForm.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const resourceId = document.getElementById("deleteArticletitle").value;
  
//       console.log("Selected Resource ID:", resourceId);
  
//       if (!resourceId) {
//         alert("Please select a resource to delete.");
//         return;
//       }
  
//       try {
//         const response = await fetch("/resources", {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ resourceId }),
//         });
  
//         if (response.ok) {
//           alert("Resource deleted successfully!");
//         } else {
//           alert("Error deleting the resource.");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Error deleting the resource.");
//       }
  
//       deleteArticleForm.reset();
//     });
//   }
  
//   // Function to handle job update
//   function handleJobUpdate() {
//     const updatejob = document.getElementById("updatejob");
  
//     updatejob.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const formData = new FormData(updatejob);
//       const formObject = {};
//       formData.forEach((value, key) => {
//         formObject[key] = value;
//       });
  
//       try {
//         const response = await fetch("/addjob", {
//           method: "PUT",
//           body: JSON.stringify(formObject),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
  
//         if (response.ok) {
//           alert("Job updated successfully!");
//         } else {
//           alert("Error updating the job.");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Error updating the job.");
//       }
  
//       updatejob.reset();
//     });
//   }
  
//   // Function to handle job deletion
//   function handleJobDelete() {
//     const deletejobForm = document.getElementById("deletejobForm");
  
//     deletejobForm.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const jobTitle = document.getElementById("deletejobTitle").value;
  
//       if (!jobTitle) {
//         alert("Please select a job to delete.");
//         return;
//       }
  
//       try {
//         const response = await fetch("/addjob", {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ jobTitle }),
//         });
  
//         if (response.ok) {
//           alert("Job deleted successfully!");
//           deletejobForm.reset();
//         } else {
//           const errorText = await response.text();
//           console.error("Error deleting job:", errorText);
//           alert("Error deleting job: " + errorText);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Error deleting the job.");
//       }
//     });
//   }
  
//   // Function to toggle article form visibility
//   function ArticletoggleForm() {
//     const option = document.getElementById("ArticleOption").value;
//     document.getElementById("addnewArticle").style.display = "none";
//     document.getElementById("updateResource").style.display = "none";
//     document.getElementById("deleteArticle").style.display = "none";
  
//     if (option === "add") {
//       document.getElementById("addnewArticle").style.display = "block";
//     } else if (option === "update") {
//       document.getElementById("updateResource").style.display = "block";
//     } else if (option === "delete") {
//       document.getElementById("deleteArticle").style.display = "block";
//     }
//   }
  
//   // Function to toggle job form visibility
//   function toggleForm() {
//     const option = document.getElementById("jobOption").value;
//     console.log(option + "  option selected");
//     document.getElementById("addjob").style.display = "none";
//     document.getElementById("updatejobmain").style.display = "none";
//     document.getElementById("deletejobContainer").style.display = "none";
  
//     if (option === "add") {
//       document.getElementById("addjob").style.display = "block";
//     } else if (option === "update") {
//       document.getElementById("updatejobmain").style.display = "block";
//     } else if (option === "delete") {
//       document.getElementById("deletejobContainer").style.display = "block";
//     }
//   }
  
//   // Function to toggle job board form visibility
//   function togglejobboardForm() {
//     const option = document.getElementById("jobboardOption").value;
//     document.getElementById("addjobboards").style.display = "none";
//     document.getElementById("updatejobboards").style.display = "none";
//     document.getElementById("deletejobboards").style.display = "none";
  
//     if (option === "add") {
//       document.getElementById("addjobboards").style.display = "block";
//     } else if (option === "update") {
//       document.getElementById("updatejobboards").style.display = "block";
//     } else if (option === "delete") {
//       document.getElementById("deletejobboards").style.display = "block";
//     }
//   }
  
//   // Function to handle hamburger menu
//   function handleHamburgerMenu() {
//     const hamburger = document.getElementById('hamburger');
//     const navLinks = document.getElementById('nav-links');
  
//     hamburger.addEventListener('click', () => {
//       console.log('Hamburger clicked');
//       navLinks.classList.toggle('active');
//     });
//   }
  
//   // Function to show website analytics
//   function showWebsiteAnalytics() {
//     hideAllForms();
//     document.getElementById('websiteAnalytics').style.display = 'block';
//   }
  
//   // Function to handle resource form submission
//   function handleResourceFormSubmission() {
//     const resourceForm = document.getElementById("resourceForm");
  
//     resourceForm.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const formData = new FormData(resourceForm);
  
//       try {
//         const response = await fetch("http://localhost:3000/resources", {
//           method: "POST",
//           body: formData,
//         });
  
//         if (response.ok) {
//           console.log("Resource saved successfully");
//           alert("Resource added successfully!");
//           resourceForm.reset();
//         } else {
//           const error = await response.text();
//           alert("Error saving the resource: " + error);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("An unexpected error occurred.");
//       }
//     });
//   }
  
//   // Function to handle job board form submission
//   function handleJobBoardFormSubmission() {
//     const addjobboardsform = document.getElementById("addjobboardsform");
  
//     addjobboardsform.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const formData = new FormData(addjobboardsform);
//       const newField = Object.fromEntries(formData);
//       newField.openposition = newField.openPositions;
//       delete newField.openPositions;
//       console.log("Formatted Data:", newField);
  
//       try {
//         const response = await fetch("http://localhost:3000/jobboard", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(newField),
//         });
  
//         if (response.ok) {
//           alert("jobboard Added successfully!");
//           addjobboardsform.reset();
//         } else {
//           const errorText = await response.text();
//           console.error("Error while Adding jobboard:", errorText);
//           alert("Error while Adding jobboard: " + errorText);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Error Added field: " + error.message);
//       }
//     });
//   }
  
//   // Function to handle job board update
//   function handleJobBoardUpdate() {
//     const updatepositionsform = document.getElementById("updatepositionsform");
  
//     updatepositionsform.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const formData = new FormData(updatepositionsform);
//       const newField = Object.fromEntries(formData);
//       newField.openposition = newField.openPositions;
//       delete newField.openPositions;
//       console.log("Formatted Data:", newField);
  
//       try {
//         const response = await fetch("http://localhost:3000/jobboard", {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(newField),
//         });
  
//         if (response.ok) {
//           console.log("Field Updating successfully");
//           alert("Field Updating successfully!");
//           updatepositionsform.reset();
//         } else {
//           const errorText = await response.text();
//           console.error("Error Updating field:", errorText);
//           alert("Error Updating field: " + errorText);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Error Updating field: " + error.message);
//       }
//     });
//   }
  
//   // Function to handle job board deletion
//   function handleJobBoardDeletion() {
//     const deletejobboardsform = document.getElementById("deletejobboardsform");
  
//     deletejobboardsform.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const categorySelectDelete = document.getElementById("category");
//       const selectedOption = categorySelectDelete.options[categorySelectDelete.selectedIndex];
//       const category = selectedOption.value;
  
//       if (!category) {
//         alert("No category selected!");
//         return;
//       }
  
//       console.log("Selected Category:", category);
  
//       try {
//         const response = await fetch("/jobboard", {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ category }),
//         });
  
//         if (response.ok) {
//           console.log("Job board deleted successfully");
//           alert("Job board deleted successfully!");
//           deletejobboardsform.reset();
//           selectedOption.remove();
//         } else {
//           const errorText = await response.text();
//           console.error("Error deleting job board:", errorText);
//           alert("Error deleting job board: " + errorText);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Error deleting job board: " + error.message);
//       }
//     });
//   }
  
//   // Function to hide all forms
//   function hideAllForms() {
//     document.querySelectorAll('.form-container, .form-container1, .job-posting-form, .update-positions-form').forEach((form) => {
//       form.style.display = 'none';
//     });
//     document.getElementById('websiteAnalytics').style.display = 'none';
//   }
  
//   // Function to show a specific form
//   function showForm(formId) {
//     hideAllForms();
//     const form = document.getElementById(formId);
//     if (form) {
//       form.style.display = 'block';
//     }
//   }
  
//   // Function to handle logout
//   function handleLogout() {
//     document.getElementById('logoutButton').addEventListener('click', async () => {
//       const response = await fetch('/logout', { method: 'GET' });
//       if (response.ok) {
//         window.location.href = '/login';
//       } else {
//         alert('Logout failed.');
//       }
//     });
//   }
  
//   // Function to fetch and render applicants
//   async function getApplicants() {
//     try {
//       const response = await fetch('/applyjob', { method: 'GET' });
//       if (!response.ok) {
//         throw new Error('Failed to fetch applicants');
//       }
//       const applicants = await response.json();
//       renderApplicants(applicants);
//     } catch (error) {
//       console.error('Error fetching applicants:', error);
//     }
//   }
  
//   // Function to render applicants
//   function renderApplicants(applicants) {
//     const tableBody = document.getElementById('applicantTableBody');
//     tableBody.innerHTML = '';
  
//     applicants.forEach(applicant => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${applicant.fullname}</td>
//         <td>${applicant.email}</td>
//         <td>${applicant.phone}</td>
//         <td><a href="${applicant.resume}" target="_blank">View Resume</a></td>
//         <td>${applicant.coverletter}</td>
//         <td>${applicant.jobTitle}</td>
//       `;
//       tableBody.appendChild(row);
//     });
//   }
  
//   // Function to fetch and render contact submissions
//   async function fetchAndRenderContactSubmissions() {
//     try {
      
//     const responseContactUs = await fetch("http://localhost:3000/contactus");
//     if (!responseContactUs.ok) {
//       throw new Error(
//         `Failed to fetch contact submissions: ${responseContactUs.statusText}`
//       );
//     }

//     const dataContactUs = await responseContactUs.json();

//     // Validate the structure of the contact submissions data
//     if (!dataContactUs.success || !Array.isArray(dataContactUs.submissions)) {
//       throw new Error("Invalid contact submissions data format");
//     }

//     // Map the submissions to ensure the correct data format if needed
//     const submissions = dataContactUs.submissions.map((submission) => ({
//       ...submission,
//       _id: submission._id?.toString(), // Convert _id to string if needed
//     }));
//       const tableBody = document.getElementById('contactSubmissionTableBody');
//       tableBody.innerHTML = '';
//       submissions.forEach(submission => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//           <td>${submission.from_name}</td>
//           <td>${submission.from_email}</td>
//           <td>${submission.message}</td>
//         `;
//         tableBody.appendChild(row);
//       });
//     } catch (error) {
//       console.error('Error fetching contact submissions:', error);
//       alert('Failed to load contact submissions. Please try again later.');
//     }
//   }
  
//   // Initialize all functions
//   function init() {
//     handleResourceUpdate();
//     handleArticleDelete();
//     handleJobUpdate();
//     handleJobDelete();
//     handleHamburgerMenu();
//     handleResourceFormSubmission();
//     handleJobBoardFormSubmission();
//     handleJobBoardUpdate();
//     handleJobBoardDeletion();
//     handleLogout();
//     getApplicants();
//     fetchAndRenderContactSubmissions();
//     AOS.init();
//   }
  
//   // Call the init function when the DOM is fully loaded
//   document.addEventListener('DOMContentLoaded', init);
// Utility functions


const updateResourceForm = document.getElementById("updateResourceForm");

updateResourceForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Gather form data
  const formData = new FormData(updateResourceForm);

  try {
    const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/resources`;
 
   
    const response = await fetch(apiUrl, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      alert("Resource updated successfully!");
      // Handle successful response (e.g., reload page or reset form)...
    } else {
      alert("Error updating the resource.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error updating the resource.");
  }

  // Reset the form
  updateResourceForm.reset();
});


const deleteArticleForm = document.getElementById("deleteArticleForm");

deleteArticleForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get the selected resource ID
  const resourceId = document.getElementById("deleteArticletitle").value;

  // Debug: Check if resourceId is fetched correctly
  console.log("Selected Resource ID:", resourceId);

  if (!resourceId) {
    alert("Please select a resource to delete.");
    return;
  }

  try {
 
 const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/resources`;
   
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resourceId }),
    });

    if (response.ok) {
      alert("Resource deleted successfully!");
      // Reload the page or update UI dynamically
    } else {
      alert("Error deleting the resource.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error deleting the resource.");
  }

  // Reset the form
  deleteArticleForm.reset();
});




const updatejob = document.getElementById("updatejob");

updatejob.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Gather form data
  const formData = new FormData(updatejob);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  try {
    
  
 const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/addjob`;
   console.log(apiUrl);
    const response = await fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify(formObject),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Job updated successfully!");
      // Handle successful response (e.g., reload page or reset form)...
    } else {
      alert("Error updating the job.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error updating the job.");
  }

  // Reset the form
  updatejob.reset();
});

const deletejobForm = document.getElementById("deletejobForm");

deletejobForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get the selected job title
  const jobTitle = document.getElementById("deletejobTitle").value;

  if (!jobTitle || jobTitle === "") {
    alert("Please select a job to delete.");
    return;
  }

  try {
 

    const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/addjob`;
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobTitle }),
    });
    
    if (response.ok) {
      alert("Job deleted successfully!");
      deletejobForm.reset();
    } else {
      const errorText = await response.text();
      console.error("Error deleting job:", errorText);
      alert("Error deleting job: " + errorText);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error deleting the job.");
  }
});


function ArticletoggleForm() {
  const option = document.getElementById("ArticleOption").value;

  // Hide all forms initially
  document.getElementById("addnewArticle").style.display = "none";
  document.getElementById("updateResource").style.display = "none";
  document.getElementById("deleteArticle").style.display = "none";

  // Show the selected form based on the option
  if (option === "add") {
    document.getElementById("addnewArticle").style.display = "block";
  } else if (option === "update") {
    document.getElementById("updateResource").style.display = "block";
  } else if (option === "delete") {
    document.getElementById("deleteArticle").style.display = "block";
  }
}


function toggleForm() {
  const option = document.getElementById("jobOption").value;
  console.log(option + "  option selecyed")
  // Hide all forms initially
  document.getElementById("addjob").style.display = "none";
  document.getElementById("updatejobmain").style.display = "none";
  document.getElementById("deletejobContainer").style.display = "none";

  // Show the selected form
  if (option === "add") {
    document.getElementById("addjob").style.display = "block";
  } else if (option === "update") {
    document.getElementById("updatejobmain").style.display = "block";
  } else if (option === "delete") {
    document.getElementById("deletejobContainer").style.display = "block";
  } else if (option === "none") {
    document.getElementById("addjob").style.display = "none";
    document.getElementById("updatejobmain").style.display = "none";
    document.getElementById("deletejobContainer").style.display = "none";
  }
}


function togglejobboardForm() {
  const option = document.getElementById("jobboardOption").value;

  // Hide all forms initially
  document.getElementById("addjobboards").style.display = "none";
  document.getElementById("updatejobboards").style.display = "none";
  document.getElementById("deletejobboards").style.display = "none";

  // Show the selected form
  if (option === "add") {
    document.getElementById("addjobboards").style.display = "block";
  } else if (option === "update") {
    document.getElementById("updatejobboards").style.display = "block";
  } else if (option === "delete") {
    document.getElementById("deletejobboards").style.display = "block";
  }
}



const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  console.log('Hamburger clicked');
  navLinks.classList.toggle('active');
});


// Function to show the websiteAnalytics iframe
function showWebsiteAnalytics() {
  hideAllForms(); // Hide other forms
  document.getElementById('websiteAnalytics').style.display = 'block'; // Show the analytics iframe
}

document.addEventListener("DOMContentLoaded", () => {
  // Get the delete form
  const deleteForm = document.getElementById("deletejobboardsform");

  if (!deleteForm) {
    console.error("Delete form not found.");
    return;
  }

  // Get the category select element within the delete form
  const categorySelect = deleteForm.querySelector("#category");

  if (!categorySelect) {
    console.error("Category select element not found in delete form.");
    return;
  }

  // Log the selected category when the dropdown value changes
  categorySelect.addEventListener("change", () => {
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const selectedValue = selectedOption.value;
    const selectedId = selectedOption.getAttribute("data-id");

    console.log(`Selected Value: ${selectedValue}, Selected ID: ${selectedId}`);
  });

  // Handle form submission
  deleteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const selectedValue = selectedOption.value;

    // Log the selected category before sending the API request
    console.log(`Submitting delete request for category: ${selectedValue}`);

    if (!selectedValue) {
      alert("Please select a category to delete.");
      return;
    }

    // Prepare the payload for deletion
    const payload = {
      category: selectedValue,
    };

    // Ensure BASE_URL and PORT are available
    const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/jobboard`;

    try {
      // Send DELETE request
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete job board: ${response.statusText}`);
      }

      const result = await response.text();

      alert("Job board deleted successfully!");

      // Remove the deleted category from the dropdown
      categorySelect.remove(categorySelect.selectedIndex);

      console.log("Deleted successfully:", result);
    } catch (error) {
      console.error("Error during delete operation:", error.message);
      alert("Failed to delete the job board. Please try again.");
    }
  });
});


const resourceForm = document.getElementById("resourceForm");
const resourcesGrid = document.getElementById("resourcesGrid");

// Function to render a single resource card




// Handle form submission
resourceForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Gather form data
  const formData = new FormData(resourceForm);

  try {

  const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/resources`;

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData, // Send FormData directly
    });

    if (response.ok) {
      console.log("Resource saved successfully");
      alert("Resource added successfully!");
      // Optionally, reset the form or update the UI
      resourceForm.reset();
    } else {
      const error = await response.text();
      alert("Error saving the resource: " + error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An unexpected error occurred.");
  }
});




//add jobboard
const addjobboardsform = document.getElementById("addjobboardsform");

addjobboardsform.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get the form data
  const formData = new FormData(addjobboardsform);
  const newField = Object.fromEntries(formData);

  // Rename "openPositions" to "openposition" to match backend expectation
  newField.openposition = newField.openPositions; // Map it correctly
  delete newField.openPositions; // Remove the old key
  console.log("Formatted Data:", newField);

  try {
    // Make the API call

 const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/jobboard`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newField),
    });

    if (response.ok) {
      console.log("jobboard Added  successfully");
      alert("jobboard Added successfully!");
      addjobboardsform.reset(); // Reset the form after success
    } else {
      const errorText = await response.text();
      console.error("Error Added field:", errorText);
      alert("Error while Adding jobboard: " + errorText);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error Added field: " + error.message);
  }
});






const updatepositionsform = document.getElementById("updatepositionsform");

updatepositionsform.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get the form data
  const formData = new FormData(updatepositionsform);
  const newField = Object.fromEntries(formData);

  // Rename "openPositions" to "openposition" to match backend expectation
  newField.openposition = newField.openPositions; // Map it correctly
  delete newField.openPositions; // Remove the old key
  console.log("Formatted Data:", newField);

  try {
    // Make the API call
    //const apiUrl = `${process.env.BASE_URL}${process.env.PORT ? `:${process.env.PORT}` : ""}/api/addjob`;
   
    const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/jobboard`;
    console.log("API URL:", apiUrl);
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newField),
    });

    if (response.ok) {
      console.log("Field Updating successfully");
      alert("Field Updating successfully!");
      addjobboardsform.reset(); // Reset the form after success
    } else {
      const errorText = await response.text();
      console.error("Error Updating field:", errorText);
      alert("Error Updatingfield: " + errorText);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error Updating field: " + error.message);
  }
});



document.querySelectorAll('.job-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const jobId = e.target.dataset.jobId;
    // Fetch job details based on jobId (mock for now)
    document.getElementById('job-description').style.display = 'block';
    document.getElementById('apply-job').style.display = 'none';
  });
});



// Function to hide all forms
function hideAllForms() {
  // Hide all forms by selecting them with querySelectorAll
  document.querySelectorAll('.form-container, .form-container1,.form-container3, .job-posting-form, .update-positions-form').forEach((form) => {
    form.style.display = 'none';
  });
  document.getElementById('websiteAnalytics').style.display = 'none'; // Example of other hidden element
}

// Function to show a specific form based on its ID
function showForm(formId) {
  // Hide all forms first
  hideAllForms();

  // Show the desired form by ID
  const form = document.getElementById(formId);
  if (form) {
    form.style.display = 'block';
  }
}







document.getElementById("deletejobboardsform").addEventListener("submit", function (e) {
e.preventDefault(); // Prevent the default form submission
const selectedCategory = document.getElementById("category").value;
console.log("Selected Category:", selectedCategory);
categorySelect.addEventListener("change", (event) => {
  console.log("Dropdown changed to:", event.target.value);
});

deletejobboardsform.addEventListener("submit", async (event) => {
  event.preventDefault();

  const category = categorySelect.value;

  console.log("Form submitted");
  console.log("Selected Category:", category);

  if (!category) {
    console.error("No category selected");
    alert("Please select a category to delete!");
    return;
  }

  try {
   
    
    const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/jobboard`;
    console.log("Sending DELETE request to:", apiUrl);
    console.log("category just before sending to api" + category)
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category }),
    });

    if (response.ok) {
      console.log("Job board deleted successfully");
      alert("Job board deleted successfully!");
      
      // Remove the deleted option from the select dropdown
      const optionToRemove = Array.from(categorySelect.options).find(option => option.value === category);
      if (optionToRemove) {
        optionToRemove.remove();
      }
      
      if (categorySelect.options.length > 0) {
        categorySelect.selectedIndex = 0;
      } else {
        // If no options left, hide or disable the form
        deletejobboardsform.style.display = 'none';
      }
    } else {
      const errorText = await response.text();
      console.error("Error deleting job board:", errorText);
      alert("Error deleting job board: " + errorText);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error deleting job board: " + error.message);
  }
});

// Log initial state
console.log("Initial options:", Array.from(categorySelect.options).map(opt => ({
  value: opt.value,
  text: opt.text
})));
});





document.getElementById('logoutButton').addEventListener('click', async () => {
  const response = await fetch('/logout', { method: 'GET' });
  if (response.ok) {
    window.location.href = '/login'; // Redirect to login page
  } else {
    alert('Logout failed.');
  }
});

AOS.init();

// Fetch applicants from the server
async function getApplicants() {
  try {
    const response = await fetch('/api/applyjob', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch applicants');
    }
    const applicants = await response.json();


    renderApplicants(applicants); // Render the applicants once the data is fetched
  } catch (error) {
    console.error('Error fetching applicants:', error);
  }
}

// Function to render applicants in the table
function renderApplicants(applicants) {
  const tableBody = document.getElementById('applicantTableBody');
  tableBody.innerHTML = ''; // Clear the table body before rendering new rows

  applicants.forEach(applicant => {
    const row = document.createElement('tr');

    // Create table data cells for each applicant field
    row.innerHTML = `
      <td data-label="fullname :">${applicant.fullname}</td>
      <td data-label="email :">${applicant.email}</td>
      <td data-label="phone :">${applicant.phone}</td>
      <td data-label="resume :"><a href="${applicant.resume}" target="_blank">View Resume</a></td>
      <td data-label="coverletter :">${applicant.coverletter}</td>
      <td data-label="jobTitle :">${applicant.jobTitle}</td>
    <td><button class="delete-btn" data-id="${applicant._id}">Delete</button></td>
  `;
  const deleteBtn = row.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteApplicant(applicant._id, row));

    // Append the row to the table body
    tableBody.appendChild(row);
  });
}
// Delete applicant
async function deleteApplicant(applicantId, row) {
  const confirmed = confirm('Are you sure you want to delete this applicant?');
  if (!confirmed) return;

  try {
    const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/applyjob`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      body: JSON.stringify({ _id: applicantId }), // Send _id in the body
      headers: {
        'Content-Type': 'application/json',
      },
    });
    

    if (!response.ok) {
      throw new Error('Failed to delete applicant');
    }

    row.remove(); // Remove row from UI
    alert('Applicant deleted successfully');
  } catch (error) {
    console.error('Error deleting applicant:', error);
    alert('Failed to delete the applicant. Please try again.');
  }
}


// Call the function to fetch and render applicants
getApplicants();








document.addEventListener("DOMContentLoaded", function () {
  const addjobForm = document.getElementById("addjobForm");

  addjobForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(addjobForm);
    const newJobData = Object.fromEntries(formData.entries());

    console.log("New Job Data:", newJobData);

    try {
      const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/addjob`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJobData), // This sends the data in the body
      });

      if (response.ok) {
        console.log("Job posted successfully!");
        alert("Job posted successfully!");
        addjobForm.reset();
      } else {
        const errorText = await response.text();
        console.error("Error posting job:", errorText);
        alert("Error posting job: " + errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error posting job: " + error.message);
    }
  });


  async function fetchAndRenderContactSubmissions() {
    try {
      const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/contactus`;
  
      const response = await fetch(apiUrl, { method: 'GET' });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      const submissions = responseData.submissions;
  
      if (!Array.isArray(submissions)) {
        throw new Error('Invalid response format: Expected an array');
      }
  
      const tableBody = document.getElementById('contactSubmissionTableBody');
      tableBody.innerHTML = ''; // Clear the table body
  
      submissions.forEach(submission => {
        console.log(submission._id);  // Check the structure of _id
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${submission.from_name}</td>
        <td>${submission.from_email}</td>
        <td>${submission.message}</td>
        <td>
          <select class="status-select" dataid="${submission._id}"> <!-- Pass the correct _id here -->
            <option value="Pending" ${submission.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Contacted" ${submission.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Resolved" ${submission.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            <option value="Not Interested" ${submission.status === 'Not Interested' ? 'selected' : ''}>Not Interested</option>
          </select>
        </td>
        <td>
          <button class="update-status-btn" dataid="${submission._id}">Update Status</button> <!-- Correct ID here -->
        </td>
      `;
      
        tableBody.appendChild(row);
      });
      
  
      // Attach event listeners to Update Status buttons
      document.querySelectorAll('.update-status-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
          const id = event.target.getAttribute('dataid');  // This should now give you the correct ID
          console.log('Button clicked for ID:', id);  // Check the logged ID
          const statusDropdown = event.target.closest('tr').querySelector('.status-select');
          const newStatus = statusDropdown.value;
      
          if (newStatus) {
            await updateStatus(id, newStatus);
            fetchAndRenderContactSubmissions(); // Refresh the table after update
          }
        });
      });
      
      
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      alert('Failed to load contact submissions. Please try again later.');
    }
  }
  async function updateStatus(id, newStatus) {
    try {
      const apiUrl = `${BASE_URL}${PORT ? `:${PORT}` : ''}/api/contactus`;  // No ID in URL anymore
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })  // Sending 'id' and 'status' in body
      });
  
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
  
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  }
  
  
  
  fetchAndRenderContactSubmissions();
  
  
  
});


