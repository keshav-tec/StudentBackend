import fs from "fs/promises";


export async function transcribeAudio(
  filePath,
  {
    mode = "transcribe"
  } = {}
) {

  if (!process.env.SARVAM_API_KEY) {

    throw new Error(
      "SARVAM_API_KEY is not configured"
    );

  }


  const bytes = await fs.readFile(filePath);


  const form = new FormData();


  form.append(
    "file",
    new Blob([bytes]),
    filePath.split("/").pop()
  );


  form.append(
    "model",
    process.env.SARVAM_STT_MODEL || "saaras:v4"
  );


  form.append(
    "mode",
    mode
  );


  const response = await fetch(
    "https://api.sarvam.ai/speech-to-text",
    {
      method: "POST",

      headers: {
        "api-subscription-key":
          process.env.SARVAM_API_KEY
      },

      body: form
    }
  );


  const data = await response.json();


  if (!response.ok) {

    throw new Error(
      data?.error?.message ||
      `Sarvam STT failed (${response.status})`
    );

  }


  return data;

}