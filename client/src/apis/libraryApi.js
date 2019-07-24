import axios from "axios";

axios.defaults.timeout = 60 * 4 * 1000;

const instance = axios.create({
  baseURL: `http://localhost:3010/api`
});

export const createAttendance = async ({ student_nim, time }) => {
  const response = await instance.post("/attendances", { student_nim, time });
  return response.data;
};

export const getStudents = async () => {
  const response = await instance.get("/students");
  return response.data;
};
