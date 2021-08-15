const STUDENT_COLUMNS = [
  { Header: "Name", accessor: "fullName" },
  { Header: "Grade", accessor: "grade", Cell: ({ value }: any) => (value === 0 ? "K" : value) },
  { Header: "RenWeb ID", accessor: "customID" },
];

export default STUDENT_COLUMNS;
