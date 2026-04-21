import React, { useState, useCallback, useMemo, useContext, useRef, createContext } from 'react';
import type {
  ReviewItem,
  WorkspaceReviewItem,
  AccessReviewItem,
  LicenseReviewItem,
  ReviewCategory,
  AccessMember,
} from '@/types/review';
import {
  mockWorkspaceReviews,
  mockAccessReviews,
  mockLicenseReviews,
} from '@/data/mockReviews';

/* ── Undo entry ──────────────────────────────────────────────── */
interface UndoEntry {
  id: string;
  category: ReviewCategory;
  snapshot: ReviewItem;
  timerId: ReturnType<typeof setTimeout>;
}

/* ── Context shape ───────────────────────────────────────────── */
interface ReviewsContextValue {
  allReviews: ReviewItem[];
  pendingReviews: ReviewItem[];
  completedCount: number;
  totalCount: number;
  pendingCount: number;
  getCategoryCount: (category: ReviewCategory) => number;
  getReviewsByCategory: (category: ReviewCategory) => ReviewItem[];
  getReviewById: (id: string) => ReviewItem | undefined;
  handleWorkspaceDecision: (id: string, decision: 'keep' | 'partial' | 'not-using', comment?: string) => void;
  handleAccessMemberDecision: (reviewId: string, memberId: string, decision: 'keep' | 'remove') => void;
  bulkAccessDecision: (reviewId: string, decision: 'keep' | 'remove') => void;
  submitAccessReview: (reviewId: string, comment?: string) => void;
  handleLicenseDecision: (id: string, decision: 'keep' | 'partial' | 'release', comment?: string) => void;
  /** Undo a submitted review (only works within 5s window) */
  undoReview: (id: string) => boolean;
  /** Returns true if the given review is in the undo window */
  isUndoable: (id: string) => boolean;
}

const ReviewsContext = createContext<ReviewsContextValue | null>(null);

/* ── Provider ────────────────────────────────────────────────── */
export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<WorkspaceReviewItem[]>(mockWorkspaceReviews);
  const [accessReviews, setAccessReviews] = useState<AccessReviewItem[]>(mockAccessReviews);
  const [licenses, setLicenses] = useState<LicenseReviewItem[]>(mockLicenseReviews);
  const undoStackRef = useRef<UndoEntry[]>([]);
  const [, forceUpdate] = useState(0); // trigger re-render when undo stack changes

  const allReviews: ReviewItem[] = useMemo(
    () => [...workspaces, ...accessReviews, ...licenses],
    [workspaces, accessReviews, licenses]
  );

  const pendingReviews = useMemo(
    () => allReviews.filter((r) => r.status === 'pending' || r.status === 'in-review'),
    [allReviews]
  );

  const completedCount = useMemo(
    () => allReviews.filter((r) => r.status === 'approved' || r.status === 'rejected').length,
    [allReviews]
  );

  const totalCount = allReviews.length;
  const pendingCount = pendingReviews.length;

  const getCategoryCount = useCallback(
    (category: ReviewCategory) =>
      allReviews.filter((r) => r.category === category && (r.status === 'pending' || r.status === 'in-review')).length,
    [allReviews]
  );

  const getReviewsByCategory = useCallback(
    (category: ReviewCategory): ReviewItem[] => {
      switch (category) {
        case 'workspace': return workspaces;
        case 'access': return accessReviews;
        case 'license': return licenses;
      }
    },
    [workspaces, accessReviews, licenses]
  );

  const getReviewById = useCallback(
    (id: string): ReviewItem | undefined => allReviews.find((r) => r.id === id),
    [allReviews]
  );

  /* ── Undo helpers ────────────────────────────────────────────── */
  const scheduleUndo = useCallback((item: ReviewItem) => {
    // Save a snapshot of the item before it was changed
    const timerId = setTimeout(() => {
      // After 5s, remove from undo stack (finalize)
      undoStackRef.current = undoStackRef.current.filter((e) => e.id !== item.id);
      forceUpdate((v) => v + 1);
    }, 5000);

    undoStackRef.current = [
      ...undoStackRef.current.filter((e) => e.id !== item.id),
      { id: item.id, category: item.category, snapshot: { ...item }, timerId },
    ];
    forceUpdate((v) => v + 1);
  }, []);

  const undoReview = useCallback((id: string): boolean => {
    const entry = undoStackRef.current.find((e) => e.id === id);
    if (!entry) return false;

    clearTimeout(entry.timerId);
    undoStackRef.current = undoStackRef.current.filter((e) => e.id !== id);

    // Restore the snapshot
    const snap = entry.snapshot;
    if (snap.category === 'workspace') {
      setWorkspaces((prev) => prev.map((w) => (w.id === id ? snap as WorkspaceReviewItem : w)));
    } else if (snap.category === 'access') {
      setAccessReviews((prev) => prev.map((a) => (a.id === id ? snap as AccessReviewItem : a)));
    } else if (snap.category === 'license') {
      setLicenses((prev) => prev.map((l) => (l.id === id ? snap as LicenseReviewItem : l)));
    }

    forceUpdate((v) => v + 1);
    return true;
  }, []);

  const isUndoable = useCallback(
    (id: string) => undoStackRef.current.some((e) => e.id === id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [undoStackRef.current.length]
  );

  /* ── Workspace actions ───────────────────────────────────────── */
  const handleWorkspaceDecision = useCallback(
    (id: string, decision: 'keep' | 'partial' | 'not-using', comment?: string) => {
      const current = workspaces.find((w) => w.id === id);
      if (current) scheduleUndo(current);
      setWorkspaces((prev) =>
        prev.map((w) => w.id === id ? { ...w, status: 'approved' as const, decision, comment } : w)
      );
    },
    [workspaces, scheduleUndo]
  );

  /* ── Access actions ──────────────────────────────────────────── */
  const handleAccessMemberDecision = useCallback(
    (reviewId: string, memberId: string, decision: 'keep' | 'remove') => {
      setAccessReviews((prev) =>
        prev.map((ar) =>
          ar.id === reviewId
            ? { ...ar, members: ar.members.map((m: AccessMember) => m.id === memberId ? { ...m, decision } : m) }
            : ar
        )
      );
    },
    []
  );

  const bulkAccessDecision = useCallback(
    (reviewId: string, decision: 'keep' | 'remove') => {
      setAccessReviews((prev) =>
        prev.map((ar) =>
          ar.id === reviewId
            ? { ...ar, members: ar.members.map((m: AccessMember) => ({ ...m, decision })) }
            : ar
        )
      );
    },
    []
  );

  const submitAccessReview = useCallback(
    (reviewId: string, comment?: string) => {
      const current = accessReviews.find((a) => a.id === reviewId);
      if (current) scheduleUndo(current);
      setAccessReviews((prev) =>
        prev.map((ar) => ar.id === reviewId ? { ...ar, status: 'approved' as const, comment } : ar)
      );
    },
    [accessReviews, scheduleUndo]
  );

  /* ── License actions ─────────────────────────────────────────── */
  const handleLicenseDecision = useCallback(
    (id: string, decision: 'keep' | 'partial' | 'release', comment?: string) => {
      const current = licenses.find((l) => l.id === id);
      if (current) scheduleUndo(current);
      setLicenses((prev) =>
        prev.map((l) => l.id === id ? { ...l, status: 'approved' as const, decision, comment } : l)
      );
    },
    [licenses, scheduleUndo]
  );

  const value = useMemo<ReviewsContextValue>(() => ({
    allReviews,
    pendingReviews,
    completedCount,
    totalCount,
    pendingCount,
    getCategoryCount,
    getReviewsByCategory,
    getReviewById,
    handleWorkspaceDecision,
    handleAccessMemberDecision,
    bulkAccessDecision,
    submitAccessReview,
    handleLicenseDecision,
    undoReview,
    isUndoable,
  }), [
    allReviews, pendingReviews, completedCount, totalCount, pendingCount,
    getCategoryCount, getReviewsByCategory, getReviewById,
    handleWorkspaceDecision, handleAccessMemberDecision, bulkAccessDecision,
    submitAccessReview, handleLicenseDecision, undoReview, isUndoable,
  ]);

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
}

/* ── Hook ─────────────────────────────────────────────────────── */
export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within a ReviewsProvider');
  return ctx;
}
