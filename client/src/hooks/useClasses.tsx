import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { APIError } from "../types/apiResponses";
import Class from "../types/class";

export default function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  useEffect(() => {
    getStudents();

    async function getStudents() {
      try {
        const res = await axios.get("/api/v2/students/group");
        setClasses(res.data.data.grades);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, []);
  return classes;
}
