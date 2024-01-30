export const priorityList = [
  {
    id: 1,
    description: "Низкий",
  },
  {
    id: 2,
    description: "Средний",
  },
  {
    id: 3,
    description: "Высокий",
  },
];

export const getPriorityDescriptionByNumber = (priority) => {
  return priorityList.find((p) => p.id === priority)?.description ?? "Другое";
};
