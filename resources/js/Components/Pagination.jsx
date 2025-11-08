import React, { useMemo } from 'react';
import { Link } from '@inertiajs/react';

/**
 * Pagination component (robuste pour Laravel paginator -> toArray().links)
 * Props:
 *  - links: array (paginator.links)
 *  - meta: paginator meta (current_page, last_page, total)
 */
export default function Pagination({ links = [], meta = {} }) {
    // helper: strip HTML tags and decode text
    const stripHtml = (html) => {
        if (!html) return '';
        if (typeof window === 'undefined') return html.replace(/<\/?[^>]+(>|$)/g, '');
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.documentElement.textContent || '';
    };

    const { prev, next, pages } = useMemo(() => {
        if (!links || links.length === 0) return { prev: null, next: null, pages: [] };

        const prevLink = links[0] ?? null;
        const nextLink = links[links.length - 1] ?? null;

        // pages are the middle items with numeric labels
        const pageItems = links
            .slice(1, -1)
            .map((l) => {
                const text = stripHtml(l.label).trim();
                const m = text.match(/\d+/);
                return m ? { ...l, page: Number(m[0]) } : null;
            })
            .filter(Boolean);

        return { prev: prevLink, next: nextLink, pages: pageItems };
    }, [links]);

    if (!links || links.length === 0) return null;

    // helper to decide what to display for prev/next (fallback if server returns translation keys)
    const getDisplayLabel = (labelHtml, fallback) => {
        const txt = stripHtml(labelHtml).trim();
        if (!txt) return fallback;
        // Laravel may return translation key like "pagination.previous" when translations not loaded.
        // Detect that and use our fallback for a nicer UX.
        if (/^pagination\./i.test(txt)) return fallback;
        return txt;
    };

    const prevDisplay = getDisplayLabel(prev?.label, '‹ Précédent');
    const nextDisplay = getDisplayLabel(next?.label, 'Suivant ›');

    // Build compact window of pages (show nearby pages, with ellipsis)
    const pageWindow = useMemo(() => {
        if (!pages.length) return [];

        const current = meta.current_page ?? pages.find(p => p.active)?.page ?? pages[0].page;
        const last = meta.last_page ?? (pages[pages.length - 1] ? pages[pages.length - 1].page : current);
        const windowSize = 5;
        const half = Math.floor(windowSize / 2);

        let start = Math.max(1, current - half);
        let end = Math.min(last, current + half);

        if (current - start < half) end = Math.min(last, end + (half - (current - start)));
        if (end - current < half) start = Math.max(1, start - (half - (end - current)));

        const nodes = [];

        if (start > 1) {
            const first = pages.find(p => p.page === 1);
            if (first) nodes.push(first);
            if (start > 2) nodes.push({ ellipsis: true, key: 'left' });
        }

        for (let p = start; p <= end; p++) {
            const link = pages.find(item => item.page === p);
            if (link) nodes.push(link);
        }

        if (end < last) {
            if (end < last - 1) nodes.push({ ellipsis: true, key: 'right' });
            const lastLink = pages.find(p => p.page === last);
            if (lastLink) nodes.push(lastLink);
        }

        return nodes;
    }, [pages, meta]);

    return (
        <div className="mt-4 flex items-center justify-between">
            {meta && meta.total !== undefined ? (
                <div className="text-sm text-gray-600">
                    Page {meta.current_page} / {meta.last_page} — {meta.total} utilisateurs
                </div>
            ) : <div />}

            <nav className="inline-flex items-center space-x-1" aria-label="Pagination">
                {/* Prev */}
                {prev && prev.url ? (
                    <Link
                        href={prev.url}
                        className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                        aria-label="Page précédente"
                    >
                        {prevDisplay}
                    </Link>
                ) : (
                    <span className="px-3 py-1 rounded-md text-sm text-gray-400" aria-hidden="true">
                        {prev ? prevDisplay : 'Précédent'}
                    </span>
                )}

                {/* Page numbers */}
                {pageWindow.map((node, idx) => {
                    if (node.ellipsis) {
                        return (
                            <span key={node.key ?? `ellipsis-${idx}`} className="px-3 py-1 text-sm text-gray-500">
                                …
                            </span>
                        );
                    }

                    const isActive = node.active;
                    const text = String(node.page);

                    if (!node.url) {
                        return (
                            <span key={`p-${node.page}`} className="px-3 py-1 rounded-md text-sm text-gray-500">
                                {text}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={`p-${node.page}`}
                            href={node.url}
                            className={
                                'px-3 py-1 rounded-md text-sm ' +
                                (isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100')
                            }
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {text}
                        </Link>
                    );
                })}

                {/* Next */}
                {next && next.url ? (
                    <Link
                        href={next.url}
                        className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                        aria-label="Page suivante"
                    >
                        {nextDisplay}
                    </Link>
                ) : (
                    <span className="px-3 py-1 rounded-md text-sm text-gray-400" aria-hidden="true">
                        {next ? nextDisplay : 'Suivant'}
                    </span>
                )}
            </nav>
        </div>
    );
}