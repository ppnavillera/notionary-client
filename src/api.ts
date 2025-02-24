import axios from "axios";

const url =
  "https://nxogwwumniauclwarsbt.supabase.co/functions/v1/enkoextension";

export async function getWord(word: string) {
  try {
    const response = await axios.post(
      url,
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
