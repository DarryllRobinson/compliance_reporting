export const xeroService = {
  async connect() {
    // Simulate an API call to connect to Xero
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  },

  async fetchData() {
    const filePath = "/data/Worked_example_mock_data.json"; // Relative path to the JSON file in the public folder

    return fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch the JSON file.");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  },
};
