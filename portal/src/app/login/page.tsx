// portal/src/app/login/page.tsx
import LoginForm from "./LoginForm";

type Props = {
  searchParams?: { next?: string | string[] };
};

function sanitizeNext(next: string | string[] | undefined) {
  const raw = Array.isArray(next) ? next[0] : next;
  if (!raw) return "/operator";

  // must be site-relative
  if (!raw.startsWith("/")) return "/operator";
  // block protocol-relative
  if (raw.startsWith("//")) return "/operator";
  // block backslashes
  if (raw.includes("\\")) return "/operator";
  // block full URLs just in case
  if (raw.startsWith("http://") || raw.startsWith("https://")) return "/operator";

  return raw;
}

export default function LoginPage({ searchParams }: Props) {
  const nextPath = sanitizeNext(searchParams?.next);
  return <LoginForm nextPath={nextPath} />;
}
