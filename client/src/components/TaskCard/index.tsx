import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { useUpdateTaskStatusMutation } from "@/state/api";
import { Status } from "@/state/api";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleStatusChange = async (newStatus: Status) => {
    try {
      await updateTaskStatus({ taskId: task.id, status: newStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <div className="mb-3 rounded bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
        {task.attachments && task.attachments.length > 0 && (
          <div>
            <strong>Attachments:</strong>
            <div className="flex flex-wrap">
              {task.attachments && task.attachments.length > 0 && (
                <Image
                  src={`https://manageit-s3-images.s3.us-east-1.amazonaws.com/${task.attachments[0].fileURL}`}
                  alt={task.attachments[0].fileName}
                  width={400}
                  height={200}
                  className="rounded-md"
                />
              )}
            </div>
          </div>
        )}
        <p>
          <strong>ID:</strong> {task.id}
        </p>
        <p>
          <strong>Title:</strong> {task.title}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {task.description || "No description provided"}
        </p>
        <p>
          <strong>Status:</strong> {task.status}
        </p>
        <p>
          <strong>Priority:</strong> {task.priority}
        </p>
        <p>
          <strong>Tags:</strong> {task.tags || "No tags"}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {task.startDate ? format(new Date(task.startDate), "P") : "Not set"}
        </p>
        <p>
          <strong>Due Date:</strong>{" "}
          {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}
        </p>
        <p>
          <strong>Author:</strong>{" "}
          {task.author ? task.author.username : "Unknown"}
        </p>
        <p>
          <strong>Assignee:</strong>{" "}
          {task.assignee ? task.assignee.username : "Unassigned"}
        </p>
      </div>

      <button onClick={handleMenuClick} className="absolute right-2 top-2 p-1">
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-8 z-10 w-48 rounded-md bg-white shadow-lg dark:bg-dark-secondary"
        >
          <div className="py-1">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-dark-tertiary"
              onClick={() => handleStatusChange(Status.ToDo)}
            >
              Set To Do
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-dark-tertiary"
              onClick={() => handleStatusChange(Status.WorkInProgress)}
            >
              Set In Progress
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-dark-tertiary"
              onClick={() => handleStatusChange(Status.Completed)}
            >
              Set Completed
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-tertiary"
              onClick={() => {
                /* TODO: Implement delete */
              }}
            >
              Delete Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
