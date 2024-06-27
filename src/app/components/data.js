
export const tables = [
  {
    id: 'Temp1',
    name: 'Temp1',
    children: [
      { id: 'Temp1_employee_salary', name: '1_employee_salary', pointer: "first" },
      { id: 'Temp1_employee', name: '1_employee',  pointer: "second" },
      { id: 'Temp1_patients', name: '1_patients', pointer: "third" },
    ],
  },
  {
    id: 'Temp2',
    name: 'Temp2',
    children: [
      { id: 'Temp2_employee_salary', name: '2_employee_salary', pointer: "first"  },
      { id: 'Temp2_employee', name: '2_employee', pointer: "second" },
      { id: 'Temp2_patients', name: '2_patients', pointer: "third" },
    ],
  },
];