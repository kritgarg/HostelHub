import { prisma } from "../../config/db.js";

export const createPoll = async ({ question, options, createdBy }) => {
  return prisma.poll.create({
    data: {
      question,
      options: options, // JSON array
      createdBy: Number(createdBy),
    },
    select: { id: true, question: true, options: true, createdBy: true, createdAt: true },
  });
};

export const listPolls = async ({ active = true, page = 1, limit = 20 }) => {
  // No expiresAt in schema; 'active' simply returns all for now
  const where = {};
  const [items, total] = await Promise.all([
    prisma.poll.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, question: true, options: true, createdAt: true },
    }),
    prisma.poll.count({ where }),
  ]);
  return { items, total, page, limit };
};

export const getPollById = async ({ id }) => {
  return prisma.poll.findUnique({
    where: { id: Number(id) },
    select: { id: true, question: true, options: true, createdAt: true },
  });
};

export const vote = async ({ pollId, userId, option }) => {
  const poll = await prisma.poll.findUnique({ where: { id: Number(pollId) } });
  if (!poll) {
    const e = new Error("Poll not found");
    e.status = 404;
    throw e;
  }
  const opts = Array.isArray(poll.options) ? poll.options : [];
  if (!opts.includes(option)) {
    const e = new Error("Invalid option");
    e.status = 400;
    throw e;
  }

  const existing = await prisma.pollVote.findFirst({ where: { pollId: Number(pollId), userId: Number(userId) } });
  if (existing) {
    const e = new Error("Already voted");
    e.status = 409;
    throw e;
  }

  await prisma.pollVote.create({ data: { pollId: Number(pollId), userId: Number(userId), option } });
  return { success: true };
};

export const results = async ({ id }) => {
  const poll = await prisma.poll.findUnique({ where: { id: Number(id) } });
  if (!poll) {
    const e = new Error("Poll not found");
    e.status = 404;
    throw e;
  }
  const counts = await prisma.pollVote.groupBy({
    by: ["option"],
    where: { pollId: Number(id) },
    _count: { _all: true },
  });
  return counts.map((c) => ({ option: c.option, votes: c._count._all }));
};

export const deletePoll = async ({ id }) => {
  // Optionally delete votes first if onDelete is not cascaded
  await prisma.pollVote.deleteMany({ where: { pollId: Number(id) } });
  return prisma.poll.delete({ where: { id: Number(id) }, select: { id: true } });
};

