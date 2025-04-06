import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FiX, FiMessageSquare, FiPaperclip, FiSend } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export default function TaskDetail({ taskId, onClose }) {
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);
  
  async function fetchTaskDetails() {
    try {
      setLoading(true);
      
      // Fetch task details
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();
      
      if (taskError) throw taskError;
      setTask(taskData);
      
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          users:user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      setComments(commentsData);
      
      // Fetch files
      const { data: filesData, error: filesError } = await supabase
        .from('task_files')
        .select(`
          *,
          users:uploaded_by (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('task_id', taskId)
        .order('uploaded_at', { ascending: false });
      
      if (filesError) throw filesError;
      setFiles(filesData);
      
      // Fetch assignees
      const { data: assigneesData, error: assigneesError } = await supabase
        .from('task_assignments')
        .select(`
          *,
          users:user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('task_id', taskId);
      
      if (assigneesError) throw assigneesError;
      setAssignees(assigneesData.map(a => a.users));
      
    } catch (error) {
      console.error('Error fetching task details:', error);
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  }
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          task_id: taskId,
          user_id: user.id,
          content: newComment
        })
        .select(`
          *,
          users:user_id (
            id,
            full_name,
            avatar_url
          )
        `);
      
      if (error) throw error;
      
      setComments([data[0], ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  if (error || !task) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-red-500">{error || 'Task not found'}</div>
        <button 
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-100 rounded-md"
        >
          Close
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center">
            <span className={`px-2 py-1 text-xs rounded-full ${
              task.status === 'To Do' ? 'bg-blue-100 text-blue-800' :
              task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.status}
            </span>
            <span className={`ml-2 text-xs ${
              task.priority === 'High' ? 'text-red-500' :
              task.priority === 'Medium' ? 'text-yellow-500' :
              'text-green-500'
            }`}>
              {task.priority} Priority
            </span>
          </div>
          <h2 className="text-xl font-semibold mt-2">{task.title}</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <FiX size={20} />
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
        <p className="text-gray-600">
          {task.description || 'No description provided.'}
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Assignees</h3>
        <div className="flex flex-wrap gap-2">
          {assignees.length > 0 ? (
            assignees.map(assignee => (
              <div key={assignee.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <div className="h-6 w-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs mr-2">
                  {assignee.full_name.charAt(0)}
                </div>
                <span className="text-sm">{assignee.full_name}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No assignees yet</div>
          )}
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center">
                  <FiPaperclip className="text-gray-400 mr-2" />
                  <span className="text-sm">{file.file_name}</span>
                </div>
                <a 
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Comments ({comments.length})
        </h3>
        
        <form onSubmit={handleSubmitComment} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiSend />
            </button>
          </div>
        </form>
        
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs mr-2">
                    {comment.users.full_name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{comment.users.full_name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-sm mt-2">{comment.content}</p>
            </div>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-4">
              No comments yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}