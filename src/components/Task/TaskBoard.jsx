import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from '../../lib/supabase';
import { FiFilter, FiCalendar, FiMoreVertical, FiPlus } from 'react-icons/fi';
import TaskCard from './TaskCard';

export default function TaskBoard() {
  const [columns, setColumns] = useState({
    'To Do': {
      id: 'todo',
      tasks: []
    },
    'In Progress': {
      id: 'inprogress',
      tasks: []
    },
    'Done': {
      id: 'done',
      tasks: []
    }
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  async function fetchTasks() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_assignments(
            user_id
          ),
          comments(count),
          task_files(count)
        `)
        .eq('project_LSBU', 'Project LSBU'); // Replace with actual project ID
      
      if (error) throw error;
      
      // Group tasks by status
      const newColumns = {
        'To Do': {
          id: 'todo',
          tasks: []
        },
        'In Progress': {
          id: 'inprogress',
          tasks: []
        },
        'Done': {
          id: 'done',
          tasks: []
        }
      };
      
      data.forEach(task => {
        const status = task.status;
        if (newColumns[status]) {
          newColumns[status].tasks.push({
            ...task,
            commentCount: task.comments[0].count,
            fileCount: task.task_files[0].count,
            assignees: task.task_assignments.map(a => a.user_id)
          });
        }
      });
      
      setColumns(newColumns);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }
  
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside any droppable area
    if (!destination) return;
    
    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Find source and destination column
    const sourceColumn = Object.keys(columns).find(
      col => columns[col].id === source.droppableId
    );
    
    const destColumn = Object.keys(columns).find(
      col => columns[col].id === destination.droppableId
    );
    
    if (!sourceColumn || !destColumn) return;
    
    // Create new columns state
    const newColumns = { ...columns };
    
    // Remove task from source column
    const [movedTask] = newColumns[sourceColumn].tasks.splice(source.index, 1);
    
    // Add task to destination column
    newColumns[destColumn].tasks.splice(destination.index, 0, movedTask);
    
    setColumns(newColumns);
    
    // Update task status in database
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: destColumn })
        .eq('id', draggableId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revert changes if update fails
      fetchTasks();
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mobile App</h1>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-md flex items-center">
            <FiPlus className="mr-1" />
            Invite
          </button>
          <button className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md">
            Share
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex space-x-4">
            <span className="text-sm font-medium">Filter through tasks</span>
            <span className="text-sm font-medium">Filter Through Dates</span>
          </div>
          <div className="mt-3 sm:mt-0 flex space-x-2">
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-md flex items-center">
              <FiFilter className="mr-2" />
              Filter
            </button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-md flex items-center">
              <FiCalendar className="mr-2" />
              Today
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10">Loading tasks...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(columns).map(columnKey => (
              <div key={columnKey} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${
                      columnKey === 'To Do' ? 'bg-blue-500' :
                      columnKey === 'In Progress' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></span>
                    <h3 className="font-medium">{columnKey}</h3>
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                      {columns[columnKey].tasks.length}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiPlus />
                  </button>
                </div>
                
                <Droppable droppableId={columns[columnKey].id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-3 min-h-[200px]"
                    >
                      {columns[columnKey].tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
// Add imports for Modal and NewTaskForm
import Modal from '../UI/Modal';
import NewTaskForm from './NewTaskForm';
import TaskDetail from './TaskDetail';

// Add state for modals
const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);

// Add function to handle task click
const handleTaskClick = (task) => {
  setSelectedTask(task);
};

// Add function to handle task creation
const handleTaskCreated = (newTask) => {
  fetchTasks();
};

// Add the following inside the TaskBoard component UI, right after the column heading
<>
    // Add the following inside the TaskBoard component UI, right after the column heading
    <button
        onClick={() => setIsNewTaskModalOpen(true)}
        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md flex items-center ml-auto"
    >
        <FiPlus className="mr-1" />
        Add Task
    </button>
    // Add the following at the bottom of the component return
    <Modal isOpen={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)}>
        <NewTaskForm
            projectId="Project LSBU"
            onClose={() => setIsNewTaskModalOpen(false)}
            onTaskCreated={handleTaskCreated} />
    </Modal><Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)}>
        {selectedTask && <TaskDetail taskId={selectedTask.id} onClose={() => setSelectedTask(null)} />}
    </Modal></>