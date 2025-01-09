document.addEventListener("DOMContentLoaded", () => {
  const jobsTableBody = document.getElementById("jobsTableBody");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const filterButtons = document.querySelectorAll(".filter-button");
  const dropdowns = document.querySelectorAll(".dropdown");
  const modal = document.getElementById("applyModal");
  const jobTitleSpan = document.getElementById("jobTitle");
  // const jobTitleInput = document.getElementById('job-title');
  const jobAboutInput = document.getElementById("job-about");
  const jobResponsibilitiesInput = document.getElementById(
    "job-responsibilities"
  );
  const jobIdInput = document.getElementById("job-id");
  const closeBtn = modal.querySelector(".close");
  const applicationForm = document.getElementById("applyjob");
  const applyjobForm = document.getElementById("applyjob");
  let title = "";
  // Map filter types to job object fields
  const filterTypeMapping = {
    location: "jobLocation",
    experienceLevel: "jobExperiencelevel",
    contractType: "jobContractType",
  };

  function renderJobs(jobs) {
    jobsTableBody.innerHTML = ""; // Clear table rows
    if (jobs.length === 0) {
      jobsTableBody.innerHTML = `
                  <tr>
                      <td colspan="5" style="text-align: center;">No results found</td>
                  </tr>`;
      return;
    }
    jobs.forEach((job) => {
      const row = `
                 <tr>
<td data-label="Job Title">${job.jobTitle}</td>
<td data-label="Location">${job.jobLocation}</td>
<td data-label="Experience Level">${job.jobExperiencelevel}</td>
<td data-label="Contract Type">${job.jobContractType}</td>
<td data-label="Action">
<button class="apply-now-btn" data-job-id="${job._id}">Apply Now</button>
</td>
</tr>`;
      jobsTableBody.insertAdjacentHTML("beforeend", row);
    });
  }

  // Initial Render
  renderJobs(allJobs);

  // Search Functionality
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    const filteredJobs = allJobs.filter(
      (job) =>
        job.jobTitle.toLowerCase().includes(query) ||
        job.jobLocation.toLowerCase().includes(query) ||
        job.jobExperiencelevel.toLowerCase().includes(query) ||
        job.jobContractType.toLowerCase().includes(query)
    );
    renderJobs(filteredJobs);
    if (jobsTableBody.children.length > 0) {
      jobsTableBody.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // Dropdown Filter Functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const dropdownId = button.getAttribute("data-filter") + "Dropdown";
      const dropdown = document.getElementById(dropdownId);
      dropdowns.forEach((d) => d.classList.add("hidden")); // Hide all dropdowns
      dropdown.classList.toggle("hidden"); // Show the clicked dropdown
    });
  });

  // Handle Dropdown Selection
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      const filterType = event.target
        .closest(".dropdown")
        .id.replace("Dropdown", "");
      const filterField = filterTypeMapping[filterType]; // Map to the correct field name
      const filterValue = event.target.getAttribute("data-value");

      console.log("Filtering by:", filterField, filterValue); // Debugging info
      const filteredJobs = allJobs.filter((job) => {
        console.log(`Checking job: ${job[filterField]} === ${filterValue}`); // Debug info
        return job[filterField] === filterValue;
      });

      renderJobs(filteredJobs);

      // Hide dropdown after selection
      event.target.closest(".dropdown").classList.add("hidden");
    });
  });

  // Clear Filters functionality
  document
    .getElementById("clearFiltersButton")
    .addEventListener("click", () => {
      // Reset filteredJobs to all jobs
      renderJobs(allJobs);

      // Reset any dropdowns and input fields
      searchInput.value = "";
      dropdowns.forEach((dropdown) => dropdown.classList.add("hidden"));
    });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".filter-group")) {
      dropdowns.forEach((dropdown) => dropdown.classList.add("hidden"));
    }
  });

  // Open modal when "Apply Now" is clicked

  jobsTableBody.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("apply-now-btn")) {
      const jobId = e.target.getAttribute("data-job-id");
      const job = allJobs.find((j) => j._id === jobId);
      document.getElementById("job-about").textContent =
        job.jobAbout || "No description available";
      document.getElementById("job-responsibilities").textContent =
        job.jobResponsibilities || "No responsibilities listed";
      jobTitleSpan.textContent = job.jobTitle;
      jobIdInput.value = jobId;
      modal.style.display = "block";
    }
    console.log();
  });

  // Close modal when 'x' is clicked
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  // Close modal when clicking outside of it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
document.addEventListener("DOMContentLoaded", () => {
  const applyjobForm = document.getElementById("applyjob");
  const jobTitleSpan = document.getElementById("jobTitle");
  const submitButton = document.querySelector(
    "#applyjob button[type='submit']"
  );
  const loadingIndicator = document.getElementById("loadingIndicator"); // Add a loading element

  if (applyjobForm) {
    applyjobForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Show loading indicator
      if (loadingIndicator) loadingIndicator.style.display = "block";
      if (submitButton) submitButton.disabled = true; // Disable the submit button

      const formData = new FormData(applyjobForm);
      formData.append("jobTitle", jobTitleSpan.textContent.trim());

      console.log("Form Data:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      
      const apiUrl = `${BASE_URL.replace(/\/$/, '')}${PORT ? `:${PORT}` : ''}/api/applyjob`;


    
      console.log("API URL:", apiUrl);

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Server Response:", result);

        if (result.message === "Application submitted successfully") {
          // Hide the loading indicator first
          if (loadingIndicator) loadingIndicator.style.display = "none";

          // Reset the form
          applyjobForm.reset();

          // Show success alert
          alert("Applied successfully");

          // Close the modal
          const modal = document.getElementById("applyModal");
          if (modal) modal.style.display = "none";
        } else {
          alert("Unexpected response from the server.");
        }
      } catch (error) {
        console.error("Fetch Error:", error.message);
        alert("Failed to submit the application. Please try again.");
      } finally {
        // Hide loading indicator and enable submit button
        if (loadingIndicator) loadingIndicator.style.display = "none";
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
});
