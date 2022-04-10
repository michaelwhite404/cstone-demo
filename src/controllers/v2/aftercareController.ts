import { Student } from "@models";
import { handlerFactory as factory } from ".";

export const getAllAftercareStudents = factory.getAll(Student, "student", { aftercare: true });

export const addAftercareStudent = "IMPLEMENT";
