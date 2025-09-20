// StudentContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(() => {
    const stored = sessionStorage.getItem("studentInfo");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (student) {
      sessionStorage.setItem("studentInfo", JSON.stringify(student));
    } else {
      sessionStorage.removeItem("studentInfo");
    }
  }, [student]);

  return (
    <StudentContext.Provider value={{ student, setStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStudent = () => useContext(StudentContext);
