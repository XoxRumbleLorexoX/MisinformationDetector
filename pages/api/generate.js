import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  // #GOALS
  // #. Is what he said true or false? Misinformation detection
  // #Answer true or false : “The world is flat."
  // #Veracity: False. The world is round.
  // #Prove $(the world is round.)
  // #Auio,text,video,images,etc to be checked as well!

  
  const trueorfalse = req.body.trueorfalse;
  if (trueorfalse.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid statement that you would like to check for its truthfulness.",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      max_tokens: 1000,
      prompt: generatePrompt(req.body.trueorfalse),
      temperature: 0.8,
    });
    console.log(completion.data.choices);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(trueorfalse) {
  return `Answer true or false and explain why it is this: ${trueorfalse}`;
}
