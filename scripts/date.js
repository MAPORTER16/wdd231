// Get the current year and put it in the copyright
const currentYear = new Date().getFullYear();
document.getElementById("currentyear").textContent = `© ${currentYear} Matthew Porter Utah`;

// Get the last modified date and format it nicely
const lastModified = document.lastModified;
document.getElementById("lastmodified").textContent = `Last Modified: ${lastModified}`;