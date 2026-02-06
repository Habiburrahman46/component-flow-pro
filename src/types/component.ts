export type ComponentStatus =
  | 'received'
  | 'registered'
  | 'qa-1'
  | 'qa-2'
  | 'qa-3'
  | 'qa-4'
  | 'qa-5'
  | 'qa-6'
  | 'qa-7'
  | 'waiting-fabrication'
  | 'waiting-gl-approval'
  | 'waiting-planner-approval'
  | 'vendor-repair'
  | 'rfu'
  | 'installed'
  | 'removed'
  | 'waiting-repair';

export type ComponentType =
  | 'Track Roller'
  | 'Idler'
  | 'Final Drive'
  | 'Sprocket'
  | 'Track Chain'
  | 'Carrier Roller';

export const COMPONENT_TYPES: ComponentType[] = [
  'Track Roller',
  'Idler',
  'Final Drive',
  'Sprocket',
  'Track Chain',
  'Carrier Roller',
];

export interface Component {
  id: string;
  type: ComponentType;
  serialNumber: string;
  status: ComponentStatus;
  fromUnitId?: string;
  dateReceived: string;
  conditionNotes?: string;
  oemPartNumber?: string;
  modelCompatibility?: string;
  vendorReference?: string;
  currentQAStage?: number;
  totalLifetime: number;
  cycles: number;
}

export interface QAChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface QARecord {
  id: string;
  componentId: string;
  stage: number;
  stageName: string;
  status: 'pending' | 'completed';
  mechanicName?: string;
  dateUpdated?: string;
  notes?: string;
  checklistItems: QAChecklistItem[];
}

export interface FabricationRequest {
  id: string;
  componentId: string;
  componentType: ComponentType;
  reason: string;
  vendorName?: string;
  estimatedCost: number;
  status: 'pending' | 'gl-approved' | 'planner-approved' | 'rejected';
  createdDate: string;
  createdBy: string;
  attachment?: string;
}

export interface InstallRecord {
  id: string;
  componentId: string;
  componentType: ComponentType;
  unitId: string;
  installDate: string;
  removeDate?: string;
  hmStart: number;
  hmEnd?: number;
  lifetime?: number;
  removalReason?: string;
}

export interface TimelineEvent {
  id: string;
  componentId: string;
  date: string;
  type: 'received' | 'qa' | 'repair' | 'vendor' | 'rfu' | 'installed' | 'removed' | 'fabrication' | 'approval';
  title: string;
  description: string;
}

export const QA_STAGES = [
  { stage: 1, name: 'QA-1', title: 'Delivery Inspection Sheet' },
  { stage: 2, name: 'QA-2', title: 'Final Inspection Sheet' },
  { stage: 3, name: 'QA-3', title: 'Testing Performance Sheet' },
  { stage: 4, name: 'QA-4', title: 'Guidance Assembly Sheet' },
  { stage: 5, name: 'QA-5', title: 'Measurement & Inspection Sheet' },
  { stage: 6, name: 'QA-6', title: 'Guidance Disassembly Sheet' },
  { stage: 7, name: 'QA-7', title: 'Receiving Sheet' },
];

export const STATUS_LABELS: Record<ComponentStatus, string> = {
  'received': 'Received',
  'registered': 'Registered',
  'qa-1': 'QA-1 Inspection',
  'qa-2': 'QA-2 Final Inspection',
  'qa-3': 'QA-3 Testing',
  'qa-4': 'QA-4 Assembly',
  'qa-5': 'QA-5 Measurement',
  'qa-6': 'QA-6 Disassembly',
  'qa-7': 'QA-7 Receiving',
  'waiting-fabrication': 'Waiting Fabrication',
  'waiting-gl-approval': 'Waiting GL Approval',
  'waiting-planner-approval': 'Waiting Planner Approval',
  'vendor-repair': 'Vendor Repair',
  'rfu': 'Ready For Use',
  'installed': 'Installed / In Service',
  'removed': 'Removed',
  'waiting-repair': 'Waiting Repair',
};

export type StatusColorKey = 'received' | 'qa' | 'approval' | 'vendor' | 'rfu' | 'installed' | 'removed' | 'waiting';

export const STATUS_COLOR_MAP: Record<ComponentStatus, StatusColorKey> = {
  'received': 'received',
  'registered': 'received',
  'qa-1': 'qa',
  'qa-2': 'qa',
  'qa-3': 'qa',
  'qa-4': 'qa',
  'qa-5': 'qa',
  'qa-6': 'qa',
  'qa-7': 'qa',
  'waiting-fabrication': 'approval',
  'waiting-gl-approval': 'approval',
  'waiting-planner-approval': 'approval',
  'vendor-repair': 'vendor',
  'rfu': 'rfu',
  'installed': 'installed',
  'removed': 'removed',
  'waiting-repair': 'waiting',
};
