import { FiMoreHorizontal, FiMessageSquare, FiPaperclip } from 'react-icons/fi';

export default function TaskCard({ task }) {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'To Do':
        return 'text-blue-500 bg-blue-50';
      case 'In Progress':
        return 'text-yellow-500 bg-yellow-50';
      case 'Done':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start">
        <div className="text-xs font-medium">
          <span className={getPriorityClass(task.priority)}>{task.priority}</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <FiMoreHorizontal />
        </button>
      </div>
      
      <h4 className="font-medium mt-2">{task.title}</h4>
      
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
        {task.description}
      </p>
      
      {/* Task Images (if any) */}
      {task.image_url && (
        <div className="mt-3">
          <img 
            src={task.image_url} 
            alt={task.title} 
            className="rounded-lg w-full h-32 object-cover"
          />
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between">
        {/* Assignees */}
        <div className="flex -space-x-2">
          {/* Here you would map through assignees */}
          <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
            U
          </div>
        </div>
        
        {/* Metadata */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="flex items-center">
            <FiMessageSquare className="mr-1" />
            <span>{task.commentCount || 0}</span>
          </div>
          
          <div className="flex items-center">
            <FiPaperclip className="mr-1" />
            <span>{task.fileCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}