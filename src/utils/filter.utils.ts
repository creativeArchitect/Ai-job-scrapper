

export const chunkingData = (jobs: any, chunkSize: number)=> {
    const chunks = [];
    for (let i = 0; i < jobs.length; i += chunkSize) {
      chunks.push(jobs.slice(i, i + chunkSize));
    }
    return chunks;
  }
  