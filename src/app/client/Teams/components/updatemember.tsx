("use client");

import React, { useMemo, useState } from "react";
import MemberCard, { MemberCardProps } from "../MemberCard";

type Action = "ADD" | "UPDATE" | "DELETE" | "READ";

const sampleMembers: MemberCardProps[] = [
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
  {
    id: 2,
    imageUrl: "https://picsum.photos/300/300?random=2",
    name: "Priya",
    designation: "MEMBER",
    position: "Web",
    linkedinUrl: "https://www.linkedin.com/in/priya",
    mail: "priya@example.com",
  },
];

export default function UpdateMemberUI() {
  const [action, setAction] = useState<Action | null>(null);
  const [members, setMembers] = useState<MemberCardProps[]>(sampleMembers);

  // For ADD / UPDATE forms
  const emptyDraft: Partial<MemberCardProps> = {
    id: Date.now(),
    imageUrl: "",
    name: "",
    designation: "",
    position: "",
    linkedinUrl: "",
    mail: "",
  };

  const [draft, setDraft] = useState<Partial<MemberCardProps>>(emptyDraft);
  const [selectedId, setSelectedId] = useState<number | null>(
    members.length ? (members[0].id as number) : null
  );

  const selectedMember = useMemo(() => {
    return members.find((m) => Number(m.id) === Number(selectedId)) ?? null;
  }, [members, selectedId]);

  function handleAdd() {
    const newMember: MemberCardProps = {
      id: Date.now(),
      imageUrl: draft.imageUrl || "https://picsum.photos/300/300",
      name: draft.name || "New Member",
      designation: draft.designation || "MEMBER",
      position: draft.position,
      linkedinUrl: draft.linkedinUrl,
      mail: draft.mail,
    };
    setMembers((s) => [newMember, ...s]);
    setDraft(emptyDraft);
    setAction(null);
  }

  function handleUpdate() {
    if (!selectedMember) return;
    setMembers((prev) =>
      prev.map((m) =>
        Number(m.id) === Number(selectedMember.id)
          ? { ...(m as MemberCardProps), ...(draft as MemberCardProps) }
          : m
      )
    );
    setDraft(emptyDraft);
    setAction(null);
  }

  function handleDelete() {
    if (!selectedMember) return;
    setMembers((prev) =>
      prev.filter((m) => Number(m.id) !== Number(selectedMember.id))
    );
    setSelectedId((prev) => {
      const others = members.filter((m) => Number(m.id) !== Number(prev));
      return others.length ? Number(others[0].id) : null;
    });
    setAction(null);
  }

  function renderActionPanel() {
    switch (action) {
      case "ADD":
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Add Member</h3>
            <input
              value={draft.name || ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  name: e.target.value,
                }))
              }
              placeholder="Name"
              className="w-full border p-2"
            />
            <input
              value={draft.designation || ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  designation: e.target.value,
                }))
              }
              placeholder="Designation"
              className="w-full border p-2"
            />
            <input
              value={draft.position || ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  position: e.target.value,
                }))
              }
              placeholder="Position"
              className="w-full border p-2"
            />
            <input
              value={draft.imageUrl || ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  imageUrl: e.target.value,
                }))
              }
              placeholder="Image URL"
              className="w-full border p-2"
            />
            <input
              value={draft.linkedinUrl || ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  linkedinUrl: e.target.value,
                }))
              }
              placeholder="LinkedIn URL"
              className="w-full border p-2"
            />
            <input
              value={draft.mail || ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  mail: e.target.value,
                }))
              }
              placeholder="Email"
              className="w-full border p-2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Member
              </button>
              <button
                onClick={() => {
                  setAction(null);
                  setDraft(emptyDraft);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      case "UPDATE":
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Update Member</h3>
            <label className="block text-sm">Select member</label>
            <select
              className="w-full border p-2"
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id as number}>
                  {m.name} — {m.designation}
                </option>
              ))}
            </select>

            <input
              value={draft.name ?? selectedMember?.name ?? ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  name: e.target.value,
                }))
              }
              placeholder="Name"
              className="w-full border p-2"
            />
            <input
              value={draft.designation ?? selectedMember?.designation ?? ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  designation: e.target.value,
                }))
              }
              placeholder="Designation"
              className="w-full border p-2"
            />
            <input
              value={draft.position ?? selectedMember?.position ?? ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  position: e.target.value,
                }))
              }
              placeholder="Position"
              className="w-full border p-2"
            />
            <input
              value={draft.imageUrl ?? selectedMember?.imageUrl ?? ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  imageUrl: e.target.value,
                }))
              }
              placeholder="Image URL"
              className="w-full border p-2"
            />
            <input
              value={draft.linkedinUrl ?? selectedMember?.linkedinUrl ?? ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  linkedinUrl: e.target.value,
                }))
              }
              placeholder="LinkedIn URL"
              className="w-full border p-2"
            />
            <input
              value={draft.mail ?? selectedMember?.mail ?? ""}
              onChange={(e) =>
                setDraft((d: Partial<MemberCardProps>) => ({
                  ...d,
                  mail: e.target.value,
                }))
              }
              placeholder="Email"
              className="w-full border p-2"
            />

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setAction(null);
                  setDraft(emptyDraft);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      case "DELETE":
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Delete Member</h3>
            <label className="block text-sm">Select member to delete</label>
            <select
              className="w-full border p-2"
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id as number}>
                  {m.name} — {m.designation}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setAction(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      case "READ":
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">View Member</h3>
            <label className="block text-sm">Select member</label>
            <select
              className="w-full border p-2"
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id as number}>
                  {m.name} — {m.designation}
                </option>
              ))}
            </select>

            {selectedMember ? (
              <div className="mt-3">
                <p className="font-medium">Name: {selectedMember.name}</p>
                <p className="text-sm">
                  Designation: {selectedMember.designation}
                </p>
                <p className="text-sm">Position: {selectedMember.position}</p>
                <p className="text-sm">Email: {selectedMember.mail}</p>
                <p className="text-sm">
                  LinkedIn: {selectedMember.linkedinUrl}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No member selected
              </p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setAction(null)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  const previewMember: MemberCardProps | null = useMemo(() => {
    if (!action) return null;
    if (action === "ADD") {
      // show draft preview for add
      return {
        id: draft.id ?? Date.now(),
        imageUrl: draft.imageUrl || "https://picsum.photos/300/300",
        name: draft.name || "Preview",
        designation: draft.designation || "MEMBER",
        position: draft.position,
        linkedinUrl: draft.linkedinUrl,
        mail: draft.mail,
      };
    }
    // for other actions, show the selected member if any
    return selectedMember ?? null;
  }, [action, draft, selectedMember]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 md:w-2/3">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Choose action</label>
          <div className="flex gap-2">
            {(["ADD", "UPDATE", "DELETE", "READ"] as Action[]).map((a) => (
              <button
                key={a}
                onClick={() => {
                  setAction(a);
                  // prefill draft when updating
                  if (a === "UPDATE" && selectedMember)
                    setDraft(selectedMember);
                }}
                className={`px-3 py-2 rounded border ${
                  action === a ? "bg-black text-white" : "bg-white"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border p-4 rounded shadow-sm">
          {!action ? (
            <p className="text-sm text-muted-foreground">
              Select an action to continue.
            </p>
          ) : (
            renderActionPanel()
          )}
        </div>
      </div>

      {/* Right-side preview */}
      <div className="w-80">
        {previewMember ? (
          <div>
            <h4 className="text-sm font-medium mb-2">Live preview</h4>
            <MemberCard {...previewMember} />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Preview will appear here after selecting an action.
          </div>
        )}
      </div>
    </div>
  );
}
