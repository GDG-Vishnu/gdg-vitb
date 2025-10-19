"use client";

import React from "react";

export type MemberFormData = {
  id?: number | string;
  imageUrl?: string;
  name?: string;
  designation?: string;
  position?: string;
  linkedinUrl?: string;
  mail?: string;
  bgColor?: string;
};


type Props = {
  action: "ADD" | "UPDATE" | "DELETE" | "READ" | null;
  form: MemberFormData;
  setForm: (next: MemberFormData) => void;
  onSubmit: () => void;
  onDelete?: () => void;
  onCancel: () => void;
  editing?: boolean;
  preview?: MemberFormData | null;
};

export default function AddMemberForm({
  action,
  form,
  setForm,
  onSubmit,
  onDelete,
  onCancel,
  editing,
}: Props) {
  const disabled = action === "READ" || action === "DELETE";

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (action === "DELETE") {
            onDelete?.();
          } else {
            onSubmit();
          }
        }}
        className="space-y-4 mb-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={form.imageUrl ?? ""}
            onChange={(e) =>
              setForm({ ...(form || {}), imageUrl: e.target.value })
            }
            placeholder="https://.../image.jpg"
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={form.name ?? ""}
            onChange={(e) => setForm({ ...(form || {}), name: e.target.value })}
            required
            placeholder="Full name"
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Designation</label>
          <input
            type="text"
            value={form.designation ?? ""}
            onChange={(e) =>
              setForm({ ...(form || {}), designation: e.target.value })
            }
            placeholder="e.g., LEAD, MEMBER"
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <input
            type="text"
            value={form.position ?? ""}
            onChange={(e) =>
              setForm({ ...(form || {}), position: e.target.value })
            }
            placeholder="e.g., Android, Web"
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
          <input
            type="url"
            value={form.linkedinUrl ?? ""}
            onChange={(e) =>
              setForm({ ...(form || {}), linkedinUrl: e.target.value })
            }
            placeholder="https://www.linkedin.com/in/your-profile"
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.mail ?? ""}
            onChange={(e) => setForm({ ...(form || {}), mail: e.target.value })}
            placeholder="name@example.com"
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Card Color - HEXCODE</label>
          <input
            type="text"
            value={form.bgColor ?? ""}
            onChange={(e) =>
              setForm({ ...(form || {}), bgColor: e.target.value })
            }
            placeholder="Card background color (e.g., #FFFFFF)"
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
            disabled={disabled}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className={`px-4 py-2 rounded-md font-semibold transition ${
              action === "DELETE"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {action === "ADD"
              ? "Create"
              : action === "UPDATE"
              ? "Save"
              : action === "DELETE"
              ? "Delete"
              : "Close"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md bg-white hover:shadow-sm transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
