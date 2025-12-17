declare module "@dnd-kit/core" {
  export type AnnouncementHandler = (payload: any) => string | undefined;
  export type Announcements = {
    onDragStart?: AnnouncementHandler;
    onDragOver?: AnnouncementHandler;
    onDragEnd?: AnnouncementHandler;
    onDragCancel?: AnnouncementHandler;
    onDragMove?: AnnouncementHandler;
    [key: string]: AnnouncementHandler | undefined;
  };
  export const closestCenter: any;
  export const closestCorners: any;
  export const DndContext: any;
  export type DndContextProps = {
    onDragStart?: (e: any) => void;
    onDragEnd?: (e: any) => void;
    onDragCancel?: (e: any) => void;
    onDragMove?: (e: any) => void;
    onDragOver?: (e: any) => void;
    accessibility?: any;
    modifiers?: any;
    sensors?: any;
    collisionDetection?: any;
    [key: string]: any;
  };
  export type DragEndEvent = any;
  export type DraggableAttributes = any;
  export type DraggableSyntheticListeners = any;
  export const DragOverlay: any;
  export type DragStartEvent = any;
  export type DropAnimation = any;
  export const defaultDropAnimationSideEffects: any;
  export const KeyboardSensor: any;
  export const MouseSensor: any;
  export type ScreenReaderInstructions = any;
  export const TouchSensor: any;
  export type UniqueIdentifier = any;
  export const useSensor: any;
  export const useSensors: any;
}

declare module "@dnd-kit/modifiers" {
  export const restrictToHorizontalAxis: any;
  export const restrictToParentElement: any;
  export const restrictToVerticalAxis: any;
}

declare module "@dnd-kit/sortable" {
  export const arrayMove: any;
  export const horizontalListSortingStrategy: any;
  export const SortableContext: any;
  export type SortableContextProps = any;
  export const sortableKeyboardCoordinates: any;
  export const useSortable: any;
  export const verticalListSortingStrategy: any;
}

declare module "@dnd-kit/utilities" {
  export const CSS: any;
}
