import { useEffect, useState, useRef, JSX } from 'react';
import { useCanvasContext } from '../context/CanvasContext';
import {
  Trash2,
  Copy,
  Clipboard,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronsUp,
  ChevronsDown,
  Command,
  KeyboardIcon,
  Option,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  deleteHandler,
  handleBringForward,
  handleBringToFront,
  handleCopy,
  handlePaste,
  handleSendBackward,
  handleSendToBack,
} from '../lib/canvas';
import React from 'react';

type ShortcutKeyType = string | JSX.Element;

interface ShortcutDisplayProps {
  keys: ShortcutKeyType[];
}

const ContextMenu = () => {
  const {
    contextMenu,
    fabricRef,
    setContextMenu,
    clonedObject,
    setClonedObject,
    isInputFocused,
  } = useCanvasContext();
  const [isMac, setIsMac] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const calculateMenuPosition = (mouseX: number, mouseY: number) => {
    if (!menuRef.current) return { x: mouseX, y: mouseY };

    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate potential overflow
    const overflowRight = mouseX + menuRect.width > viewportWidth;
    const overflowBottom = mouseY + menuRect.height > viewportHeight;

    // Calculate new position
    let newX = mouseX;
    let newY = mouseY;

    if (overflowRight) {
      newX = viewportWidth - menuRect.width - 8; // 8px padding from viewport edge
    }

    if (overflowBottom) {
      newY = viewportHeight - menuRect.height - 8; // 8px padding from viewport edge
    }

    // Ensure menu doesn't go off the left or top edge
    newX = Math.max(8, newX);
    newY = Math.max(8, newY);

    return { x: newX, y: newY };
  };

  useEffect(() => {
    if (contextMenu?.visible && menuRef.current) {
      const { x: newX, y: newY } = calculateMenuPosition(
        contextMenu.x,
        contextMenu.y,
      );
      if (newX !== contextMenu.x || newY !== contextMenu.y) {
        setContextMenu((prev) => ({ ...prev, x: newX, y: newY }));
      }
    }
  }, [contextMenu?.visible, contextMenu?.x, contextMenu?.y]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (isInputFocused) return;
      // Delete/Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteHandler({ canvas: fabricRef.current });
      }

      // Copy/Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        handleCopy({ canvas: fabricRef.current, setClonedObject });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        handlePaste({ canvas: fabricRef.current, clonedObject });
      }

      // Layer ordering with Alt/Option
      if ((e.ctrlKey || e.metaKey) && (e.altKey || e.getModifierState('Alt'))) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
          handleBringForward({ canvas: fabricRef.current });
        }
        if (e.key === 'ArrowDown') {
          handleSendBackward({ canvas: fabricRef.current });
        }
      }

      // Quick bring to front/back
      if (e.ctrlKey || e.metaKey) {
        if (e.key === ']') {
          e.preventDefault();
          handleBringToFront({ canvas: fabricRef.current });
        }
        if (e.key === '[') {
          e.preventDefault();
          handleSendToBack({ canvas: fabricRef.current });
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [clonedObject, fabricRef, setClonedObject, isInputFocused]);

  const ModifierIcon = () =>
    isMac ? <Command size={12} /> : <KeyboardIcon size={12} />;

  const AltIcon = () =>
    isMac ? <Option size={12} /> : <span className="text-xs">Alt</span>;

  const ShortcutKey = ({ children }: React.PropsWithChildren) => (
    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-medium">
      {children}
    </span>
  );

  const ShortcutDisplay = ({ keys }: ShortcutDisplayProps) => (
    <div className="flex items-center space-x-1 text-gray-600">
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">+</span>}
          <div className="flex items-center">
            {typeof key === 'string' ? <ShortcutKey>{key}</ShortcutKey> : key}
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  if (!contextMenu) return null;

  const { x, y } = contextMenu;
  const canvas = fabricRef.current;
  const activeObject = canvas?.getActiveObject();
  const hasSelection = !!activeObject;

  return (
    <div
      className={`${contextMenu.visible ? 'fixed' : 'hidden'} bg-white shadow-lg rounded-lg border border-gray-200 py-2 w-72 text-sm select-none`}
      style={{
        left: x,
        top: y,
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()}
      ref={menuRef}
    >
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between gap-2 disabled:opacity-50"
        disabled={!hasSelection}
        onClick={() => {
          deleteHandler({ canvas });
          setContextMenu((prev) => ({ ...prev, visible: false }));
        }}
      >
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Delete
        </div>
        <ShortcutDisplay keys={['Backspace']} />
      </button>

      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between gap-2 disabled:opacity-50"
        disabled={!hasSelection}
        onClick={() => {
          handleCopy({ canvas, setClonedObject });
          setContextMenu((prev) => ({ ...prev, visible: false }));
        }}
      >
        <div className="flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Copy
        </div>
        <ShortcutDisplay keys={[<ModifierIcon />, 'C']} />
      </button>

      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between gap-2 disabled:opacity-50"
        disabled={!clonedObject}
        onClick={() => {
          handlePaste({ canvas, clonedObject });
          setContextMenu((prev) => ({ ...prev, visible: false }));
        }}
      >
        <div className="flex items-center gap-2">
          <Clipboard className="w-4 h-4" />
          Paste
        </div>
        <ShortcutDisplay keys={[<ModifierIcon />, 'V']} />
      </button>

      <div className="my-1 border-b border-gray-200" />

      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between gap-2 disabled:opacity-50"
        disabled={!hasSelection}
        onClick={() => {
          handleBringForward({ canvas: fabricRef.current });
          setContextMenu((prev) => ({ ...prev, visible: false }));
        }}
      >
        <div className="flex items-center gap-2">
          <ArrowUpCircle className="w-4 h-4" />
          Bring Forward
        </div>
        <ShortcutDisplay
          keys={[<ModifierIcon />, <AltIcon />, <ArrowUp size={12} />]}
        />
      </button>

      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between gap-2 disabled:opacity-50"
        disabled={!hasSelection}
        onClick={() => {
          handleSendBackward({ canvas: fabricRef.current });
          setContextMenu((prev) => ({ ...prev, visible: false }));
        }}
      >
        <div className="flex items-center gap-2">
          <ArrowDownCircle className="w-4 h-4" />
          Send Backward
        </div>
        <ShortcutDisplay
          keys={[<ModifierIcon />, <AltIcon />, <ArrowDown size={12} />]}
        />
      </button>

      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between gap-2 disabled:opacity-50"
        disabled={!hasSelection}
        onClick={() => {
          handleBringToFront({ canvas: fabricRef.current });
          setContextMenu((prev) => ({ ...prev, visible: false }));
        }}
      >
        <div className="flex items-center gap-2">
          <ChevronsUp className="w-4 h-4" />
          Bring to Front
        </div>
        <ShortcutDisplay keys={[<ModifierIcon />, ']']} />
      </button>

      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between gap-2 disabled:opacity-50"
        disabled={!hasSelection}
        onClick={() => {
          handleSendToBack({ canvas: fabricRef.current });
          setContextMenu((prev) => ({ ...prev, visible: false }));
        }}
      >
        <div className="flex items-center gap-2">
          <ChevronsDown className="w-4 h-4" />
          Send to Back
        </div>
        <ShortcutDisplay keys={[<ModifierIcon />, '[']} />
      </button>
    </div>
  );
};

export default ContextMenu;
