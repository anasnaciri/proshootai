import AdvancedPromptInput from './components/AdvancedPromptInput';
import CanvasEditor from './components/CanvasEditor';
import ContextMenu from './components/ContextMenu';
import { DragDropZone } from './components/DragDropZone';
import Sidebar from './components/sidebar/Sidebar';
import UploadDialog from './components/sidebar/UploadsTab/UploadDialog';
import { CanvasProvider } from './context/CanvasContext';
import { UploadProvider } from './context/UploadsContext';

const Project = () => {
  return (
    <CanvasProvider>
      <UploadProvider>
        <DragDropZone>
          <div className={`flex flex-1`}>
            <Sidebar />
            <div className="flex-1 relative" id="canvasWrapper">
              <CanvasEditor />
              <ContextMenu />
              <AdvancedPromptInput />
            </div>
            <UploadDialog />
          </div>
        </DragDropZone>
      </UploadProvider>
    </CanvasProvider>
  );
};

export default Project;
