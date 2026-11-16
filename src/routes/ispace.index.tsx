import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ispace/")({
  beforeLoad: () => {
    throw redirect({ to: "/ispace/$section", params: { section: "profile" } });
  },
});
