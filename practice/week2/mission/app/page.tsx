import { redirect } from "next/navigation";

// "/" → /browse
export default function Home() {
  redirect("/browse");
}
