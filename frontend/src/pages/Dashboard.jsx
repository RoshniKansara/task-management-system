import { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard.css";
import "../AdminDashboard.css";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("NONE");
  const [user, setUser] = useState(null);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    task => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    task => !task.completed
  ).length

  const fetchUser = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    "https://task-management-backend-3ecl.onrender.com/auth/me",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setUser(response.data);
};

  const fetchTasks = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://task-management-backend-3ecl.onrender.com/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTasks(response.data);
      setLoading(false);

    } catch (error) {
      console.error(error);
      console.log("STATUS =", error.response?.status);
      console.log("DATA =", error.response?.data);
      console.log("HEADERS =", error.response?.headers);
    }
  };

  useEffect(() => {
      fetchTasks();
      fetchUser();
  }, []);

  const deleteTask = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `https://task-management-backend-3ecl.onrender.com/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Task deleted successfully!");

      fetchTasks();

      } catch (error) {
        console.error(error);
      }
    };

    const toggleStatus = async (task) => {

      try {

        const token = localStorage.getItem("token");

        await axios.put(
          `https://task-management-backend-3ecl.onrender.com/tasks/${task.id}`,
          {
            ...task,
            completed: !task.completed
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        fetchTasks();

      } catch (error) {
        console.error(error);
      }
    };


    const editTask = (task) => {

      setEditingTaskId(task.id);

      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setCategory(task.category);
      setDueDate(task.dueDate);
    };

    const createTask = async () => {

      try {

        const token = localStorage.getItem("token");

        console.log("REQUEST BODY", {
          title,
          description,
          priority,
          category,
          dueDate,
          completed: false
      });

      if (!title.trim()) {
        toast.error("Title is required");
        return;
      }

      if (!priority) {
        toast.error("Priority is required");
        return;
      }

      if (!dueDate) {
        toast.error("Due date is required");
        return;
      }


      await axios.post(
        "https://task-management-backend-3ecl.onrender.com/tasks",
        {
          title,
          description,
          priority,
          category,
          dueDate,
          completed: false
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchTasks();
      toast.success("Task created successfully!");

      setTitle("");
      setDescription("");
      setPriority("");
      setCategory("");
      setDueDate("");

    } catch (error) {

      console.error(error);

      console.log("STATUS =", error.response?.status);
      console.log("DATA =", error.response?.data);

    }
  };

  const updateTask = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `https://task-management-backend-3ecl.onrender.com/tasks/${editingTaskId}`,
        {
          title,
          description,
          priority,
          category,
          dueDate,
          completed: false
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchTasks();
      toast.success("Task updated successfully!");

      setEditingTaskId(null);

      setTitle("");
      setDescription("");
      setPriority("");
      setCategory("");
      setDueDate("");

    } catch (error) {
      console.error(error);
    }
  };
  console.log(tasks);

  const chartData = [
    {
      name: "Completed",
      value: completedTasks
    },
    {
      name: "Pending",
      value: pendingTasks
    }
  ];

  const COLORS = ["#22c55e", "#f59e0b"];

  const highCount = tasks.filter(
    task => task.priority?.toUpperCase() === "HIGH"
  ).length;

  const mediumCount = tasks.filter(
    task => task.priority?.toUpperCase() === "MEDIUM"
  ).length;

  const lowCount = tasks.filter(
    task => task.priority?.toUpperCase() === "LOW"
  ).length;

  const priorityData = [
    {
      priority: "High",
      count: highCount
    },
    {
      priority: "Medium",
      count: mediumCount
    },
    {
      priority: "Low",
      count: lowCount
    }
  ];

  const handleLogout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("role");

  window.location.href = "/";

};

  if (loading) {
  return <h2>Loading...</h2>;
}

  return (
    <div className="dashboard-container">

      <div className="navbar">

        <div className="user-info">
          <h2>👋 Welcome Back, {user?.name}</h2>

          <p>
            Stay organized and manage your tasks efficiently.
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
        

        

        <h2 className="section-title">Task Statistics</h2>

        <div className="stats-container">
          <div className="stat-card">
            <h3>{totalTasks}</h3>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card">
            <h3>{completedTasks}</h3>
            <p>Completed</p>
          </div>

          <div className="stat-card">
            <h3>{pendingTasks}</h3>
            <p>Pending</p>
          </div>
        </div>


          <div className="charts-row">

            <div className="chart-card">

              <h2 className="section-title">
                Task Analytics
              </h2>

                <div className="chart-container">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>

            </div>

            <div className="chart-card">

              <h2 className="section-title">
                Priority Analytics
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="count"
                    fill="#2563eb"
                    radius={[12, 12, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

            </div>

          </div>

        <hr />

      <div className="form-container">

  <h2>
    {editingTaskId
      ? "Edit Task"
      : "Create Task"}
  </h2>

  <input
    type="text"
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />

  <input
    type="text"
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />

  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="">Select Category</option>
    <option value="Work">Work</option>
    <option value="Study">Study</option>
    <option value="Project">Project</option>
    <option value="Personal">Personal</option>
    <option value="Health">Health</option>
  </select>

  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
  >
    <option value="">Select Priority</option>
    <option value="LOW">LOW</option>
    <option value="MEDIUM">MEDIUM</option>
    <option value="HIGH">HIGH</option>
  </select>

  <input
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
  />

  <button
    onClick={
      editingTaskId
        ? updateTask
        : createTask
    }
  >
    {
      editingTaskId
        ? "Update Task"
        : "Create Task"
    }
  </button>

</div>

      <hr />

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      
      

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="ALL">All</option>
        <option value="COMPLETED">Completed</option>
        <option value="PENDING">Pending</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="NONE">Sort By</option>
        <option value="PRIORITY">Priority</option>
        <option value="DATE">Due Date</option>
      </select>

      <h2>My Tasks</h2>
      {
        tasks.length === 0 &&
        <h3>No tasks found 📭</h3>
      }
        {tasks
          .filter(task =>
            task.title
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
          
          .filter(task => {

            if (filterStatus === "COMPLETED") {
              return task.completed;
            }

            if (filterStatus === "PENDING") {
              return !task.completed;
            }

            return true;
          })

          .sort((a, b) => {

            if (sortBy === "DATE") {
              return new Date(a.dueDate) - new Date(b.dueDate);
            }

            if (sortBy === "PRIORITY") {

              const order = {
                HIGH: 3,
                MEDIUM: 2,
                LOW: 1
              };

              return order[b.priority] - order[a.priority];
            }

            return 0;
          })

          .map(task => (
        <div
          key={task.id}
          className={
            task.completed
              ? "task-card task-completed"
              : "task-card"
          }
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>
            Priority: 
            <span className={task.priority?.toLowerCase()}>
            {" "}{task.priority}
            </span>
          </p>
          <p>Category: {task.category}</p>
          <p>Due Date: {task.dueDate}</p>

          {
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            !task.completed && (
              <p className="overdue">
                ⚠️ Overdue
              </p>
            )
          }
          

          <div className="task-actions">
          <button
            onClick={() => editTask(task)}
          >
            Edit
          </button>

          {" "}

          <button
            onClick={() => {

              if (window.confirm("Delete this task?")) {
                deleteTask(task.id);
              }

            }}
          >
            Delete
          </button>

          <button
            onClick={() => toggleStatus(task)}
          >
            {
              task.completed
                ? "Mark Pending"
                : "Mark Complete"
            }
          </button>

          </div>
          <span className={task.completed ? "status-done" : "status-pending"}>
            {task.completed ? "Completed" : "Pending"}
          </span>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;