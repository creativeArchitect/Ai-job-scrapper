import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
})

const analyzeJobs = async (jobHtml: any, postPlatform: string)=> {
    const prompt = `You are an AI that extracts structured job post information from HTML.

Given the following HTML of a job post, extract and return the data in JSON format with the following schema:

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

**Rules:**
- If a field is missing in the HTML, return null for numbers/dates and "" for strings.
- Extract "skills" as an array of strings.
- Extract salary information into fixedSalary, or if it's a range, fill minSalary and maxSalary.
- Leave jobUrl, postPlatform, aiScore, postedAt, and createdAt as "" or null if not available.
- Extract "experienceLevel" and "position" from the job title or description if possible.
- Ensure output is valid JSON.

HTML:
${jobHtml}
`;
try {
    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
            role: 'user', content: prompt
        }],
        temperature: 0,
    })

    const output = response.choices[0].message.content; 

    //  try to parse the JSON
    try {
        const jobData = JSON.parse(output);

        return jobData;
    } catch (parseErr) {
        console.error("Failed to parse JSON:", parseErr);
        return { rawOutput: output }; // fallback if parsing fails
      }

} catch(err) {
    console.error("OpenAI API Error:", err);
    return null;
}};



export default analyzeJobs;