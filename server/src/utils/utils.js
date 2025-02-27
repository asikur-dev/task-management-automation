async function  getPublicIP() {
  try {
    // Fetch the public IP from a service (e.g., api.ipify.org)
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json(); // Parse the JSON response
    // console.log('Your public IP address is:', data.ip);  // Access the IP from the response
    return data.ip;
  } catch (error) {
    console.error("Error fetching public IP address:", error);
  }
}

module.exports = { getPublicIP };