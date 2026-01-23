import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SignalsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const vendor = typeof searchParams.vendor === "string" ? searchParams.vendor : undefined;
    const date = typeof searchParams.date === "string" ? searchParams.date : undefined;

    const where: Prisma.SourceSignalWhereInput = {
        ...(vendor ? { vendor } : {}),
        ...(date ? { date } : {}),
    };

    const signals = await prisma.sourceSignal.findMany({
        where,
        orderBy: { ts: "desc" },
        take: 50,
    });

    return (
        <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Source Signals</h1>
                <div className="text-sm text-gray-500">
                    Showing latest {signals.length} {vendor ? `for ${vendor}` : ""} {date ? `on ${date}` : ""}
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">TS</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">Date</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">Vendor</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">Tier</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">Title</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">Published</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">SHA</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {signals.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                                    {s.ts.toISOString().slice(11, 16)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                                    {s.date}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                                    <Link href={`?vendor=${s.vendor}`} className="hover:underline">
                                        {s.vendor}
                                    </Link>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                                    {s.tier || "-"}
                                </td>
                                <td className="px-4 py-3 text-gray-900">
                                    <a
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                        title={s.summary || ""}
                                    >
                                        {s.title}
                                    </a>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                                    {s.published_at?.slice(0, 10) || "-"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-400" title={s.artifact_path}>
                                    {s.artifact_sha256.slice(0, 7)}
                                </td>
                            </tr>
                        ))}
                        {signals.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                    No signals found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
