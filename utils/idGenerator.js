export const GenerateJobID = () => {
      // Generate a random 5-digit number
      const randomID = Math.floor(10000 + Math.random() * 90000);
      return randomID;
}