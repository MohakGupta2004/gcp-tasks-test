import express from 'express'
import { CloudTasksClient, protos } from "@google-cloud/tasks"
const app = express()
app.use(express.json())
const client = new CloudTasksClient()
const PROJECT_ID = process.env.GCP_PROJECT || "website-voice-agent-demo"
const LOCATION = "us-central1"
const QUEUE = "call-queue"
const SERVICE_URL = process.env.SERVICE_URL // Cloud Run URL
app.post("/task", async (req, res)=>{
  const phoneNo = "123";
  const parent = client.queuePath(PROJECT_ID, LOCATION, QUEUE)
  const task = {
    httpRequest: {
      httpMethod: protos.google.cloud.tasks.v2.HttpMethod.POST,
      url: `${SERVICE_URL}/hello`,
      headers: {
        "Content-Type": "application/json",
      },
      body: Buffer.from(
        JSON.stringify({ phoneNo })
      ).toString("base64"),
    },
    scheduleTime: {
      seconds: Math.floor(Date.now() / 1000) + 120,
    },
  }

  const [response] = await client.createTask({ parent, task })
  console.log(`Google task log: ${response}`);
})


app.post("/hello", (req, res)=>{
  const phoneNo = req.body.phoneNo;
  console.log(`Call initiated to ${phoneNo}`)
})

app.listen(3000, ()=>{
  console.log("Server running");
  
})
