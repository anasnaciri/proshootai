import { useState, useEffect, useRef } from 'react';
import splitId from '@/utils/formatting/splitId';
import { Link } from 'react-router';
import { ImageOff, Edit2 } from 'lucide-react';
import useUpdateProjectTitle from '@/pages/designStudio/hooks/useUpdateProjectTitle';

interface Project {
  SK: string;
  preview: string;
  title: string;
  created_at: string;
  isUpdating?: boolean;
}

const ProjectCard = ({ project }: { project: Project }) => {
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project.title);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateProjectTitleMutation = useUpdateProjectTitle();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        formRef.current &&
        buttonRef.current &&
        !formRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
        setEditedTitle(project.title); // Reset to original title if cancelled
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, project.title]);

  const handleImageError = () => {
    console.log('error triggered');
    setImageError(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the edit button
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the title
    updateProjectTitleMutation.mutate({
      id: splitId(project.SK),
      title: editedTitle,
    });
    // For now, we'll just exit edit mode
    setIsEditing(false);
  };

  const showPlaceholder = imageError || !project.preview;

  const BUCKET = import.meta.env.VITE_BUCKET;
  const REGION = import.meta.env.VITE_AWS_REGION;

  return (
    <Link
      to={`/studios/design-studio/${splitId(project.SK)}`}
      className="block"
    >
      <div className="relative border border-zinc-700 rounded-2xl shadow-sm bg-dark-primary overflow-hidden">
        <div className="relative">
          {/* Image container */}
          <div className="w-full h-48 bg-dark-secondary">
            {showPlaceholder ? (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff className="w-8 h-8 text-gray-400" />
              </div>
            ) : (
              <img
                src={`https://${BUCKET}.s3.${REGION}.amazonaws.com/${project.preview}`}
                alt={`Preview of ${project.title}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
                draggable="false"
              />
            )}
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <form
                  onSubmit={handleTitleSubmit}
                  className="flex-1"
                  ref={formRef}
                >
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={handleTitleChange}
                    className="w-full px-2 py-1 text-lg font-semibold bg-dark-secondary border border-zinc-600 rounded focus:outline-none focus:border-none"
                    autoFocus
                    onClick={(e) => e.preventDefault()}
                  />
                </form>
              ) : (
                <h3
                  className={`text-lg font-semibold line-clamp-1 ${project.isUpdating ? 'animate-pulse' : ''}`}
                >
                  {project.title}
                </h3>
              )}
              <button
                onClick={handleEditClick}
                className="ml-2 p-1 hover:bg-zinc-700 rounded-full"
                title="Edit title"
                ref={buttonRef}
              >
                <Edit2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <time
              dateTime={project.created_at}
              className="text-sm text-gray-500 block"
            >
              {new Date(project.created_at).toLocaleDateString()}
            </time>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
