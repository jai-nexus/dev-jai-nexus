// portal/src/app/login/page.tsx
import LoginForm from "./LoginForm";

type SearchParams = {
  next?: string | string[];
};

type Props = {
  // Next 16.1+ can deliver this as a Promise under Turbopack
  searchParams?: SearchParams | Promise<SearchParams>;
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

export default async function LoginPage({ searchParams }: Props) {
  const sp = await Promise.resolve(searchParams);
  const nextPath = sanitizeNext(sp?.next);
  return <LoginForm nextPath={nextPath} />;
}
