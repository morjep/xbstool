const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const rules = `
* Top level task or item
** Second level task or item, also known as the parent
*** Third level task or item, also known as the child

Rule 1: The number of asterisks indicates the level of the task or item.
Rule 2: It is forbidden to use four or more asterisks.
Rule 3: It must be asterisk and no other character to indicate the level of the task or item.
Rule 4: Use // to add a comment to the individual task or item, i.e. ** Second level task or item // This is a comment
Rule 5: Any line that starts with anything else than an asterisk is ignored (can have spaces before the asterisk)

There are a number of tags that can be used to indicate the status of the task or item:
__pb_<value>__ = progress bar, where <value> is the percentage of completion, example: __pb_50__ means 50% complete
__is__ = indicator_success
__iw__ = indicator_warning
__ie__ = indicator_error
__due_<value>__ = due date, where <value> is the duedate in any string format, i.e. __due_2020-12-31__ or just __due_now__
__connect_parents__ can only be set on the top level and means that the parents (second level) will be connected chronologicaly
Tags are always placed after the task or item with at least a single space before the tag and on the same line (i.e. no new lines before the tag), i.e. ** Second level task or item __pb_50__ // This is a comment
`;

const requestMessage = {
  role: "user",
  content:
    `Please assist me in making work-breakdown structures using the following rules: ` + rules,
};

const reviewMessage = {
  role: "user",
  content:
    `Review the current WBS structure for clarity and ambiguity and suggest improvements. The WBS is constructed using the following rules: ` +
    rules +
    `
   Additional rule: Do not change the WBS structure, do not delete anything, only add inline comments
    `,
};

const reviewRequest = `
  Please add inline comments using "//" to indicate any issues with the current WBS structure.

`;

const chatCompletion = async (
  currentContent: string,
  notes: string,
  primeMessage: any,
  userRequest: string
) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      primeMessage,
      { role: "user", content: "Current WBS: " + currentContent },
      { role: "user", content: "Additional notes: " + notes },
      { role: "user", content: userRequest },
    ],
  });
  console.log("Data: ", completion.data.choices[0]);
  console.log("Usage: ", completion.data.usage);
  return completion.data.choices[0].message.content;
};

export async function handleAIrequest(data: string, notes: string, aiRequest: string) {
  console.log("AI request: " + aiRequest);
  console.log("Data: " + data);
  const newData = await chatCompletion(data, notes, requestMessage, aiRequest);
  return newData;
}

export async function handleAIreview(data: string, notes: string) {
  console.log("AI request: " + reviewRequest);
  console.log("Data: " + data);
  const newData = await chatCompletion(data, notes, reviewMessage, reviewRequest);
  return newData;
}
