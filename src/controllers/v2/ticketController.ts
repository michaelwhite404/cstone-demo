import { Department, Ticket } from "@models";
import { APIFeatures, AppError, catchAsync } from "@utils";

export const getAllTickets = catchAsync(async (req, res) => {
  const query = Ticket.find().populate({
    path: "department submittedBy",
    select: "name email fullName",
  });
  const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
  const tickets = await features.query;
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tickets.length,
    data: {
      tickets,
    },
  });
});

export const getTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id).populate({
    path: "department submittedBy",
    select: "name email fullName",
  });
  if (!ticket) return next(new AppError("No ticket found with this id", 404));

  res.sendJson(200, { ticket });
});

export const createTicket = catchAsync(async (req, res, next) => {
  const dept = await Department.findById(req.body.department);
  if (!dept) return next(new AppError("There is no department with the given department id", 404));
  const assignedTo = dept.members.filter((m) => m.role === "LEADER").map((m) => m.userId);
  const { title, description, department, priority } = req.body;

  const response = await Ticket.create({
    title,
    description,
    department,
    priority,
    assignedTo,
    submittedBy: req.employee._id,
    status: "NOT_STARTED",
    createdAt: new Date(req.requestTime),
    updatedAt: new Date(req.requestTime),
  });

  const ticket = await Ticket.populate(response, {
    path: "department submittedBy assignedTo",
    select: "name email fullName",
  });
  res.sendJson(201, { ticket });
});

export const addTicketUpdate = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return next(new AppError("No ticket found with this id", 404));

  // const department = await Department.
});
