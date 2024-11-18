const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const OpenAIClient = require("@azure/openai");  
const { AzureKeyCredential } = require('@azure/core-auth');
const { DefaultAzureCredential, getBearerTokenProvider } = require("@azure/identity");  

const app = express();
const port = process.env.PORT || 5000;

const endpoint = "https://genai-openai-creativetechbrains.openai.azure.com/";  
const azureApiKey = "";  
const deploymentId = "gpt-4o";  
const searchEndpoint = "https://alsearchctb2024.search.windows.net";  
const searchKey = "";  
const searchIndex = "countryreport";  

// Middleware for handling CORS and file uploads
app.use(cors());
// Set up multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB (can adjust as needed)
  });

  
  app.post('/chat', async (req, res) => {

    console.log("I am inside chat space");
    // const { prompt } = req.body;
  
    if (!endpoint || !azureApiKey || !deploymentId || !searchEndpoint || !searchKey || !searchIndex) {  
        console.error("Please set the required environment variables.");  
        return;  
    }  
  
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));  
  
    const messages = [  
        { role: "system", content: "You are an AI assistant that helps people find information." },  
        { role: "user", content: "" }  
    ];  
    console.log(`Message: ${messages.map((m) => m.content).join("\n")}`);  
  
    try {
      // Call Azure OpenAI API using the SDK
      const events = await client.streamChatCompletions(deploymentId, messages, {  
        pastMessages: 10,  
        maxTokens: 800,  
        temperature: 0.7,  
        topP: 0.95,  
        frequencyPenalty: 0,  
        presencePenalty: 0,  
          
        azureExtensionOptions: {  
            extensions: [  
                {  
                    type: "AzureCognitiveSearch",  
                    endpoint: searchEndpoint,  
                    key: searchKey,  
                    indexName: searchIndex,  
                },  
            ],  
        },  
    });  
  
    let response = "";  
    for await (const event of events) {  
        for (const choice of event.choices) {  
            const newText = choice.delta?.content;  
            if (!!newText) {  
                response += newText;  
                // To see streaming results as they arrive, uncomment line below  
                // console.log(newText);  
            }  
        }  
    }  
    console.log(response);  
    } catch (error) {
      console.error('Error querying GPT-4:', error);
      res.status(500).json({ error: 'Failed to get response from Azure OpenAI API' });
    }
  });

// Route to handle file uploads from React frontend
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const endpoint = "https://docintellictb.cognitiveservices.azure.com/";
    const apiKey = "";
    console.log("I am here!");
    console.log(endpoint);
    // Sending the file to Azure Form Recognizer
    const response = await axios.post(endpoint, req.file.buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': apiKey,
      },
    });

    // Return the response from Azure to the frontend
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error analyzing document');
  }
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
}

// Start the backend server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
