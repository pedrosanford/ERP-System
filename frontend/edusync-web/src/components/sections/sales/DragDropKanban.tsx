import React, { useState } from 'react';
import { FiPlus, FiGripVertical } from 'react-icons/fi';
import ExpandableKanbanCard from './ExpandableKanbanCard';
import { Lead, KanbanStage } from './types';

interface DragDropKanbanProps {
  stages: KanbanStage[];
  leads: Lead[];
  onLeadUpdate: (updatedLead: Lead) => void;
  onLeadMove: (leadId: number, newStatus: string) => void;
  onStagesReorder: (newStages: KanbanStage[]) => void;
}

const DragDropKanban: React.FC<DragDropKanbanProps> = ({
  stages,
  leads,
  onLeadUpdate,
  onLeadMove,
  onStagesReorder
}) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [draggedLead, setDraggedLead] = useState<number | null>(null);
  const [draggedStage, setDraggedStage] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Lead drag and drop handlers
  const handleLeadDragStart = (e: React.DragEvent, leadId: number) => {
    setDraggedLead(leadId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', leadId.toString());
  };

  const handleLeadDragEnd = () => {
    setDraggedLead(null);
    setDragOverStage(null);
  };

  const handleStageDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedLead) {
      setDragOverStage(stageId);
    }
  };

  const handleStageDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the stage container entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverStage(null);
    }
  };

  const handleLeadDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedLead) {
      const lead = leads.find(l => l.id === draggedLead);
      if (lead && lead.status !== stageId) {
        onLeadMove(draggedLead, stageId);
      }
    }
    setDraggedLead(null);
    setDragOverStage(null);
  };

  // Stage drag and drop handlers
  const handleStageDragStart = (e: React.DragEvent, stageId: string) => {
    setDraggedStage(stageId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'stage', id: stageId }));
  };

  const handleStageDragEnd = () => {
    setDraggedStage(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedStage && draggedStage !== stageId) {
      e.dataTransfer.dropEffect = 'move';
      setDragOverColumn(stageId);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    if (draggedStage && draggedStage !== targetStageId) {
      const draggedIndex = stages.findIndex(s => s.id === draggedStage);
      const targetIndex = stages.findIndex(s => s.id === targetStageId);

      const newStages = [...stages];
      const draggedItem = newStages.splice(draggedIndex, 1)[0];
      newStages.splice(targetIndex, 0, draggedItem);

      onStagesReorder(newStages);
    }
    setDraggedStage(null);
    setDragOverColumn(null);
  };

  const getStageLeads = (stageId: string) => {
    return leads.filter(lead => lead.status === stageId);
  };

  const handleAddLead = (stageId: string) => {
    // This would typically open a modal or form to add a new lead
    console.log('Add lead to stage:', stageId);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageLeads = getStageLeads(stage.id);
        const isDraggedOver = dragOverStage === stage.id;
        const isColumnDraggedOver = dragOverColumn === stage.id;
        const isBeingDragged = draggedStage === stage.id;

        return (
          <div
            key={stage.id}
            className={`min-w-80 flex-shrink-0 bg-gray-50 rounded-lg transition-all duration-200 ${
              isDraggedOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
            } ${
              isColumnDraggedOver ? 'bg-green-50 ring-2 ring-green-300' : ''
            } ${
              isBeingDragged ? 'opacity-50' : ''
            }`}
            onDragOver={(e) => {
              handleStageDragOver(e, stage.id);
              handleColumnDragOver(e, stage.id);
            }}
            onDragLeave={handleStageDragLeave}
            onDrop={(e) => {
              handleLeadDrop(e, stage.id);
              handleColumnDrop(e, stage.id);
            }}
          >
            {/* Stage Header */}
            <div
              className="p-4 border-b border-gray-200 relative cursor-move"
              draggable
              onDragStart={(e) => handleStageDragStart(e, stage.id)}
              onDragEnd={handleStageDragEnd}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FiGripVertical className="w-4 h-4 text-gray-400" />
                  <h4 className="font-medium text-gray-900 text-sm">{stage.title}</h4>
                </div>
                <span className={`text-xs text-white px-2 py-1 rounded-full ${stage.color}`}>
                  {stageLeads.length}
                </span>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${stage.lineColor} rounded-b-sm`}></div>

              {/* Drop zone indicator */}
              {isDraggedOver && (
                <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-t-lg flex items-center justify-center">
                  <span className="text-blue-700 font-medium text-sm">Drop lead here</span>
                </div>
              )}

              {isColumnDraggedOver && (
                <div className="absolute inset-0 bg-green-100 bg-opacity-50 rounded-t-lg flex items-center justify-center">
                  <span className="text-green-700 font-medium text-sm">Reorder column here</span>
                </div>
              )}
            </div>

            {/* Stage Content */}
            <div className="p-4 space-y-4 min-h-96 max-h-[600px] overflow-y-auto">
              {stageLeads.map((lead) => {
                const isExpanded = expandedCard === lead.id;
                const isBeingDraggedLead = draggedLead === lead.id;

                return (
                  <ExpandableKanbanCard
                    key={lead.id}
                    lead={lead}
                    stage={stage}
                    onUpdate={onLeadUpdate}
                    onMove={onLeadMove}
                    isExpanded={isExpanded}
                    onToggle={() => setExpandedCard(isExpanded ? null : lead.id)}
                    allStages={stages}
                    isDragging={isBeingDraggedLead}
                    onDragStart={(e) => handleLeadDragStart(e, lead.id)}
                    onDragEnd={handleLeadDragEnd}
                  />
                );
              })}

              {/* Add New Lead Card */}
              <div
                className={`bg-white/50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 hover:bg-white/80 transition-all duration-200 cursor-pointer ${
                  isDraggedOver ? 'border-blue-400 bg-blue-50' : ''
                }`}
                onClick={() => handleAddLead(stage.id)}
              >
                <FiPlus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">
                  {isDraggedOver && draggedLead ? 'Drop lead here' : 'Add Lead'}
                </span>
              </div>

              {/* Drop zone for empty columns */}
              {stageLeads.length === 0 && isDraggedOver && (
                <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-8 text-center">
                  <span className="text-blue-700 font-medium">Drop lead here</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DragDropKanban;