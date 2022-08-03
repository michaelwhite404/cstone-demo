import { Department, Employee, Ticket, TicketAssign, TicketComment, TicketTag } from "@models";
import { EmployeeModel, TicketDocument } from "@@types/models";
import { APIFeatures, AppError, catchAsync } from "@utils";

const ticketQuery = (employee: any) =>
  Ticket.findOne({
    // Either was created by requesting user or assigned to requesting user
    $or: [{ submittedBy: employee._id }, { assignedTo: { $in: employee._id } }],
    // @ts-ignore
  }).populate({
    path: "department submittedBy assignedTo",
    select: "name email fullName",
  });

export const getAllTickets = catchAsync(async (req, res) => {
  const query = Ticket.find({
    // Either was created by requesting user or assigned to requesting user
    $or: [{ submittedBy: req.employee._id }, { assignedTo: { $in: req.employee._id } }],
    // @ts-ignore
  }).populate({
    path: "department submittedBy assignedTo",
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
  const ticket = await ticketQuery(req.employee);
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
    status: "OPEN",
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
  const ticket: TicketDocument = await Ticket.findOne({
    // Either was created by requesting user or assigned to requesting user
    $or: [{ submittedBy: req.employee._id }, { assignedTo: { $in: req.employee._id } }],
    // @ts-ignore
  }).populate({
    path: "department submittedBy assignedTo",
    select: "name email fullName members",
  });
  if (!ticket) return next(new AppError("No ticket found with this id", 404));
  if (ticket.submittedBy._id.toString() === req.employee._id.toString()) {
    return next(new AppError("You are not authorized to update this ticket", 403));
  }
  const data = {
    date: req.requestTime,
    createdBy: req.employee._id,
    ticket: ticket._id,
  };
  let update;
  switch (req.body.type) {
    case "COMMENT":
      update = await TicketComment.create({ ...data, comment: req.body.comment });
      break;
    case "ASSIGN":
      const assignedIds = (ticket.assignedTo as Pick<EmployeeModel, "_id">[]).map((e) =>
        e._id.toString()
      );
      // If employee is valid and employee is not in the assignedTo list
      if (assignedIds.includes(req.body.assign))
        return next(
          new AppError("The user you are trying to assign is already assigned to this ticket", 400)
        );
      const emp = await Employee.findById(req.body.assign);
      if (!emp)
        return next(new AppError("There is user with the id you are trying to assign", 400));
      update = await TicketAssign.create({ ...data, assign: req.body.assign, op: req.body.op });
      /**
       *
       * // Update assignedToProperty in ticket
       *
       */
      break;
    case "TAG":
      update = await TicketTag.create({ ...data, tag: req.body.tag });
      break;
    default:
      return next(new AppError("", 400));
  }

  res.sendJson(200, update);
});
