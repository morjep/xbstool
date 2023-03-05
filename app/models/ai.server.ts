const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const chatCompletion = async (currentContent: string, userRequest: string) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `
    Please assist me in making work-breakdown structures using the following rules:  "
    @startWBS // Start of WBS
    * Top level task or item
    ** Second level task or item, also known as the parent
    *** Third level task or item, also known as the child
    Rule 1: The number of asterisks indicates the level of the task or item.
    Rule 2: It is forbidden to use four or more asterisks.
    Rule 3: It must be asterisk and no other character to indicate the level of the task or item.
    @endWBS // End of WBS
    `,
      },
      { role: "user", content: "Current WBS: " + currentContent },
      { role: "user", content: userRequest },
    ],
  });
  console.log("Data: ", completion.data.choices[0]);
  console.log("Usage: ", completion.data.usage);
  return completion.data.choices[0].message.content;
};

export async function handleAIrequest(data: string, aiRequest: string) {
  console.log("AI request: " + aiRequest);
  console.log("Data: " + data);
  const newData = await chatCompletion(data, aiRequest);
  return newData;
}
