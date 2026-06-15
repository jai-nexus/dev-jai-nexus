export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
} from "@/components/operator/slate";
import { prisma } from "@/lib/prisma";
import { formatCentral } from "@/lib/time";

interface ChatPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await Promise.resolve(params);
  const chatId = parseInt(id, 10);

  if (Number.isNaN(chatId)) notFound();

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      decisions: {
        orderBy: { lineNumber: "asc" },
      },
    },
  });

  if (!chat) notFound();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-300 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/operator/chats"
          className="inline-flex text-sm text-sky-300 underline hover:text-sky-200"
        >
          Back to chats
        </Link>

        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / operator / chats / detail
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100">
              {chat.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
              <OperatorBadge tone="advisory">
                EXTRACTED DECISIONS
              </OperatorBadge>
              <OperatorBadge tone="blocked">NOT RECEIPTS</OperatorBadge>
              <OperatorBadge tone="blocked">NOT AUTOMATIC CANON</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span>Date: {formatCentral(chat.chatDate)}</span>
              <span>Source: {chat.source}</span>
              {chat.model ? <span>Model: {chat.model}</span> : null}
              {chat.nhId ? <OperatorIdChip>{chat.nhId}</OperatorIdChip> : null}
              <OperatorIdChip>{chat.chatId}</OperatorIdChip>
            </div>
            {chat.tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {chat.tags.map((tag) => (
                  <OperatorBadge key={tag} tone="neutral">
                    {tag}
                  </OperatorBadge>
                ))}
              </div>
            ) : null}
          </OperatorPanel>

          <OperatorSafetyRail
            title="Chat Detail Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Create receipt</OperatorBlockedAction>
              <OperatorBlockedAction>Update canon</OperatorBlockedAction>
              <OperatorBlockedAction>Accept extraction</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Extracted decisions are not receipts. Read-only is not authority.
            </p>
          </OperatorSafetyRail>
        </header>

        <OperatorPanel>
          <OperatorSectionHeader
            index="01"
            title={`Extracted Decisions (${chat.decisions.length})`}
            right={
              <>
                <OperatorBadge tone="advisory">EXTRACTED</OperatorBadge>
                <OperatorBadge tone="blocked">NOT ACCEPTED</OperatorBadge>
              </>
            }
          />
          <p className="mb-4 text-sm text-slate-400">
            Extraction identifies decision-like text for review. It does not
            create acceptance, a receipt, or canon.
          </p>

          {chat.decisions.length === 0 ? (
            <OperatorGateCard>
              <OperatorBadge tone="readOnly">READ-ONLY / EMPTY</OperatorBadge>
              <p className="mt-2 text-sm text-slate-400">
                No extracted decisions are attached to this conversation.
              </p>
            </OperatorGateCard>
          ) : (
            <div className="space-y-3">
              {chat.decisions.map((decision) => (
                <OperatorGateCard key={decision.id}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-slate-200">{decision.text}</p>
                    {decision.lineNumber ? (
                      <OperatorIdChip>L{decision.lineNumber}</OperatorIdChip>
                    ) : null}
                  </div>
                  {decision.context ? (
                    <p className="mt-2 text-xs text-slate-500">
                      Context: {decision.context}
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {decision.category ? (
                      <OperatorBadge tone="advisory">
                        {decision.category}
                      </OperatorBadge>
                    ) : null}
                    <OperatorStatusChip
                      status={decision.status}
                      tone="readOnly"
                    />
                    <OperatorBadge tone="blocked">NOT A RECEIPT</OperatorBadge>
                  </div>
                </OperatorGateCard>
              ))}
            </div>
          )}
        </OperatorPanel>

        <OperatorPanel className="p-5">
          <OperatorSectionHeader
            index="02"
            title="Full Conversation"
            right={<OperatorReadOnlyAction>ARCHIVE TEXT</OperatorReadOnlyAction>}
          />
          <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded border border-slate-800 bg-slate-950/60 p-4 font-mono text-xs leading-relaxed text-slate-300">
            {chat.fullText}
          </pre>
        </OperatorPanel>
      </div>
    </main>
  );
}
