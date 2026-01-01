export const GET = async (request) => {
  return Response.json({
    status: "Success",
  });
};

export const POST = async (request) => {
  try {
    const { prompts } = await request.json();
    const res = await fetch("https://api.imagegpt.online/generate/text-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.IMAGE_GPT_API_KEY,
      },
      body: JSON.stringify({
        prompt: prompts,
        width: 512,
        height: 720,
        seed: 51,
        model: "turbo",
        outputType: "url",
      }),
    });
    const data = await res.json();

    return Response.json({
      data,
    });
  } catch (err) {
    return new Error(err);
  }
};
