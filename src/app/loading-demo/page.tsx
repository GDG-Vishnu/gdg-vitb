"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DeleteComponentLoading,
  AddComponentLoading,
  FormLoading,
  FormDeletionLoading,
} from "@/components/form-builder/loading-pages";

export default function LoadingDemo() {
  const [showDeleteLoading, setShowDeleteLoading] = useState(false);
  const [showAddLoading, setShowAddLoading] = useState(false);
  const [showFormLoading, setShowFormLoading] = useState(false);
  const [showFormDeletionLoading, setShowFormDeletionLoading] = useState(false);
  const [componentType, setComponentType] = useState("Text Input");

  // Simulate actual async operations that would be real API calls
  const performAsyncOperation = async (
    operationType: string,
    duration: number = 300
  ) => {
    console.log(`Starting ${operationType}...`);
    // This could be replaced with actual API calls like createField, deleteField, etc.
    await new Promise((resolve) => setTimeout(resolve, duration));
    console.log(`Completed ${operationType}`);
  };

  const handleTestDelete = async () => {
    setShowDeleteLoading(true);
    try {
      await performAsyncOperation("component deletion", 400);
    } finally {
      setShowDeleteLoading(false);
    }
  };

  const handleTestAdd = async () => {
    setShowAddLoading(true);
    try {
      await performAsyncOperation("component addition", 300);
    } finally {
      setShowAddLoading(false);
    }
  };

  const handleInstantDelete = async () => {
    setShowDeleteLoading(true);
    try {
      await performAsyncOperation("instant deletion", 50);
    } finally {
      setShowDeleteLoading(false);
    }
  };

  const handleInstantAdd = async () => {
    setShowAddLoading(true);
    try {
      await performAsyncOperation("instant addition", 50);
    } finally {
      setShowAddLoading(false);
    }
  };

  const handleTestFormLoading = async () => {
    setShowFormLoading(true);
    try {
      await performAsyncOperation("form loading", 400);
    } finally {
      setShowFormLoading(false);
    }
  };

  const handleInstantFormLoading = async () => {
    setShowFormLoading(true);
    try {
      await performAsyncOperation("instant form loading", 50);
    } finally {
      setShowFormLoading(false);
    }
  };

  const handleTestFormDeletion = async () => {
    setShowFormDeletionLoading(true);
    try {
      await performAsyncOperation("form deletion", 350);
    } finally {
      setShowFormDeletionLoading(false);
    }
  };

  const handleInstantFormDeletion = async () => {
    setShowFormDeletionLoading(true);
    try {
      await performAsyncOperation("instant form deletion", 50);
    } finally {
      setShowFormDeletionLoading(false);
    }
  };

  const componentTypes = [
    "Text Input",
    "Email Field",
    "Phone Number",
    "Checkbox",
    "Radio Button",
    "Select Dropdown",
    "Date Picker",
    "File Upload",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            GDG Loading Components Demo
          </h1>
          <p className="text-gray-600">
            Test both add and delete loading components with GDG theme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Component Demo */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Add Component Loading
            </h2>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Component Type to Add:
              </label>
              <select
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {componentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleTestAdd}
                disabled={showAddLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {showAddLoading ? "Adding..." : `Test Add ${componentType}`}
              </Button>

              <Button
                onClick={handleInstantAdd}
                disabled={showAddLoading}
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                Test Instant Add
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Green theme with Plus icon
            </div>
          </div>

          {/* Delete Component Demo */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Delete Component Loading
            </h2>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Component Type to Delete:
              </label>
              <select
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {componentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleTestDelete}
                disabled={showDeleteLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                {showDeleteLoading
                  ? "Deleting..."
                  : `Test Delete ${componentType}`}
              </Button>

              <Button
                onClick={handleInstantDelete}
                disabled={showDeleteLoading}
                variant="outline"
                className="w-full border-red-500 text-red-600 hover:bg-red-50"
              >
                Test Instant Delete
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Red theme with Trash icon
            </div>
          </div>

          {/* Form Loading Demo */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Form Loading
            </h2>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Simulating form click navigation:
              </label>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                Sample Form: "Contact Registration Form"
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleTestFormLoading}
                disabled={showFormLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {showFormLoading ? "Loading Form..." : "Test Form Loading"}
              </Button>

              <Button
                onClick={handleInstantFormLoading}
                disabled={showFormLoading}
                variant="outline"
                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                Test Instant Form Loading
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Blue theme with FileText icon
            </div>
          </div>

          {/* Form Deletion Demo */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Form Deletion Loading
            </h2>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Simulating form deletion:
              </label>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                Sample Form: "Contact Registration Form"
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleTestFormDeletion}
                disabled={showFormDeletionLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                {showFormDeletionLoading
                  ? "Deleting Form..."
                  : "Test Form Deletion"}
              </Button>

              <Button
                onClick={handleInstantFormDeletion}
                disabled={showFormDeletionLoading}
                variant="outline"
                className="w-full border-red-500 text-red-600 hover:bg-red-50"
              >
                Test Instant Form Deletion
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Red theme with Trash icon (Form-level)
            </div>
          </div>
        </div>

        {/* Simulated Form Component */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sample {componentType} Component
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {componentType}
            </label>
            {componentType.includes("Text") ||
            componentType.includes("Email") ? (
              <input
                type="text"
                placeholder={`Enter your ${componentType.toLowerCase()}`}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled
              />
            ) : componentType.includes("Phone") ? (
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled
              />
            ) : componentType.includes("Checkbox") ? (
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="demo-checkbox" disabled />
                <label htmlFor="demo-checkbox">Checkbox option</label>
              </div>
            ) : componentType.includes("Radio") ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" name="demo-radio" disabled />
                  <label>Option 1</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" name="demo-radio" disabled />
                  <label>Option 2</label>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">
                {componentType} preview
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Components */}
      {showAddLoading && <AddComponentLoading componentName={componentType} />}
      {showDeleteLoading && (
        <DeleteComponentLoading componentName={componentType} />
      )}
      {showFormLoading && <FormLoading formName="Contact Registration Form" />}
      {showFormDeletionLoading && (
        <FormDeletionLoading formName="Contact Registration Form" />
      )}
    </div>
  );
}
