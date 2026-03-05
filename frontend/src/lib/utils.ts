/**
 * Utility functions.
 */

/** Merge CSS class names safely. */
export function cn(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(" ");
}

/** Format a date string for display. */
export function formatDate(date: string | undefined): string {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}
