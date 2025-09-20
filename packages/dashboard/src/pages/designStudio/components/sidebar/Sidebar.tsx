import {
  Component,
  Grid2x2Check,
  ImageUp,
  Play,
  Type,
  WandSparkles,
} from 'lucide-react';
import { useState } from 'react';
import { colors } from '@/config/constants';
import UploadsTab from './UploadsTab/UploadsTab.tsx';
import Style from './Style.tsx';
import PropsTab from './PropsTab.tsx';
import TextTab from './TextTab.tsx';
import GenerationsTab from './GenerationsTab/GenerationsTab.tsx';
import Generate from './Generate.tsx';
import { IconButton } from '@/components/common/IconButton.tsx';

// Define tab types for better type safety
type TabType = 'PRD' | 'STYLE' | 'PROPS' | 'TEXT' | 'GENS' | 'GEN';

const Sidebar = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('PRD');

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
  };

  return (
    <div className="h-100 flex">
      <nav className="h-full py-2 px-1 flex flex-col justify-start items-center gap-2 bg-dark-primary  border border-t-0 border-b-0 border-l-0 border-r-zinc-600">
        <IconButton<TabType>
          tab="PRD"
          isActive={currentTab === 'PRD'}
          onClick={handleTabChange}
        >
          <ImageUp
            color={currentTab === 'PRD' ? colors.primary[600] : undefined}
            size={24}
          />
          <p>Imports</p>
        </IconButton>
        <IconButton<TabType>
          tab="STYLE"
          isActive={currentTab === 'STYLE'}
          onClick={handleTabChange}
        >
          <WandSparkles
            color={currentTab === 'STYLE' ? colors.primary[600] : undefined}
            size={24}
          />
          <p>Style</p>
        </IconButton>
        <IconButton<TabType>
          tab="PROPS"
          isActive={currentTab === 'PROPS'}
          onClick={handleTabChange}
        >
          <Component
            color={currentTab === 'PROPS' ? colors.primary[600] : undefined}
            size={24}
          />
          <p>Elements</p>
        </IconButton>
        {/* <IconButton<TabType>
          tab="TEXT"
          isActive={currentTab === 'TEXT'}
          onClick={handleTabChange}
        >
          <Type
            color={currentTab === 'TEXT' ? colors.primary[600] : undefined}
            size={24}
          />
          <p>Text</p>
        </IconButton> */}
        <IconButton<TabType>
          tab="GEN"
          isActive={currentTab === 'GEN'}
          onClick={handleTabChange}
        >
          <Play
            color={currentTab === 'GEN' ? colors.primary[600] : undefined}
            size={24}
          />
          <p>Generate</p>
        </IconButton>
        <IconButton<TabType>
          tab="GENS"
          isActive={currentTab === 'GENS'}
          onClick={handleTabChange}
        >
          <Grid2x2Check
            color={currentTab === 'GENS' ? colors.primary[600] : undefined}
            size={24}
          />
          <p>Generations</p>
        </IconButton>
      </nav>
      <div className="p-4 w-96 hidden md:flex bg-dark-primary text-white">
        {currentTab === 'PRD' ? (
          <UploadsTab />
        ) : currentTab === 'STYLE' ? (
          <Style />
        ) : currentTab === 'PROPS' ? (
          <PropsTab />
        ) : currentTab === 'TEXT' ? (
          <TextTab />
        ) : currentTab === 'GEN' ? (
          <Generate />
        ) : currentTab === 'GENS' ? (
          <GenerationsTab />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Sidebar;
