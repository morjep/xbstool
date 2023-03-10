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
    @endWBS // End of WBS

    The wbs content must always be between the @startWBS and @endWBS tags.

    Rule 1: The number of asterisks indicates the level of the task or item.
    Rule 2: It is forbidden to use four or more asterisks.
    Rule 3: It must be asterisk and no other character to indicate the level of the task or item.
    Rule 4: Use // to add a comment to the individual task or item, i.e. ** Second level task or item // This is a comment

    There are a number of tags that can be used to indicate the status of the task or item:
    __pb<value>__ = progress bar, where <value> is the percentage of completion, example: __pb50__ means 50% complete
    __is__ = indicator_success
    __iw__ = indicator_warning
    __ie__ = indicator_error
    __due_<value>__ = due date, where <value> is the duedate in any string format, i.e. __due_2020-12-31__ or just __due_now__
    __connect_parents__ can only be set on the top level and means that the parents (second level) will be connected chronologicaly
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
