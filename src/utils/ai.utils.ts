import OpenAI from "openai";
import { cleanAIJsonOutput } from "./refineData.utils";
import { setTimeout as wait } from "timers/promises";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const analyzeJobs = async (jobChunks: any[], postPlatform: string) => {
  const allResults: any[] = [];

  for (let i = 0; i < jobChunks.length; i++) {
    const chunk = jobChunks[i];
    const prompt = `
You are an AI assistant that processes an array of raw job data objects and returns clean, structured job post information.

**Data Cleaning Rules:**
- Remove newlines, extra spaces, and special characters.
- Handle salary as explained:
  - "2–3 LPA" → minSalary="2 LPA", maxSalary="3 LPA"
  - "Up to ₹X" → maxSalary="₹X"
  - "From ₹X" → minSalary="₹X"
  - Missing → leave all salary fields blank
- Keep numeric values as strings.

**Schema for each job:**
{
  "title": "",
  "description": "",
  "companyName": "",
  "location": "",
  "minSalary": "",
  "maxSalary": "",
  "fixedSalary": "",
  "eligibleYear": "",
  "requiredExp": "",
  "skills": [],
  "jobUrl": "",
  "postPlatform": "${postPlatform}",
  "aiScore": null,
  "experienceLevel": "",
  "position": "",
  "postedAt": null,
  "createdAt": null
}

**Input Data:**
${JSON.stringify(chunk, null, 2)}
`;

    let retries = 3;
    let success = false;

    while (retries > 0 && !success) {
      try {
        console.log(`🔹 Processing batch ${i + 1}/${jobChunks.length}`);

        const response = await client.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: [{ role: "user", content: prompt }],
          temperature: 0,
        });

        const rawOutput = response.choices?.[0]?.message?.content || "";
        const cleanedOutput = cleanAIJsonOutput(rawOutput);
        const parsed = JSON.parse(cleanedOutput as string);

        allResults.push(...parsed);
        success = true;

        await wait(3000); // wait between calls
      } catch (err: any) {
        console.error(`❌ Error in batch ${i + 1}:`, err.code || err.message);

        if (err.code === "insufficient_quota") {
          console.error("⛔ Out of quota. Check your OpenAI billing.");
          return allResults;
        }

        if (err.status === 429) {
          console.warn("⚠️ Rate limit hit, waiting 20s...");
          await wait(20000); // exponential backoff
          retries--;
        } else {
          retries--;
          await wait(5000);
        }
      }
    }
  }

  return allResults;
};

export default analyzeJobs;
