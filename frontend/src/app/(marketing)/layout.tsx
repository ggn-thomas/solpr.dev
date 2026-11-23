import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell
      nav={
        <>
          <Link href="/">[Home]</Link>
          {/* No such sections yet: the mockup draws these links without targets. */}
          <a href="#">[Use cases]</a>
          <a href="#">[How it works]</a>
          <a href="https://www.helius.dev/docs/privacy">[Docs]</a>
        </>
      }
      actions={
        <ButtonLink href="/app" size="header" dashed>
          Launch app
        </ButtonLink>
      }
    >
      {children}
    </PageShell>
  );
}
