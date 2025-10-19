"use client";

import React, { useState, useCallback } from "react";
import { FieldType } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SectionConfiguration,
  FieldConfiguration,
  useFormBuilder,
  getFieldTypeIcon,
  getFieldTypeLabel,
} from "./FormBuilderContext";
import { cn } from "@/lib/utils";
import {
  GripVertical,
  Plus,
  Settings,
  Trash2,
  Edit3,
  Check,
  X,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface FieldItemProps {
  field: FieldConfiguration;
  sectionId: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

function FieldItem({
  field,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}: FieldItemProps) {
  const hasValidationErrors =
    field.validationErrors && Object.keys(field.validationErrors).length > 0;

  return (
    <Card
      className={cn(
        "relative group cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2",
        hasValidationErrors && "border-destructive",
        field.isEditing &&
          "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <div className="flex-shrink-0 cursor-grab active:cursor-grabbing mt-1 opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Field icon */}
          <div className="flex-shrink-0 text-lg mt-0.5">
            {getFieldTypeIcon(field.type)}
          </div>

          {/* Field content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {field.label}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {field.placeholder ||
                    `${getFieldTypeLabel(field.type)} field`}
                </p>
              </div>

              {/* Field badges */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {field.required && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    Required
                  </Badge>
                )}
                {field.isEditing && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0.5 border-orange-500 text-orange-600"
                  >
                    Editing
                  </Badge>
                )}
                {hasValidationErrors && (
                  <Badge
                    variant="destructive"
                    className="text-xs px-1.5 py-0.5"
                  >
                    Errors
                  </Badge>
                )}
              </div>
            </div>

            {/* Validation errors */}
            {hasValidationErrors && (
              <div className="mt-2 space-y-1">
                {Object.entries(field.validationErrors || {}).map(
                  ([key, error]) => (
                    <p key={key} className="text-xs text-destructive">
                      {error}
                    </p>
                  )
                )}
              </div>
            )}

            {/* Field preview */}
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                {field.type.toLowerCase()}
              </span>
              {field.options && (
                <span className="ml-2">
                  {field.options.length} option
                  {field.options.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-100 hover:bg-muted/30 transition-all rounded z-20"
                aria-label="Field settings"
              >
                <Settings className="h-4 w-4 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onEdit}>
                <Edit3 className="h-4 w-4 mr-2" />
                Configure Field
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Field
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Field
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

interface SectionContainerProps {
  section: SectionConfiguration;
  onAddField?: (sectionId: string, fieldType: FieldType) => void;
  onUpdateSection?: (sectionId: string, title: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  className?: string;
}

export function SectionContainer({
  section,
  onAddField,
  onUpdateSection,
  onDeleteSection,
  className,
}: SectionContainerProps) {
  const {
    state,
    selectField,
    setFieldEditing,
    deleteField,
    updateField,
    generateFieldId,
  } = useFormBuilder();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"));
        if (data.type === "FIELD_TYPE" && data.fieldType) {
          onAddField?.(section.id, data.fieldType);
        }
      } catch (error) {
        console.error("Error handling drop:", error);
      }
    },
    [section.id, onAddField]
  );

  // Handle section title editing
  const handleSaveTitle = useCallback(() => {
    if (editTitle.trim() && editTitle !== section.title) {
      onUpdateSection?.(section.id, editTitle.trim());
    } else {
      setEditTitle(section.title);
    }
    setIsEditingTitle(false);
  }, [editTitle, section.title, section.id, onUpdateSection]);

  const handleCancelTitle = useCallback(() => {
    setEditTitle(section.title);
    setIsEditingTitle(false);
  }, [section.title]);

  // Handle field actions
  const handleFieldSelect = useCallback(
    (fieldId: string) => {
      selectField(fieldId);
    },
    [selectField]
  );

  const handleFieldEdit = useCallback(
    (fieldId: string) => {
      setFieldEditing(fieldId, true);
      selectField(fieldId);
    },
    [setFieldEditing, selectField]
  );

  const handleFieldDelete = useCallback(
    (fieldId: string) => {
      deleteField(section.id, fieldId);
    },
    [deleteField, section.id]
  );

  const handleFieldDuplicate = useCallback(
    (field: FieldConfiguration) => {
      const newField: FieldConfiguration = {
        ...field,
        id: generateFieldId(),
        label: `${field.label} (Copy)`,
        order: section.fields.length,
        isEditing: true,
        validationErrors: {},
      };

      updateField(newField);
      selectField(newField.id);
    },
    [generateFieldId, section.fields.length, updateField, selectField]
  );

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isDragOver && "ring-2 ring-primary ring-offset-2 bg-primary/5",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Section Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-shrink-0 cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>

            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle();
                    if (e.key === "Escape") handleCancelTitle();
                  }}
                  className="h-8 text-sm"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleSaveTitle}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelTitle}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="flex-1 min-w-0 cursor-pointer group"
                onClick={() => setIsEditingTitle(true)}
              >
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {section.fields.length} field
                  {section.fields.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingTitle(true)}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-100 hover:bg-muted/30 transition-all rounded z-20"
                  aria-label="Section settings"
                >
                  <Settings className="h-4 w-4 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Title
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDeleteSection?.(section.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Section Content */}
      <CardContent className="pt-0">
        {/* Fields */}
        {section.fields.length > 0 ? (
          <div className="space-y-3">
            {section.fields
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <FieldItem
                  key={field.id}
                  field={field}
                  sectionId={section.id}
                  isSelected={state.selectedField === field.id}
                  onSelect={() => handleFieldSelect(field.id)}
                  onEdit={() => handleFieldEdit(field.id)}
                  onDelete={() => handleFieldDelete(field.id)}
                  onDuplicate={() => handleFieldDuplicate(field)}
                />
              ))}
          </div>
        ) : (
          /* Empty state */
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
          >
            <div className="text-4xl mb-2">📝</div>
            <h4 className="font-medium text-foreground mb-1">No fields yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Drag components from the sidebar or click the button below to add
              fields
            </p>
          </div>
        )}

        {/* Add Field Button */}
        <div className="mt-4 pt-4 border-t border-dashed">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Quick Add
              </div>
              <DropdownMenuItem
                onClick={() => onAddField?.(section.id, FieldType.INPUT)}
              >
                📝 Text Input
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAddField?.(section.id, FieldType.TEXTAREA)}
              >
                📄 Text Area
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAddField?.(section.id, FieldType.SELECT)}
              >
                📋 Select
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAddField?.(section.id, FieldType.CHECKBOX)}
              >
                ☑️ Checkbox
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAddField?.(section.id, FieldType.DATE)}
              >
                📅 Date
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

export default SectionContainer;
