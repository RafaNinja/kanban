import { useState } from "react";

function App() {
  const [columns, setColumns] = useState({
    todo: {
      name: "To Do",
      items: [
        { id: "1", content: "Wash the dishes" },
        { id: "2", content: "Take out the trash" },
      ],
    },
    inProgress: {
      name: "In Progress",
      items: [{ id: "3", content: "Cooking" }],
    },
    done: {
      name: "Done",
      items: [{ id: "4", content: "Take meds" }],
    },
  });

  const [newTask, setNewTask] = useState("");
  const [activeColumn, setActiveColumn] = useState("todo");
  const [draggedItem, setDraggedItem] = useState(null);

  const addNewTask = () => {
    if (newTask.trim() === "") return;

    const updatedColumns = { ...columns };

    updatedColumns[activeColumn].items.push({
      id: Date.now().toString(),
      content: newTask,
    });

    setColumns(updatedColumns);
    setNewTask("");
  };

  const removeTask = (columnId, taskId) => {
    const updatedColumns = { ...columns };
    updatedColumns[columnId].items = updatedColumns[columnId].items.filter(
      (item) => item.id !== taskId
    );
    setColumns(updatedColumns);
  };

  const handleDragStart = (columnId, item) => {
    setDraggedItem({ columnId, item });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceColumnId, item } = draggedItem;
    if (sourceColumnId === columnId) return;

    const updatedColumns = { ...columns };

    updatedColumns[sourceColumnId].items = updatedColumns[
      sourceColumnId
    ].items.filter((i) => i.id !== item.id);

    updatedColumns[columnId].items.push(item);

    setColumns(updatedColumns);
    setDraggedItem(null);
  };

  const columnStyles = {
    todo: {
      header: "bg-gradient-to-r from-blue-600 to-blue-400",
      border: "border-blue-200",
    },
    inProgress: {
      header: "bg-gradient-to-r from-yellow-600 to-yellow-400",
      border: "border-yellow-200",
    },
    done: {
      header: "bg-gradient-to-r from-red-600 to-red-400",
      border: "border-red-200",
    },
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-b from-[#272530] to-[#e8f3c5] flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-6xl rounded-lg">
        <h1 className="text-6xl font-serif mb-8 text-transparent bg-clip-text bg-gradient-to-t from-yellow-100 via-amber-500 to-red-500">
          Kanban Board
        </h1>

        <div className="mb-8 flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new mission"
            className="flex-grow p-3 bg-zinc-700 text-white"
            onKeyDown={(e) => e.key === "Enter" && addNewTask()}
          />

          <select
            value={activeColumn}
            onChange={(e) => setActiveColumn(e.target.value)}
            className="p-3 bg-zinc-700 text-white border-0 border-l border-zinc-600"
          >
            {Object.keys(columns).map((columnId) => (
              <option value={columnId} key={columnId}>
                {columns[columnId].name}
              </option>
            ))}
          </select>

          <button
            onClick={addNewTask}
            className="px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white font-medium"
          >
            Add
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 w-full">
          {Object.keys(columns).map((columnId) => (
            <div
              key={columnId}
              className={`flex-shrink-0 w-80 bg-zinc-800 rounded-lg shadow-xl border-t-4 ${columnStyles[columnId].border}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div
                className={`p-4 text-white font-bold text-xl rounded-t-md ${columnStyles[columnId].header}`}
              >
                {columns[columnId].name}
                <span className="ml-2 px-2 py-1 bg-zinc-800 bg-opacity-30 rounded-full text-sm">
                  {columns[columnId].items.length}
                </span>
              </div>

              <div className="p-3 min-h-64">
                {columns[columnId].items.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 italic text-sm">
                    Drop tasks here
                  </div>
                ) : (
                  columns[columnId].items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(columnId, item)}
                    >
                      <span className="mr-2">{item.content}</span>
                      <button
                        onClick={() => removeTask(columnId, item.id)}
                        className="text-zinc-400 hover:text-red-400"
                      >
                        X
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;


