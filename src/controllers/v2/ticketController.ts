import { Department, Employee, Ticket, TicketAssign, TicketComment, TicketTag } from "@models";
import { EmployeeModel } from "@@types/models";
import { APIFeatures, AppError, catchAsync } from "@utils";

const ticketQuery = (employee: any) =>
  Ticket.findOne({
    // Either was created by requesting user or assigned to requesting user
    $or: [{ submittedBy: employee._id }, { assignedTo: { $in: employee._id } }],
    // @ts-ignore
  }).populate({
    path: "department submittedBy assignedTo updates",
    select: "name email fullName comment assign op",
    populate: { path: "assign", select: "fullName email" },
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
  const ticket = await Ticket.findOne({
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
  let newTicket;
  switch (req.body.type) {
    case "COMMENT":
      await TicketComment.create({ ...data, comment: req.body.comment });
      break;
    case "ASSIGN":
      // Make sure valid employee
      const emp = await Employee.findOne({ _id: req.body.assign, active: true });
      if (!emp)
        return next(
          new AppError("There is no active user with the id you are trying to assign", 400)
        );
      if (!["ADD", "REMOVE"].includes(req.body.op))
        return next(new AppError("`op` property must be have the value `ADD` or `REMOVE`", 400));
      const assignedIds = (ticket.assignedTo as Pick<EmployeeModel, "_id">[]).map((e) =>
        e._id.toString()
      );
      // If operation is add
      if (req.body.op === "ADD") {
        // If employee is not in the assignedTo list
        if (assignedIds.includes(req.body.assign))
          return next(
            new AppError(
              "The user you are trying to assign is already assigned to this ticket",
              400
            )
          );
        const req1 = Ticket.findByIdAndUpdate(
          ticket._id,
          {
            $push: { assignedTo: emp._id },
          },
          { new: true }
        ).populate({
          path: "department submittedBy assignedTo",
          select: "name email fullName",
        });
        const req2 = TicketAssign.create({ ...data, assign: req.body.assign, op: req.body.op });
        [newTicket] = await Promise.all([req1, req2]);
        break;
      }
      // If operation is remove
      if (!assignedIds.includes(req.body.assign)) {
        return next(new AppError("The user is not assigned to this ticket", 400));
      }
      const newAssigned = (ticket.assignedTo as EmployeeModel[]).filter(
        (e) => e._id.toString() !== emp._id.toString()
      );
      ticket.assignedTo = newAssigned;
      const req1 = await ticket.save();
      const req2 = TicketAssign.create({ ...data, assign: req.body.assign, op: req.body.op });
      [newTicket] = await Promise.all([req1, req2]);
      // const newAssigned = assignedIds.filter(ids => ids !== emp._id)
      // ticket.assignedTo = newAssigned
      break;

    case "TAG":
      await TicketTag.create({ ...data, tag: req.body.tag });
      break;
    default:
      return next(new AppError("", 400));
  }

  res.sendJson(200, { ticket: newTicket });
});
