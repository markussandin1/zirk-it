import { VertexAI } from '@google-cloud/vertexai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.GOOGLE_CLOUD_PROJECT || !process.env.GOOGLE_CLOUD_LOCATION || !process.env.GOOGLE_API_KEY) {
      throw new Error('Missing Vertex AI environment variables.');
    }

    const vertex_ai = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.GOOGLE_CLOUD_LOCATION,
      googleAuthOptions: {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      },
    });

    const model = 'gemini-pro';

    const generativeModel = vertex_ai.getGenerativeModel({
      model: model,
      // The following parameters are optional
      // They can be set to control the behavior of the model
      // generation_config: {
      //   maxOutputTokens: 2048,
      //   temperature: 0.9,
      //   topP: 1,
      // },
      // safety_settings: [
      //   {
      //     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      //   },
      // ],
    });

    const resp = await generativeModel.generateContent(prompt);
    const text = resp.response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
