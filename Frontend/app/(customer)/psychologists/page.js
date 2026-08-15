import { redirect } from "next/navigation";

export default function PsychologistsRedirect() {
  redirect("/doctors?specialty=psychologist");
}
