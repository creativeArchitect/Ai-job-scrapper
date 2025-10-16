
export const cleanAIJsonOutput = (rawOutput: string) => {
    try {
        if (typeof rawOutput !== "string") {
            rawOutput = JSON.stringify(rawOutput);
          }
        
          // Remove markdown fences like ```json ... ```
          return rawOutput
            .replace(/```json/i, "")
            .replace(/```/g, "")
            .trim();
    } catch (err) {
      console.error("❌ Error parsing AI output:", err);
      return [];
    }
  };
   
export const cleanJobData = (job: any)=> {
    return {
        ...job,
        title: job.title?.trim(),
        description: job.description?.replace(/\s+/g, " ").trim(),
        companyName: job.companyName?.trim(),
        location: job.location?.trim(),
        minSalary: job.minSalary || null,
        maxSalary: job.maxSalary || null,
        fixedSalary: job.fixedSalary || null,
        eligibleYear: job.eligibleYear || null,
        requiredExp: job.requiredExp || null,
        skills: job.skills?.map(s => s.trim()) || [],
        jobUrl: job.jobUrl.startsWith("http")
          ? job.jobUrl
          : `https://internshala.com${job.jobUrl}`,
        postPlatform: job.postPlatform || "internshala",
        experienceLevel: job.experienceLevel || null,
        position: job.position || null,
        postedAt: job.postedAt ? new Date(job.postedAt) : null,
        createdAt: new Date(),
      };
}
