'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '@/store/useBuilderStore';
import { BuilderSection, SectionType } from '@/types/github.types';
import {
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Heading,
  User,
  Cpu,
  BarChart3,
  Flame,
  Globe,
  Trophy,
  FolderGit2,
  Link2,
  Compass,
  MessageSquare,
  Terminal,
  FileText,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to resolve Icons for categories
const CATEGORY_ICONS: Record<SectionType, React.ComponentType<any>> = {
  header: Heading,
  about: User,
  skills: Cpu,
  stats: BarChart3,
  streak: Flame,
  languages: Globe,
  trophies: Trophy,
  projects: FolderGit2,
  socials: Link2,
  'visitor-counter': Eye,
  'working-on': Compass,
  quote: MessageSquare,
  typing: Terminal,
  custom: FileText,
  'activity-graph': BarChart3,
  'snake-game': Flame,
  'goals-list': FileText,
};

// Drag & Drop Sortable Item Component
interface SortableItemProps {
  section: BuilderSection;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function SortableSectionItem({ 
  section, 
  isSelected, 
  onSelect, 
  onToggle, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  isFirst,
  isLast
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = CATEGORY_ICONS[section.type] || FileText;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        'group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer select-none',
        isDragging ? 'dragging shadow-2xl scale-[1.01] bg-zinc-900 border-[#7c3aed]/50' : '',
        isSelected
          ? 'bg-[#7c3aed]/15 border-l-2 border-l-[#7c3aed] border-y-[#30363d] border-r-[#30363d] text-white shadow-md shadow-purple-500/5'
          : 'bg-[#15121b]/40 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Grab Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-zinc-650 hover:text-zinc-400 cursor-grab active:cursor-grabbing shrink-0"
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Up / Down Click Controls */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={isFirst}
            className={cn(
              "p-0.5 rounded transition-colors text-zinc-600 hover:text-zinc-250 hover:bg-zinc-800/60",
              isFirst ? "opacity-10 cursor-not-allowed" : "cursor-pointer"
            )}
            title="Move Up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={isLast}
            className={cn(
              "p-0.5 rounded transition-colors text-zinc-600 hover:text-zinc-250 hover:bg-zinc-800/60",
              isLast ? "opacity-10 cursor-not-allowed" : "cursor-pointer"
            )}
            title="Move Down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <IconComponent className="h-4 w-4 text-indigo-400 shrink-0" />

        {/* Section title */}
        <span className={cn(
          'text-xs font-semibold truncate',
          section.isVisible ? 'text-zinc-200' : 'text-zinc-550 line-through'
        )}>
          {section.title}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Delete button for custom sections */}
        {section.type === 'custom' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded bg-zinc-900 border border-white/5 text-zinc-550 hover:text-red-400 transition-colors cursor-pointer"
            title="Delete Section"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}

        {/* Toggle Slider Switch */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(e);
          }}
          className={cn(
            'w-8 h-4 rounded-full relative transition-colors duration-200 shrink-0 cursor-pointer',
            section.isVisible ? 'bg-[#7c3aed]' : 'bg-[#30363D]'
          )}
          title={section.isVisible ? 'Hide Section' : 'Show Section'}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow-sm block',
              section.isVisible ? 'translate-x-4' : 'translate-x-0'
            )}
          />
        </button>
      </div>
    </div>
  );
}

// Main Panel Component
export default function SectionList() {
  const {
    sections,
    setSections,
    toggleSectionVisibility,
    selectedSectionId,
    setSelectedSectionId,
    addCustomSection,
    deleteSection,
  } = useBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((item) => item.id === active.id);
      const newIndex = sections.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(sections, oldIndex, newIndex);
      setSections(reordered);
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;
    const reordered = arrayMove(sections, index, nextIndex);
    setSections(reordered);
  };

  return (
    <div className="flex flex-col h-full bg-[#15121b] shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-white/5 sticky top-0 bg-[#15121b] z-10 backdrop-blur-md shrink-0">
        <h2 className="text-[10px] font-bold text-[#ccc3d8] uppercase tracking-widest">Sections Manager</h2>
      </div>

      {/* Drag & Drop Section Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((sec, idx) => (
              <SortableSectionItem
                key={sec.id}
                section={sec}
                isSelected={selectedSectionId === sec.id}
                onSelect={() => setSelectedSectionId(sec.id)}
                onToggle={(e) => {
                  e.stopPropagation();
                  toggleSectionVisibility(sec.id);
                }}
                onDelete={() => deleteSection(sec.id)}
                onMoveUp={() => moveSection(idx, 'up')}
                onMoveDown={() => moveSection(idx, 'down')}
                isFirst={idx === 0}
                isLast={idx === sections.length - 1}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Custom Section Button */}
      <div className="p-4 border-t border-white/5 bg-zinc-950/20 shrink-0">
        <button
          onClick={addCustomSection}
          className="w-full py-2 bg-transparent border border-dashed border-zinc-700 hover:border-indigo-500/50 hover:text-indigo-400 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Section</span>
        </button>
      </div>
    </div>
  );
}
