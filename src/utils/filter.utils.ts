import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const analyzeJobs = async (jobHtml: any, postPlatform: string) => {
  const prompt = `
You are an AI assistant that processes an array of raw job data objects and returns cleaned, structured job post information.

 and also make sure that you remove all the **/n** in the content because i will store the filtered data in the db for the reference.

 if salary like this '₹ 2,00,000 - 2,25,000' this exists at that time you assume first value like example 2,00,000 as minSalary and second value like for example 2,25,000 assume maxSalary if only one value exists and minSalary and maxSalary will be the value

Your task is to return an array of valid JSON objects that strictly match the schema below. Respond **only** with the raw JSON array — no markdown, no code blocks, no explanations.

Schema (for each job object):
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

Instructions:
- Normalize fields to match schema.
- Return only valid JSON array (no text or markdown).
- If data is missing:
  - "" for text
  - null for numbers/dates
  - [] for arrays
- Extract and clean skills array.
- Parse salary info correctly.
- Infer experienceLevel and position if possible.
- Ensure all objects strictly follow the schema.

Input Data:
${JSON.stringify(jobHtml).slice(0, 12000)}  // limit to prevent truncation
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const rawOutput = response.choices?.[0]?.message?.content || "";
    console.log("🧠 Raw AI Output:\n", rawOutput);

    // Clean markdown wrappers if they exist
    const cleanedOutput = rawOutput
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Attempt to parse
    try {
      const parsed = JSON.parse(cleanedOutput);
      console.log("✅ Parsed job data:", parsed);
      return parsed;
    } catch (parseErr) {
      console.error("❌ JSON parse failed:", parseErr);
      return { rawOutput: cleanedOutput };
    }
  } catch (err) {
    console.error("❌ OpenAI API Error:", err);
    return null;
  }
};

export default analyzeJobs;
