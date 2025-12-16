import { redirect } from "next/navigation";

export default function Page() {
  // Redirect to the new events-manage admin page so the sidebar link keeps working
  redirect("/admin/events-manage");
}
