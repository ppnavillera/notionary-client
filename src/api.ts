import axios from "axios";

const url = "http://127.0.0.1:54321/functions/v1/";
// "https://nxogwwumniauclwarsbt.supabase.co/functions/v1/enkoextension";

export async function getDefinition(word: string) {
  const geminiUrl = url + "/gemini";
  try {
    const response = await axios.post(
      geminiUrl,
      { word: word },
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식 명시
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response?.data || err.message);
    } else {
      console.error(err);
    }
  }
}

export async function saveToNotion(word: string) {
  const notionUrl = url + "/notion";
  try {
    const response = await axios.post(
      notionUrl,
      { word: word }, // "word"로 수정
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식 명시
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response?.data || err.message);
    } else {
      console.error(err);
    }
  }
}
