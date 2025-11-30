"use client";

import React, { useState, useEffect } from "react";
import MemberCard from "@/app/client/Teams/MemberCard";
import AddMemberForm, {
  MemberFormData,
} from "@/app/admin/teams/components/addmember";
import { Mail } from "lucide-react";

type Member = {
  id: number;
  imageUrl: string;
  name: string;
  designation: string;
  position?: string;
  linkedinUrl?: string;
  mail?: string;
};

export default function Teammanage() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      imageUrl:
        "https://res.cloudinary.com/duvr3z2z0/image/upload/v1760581771/Ganesh_portrait_qzqk6u.jpg",
      name: "Ganesh",
      designation: "LEAD",
      position: "Android",
      linkedinUrl: "https://www.linkedin.com/in/ganesh",
      mail: "ganesh@example.com",
    },
  ]);

  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState<Partial<Member>>({});
  const [selectedAction, setSelectedAction] = useState<
    "ADD" | "UPDATE" | "DELETE" | "READ" | null
  >(null);
  const [memberNameInput, setMemberNameInput] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [previewMember, setPreviewMember] = useState<Member | null>(null);
  const [memberFormData, setMemberFormData] = useState<MemberFormData>({});
  const actionColorMap: Record<string, string> = {
    ADD: "#16A34A",
    UPDATE: "#2563EB",
    DELETE: "#EA4335",
    READ: "#8B5CF6",
  };
  const [isHoveringButton, setIsHoveringButton] = useState<boolean>(false);

  // When the selected CRUD action changes, clear preview and status so the UI refreshes
  useEffect(() => {
    setPreviewMember(null);
    setStatusMessage(null);
    // When switching to ADD, reset the editing/form state to present a blank form
    if (selectedAction === "ADD") {
      setEditing(null);
      setForm({});
      setMemberFormData({});
    }
  }, [selectedAction]);

  function handleEdit(member: Member) {
    setEditing(member);
    setForm(member);
  }

  function handleDelete(id: number) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editing.id ? { ...(m as Member), ...(form as Member) } : m
        )
      );
      setEditing(null);
      setForm({});
    } else {
      const newMember: Member = {
        id: Date.now(),
        imageUrl: (form.imageUrl as string) || "",
        name: (form.name as string) || "",
        designation: (form.designation as string) || "",
        position: form.position,
        linkedinUrl: form.linkedinUrl,
        mail: form.mail,
      };
      setMembers((prev) => [newMember, ...prev]);
      setForm({});
    }
  }

  // Handlers for the AddMemberForm component (wired to local in-memory state)
  function handleFormSubmit() {
    if (!selectedAction) return;

    if (selectedAction === "ADD") {
      // Persist to the database via API
      (async () => {
        try {
          setStatusMessage("Creating member...");
          const res = await fetch("/api/teams/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: memberFormData.name,
              imageUrl: memberFormData.imageUrl,
              designation: memberFormData.designation,
              position: memberFormData.position,
              linkedinUrl: memberFormData.linkedinUrl,
              mail: memberFormData.mail,
            }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            setStatusMessage(
              (err && (err.error || err.message)) || "Failed to create member"
            );
            return;
          }

          const created = await res.json();

          // Map created DB row to Member type (Prisma id is string)
          const newMemberFromDb: Member = {
            id: Date.now(),
            imageUrl: created.imageUrl || "",
            name:
              created.name || (memberFormData.name as string) || "New Member",
            designation:
              created.designation ||
              (memberFormData.designation as string) ||
              "MEMBER",
            position: created.position || memberFormData.position,
            linkedinUrl: created.linkedinUrl || memberFormData.linkedinUrl,
            mail: created.mail || memberFormData.mail,
          };

          setMembers((prev) => [newMemberFromDb, ...prev]);
          setStatusMessage(`Added member: ${newMemberFromDb.name}`);
          setMemberFormData({});
          setMemberNameInput("");
        } catch (err) {
          console.error(err);
          setStatusMessage("Failed to create member (network error)");
        }
      })();

      return;
    }

    if (selectedAction === "UPDATE") {
      if (!previewMember && !editing) {
        setStatusMessage("No member selected to update.");
        return;
      }

      const originalName = editing?.name || previewMember?.name;

      // Persist to the database via API
      (async () => {
        try {
          setStatusMessage("Updating member...");
          const res = await fetch("/api/teams/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              originalName: originalName, // Use original name to find the member
              name: memberFormData.name, // New name (can be same or different)
              imageUrl: memberFormData.imageUrl,
              designation: memberFormData.designation,
              position: memberFormData.position,
              linkedinUrl: memberFormData.linkedinUrl,
              mail: memberFormData.mail,
              bgColor: memberFormData.bgColor,
            }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            setStatusMessage(
              (err && (err.error || err.message)) || "Failed to update member"
            );
            return;
          }

          const updated = await res.json();

          // Update local state
          setMembers((prev) =>
            prev.map((m) =>
              m.name.toLowerCase() === originalName!.toLowerCase()
                ? {
                    ...m,
                    name: updated.name || memberFormData.name || m.name,
                    imageUrl:
                      updated.imageUrl || memberFormData.imageUrl || m.imageUrl,
                    designation:
                      updated.designation ||
                      memberFormData.designation ||
                      m.designation,
                    position:
                      updated.position ?? memberFormData.position ?? m.position,
                    linkedinUrl:
                      updated.linkedinUrl ??
                      memberFormData.linkedinUrl ??
                      m.linkedinUrl,
                    mail: updated.mail ?? memberFormData.mail ?? m.mail,
                  }
                : m
            )
          );

          // Update preview with new data
          if (previewMember) {
            setPreviewMember({
              ...previewMember,
              name: updated.name || memberFormData.name || previewMember.name,
              imageUrl:
                updated.imageUrl ||
                memberFormData.imageUrl ||
                previewMember.imageUrl,
              designation:
                updated.designation ||
                memberFormData.designation ||
                previewMember.designation,
              position:
                updated.position ??
                memberFormData.position ??
                previewMember.position,
              linkedinUrl:
                updated.linkedinUrl ??
                memberFormData.linkedinUrl ??
                previewMember.linkedinUrl,
              mail: updated.mail ?? memberFormData.mail ?? previewMember.mail,
            });
          }

          setStatusMessage(
            `Updated ${updated.name || memberFormData.name || originalName}`
          );
          setEditing(null);
          setMemberFormData({});
        } catch (err) {
          console.error(err);
          setStatusMessage("Failed to update member (network error)");
        }
      })();

      return;
    }
  }

  function handleFormDelete() {
    (async () => {
      // Prefer deleting by Prisma id when available on the DB row.
      let targetName: string | undefined;
      let targetId: string | undefined;

      if (editing) {
        targetName = editing.name;
      }

      if (previewMember) {
        targetName = previewMember.name;
      }

      // If no preview or editing is set, nothing to delete
      if (!targetName) {
        setStatusMessage("No member selected to delete.");
        return;
      }

      try {
        setStatusMessage("Deleting member...");
        const res = await fetch("/api/teams/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: targetName }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setStatusMessage(
            (err && (err.error || err.message)) || "Failed to delete member"
          );
          return;
        }

        const data = await res.json();

        // Remove from local UI state (best-effort match by name)
        setMembers((prev) =>
          prev.filter((m) => m.name.toLowerCase() !== targetName!.toLowerCase())
        );
        setStatusMessage(`Deleted ${targetName}`);
        setEditing(null);
        setPreviewMember(null);
        setMemberFormData({});
      } catch (err) {
        console.error(err);
        setStatusMessage("Failed to delete member (network error)");
      }
    })();
  }

  function handleFormCancel() {
    setMemberFormData({});
    setEditing(null);
    // keep selectedAction so user can choose another, but clear preview
    setPreviewMember(null);
  }

  // Primary action (extracted from the button onclick) so it can be reused
  async function handlePrimaryAction() {
    setStatusMessage(null);
    const name = memberNameInput.trim();
    if (!selectedAction) {
      // create a new member with the provided name locally
      const newMember: Member = {
        id: Date.now(),
        imageUrl: "https://picsum.photos/300/300",
        name: name || "New Member",
        designation: "MEMBER",
        position: "",
        linkedinUrl: "",
        mail: "",
      };
      setMembers((prev) => [newMember, ...prev]);
      setStatusMessage(`Added member: ${newMember.name}`);
      setMemberNameInput("");
      return;
    }

    // For GET DETAILS / READ / UPDATE / DELETE we call the API to fetch by name
    if (!name) {
      setStatusMessage("Please enter a member name to look up.");
      return;
    }

    try {
      setStatusMessage("Looking up member...");
      const res = await fetch(
        `/api/teams/get-by-name?name=${encodeURIComponent(name)}`
      );
      if (!res.ok) {
        if (res.status === 404) {
          setPreviewMember(null);
          setStatusMessage(`No member found with name '${name}'.`);
          return;
        }
        throw new Error(`API error ${res.status}`);
      }

      const data = await res.json();
      // Map database shape to Member type if needed
      const memberFromDb: Member = {
        id: Date.now(),
        imageUrl: data.imageUrl || "",
        name: data.name || "",
        designation: data.designation || "",
        position: data.position,
        linkedinUrl: data.linkedinUrl,
        mail: data.mail,
      };

      setPreviewMember(memberFromDb);
      setStatusMessage(`Loaded ${memberFromDb.name}`);

      if (selectedAction === "READ") {
        setEditing(memberFromDb);
      } else if (selectedAction === "UPDATE") {
        setEditing(memberFromDb);
        setForm(memberFromDb);
        // Pre-populate the form with the member's current data
        setMemberFormData({
          imageUrl: data.imageUrl || "",
          name: data.name || "",
          designation: data.designation || "",
          position: data.position || "",
          linkedinUrl: data.linkedinUrl || "",
          mail: data.mail || "",
          bgColor: data.bgColor || "",
        });
      } else if (selectedAction === "DELETE") {
        // If delete is requested, perform local delete of previewed member by name
        setMembers((prev) =>
          prev.filter((m) => m.name.toLowerCase() !== name.toLowerCase())
        );
        setStatusMessage(`Deleted member ${memberFromDb.name}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to fetch member details.");
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Team Members</h2>
      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {(["ADD", "UPDATE", "DELETE", "READ"] as const).map((a) => {
          // pick a color per action
          const colorMap: Record<string, string> = {
            ADD: "#16A34A", // green-600
            UPDATE: "#2563EB", // blue-600
            DELETE: "#EA4335", // gdg red
            READ: "#8B5CF6", // purple-500
          };
          const color = colorMap[a];
          const isActive = selectedAction === a;

          return (
            <button
              key={a}
              onClick={() => setSelectedAction(a)}
              className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 hover:shadow-md transition ${
                isActive ? "scale-[1.01]" : ""
              }`}
              style={{
                borderColor: color,
                background: isActive ? `${color}14` : undefined,
              }}
              aria-pressed={isActive}
            >
              <span className="font-semibold text-sm" style={{ color }}>
                {a}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input to lookup member by name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Member name</label>
        <input
          type="text"
          value={memberNameInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMemberNameInput(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handlePrimaryAction();
            }
          }}
          placeholder="Enter member name"
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
        />
      </div>
      {selectedAction && (
        <div className="mb-6">
          <p className="text-sm">
            Selected action:{" "}
            <strong className="text-red-600">{selectedAction}</strong>
          </p>
        </div>
      )}

      {/* Primary action button */}
      <div className="mb-6">
        <button
          onClick={() => {
            void handlePrimaryAction();
          }}
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
          disabled={!selectedAction}
          className={`px-4 py-2 rounded-md border-2 transition-all duration-150 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            {
              true: "hover:shadow-md",
            } as any
          }`}
          style={{
            borderColor: selectedAction
              ? actionColorMap[selectedAction]
              : "#000",
            backgroundColor:
              isHoveringButton && selectedAction
                ? actionColorMap[selectedAction]
                : undefined,
            color:
              isHoveringButton && selectedAction
                ? "#ffffff"
                : selectedAction
                ? actionColorMap[selectedAction]
                : "#000000",
            cursor: !selectedAction ? "not-allowed" : undefined,
            opacity: !selectedAction ? 0.6 : 1,
          }}
        >
          {selectedAction === "ADD" ? "Add Member" : "Get Details"}
        </button>

        {statusMessage && (
          <p className="mt-2 text-sm text-muted-foreground">{statusMessage}</p>
        )}
      </div>
      {/* Member form */}

      <div className="flex justify-between">
        {previewMember && (
          <div className="mb-6 w-full mr-8">
            <h3 className="text-lg font-semibold mb-4">Member Data</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Member ID</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {previewMember?.id ?? "-"}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Name</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {memberFormData.name ?? previewMember?.name ?? "-"}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Designation</div>
                <div className="mt-1 text-base text-gray-800">
                  {memberFormData.designation ??
                    previewMember?.designation ??
                    "-"}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">
                  Position / Department
                </div>
                <div className="mt-1 text-base text-gray-800">
                  {memberFormData.position ?? previewMember?.position ?? "-"}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">LinkedIn</div>
                <div className="mt-1 text-sm">
                  {memberFormData.linkedinUrl ?? previewMember?.linkedinUrl ? (
                    <a
                      href={
                        memberFormData.linkedinUrl ?? previewMember?.linkedinUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {memberFormData.linkedinUrl ?? previewMember?.linkedinUrl}
                    </a>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Email</div>
                <div className="mt-1 text-sm">
                  {memberFormData.mail ?? previewMember?.mail ? (
                    <a
                      href={`mailto:${
                        memberFormData.mail ?? previewMember?.mail
                      }`}
                      className="text-blue-600 underline"
                    >
                      {memberFormData.mail ?? previewMember?.mail}
                    </a>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedAction === "ADD" && (
          <AddMemberForm
            action={selectedAction}
            form={memberFormData}
            setForm={(next) => setMemberFormData(next)}
            onSubmit={handleFormSubmit}
            onDelete={handleFormDelete}
            onCancel={handleFormCancel}
            editing={!!editing}
            preview={previewMember}
          />
        )}

        {selectedAction === "UPDATE" && previewMember && (
          <div className="mb-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              Update Member
            </h3>
            <AddMemberForm
              action={selectedAction}
              form={memberFormData}
              setForm={(next) => setMemberFormData(next)}
              onSubmit={handleFormSubmit}
              onDelete={handleFormDelete}
              onCancel={handleFormCancel}
              editing={true}
              preview={previewMember}
            />
          </div>
        )}

        {/* Preview panel */}

        {previewMember && (
          <div className="mb-6 ">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <MemberCard
              id={previewMember.id}
              imageUrl={previewMember.imageUrl}
              name={previewMember.name}
              designation={previewMember.designation}
              position={previewMember.position}
              linkedinUrl={previewMember.linkedinUrl}
              mail={previewMember.mail}
            />
            <div className="mt-2  flex items-center gap-2">
              {/* email icon */}
              <Mail className="w-5 h-5 text-muted-foreground" />
              <p className="text-lg text-stone-900  ">{previewMember.mail}</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  if (!confirm(`Delete member '${previewMember.name}'?`))
                    return;
                  handleFormDelete();
                }}
                className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
