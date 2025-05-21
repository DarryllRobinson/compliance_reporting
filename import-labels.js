const fs = require("fs");
const axios = require("axios");

const labels = JSON.parse(fs.readFileSync("github_labels.json", "utf8"));

// 🔒 Replace these with your actual GitHub details
const repo = "DarryllRobinson/compliance_reporting"; // e.g. 'monochrome-compliance/compliance_reporting'
const token = "REDACTED"; // Remove actual key

const headers = {
  Authorization: `token ${token}`,
  Accept: "application/vnd.github.v3+json",
};

async function createLabel(label) {
  try {
    await axios.post(`https://api.github.com/repos/${repo}/labels`, label, {
      headers,
    });
    console.log(`✅ Created label: ${label.name}`);
  } catch (err) {
    if (err.response && err.response.status === 422) {
      console.log(`⚠️ Label already exists: ${label.name}`);
    } else {
      console.error(`❌ Failed to create label ${label.name}:`, err.message);
    }
  }
}

(async () => {
  for (const label of labels) {
    await createLabel(label);
  }
})();
