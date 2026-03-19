// console.log("script.js loaded");

// /* ================= SECTION NAVIGATION ================= */
// function showSection(id) {
//   document.querySelectorAll(".section").forEach(sec => {
//     sec.style.display = "none";
//   });

//   const section = document.getElementById(id);
//   if (section) section.style.display = "block";

//   if (id === "dashboard") {
//     fetchUsers();
//   }
// }

// /* ================= SCROLL ================= */
// function scrollToAdd() {
//   const el = document.getElementById("add");
//   if (el) el.scrollIntoView({ behavior: "smooth" });
// }

// /* ================= LOGIN MODAL ================= */
// function openLogin() {
//   document.getElementById("loginModal").style.display = "block";
// }

// function closeLogin() {
//   document.getElementById("loginModal").style.display = "none";
// }

// async function loginUser() {
//   const name = document.getElementById("loginName").value;
//   const email = document.getElementById("loginEmail").value;
//   const password = document.getElementById("loginPassword").value;

//   try {
//     const res = await fetch("/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, password })
//     });

//     const data = await res.json();
//     document.getElementById("loginMsg").innerText = data.message || "Logged in";
//   } catch (err) {
//     console.error(err);
//     document.getElementById("loginMsg").innerText = "Login failed";
//   }
// }

// /* ================= FETCH USERS ================= */
// async function fetchUsers() {
//   try {
//     const res = await fetch("/users");
//     const users = await res.json();

//     if (!Array.isArray(users)) {
//       console.error("Expected array, got:", users);
//       return;
//     }

//     const container = document.getElementById("users");
//     container.innerHTML = "";

//     const names = [];
//     const scores = [];

//     users.forEach(u => {
//       const div = document.createElement("div");
//       div.className = "card";
//       div.innerHTML = `
//         <strong>${u.name || "No Name"}</strong><br>
//         Skills: ${(u.skills || []).join(", ")}<br>
//         Certifications: ${(u.certifications || []).join(", ")}<br>
//         Experience: ${u.experience || 0} yrs<br>
//         Skill Score: ${u.skillScore || 0}<br>
//         ${u.resumePath ? `<a href="/${u.resumePath}" target="_blank">Download Resume</a>` : ""}
//       `;
//       container.appendChild(div);

//       names.push(u.name);
//       scores.push(u.skillScore || 0);
//     });

//     // Chart
//     const ctx = document.getElementById("skillChart").getContext("2d");
//     if (window.skillChart && typeof window.skillChart.destroy === "function") {
//       window.skillChart.destroy();
//     }

//     window.skillChart = new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: names,
//         datasets: [{ label: "Skill Score", data: scores }]
//       },
//       options: {
//         responsive: true,
//         scales: { y: { beginAtZero: true } }
//       }
//     });

//   } catch (err) {
//     console.error("Fetch users error:", err);
//   }
// }

// /* ================= ADD USER ================= */
// document.addEventListener("DOMContentLoaded", () => {
//   const userForm = document.getElementById("userForm");
//   if (userForm) {
//     userForm.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const nameInput = document.getElementById("name");
//       const skillsInput = document.getElementById("skills");
//       const certInput = document.getElementById("certifications");
//       const expInput = document.getElementById("experience");
//       const resumeInput = document.getElementById("userResume");

//       const formData = new FormData();
//       formData.append("name", nameInput.value);
//       formData.append("skills", skillsInput.value);
//       formData.append("certifications", certInput.value);
//       formData.append("experience", expInput.value);

//       if (resumeInput.files.length > 0) {
//         formData.append("analyzeResume", resumeInput.files[0]);
//       }

//       try {
//         const res = await fetch("/users", { method: "POST", body: formData });
//         const data = await res.json();

//         if (!res.ok) {
//           document.getElementById("msg").innerText = data.error || "Error adding user";
//           return;
//         }

//         document.getElementById("msg").innerText = "User added: " + data.name;
//         userForm.reset();
//         showSection("dashboard");
//       } catch (err) {
//         console.error(err);
//         document.getElementById("msg").innerText = "Server error";
//       }
//     });
//   }

//   /* ================= RESUME ANALYSIS ================= */
//   const resumeForm = document.getElementById("resumeForm");
//   if (resumeForm) {
//     resumeForm.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const file = document.getElementById("analyzeResume").files[0];
//       const useAI = document.getElementById("useAI").checked;

//       if (!file) {
//         alert("Please upload a resume PDF");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("analyzeResume", file); // Must match multer field name
//       formData.append("useAI", useAI);

//       try {
//         const res = await fetch("/analyze-resume", {
//           method: "POST",
//           body: formData
//         });

//         const data = await res.json();
//         displayResult(data);

//       } catch (err) {
//         console.error("Resume analysis error:", err);
//       }
//     });
//   }
// });

// /* ================= SEARCH ================= */
// async function search() {
//   const skill = document.getElementById("skill").value;

//   try {
//     const res = await fetch(`/search?skill=${encodeURIComponent(skill)}`);
//     const users = await res.json();

//     if (!Array.isArray(users)) return;

//     const container = document.getElementById("results");
//     container.innerHTML = "";

//     users.forEach(u => {
//       const div = document.createElement("div");
//       div.className = "card";
//       div.innerHTML = `
//         <strong>${u.name}</strong><br>
//         Skills: ${(u.skills || []).join(", ")}<br>
//         Skill Score: ${u.skillScore || 0}
//       `;
//       container.appendChild(div);
//     });

//   } catch (err) {
//     console.error("Search error:", err);
//   }
// }

// /* ================= DISPLAY AI RESULT ================= */
// function displayResult(data) {
//   const box = document.getElementById("aiResult");

//   box.innerHTML = `
//     <h3>Resume Analysis</h3>
//     <p><strong>Detected Domain:</strong> ${data.domain}</p>
//     <p><strong>ATS Score:</strong> ${data.atsScore}</p>
//     <p><strong>Matched Skills:</strong> ${(data.matchedSkills || []).join(", ")}</p>
//     <p><strong>Missing Skills:</strong> ${(data.missingSkills || []).join(", ")}</p>
//     <p><strong>AI Suggestions:</strong><br>${data.aiSuggestions || "Not requested"}</p>
//   `;
// }

// /* ================= AUTO LOAD ================= */
// window.onload = () => {
//   showSection("dashboard");
// };




















console.log("script.js loaded");

/* ================= SECTION NAVIGATION ================= */
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.style.display = "none";
  });

  const section = document.getElementById(id);
  if (section) section.style.display = "block";

  if (id === "dashboard") {
    fetchUsers();
  }
}

/* ================= SCROLL ================= */
function scrollToAdd() {
  const el = document.getElementById("add");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* ================= LOGIN MODAL ================= */
function openLogin() {
  document.getElementById("loginModal").style.display = "block";
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

async function loginUser() {
  const name = document.getElementById("loginName").value;
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    document.getElementById("loginMsg").innerText = data.message || "Logged in";
  } catch (err) {
    console.error(err);
    document.getElementById("loginMsg").innerText = "Login failed";
  }
}

/* ================= FETCH USERS ================= */
async function fetchUsers() {
  try {
    const res = await fetch("/users");
    const users = await res.json();

    if (!Array.isArray(users)) {
      console.error("Expected array, got:", users);
      return;
    }

    const container = document.getElementById("users");
    container.innerHTML = "";

    const names = [];
    const scores = [];

    users.forEach(u => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <strong>${u.name || "No Name"}</strong><br>
        Skills: ${(u.skills || []).join(", ")}<br>
        Certifications: ${(u.certifications || []).join(", ")}<br>
        Experience: ${u.experience || 0} yrs<br>
        Skill Score: ${u.skillScore || 0}<br>
        ${u.resumePath ? `<a href="/${u.resumePath}" target="_blank">Download Resume</a>` : ""}
      `;
      container.appendChild(div);

      names.push(u.name);
      scores.push(u.skillScore || 0);
    });

    // Chart
    const ctx = document.getElementById("skillChart").getContext("2d");
    if (window.skillChart && typeof window.skillChart.destroy === "function") {
      window.skillChart.destroy();
    }

    window.skillChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: names,
        datasets: [{ label: "Skill Score", data: scores }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });

  } catch (err) {
    console.error("Fetch users error:", err);
  }
}

/* ================= ADD USER ================= */
document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");
  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const skillsInput = document.getElementById("skills");
      const certInput = document.getElementById("certifications");
      const expInput = document.getElementById("experience");
      const resumeInput = document.getElementById("userResume");

      const formData = new FormData();
      formData.append("name", nameInput.value);
      formData.append("skills", skillsInput.value);
      formData.append("certifications", certInput.value);
      formData.append("experience", expInput.value);

      if (resumeInput.files.length > 0) {
        formData.append("analyzeResume", resumeInput.files[0]);
      }

      try {
        const res = await fetch("/users", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          document.getElementById("msg").innerText = data.error || "Error adding user";
          return;
        }

        document.getElementById("msg").innerText = "User added: " + data.name;
        userForm.reset();
        showSection("dashboard");
      } catch (err) {
        console.error(err);
        document.getElementById("msg").innerText = "Server error";
      }
    });
  }

  
// ================= RESUME ANALYSIS =================


  const resumeForm = document.getElementById("resumeForm");
  if (resumeForm) {
    resumeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fileInput = document.getElementById("analyzeResume");
      const useAI = document.getElementById("useAI").checked;

      if (!fileInput.files.length) {
        return alert("Please upload a resume PDF.");
      }

      const formData = new FormData();
      formData.append("resume", fileInput.files[0]); // Field name for multer

      try {
        // Step 1: Upload resume to server
        const res = await fetch("/uploadResume", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        // Step 2: If AI analysis is requested
        if (useAI) {
          const trimmedText = data.text.slice(0, 3000);
          
          const aiRes = await fetch("/ai/predefined", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ resumeText: data.text }),
            
            body: JSON.stringify({ resumeText: trimmedText })

          });
          const aiData = await aiRes.json();
          displayPredefinedAI(aiData);
        }

      } catch (err) {
        console.error("Resume analysis error:", err);
        alert("Error analyzing resume. Check console for details.");
      }
    });
  }



// ================= RESUME ANALYSIS =================

// const resumeForm = document.getElementById("resumeForm");

// if (resumeForm) {
//   resumeForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const fileInput = document.getElementById("analyzeResume");
//     const useAI = document.getElementById("useAI").checked;
//     const submitBtn = resumeForm.querySelector("button");

//     // ✅ Disable button to prevent multiple clicks
//     submitBtn.disabled = true;
//     submitBtn.innerText = "Analyzing...";

//     if (!fileInput.files.length) {
//       alert("Please upload a resume PDF.");
//       submitBtn.disabled = false;
//       submitBtn.innerText = "Analyze Resume";
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", fileInput.files[0]); // Field name for multer

//     try {
//       // Step 1: Upload resume to server
//       const res = await fetch("/uploadResume", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       // Step 2: If AI analysis is requested
//       if (useAI) {
//         // ✅ Trim resume text for speed
//         let trimmedText = data.text.slice(0, 3000);

//         trimmedText = trimmedText.replace(/\n{2,}/g, "\n"); // remove multiple empty lines
//         trimmedText = trimmedText.replace(/^\s+|\s+$/g, "");

        
//         // Create abort controller
//         const controller = new AbortController();

//         // Timeout 15 seconds
//         const timeoutId=setTimeout(() => controller.abort(), 15000);

//         try{
//         const aiRes = await fetch("/ai/predefined", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ resumeText: trimmedText }),
//           signal: controller.signal, // attach abort signal
//         });

//         const aiData = await aiRes.json();

//         // ✅ Display AI results (predefined Q&A)
//         displayPredefinedAI(aiData);
//       }
//       catch (err) {
//         if (err.name === "AbortError") {
//           alert("AI request timed out. Please try again.");
//         } else {
//           console.error("AI error:", err);
//           alert("Error analyzing resume.");
//         }
//       } finally {
//         clearTimeout(timeoutId);
//     }
//   }
//     } catch (err) {
//       console.error("Resume analysis error:", err);
//       alert("Error analyzing resume. Check console for details.");
//     } finally {
//       // ✅ Re-enable button always
//       submitBtn.disabled = false;
//       submitBtn.innerText = "Analyze Resume";
//     }
//   });
// }




  // ================= CUSTOM AI QUESTION =================
  const askBtn = document.getElementById("askAI");
  if (askBtn) {
    askBtn.addEventListener("click", async () => {
      const question = document.getElementById("userQuestion").value.trim();
      if (!question) return alert("Please type a question.");

      try {
        const res = await fetch("/ai/custom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });
        const data = await res.json();
        document.getElementById("aiAnswer").innerText = data.answer;
      } catch (err) {
        console.error("Custom AI error:", err);
        alert("Error getting AI response. Check console for details.");
      }
    });
  }

  // ================= DISPLAY AI RESULTS =================
  function displayPredefinedAI(aiData) {
    // console.log("AI DATA:", aiData);
      console.log("AI DATA FULL:", JSON.stringify(aiData, null, 2));

    const container = document.getElementById("aiResult");
    container.innerHTML = "<p>⏳ Analyzing resume… please wait</p>";
    // if (!container || !aiData) return;
    if (!container) {
      console.error("aiResult div not found");
      return;
    }

    const safeJoin = (v) => Array.isArray(v) ? v.join(", ") : "N/A";
    container.innerHTML = `
      <h3>Resume Skills & Content</h3><br>
      <strong>Key Skills:</strong> ${safeJoin(aiData.keySkills)}
      
      <strong>Technical vs Soft Skills:</strong> ${aiData.skillRating || "N/A"}

      <h3>Formatting & Presentation</h3>
      <strong>Professional?</strong> ${aiData.formatProfessional || "N/A"}
      <strong>Formatting Suggestions:</strong> ${aiData.formatSuggestions || "N/A"}
      <strong>Appeal Suggestions:</strong> ${aiData.appealSuggestions || "N/A"}

      <h3>Domain / Job Fit</h3>
      <strong>Strengths:</strong> ${safeJoin(aiData.strengths)}
      

      <h3>Overall Advice</h3>
      <strong>Feedback:</strong> ${aiData.overallFeedback || "N/A"}
    `;
  }

});


/* ================= SEARCH ================= */
async function search() {
  const skill = document.getElementById("skill").value;

  try {
    const res = await fetch(`/search?skill=${encodeURIComponent(skill)}`);
    const users = await res.json();

    if (!Array.isArray(users)) return;

    const container = document.getElementById("results");
    container.innerHTML = "";

    users.forEach(u => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <strong>${u.name}</strong><br>
        Skills: ${(u.skills || []).join(", ")}<br>
        Skill Score: ${u.skillScore || 0}
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error("Search error:", err);
  }
}

/* ================= DISPLAY AI RESULT ================= */
function displayResult(data) {
  const box = document.getElementById("aiResult");

  box.innerHTML = `
    <h3>Resume Analysis</h3>
    <p><strong>Detected Domain:</strong> ${data.domain}</p>
    <p><strong>ATS Score:</strong> ${data.atsScore}</p>
    <p><strong>Matched Skills:</strong> ${(data.matchedSkills || []).join(", ")}</p>
    <p><strong>Missing Skills:</strong> ${(data.missingSkills || []).join(", ")}</p>
    <p><strong>AI Suggestions:</strong><br>${data.aiSuggestions || "Not requested"}</p>
  `;
}

/* ================= AUTO LOAD ================= */
window.onload = () => {
  showSection("dashboard");
};
// FAQ Accordion functionality
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling;

    // toggle display
    if (answer.style.display === "block") {
      answer.style.display = "none";
    } else {
      answer.style.display = "block";
    }
  });
});
