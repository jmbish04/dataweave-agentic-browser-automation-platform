export const MOCK_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          price: { type: "string" },
          rating: { type: "string" },
          url: { type: "string" }
        },
        required: ["title", "price"]
      }
    }
  }
};
export const MOCK_LOGS = [
  { timestamp: "10:00:01", level: "info", message: "Initializing DataWeave Agent..." },
  { timestamp: "10:00:03", level: "info", message: "Connecting to Cloudflare Browser Rendering..." },
  { timestamp: "10:00:08", level: "success", message: "Browser instance ready." },
  { timestamp: "10:00:09", level: "info", message: "Navigating to https://www.amazon.com/s?k=laptop" },
  { timestamp: "10:00:12", level: "info", message: "Waiting for network idle..." },
  { timestamp: "10:00:15", level: "thought", message: "Agent Thought: I see the product list. I need to scroll to ensure all lazy-loaded prices are visible." },
  { timestamp: "10:00:18", level: "info", message: "Scrolling page..." },
  { timestamp: "10:00:20", level: "info", message: "Extracting elements matching schema..." },
  { timestamp: "10:00:22", level: "success", message: "Extracted 5 items successfully." },
  { timestamp: "10:00:23", level: "info", message: "Cleaning up browser instance..." },
  { timestamp: "10:00:24", level: "success", message: "Job completed." }
];