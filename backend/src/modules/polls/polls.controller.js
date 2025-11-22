import * as PollsService from "./polls.service.js";

export const createPoll = async (req, res) => {
  const userId = req.user.id;
  const { question, options } = req.body || {};
  if (!question || !Array.isArray(options) || options.length < 2) {
    const e = new Error("question and at least two options are required");
    e.status = 400;
    throw e;
  }
  const created = await PollsService.createPoll({ question, options, createdBy: userId });
  res.json(created);
};

export const listPolls = async (req, res) => {
  const { active = "true", page = 1, limit = 20 } = req.query;
  const userId = req.user.id;
  const data = await PollsService.listPolls({ active: String(active) === "true", page: Number(page), limit: Number(limit), userId });
  res.json(data);
};

export const getPollById = async (req, res) => {
  const id = Number(req.params.id);
  const poll = await PollsService.getPollById({ id });
  if (!poll) {
    const e = new Error("Poll not found");
    e.status = 404;
    throw e;
  }
  res.json(poll);
};

export const vote = async (req, res) => {
  const pollId = Number(req.params.pollId);
  const userId = req.user.id;
  const { option } = req.body || {};
  console.log(`Vote request: pollId=${pollId}, userId=${userId}, option=${option}`);
  if (!option) {
    const e = new Error("option is required");
    e.status = 400;
    throw e;
  }
  await PollsService.vote({ pollId, userId, option });
  res.json({ success: true });
};

export const results = async (req, res) => {
  const id = Number(req.params.id);
  const data = await PollsService.results({ id });
  res.json(data);
};

export const deletePoll = async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await PollsService.deletePoll({ id });
  res.json(deleted);
};

