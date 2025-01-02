// Function to handle resource update
function handleResourceUpdate() {
    const updateResourceForm = document.getElementById("updateResourceForm");
  
    updateResourceForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(updateResourceForm);
  
      try {
        const response = await fetch("/resources", {
          method: "PUT",
          body: formData,
        });
  
        if (response.ok) {
          alert("Resource updated successfully!");
        } else {
          alert("Error updating the resource.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error updating the resource.");
      }
  
      updateResourceForm.reset();
    });
  }
  
  // Function to handle article deletion
  function handleArticleDelete() {
    const deleteArticleForm = document.getElementById("deleteArticleForm");
  
    deleteArticleForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const resourceId = document.getElementById("deleteArticletitle").value;
  
      console.log("Selected Resource ID:", resourceId);
  
      if (!resourceId) {
        alert("Please select a resource to delete.");
        return;
      }
  
      try {
        const response = await fetch("/resources", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resourceId }),
        });
  
        if (response.ok) {
          alert("Resource deleted successfully!");
        } else {
          alert("Error deleting the resource.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error deleting the resource.");
      }
  
      deleteArticleForm.reset();
    });
  }
  
  // Function to handle job update
  function handleJobUpdate() {
    const updatejob = document.getElementById("updatejob");
  
    updatejob.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(updatejob);
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
  
      try {
        const response = await fetch("/addjob", {
          method: "PUT",
          body: JSON.stringify(formObject),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          alert("Job updated successfully!");
        } else {
          alert("Error updating the job.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error updating the job.");
      }
  
      updatejob.reset();
    });
  }
  
  // Function to handle job deletion
  function handleJobDelete() {
    const deletejobForm = document.getElementById("deletejobForm");
  
    deletejobForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const jobTitle = document.getElementById("deletejobTitle").value;
  
      if (!jobTitle) {
        alert("Please select a job to delete.");
        return;
      }
  
      try {
        const response = await fetch("/addjob", {
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
  }
  
  // Function to toggle article form visibility
  function ArticletoggleForm() {
    const option = document.getElementById("ArticleOption").value;
    document.getElementById("addnewArticle").style.display = "none";
    document.getElementById("updateResource").style.display = "none";
    document.getElementById("deleteArticle").style.display = "none";
  
    if (option === "add") {
      document.getElementById("addnewArticle").style.display = "block";
    } else if (option === "update") {
      document.getElementById("updateResource").style.display = "block";
    } else if (option === "delete") {
      document.getElementById("deleteArticle").style.display = "block";
    }
  }
  
  // Function to toggle job form visibility
  function toggleForm() {
    const option = document.getElementById("jobOption").value;
    console.log(option + "  option selected");
    document.getElementById("addjob").style.display = "none";
    document.getElementById("updatejobmain").style.display = "none";
    document.getElementById("deletejobContainer").style.display = "none";
  
    if (option === "add") {
      document.getElementById("addjob").style.display = "block";
    } else if (option === "update") {
      document.getElementById("updatejobmain").style.display = "block";
    } else if (option === "delete") {
      document.getElementById("deletejobContainer").style.display = "block";
    }
  }
  
  // Function to toggle job board form visibility
  function togglejobboardForm() {
    const option = document.getElementById("jobboardOption").value;
    document.getElementById("addjobboards").style.display = "none";
    document.getElementById("updatejobboards").style.display = "none";
    document.getElementById("deletejobboards").style.display = "none";
  
    if (option === "add") {
      document.getElementById("addjobboards").style.display = "block";
    } else if (option === "update") {
      document.getElementById("updatejobboards").style.display = "block";
    } else if (option === "delete") {
      document.getElementById("deletejobboards").style.display = "block";
    }
  }
  
  // Function to handle hamburger menu
  function handleHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
  
    hamburger.addEventListener('click', () => {
      console.log('Hamburger clicked');
      navLinks.classList.toggle('active');
    });
  }
  
  // Function to show website analytics
  function showWebsiteAnalytics() {
    hideAllForms();
    document.getElementById('websiteAnalytics').style.display = 'block';
  }
  
  // Function to handle resource form submission
  function handleResourceFormSubmission() {
    const resourceForm = document.getElementById("resourceForm");
  
    resourceForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(resourceForm);
  
      try {
        const response = await fetch("http://localhost:3000/resources", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          console.log("Resource saved successfully");
          alert("Resource added successfully!");
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
  }
  
  // Function to handle job board form submission
  function handleJobBoardFormSubmission() {
    const addjobboardsform = document.getElementById("addjobboardsform");
  
    addjobboardsform.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(addjobboardsform);
      const newField = Object.fromEntries(formData);
      newField.openposition = newField.openPositions;
      delete newField.openPositions;
      console.log("Formatted Data:", newField);
  
      try {
        const response = await fetch("http://localhost:3000/jobboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newField),
        });
  
        if (response.ok) {
          alert("jobboard Added successfully!");
          addjobboardsform.reset();
        } else {
          const errorText = await response.text();
          console.error("Error while Adding jobboard:", errorText);
          alert("Error while Adding jobboard: " + errorText);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error Added field: " + error.message);
      }
    });
  }
  
  // Function to handle job board update
  function handleJobBoardUpdate() {
    const updatepositionsform = document.getElementById("updatepositionsform");
  
    updatepositionsform.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(updatepositionsform);
      const newField = Object.fromEntries(formData);
      newField.openposition = newField.openPositions;
      delete newField.openPositions;
      console.log("Formatted Data:", newField);
  
      try {
        const response = await fetch("http://localhost:3000/jobboard", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newField),
        });
  
        if (response.ok) {
          console.log("Field Updating successfully");
          alert("Field Updating successfully!");
          updatepositionsform.reset();
        } else {
          const errorText = await response.text();
          console.error("Error Updating field:", errorText);
          alert("Error Updating field: " + errorText);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error Updating field: " + error.message);
      }
    });
  }
  
  // Function to handle job board deletion
  function handleJobBoardDeletion() {
    const deletejobboardsform = document.getElementById("deletejobboardsform");
  
    deletejobboardsform.addEventListener("submit", async (event) => {
      event.preventDefault();
      const categorySelectDelete = document.getElementById("category");
      const selectedOption = categorySelectDelete.options[categorySelectDelete.selectedIndex];
      const category = selectedOption.value;
  
      if (!category) {
        alert("No category selected!");
        return;
      }
  
      console.log("Selected Category:", category);
  
      try {
        const response = await fetch("/jobboard", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category }),
        });
  
        if (response.ok) {
          console.log("Job board deleted successfully");
          alert("Job board deleted successfully!");
          deletejobboardsform.reset();
          selectedOption.remove();
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
  }
  
  // Function to hide all forms
  function hideAllForms() {
    document.querySelectorAll('.form-container, .form-container1, .job-posting-form, .update-positions-form').forEach((form) => {
      form.style.display = 'none';
    });
    document.getElementById('websiteAnalytics').style.display = 'none';
  }
  
  // Function to show a specific form
  function showForm(formId) {
    hideAllForms();
    const form = document.getElementById(formId);
    if (form) {
      form.style.display = 'block';
    }
  }
  
  // Function to handle logout
  function handleLogout() {
    document.getElementById('logoutButton').addEventListener('click', async () => {
      const response = await fetch('/logout', { method: 'GET' });
      if (response.ok) {
        window.location.href = '/login';
      } else {
        alert('Logout failed.');
      }
    });
  }
  
  // Function to fetch and render applicants
  async function getApplicants() {
    try {
      const response = await fetch('/applyjob', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch applicants');
      }
      const applicants = await response.json();
      renderApplicants(applicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  }
  
  // Function to render applicants
  function renderApplicants(applicants) {
    const tableBody = document.getElementById('applicantTableBody');
    tableBody.innerHTML = '';
  
    applicants.forEach(applicant => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${applicant.fullname}</td>
        <td>${applicant.email}</td>
        <td>${applicant.phone}</td>
        <td><a href="${applicant.resume}" target="_blank">View Resume</a></td>
        <td>${applicant.coverletter}</td>
        <td>${applicant.jobTitle}</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Function to fetch and render contact submissions
  async function fetchAndRenderContactSubmissions() {
    try {
      
    const responseContactUs = await fetch("http://localhost:3000/contactus");
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
      const tableBody = document.getElementById('contactSubmissionTableBody');
      tableBody.innerHTML = '';
      submissions.forEach(submission => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${submission.from_name}</td>
          <td>${submission.from_email}</td>
          <td>${submission.message}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      alert('Failed to load contact submissions. Please try again later.');
    }
  }
  
  // Initialize all functions
  function init() {
    handleResourceUpdate();
    handleArticleDelete();
    handleJobUpdate();
    handleJobDelete();
    handleHamburgerMenu();
    handleResourceFormSubmission();
    handleJobBoardFormSubmission();
    handleJobBoardUpdate();
    handleJobBoardDeletion();
    handleLogout();
    getApplicants();
    fetchAndRenderContactSubmissions();
    AOS.init();
  }
  
  // Call the init function when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', init);