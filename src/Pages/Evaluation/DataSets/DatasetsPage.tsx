import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import styles from "./DatasetsPage.module.css";

/* ===== Outlet context: Layout에서 내려주는 전역 헤더 세터 ===== */
type HeaderSetterCtx = {
  setHeader: (cfg: { title?: React.ReactNode; rightActions?: React.ReactNode }) => void;
};

/* =========================================================
   Types & Utilities
========================================================= */

type Dataset = {
  id: string;
  name: string;
  description?: string;
  items: number;
  runs: number;
  createdAt: string;
  lastRunAt?: string;
  metadata?: string;
};

const cx = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(" ");

/* =========================================================
   Small Icons
========================================================= */

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 15l-1.5 4.5L12 18l6.5-6.5a1.9 1.9 0 10-2.7-2.7L9 15z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
      <path d="M14.5 7.5l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 8V6a2 2 0 012-2 2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 8l1 9a2 2 0 002 2 2 2 0 002-2l1-9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11.5 11.5v5M13.5 11.5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================
   CSV Import Mapping Modal
========================================================= */

type CsvType = "string" | "number";

interface ImportCsvModalProps {
  open: boolean;
  headers: string[];
  rows: string[][];
  fileName?: string;
  onCancel: () => void;
  onImport: (items: any[]) => void;
}

function ImportCsvModal({
  open,
  headers,
  rows,
  fileName,
  onCancel,
  onImport,
}: ImportCsvModalProps) {
  const [inputCol, setInputCol] = useState<string>("");
  const [inputType, setInputType] = useState<CsvType>("number");
  const [expectedCol, setExpectedCol] = useState<string>("");
  const [expectedType, setExpectedType] = useState<CsvType>("string");
  const [metaCol, setMetaCol] = useState<string>("");
  const [metaType, setMetaType] = useState<CsvType>("number");

  useEffect(() => {
    if (!open || !headers.length) return;
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

    let guessedInput = headers.find((h) =>
      ["input", "prompt", "question", "id"].includes(norm(h))
    );
    let guessedExpected = headers.find((h) =>
      ["expected", "output", "answer", "label", "name"].includes(norm(h))
    );
    let guessedMeta = headers.find((h) =>
      ["metadata", "meta", "value", "score", "cost", "tokens"].includes(norm(h))
    );

    if (!guessedInput) guessedInput = headers[0];
    if (!guessedExpected) guessedExpected = headers[1] ?? headers[0];
    if (!guessedMeta) guessedMeta = headers[2] ?? headers[0];

    setInputCol(guessedInput);
    setExpectedCol(guessedExpected);
    setMetaCol(guessedMeta);

    const inferType = (col: string): CsvType => {
      const idx = headers.indexOf(col);
      if (idx < 0) return "string";
      const vals = rows.slice(0, 50).map((r) => r[idx] ?? "");
      const allNums =
        vals.length > 0 && vals.every((v) => v !== "" && !Number.isNaN(Number(v)));
      return allNums ? "number" : "string";
    };
    setInputType(inferType(guessedInput));
    setExpectedType(inferType(guessedExpected));
    setMetaType(inferType(guessedMeta));
  }, [open, headers, rows]);

  if (!open) return null;

  const cast = (val: string, t: CsvType) => {
    if (t === "number") {
      const n = Number(val);
      return Number.isFinite(n) ? n : null;
    }
    return val ?? "";
  };

  const doImport = () => {
    const items = rows.map((r) => {
      const obj: any = {};
      headers.forEach((h, idx) => {
        const v = r[idx] ?? "";
        if (h === inputCol) obj[h] = cast(v, inputType);
        else if (h === expectedCol) obj[h] = cast(v, expectedType);
        else if (h === metaCol) obj[h] = cast(v, metaType);
      });
      return obj;
    });
    onImport(items);
  };

  const used = new Set([inputCol, expectedCol, metaCol].filter(Boolean));
  const unmapped = headers.filter((h) => !used.has(h));

  const Select = ({
    value,
    onChange,
    options,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder: string;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.select}
      style={{ width: "100%" }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  const TypeSelect = ({
    value,
    onChange,
  }: {
    value: CsvType;
    onChange: (v: CsvType) => void;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CsvType)}
      className={styles.select}
    >
      <option value="string">string</option>
      <option value="number">number</option>
    </select>
  );

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal>
      <div className={styles.modal} style={{ width: "min(1200px, calc(100% - 24px))" }}>
        <div className={styles.modalHeader}>
          <h3>Import {fileName ? fileName : "CSV"}</h3>
          <button className={styles.iconBtn} aria-label="Close" onClick={onCancel}>
            <span className={styles.iconClose}>×</span>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.importHint}>
            Map your CSV columns to dataset fields. The CSV file must have column headers in the
            first row.
          </div>
          <div className={styles.importGrid}>
            <div className={styles.importCard}>
              <div className={styles.importCardTitle}>Input</div>
              <Select
                value={inputCol}
                onChange={setInputCol}
                options={headers}
                placeholder="Select column"
              />
              <div className={styles.importTypeRow}>
                <span>type</span>
                <TypeSelect value={inputType} onChange={setInputType} />
              </div>
            </div>
            <div className={styles.importCard}>
              <div className={styles.importCardTitle}>Expected Output</div>
              <Select
                value={expectedCol}
                onChange={setExpectedCol}
                options={headers}
                placeholder="Select column"
              />
              <div className={styles.importTypeRow}>
                <span>type</span>
                <TypeSelect value={expectedType} onChange={setExpectedType} />
              </div>
            </div>
            <div className={styles.importCard}>
              <div className={styles.importCardTitle}>Metadata</div>
              <Select
                value={metaCol}
                onChange={setMetaCol}
                options={headers}
                placeholder="Select column"
              />
              <div className={styles.importTypeRow}>
                <span>type</span>
                <TypeSelect value={metaType} onChange={setMetaType} />
              </div>
            </div>
            <div className={styles.importCard}>
              <div className={styles.importCardTitle}>Not mapped</div>
              <div className={styles.unmappedBox}>
                {unmapped.length ? unmapped.join(", ") : <span className={styles.muted}>—</span>}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={cx(styles.btn, styles.btnGhost)} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={cx(styles.btn, styles.btnCreateDataset)}
            onClick={doImport}
            disabled={!(inputCol || expectedCol || metaCol)}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Create / Edit Modal
========================================================= */

const META_ERROR_MSG =
  "Invalid input. Please provide a JSON object, number, or double-quoted string.";

interface CreateDatasetModalProps {
  open: boolean;
  mode?: "create" | "edit";
  initial?: Partial<Pick<Dataset, "name" | "description" | "metadata">>;
  existingNames?: string[];
  onClose: () => void;
  onSubmit: (form: { name: string; description?: string; metadata?: string }) => void;
}

function CreateDatasetModal({
  open,
  mode = "create",
  initial,
  existingNames = [],
  onClose,
  onSubmit,
}: CreateDatasetModalProps) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [desc, setDesc] = useState(initial?.description ?? "");
  const [meta, setMeta] = useState(initial?.metadata ?? "");

  const [nameError, setNameError] = useState<string | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);

  const isDupName = (val: string) =>
    existingNames.some((n) => n.trim().toLowerCase() === val.trim().toLowerCase());

  const validateName = (val: string): string | null =>
    val.trim() && isDupName(val) ? "Dataset name already exists." : null;

  const validateMeta = (val: string): string | null => {
    const t = val.trim();
    if (!t) return null;
    try {
      const parsed = JSON.parse(t);
      if (typeof parsed === "string" || typeof parsed === "number") return null;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return null;
      return META_ERROR_MSG;
    } catch {
      return META_ERROR_MSG;
    }
  };

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setDesc(initial?.description ?? "");
    setMeta(initial?.metadata ?? "");
    setNameError(null);
    setMetaError(null);
    setTimeout(() => firstFieldRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, initial, onClose]);

  if (!open) return null;

  const backdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  const submit = () => {
    const nameErr = validateName(name) ?? (name.trim() ? null : "");
    const metaErr = validateMeta(meta);
    setNameError(nameErr);
    setMetaError(metaErr);

    if (nameErr || metaErr || !name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: desc.trim() || undefined,
      metadata: meta.trim() || undefined,
    });
  };

  return (
    <div
      className={styles.modalBackdrop}
      onMouseDown={backdropClick}
      ref={backdropRef}
      role="dialog"
      aria-modal
      aria-labelledby="dataset-modal-title"
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 id="dataset-modal-title">{mode === "edit" ? "Edit dataset" : "Create new dataset"}</h3>
          <button className={styles.iconBtn} aria-label="Close" onClick={onClose}>
            <span className={styles.iconClose}>×</span>
          </button>
        </div>

        <div className={styles.modalBody}>
          <label className={cx(styles.label, nameError && styles.labelError)}>
            <span>Name</span>
            <input
              ref={firstFieldRef}
              value={name}
              onChange={(e) => {
                const v = e.target.value;
                setName(v);
                setNameError(validateName(v));
              }}
              className={cx(styles.input, nameError && styles.inputError)}
              aria-invalid={!!nameError}
            />
            {nameError && <div className={styles.errorText}>{nameError}</div>}
          </label>

          <label className={styles.label}>
            <span>
              Description <em>(optional)</em>
            </span>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} className={styles.input} />
          </label>

          <label className={cx(styles.label, metaError && styles.labelError)}>
            <span>
              Metadata <em>(optional)</em>
            </span>
            <input
              value={meta}
              onChange={(e) => {
                const v = e.target.value;
                setMeta(v);
                setMetaError(validateMeta(v));
              }}
              className={cx(styles.input, metaError && styles.inputError)}
              aria-invalid={!!metaError}
            />
            {metaError && <div className={styles.errorText}>{META_ERROR_MSG}</div>}
          </label>
        </div>

        <div className={styles.modalFooter}>
          <button className={cx(styles.btn, styles.btnCreateDataset)} onClick={submit}>
            {mode === "edit" ? "Save" : "Create dataset"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Row Actions Popover
========================================================= */

interface RowActionsProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function RowActions({ open, onClose, onEdit, onDelete }: RowActionsProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.actionsMenu} ref={ref} onMouseDown={(e) => e.stopPropagation()}>
      <div className={styles.actionsHeader}>Actions</div>
      <button className={styles.actionsItem} onClick={onEdit}>
        <PencilIcon className={styles.actionsIcon} />
        <span>Edit</span>
      </button>
      <button className={styles.actionsItem} onClick={onDelete}>
        <TrashIcon className={styles.actionsIcon} />
        <span>Delete</span>
      </button>
    </div>
  );
}

/* =========================================================
   Empty State
========================================================= */

function DatasetsEmpty({ onClickNew }: { onClickNew: () => void }) {
  return (
    <div className={styles.emptyWrap}>
      <h2 className={styles.emptyTitle}>Get Started with Datasets</h2>
      <p className={styles.emptyDesc}>
        Datasets in Langfuse are collections of inputs (and expected outputs) for your LLM
        application. You can for example use them to benchmark new releases before deployment to
        production.
      </p>

      <div className={styles.emptyActions}>
        <button className={cx(styles.btn, styles.btnNewDataset)} onClick={onClickNew}>
          + New dataset
        </button>
        
        <a className={cx(styles.btn, styles.btnGhost)}
        href="https://langfuse.com/docs"
        target="_blank"
        rel="noreferrer"
        >
          Learn More
        </a>
      </div>

      <div className={styles.emptyGrid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>⚡ Continuous improvement</div>
          <div className={styles.cardDesc}>
            Create datasets from production edge cases to improve your application
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>🧪 Pre-deployment testing</div>
          <div className={styles.cardDesc}>
            Benchmark new releases before deploying to production
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>📄 Structured testing</div>
          <div className={styles.cardDesc}>
            Run experiments on collections of inputs and expected outputs
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>&lt;/&gt; Custom workflows</div>
          <div className={styles.cardDesc}>
            Build custom workflows around your datasets via the API and SDKs
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Detail Page (Runs / Items tabs)
========================================================= */

interface DatasetDetailProps {
  dataset: Dataset;
  onBack: () => void;
}

function DatasetDetail({ dataset, onBack }: DatasetDetailProps) {
  const { setHeader } = useOutletContext<HeaderSetterCtx>(); // ★ 전역 헤더 세터
  const [tab, setTab] = useState<"runs" | "items">("runs");

  const [items, setItems] = useState<any[]>([]);
  const [importOpen, setImportOpen] = useState(false);
  const [importHeaders, setImportHeaders] = useState<string[]>([]);
  const [importRows, setImportRows] = useState<string[][]>([]);
  const [lastFileName, setLastFileName] = useState<string>("");
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsRowsPerPage, setItemsRowsPerPage] = useState(50);
  const hasItems = items.length > 0;
  const [isDragging, setIsDragging] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

  // ★ 전역 헤더 구성: 왼쪽 타이틀 + 탭별 우측 액션
  useEffect(() => {
    const left = (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button className={styles.breadcrumbChip} onClick={onBack}>Dataset</button>
        <span className={styles.datasetChip}>{dataset.name}</span>
        <span className={styles.infoDot} aria-hidden>○</span>
      </div>
    );

    const right =
      tab === "items" ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className={cx(styles.btn, styles.newItemBtn)}>+ New item</button>
          <button className={styles.iconBtn} aria-label="More">⋯</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className={cx(styles.btn, styles.btnNewExperiment)}>New experiment</button>
          <button className={cx(styles.btn, styles.btnGhost)}>Select evaluators ▾</button>
          <button className={cx(styles.btn, styles.btnGhost)}>Charts <span className={styles.badge}>2</span></button>
          <button className={styles.iconBtn} aria-label="More">⋯</button>
        </div>
      );

    setHeader({ title: left, rightActions: right });
    return () => setHeader({ title: undefined, rightActions: undefined });
  }, [dataset.name, onBack, setHeader, tab]);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0]; if (!file) return; readCsvFile(file);
  };

  // CSV parser
  const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
    const rows: string[][] = [];
    let row: string[] = [];
    let current = "";
    let inQuotes = false;

    const pushCell = () => { row.push(current); current = ""; };
    const pushRow = () => { rows.push(row); row = []; };

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { current += '"'; i++; }
          else { inQuotes = false; }
        } else {
          current += c;
        }
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ",") pushCell();
        else if (c === "\n") { pushCell(); pushRow(); }
        else if (c === "\r") { /* ignore */ }
        else current += c;
      }
    }
    pushCell();
    if (row.length > 1 || row[0] !== "") pushRow();

    while (rows.length && rows[rows.length - 1].every((x) => x === "")) rows.pop();

    const headers = rows.shift() ?? [];
    return { headers, rows };
  };

  const readCsvFile = (file: File) => {
    setItemsError(null);
    if (!/\.csv($|\b)/i.test(file.name) && file.type !== "text/csv") {
      setItemsError("Please upload a .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const parsed = parseCSV(text);
        if (!parsed.headers.length) { setItemsError("CSV has no header row."); return; }
        if (parsed.rows.length === 0) { setItemsError("No rows found in the CSV."); return; }
        setImportHeaders(parsed.headers);
        setImportRows(parsed.rows);
        setLastFileName(file.name);
        setImportOpen(true);
      } catch {
        setItemsError("Failed to parse CSV. Please check the format.");
      }
    };
    reader.onerror = () => setItemsError("Failed to read the file.");
    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readCsvFile(file);
  };

  return (
    <div className={styles.detailPage}>
      {/* ⛔️ 기존 detailTopBar는 전역 헤더로 올렸으므로 제거 */}

      {/* tabs */}
      <div className={styles.detailTabs}>
        <button className={cx(styles.tabBtn, tab === "runs" && styles.tabBtnActive)} onClick={() => setTab("runs")}>Runs</button>
        <button className={cx(styles.tabBtn, tab === "items" && styles.tabBtnActive)} onClick={() => setTab("items")}>Items</button>
      </div>

      {/* Runs tab */}
      {tab === "runs" ? (
        <>
          <div className={styles.tableToolbarRightOnly}>
            <button className={cx(styles.btn, styles.btnGhost)}>
              Columns <span className={styles.badge}>9/10</span>
            </button>
            <button className={styles.iconBtn} aria-label="Layout">☰</button>
          </div>

          <table className={styles.detailTable}>
            <thead>
              <tr>
                <th>Name</th><th>Description</th><th>Run Items</th><th>Latency (avg)</th>
                <th>Total Cost (avg)</th><th>Run-level Scores</th><th>Aggregated Run Items…</th>
                <th>Created</th><th>Metadata</th><th className={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={styles.emptyCellDetail} colSpan={10}>No results.</td></tr>
            </tbody>
          </table>

          <div className={styles.bottomBar}>
            <div className={styles.bottomRight}>
              <div className={styles.rowsPerPage}>
                Rows per page
                <select
                  className={styles.select}
                  value={itemsRowsPerPage}
                  onChange={(e) => { setItemsRowsPerPage(parseInt(e.target.value, 10)); setItemsPage(1); }}
                >
                  <option value={10}>10</option><option value={25}>25</option>
                  <option value={50}>50</option><option value={100}>100</option>
                </select>
              </div>
              <div className={styles.pageInfo}>
                Page <input className={styles.pageInput} value={itemsPage}
                  onChange={(e)=>{ const n = parseInt(e.target.value||"1",10); if(!Number.isNaN(n)) setItemsPage(n); }} />
                <span>of {Math.max(1, Math.ceil(items.length / itemsRowsPerPage))}</span>
              </div>
              <div className={styles.pagerBtns}>
                <button className={styles.pageBtn} onClick={()=>setItemsPage(1)}>«</button>
                <button className={styles.pageBtn} onClick={()=>setItemsPage(Math.max(1, itemsPage-1))}>‹</button>
                <button className={styles.pageBtn} onClick={()=>setItemsPage(Math.min(Math.max(1, Math.ceil(items.length/itemsRowsPerPage)), itemsPage+1))}>›</button>
                <button className={styles.pageBtn} onClick={()=>setItemsPage(Math.max(1, Math.ceil(items.length/itemsRowsPerPage)))}>»</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Items tab */
        <>
          <div className={styles.itemsToolbarRight}>
            <button className={cx(styles.btn, styles.btnGhost)}>
              Columns <span className={styles.badge}>8/8</span>
            </button>
            <button className={styles.iconBtn} title="List">☰</button>
            <button className={styles.iconBtn} title="Download">⇩</button>
          </div>

          {hasItems && (
            <table className={styles.detailTable}>
              <thead>
                <tr>{(items.length ? Object.keys(items[0]) : []).map((col) => (<th key={col}>{col}</th>))}</tr>
              </thead>
              <tbody>
                {(() => {
                  const pageCount = Math.max(1, Math.ceil(items.length / itemsRowsPerPage));
                  const safePage = Math.min(Math.max(1, itemsPage), pageCount);
                  const start = (safePage - 1) * itemsRowsPerPage;
                  const visible = items.slice(start, start + itemsRowsPerPage);
                  return visible.map((row, idx) => (
                    <tr key={idx}>{Object.keys(items[0]).map((col) => (<td key={col + idx}>{String(row[col] ?? "")}</td>))}</tr>
                  ));
                })()}
              </tbody>
            </table>
          )}

          {!hasItems && (
            <div className={styles.itemsDropzoneWrap}>
              <div className={styles.itemsDropzone}>
                <div className={styles.dropTitle}>Add items to dataset</div>
                <div className={styles.dropSubtitle}>
                  Add items to dataset by uploading a file, add items manually or via our SDKs/API
                </div>
                <input id="csvFileInput" type="file" accept=".csv,text/csv" className={styles.fileInputHidden} onChange={handleFileSelect}/>
                <label
                  htmlFor="csvFileInput"
                  className={cx(styles.dropArea, styles.dropAreaWide, isDragging && styles.dropAreaActive)}
                  onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                >
                  <div className={styles.dropIcon}>⬆</div>
                  <div className={styles.dropText}>Click to select a CSV file</div>
                </label>
              </div>
              {itemsError && <div className={styles.dropError}>{itemsError}</div>}
            </div>
          )}

          {hasItems && (
            <div className={styles.bottomBar}>
              <div className={styles.bottomRight}>
                <div className={styles.rowsPerPage}>
                  Rows per page
                  <select className={styles.select} value={itemsRowsPerPage}
                    onChange={(e)=>{ setItemsRowsPerPage(parseInt(e.target.value,10)); setItemsPage(1); }}>
                    <option value={10}>10</option><option value={25}>25</option>
                    <option value={50}>50</option><option value={100}>100</option>
                  </select>
                </div>
                <div className={styles.pageInfo}>
                  Page <input className={styles.pageInput} value={itemsPage}
                    onChange={(e)=>{ const n = parseInt(e.target.value||"1",10); if(!Number.isNaN(n)) setItemsPage(n); }} />
                  <span>of {Math.max(1, Math.ceil(items.length / itemsRowsPerPage))}</span>
                </div>
                <div className={styles.pagerBtns}>
                  <button className={styles.pageBtn} onClick={()=>setItemsPage(1)}>«</button>
                  <button className={styles.pageBtn} onClick={()=>setItemsPage(Math.max(1, itemsPage-1))}>‹</button>
                  <button className={styles.pageBtn} onClick={()=>setItemsPage(Math.min(Math.max(1, Math.ceil(items.length/itemsRowsPerPage)), itemsPage+1))}>›</button>
                  <button className={styles.pageBtn} onClick={()=>setItemsPage(Math.max(1, Math.ceil(items.length/itemsRowsPerPage)))}>»</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Import mapping modal */}
      <ImportCsvModal
        open={importOpen}
        headers={importHeaders}
        rows={importRows}
        fileName={lastFileName}
        onCancel={() => setImportOpen(false)}
        onImport={(newItems) => {
          setItems(newItems);
          setItemsPage(1);
          setImportOpen(false);
          setTab("items");
        }}
      />
    </div>
  );
}

/* =========================================================
   List Table (index view)
========================================================= */

interface DatasetsTableProps {
  data: Dataset[];
  search: string;
  setSearch: (s: string) => void;
  page: number;
  setPage: (n: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (n: number) => void;
  onEdit: (row: Dataset) => void;
  onDelete: (row: Dataset) => void;
  onOpen: (row: Dataset) => void;
}

function DatasetsTable({
  data,
  search,
  setSearch,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  onEdit,
  onDelete,
  onOpen,
}: DatasetsTableProps) {
  const [menuRow, setMenuRow] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? data.filter((d) => d.name.toLowerCase().includes(q)) : data;
  }, [data, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(Math.max(1, page), pageCount);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount]);

  const start = (safePage - 1) * rowsPerPage;
  const visible = filtered.slice(start, start + rowsPerPage);

  return (
    <>
      {/* toolbar */}
      <div className={styles.tableToolbar}>
        <div className={styles.searchWrap}>
          <div className={styles.searchIcon}>🔍</div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            placeholder="Search (Name)"
          />
        </div>
        <div className={styles.toolbarRight}>
          <button className={cx(styles.btn, styles.btnGhost)}>
            Table View <span className={styles.badge}>0</span>
          </button>
          <button className={cx(styles.btn, styles.btnGhost)}>
            Columns <span className={styles.badge}>8/8</span>
          </button>
          <button className={styles.iconBtn} aria-label="Layout">☰</button>
        </div>
      </div>

      {/* table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thName}>Name</th>
            <th>Description</th>
            <th>Items</th>
            <th>Runs</th>
            <th>Created</th>
            <th>Last Run</th>
            <th>Metadata</th>
            <th className={styles.thActions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((d) => (
            <tr key={d.id} onMouseDown={() => setMenuRow(null)}>
              <td>
                <button
                  className={cx(styles.nameTag, styles.nameTagButton)}
                  onClick={() => onOpen(d)}
                  title="Open dataset"
                >
                  {d.name}
                </button>
              </td>
              <td className={styles.muted}>{d.description ?? ""}</td>
              <td>{d.items}</td>
              <td>{d.runs}</td>
              <td className={styles.muted}>{d.createdAt}</td>
              <td className={styles.muted}>{d.lastRunAt ?? ""}</td>
              <td>
                <input className={styles.cellInput} value={d.metadata ?? ""} readOnly />
              </td>
              <td className={cx(styles.tdActions, styles.actionsCell)}>
                <button
                  className={styles.dotBtn}
                  aria-label="More"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setMenuRow((prev) => (prev === d.id ? null : d.id));
                  }}
                >
                  ⋮
                </button>
                <RowActions
                  open={menuRow === d.id}
                  onClose={() => setMenuRow(null)}
                  onEdit={() => {
                    setMenuRow(null);
                    onEdit(d);
                  }}
                  onDelete={() => {
                    setMenuRow(null);
                    onDelete(d);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* bottom bar */}
      {filtered.length > 0 && (
        <div className={styles.bottomBar}>
          <div className={styles.bottomRight}>
            <div className={styles.rowsPerPage}>
              Rows per page
              <select
                className={styles.select}
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className={styles.pageInfo}>
              Page
              <input
                className={styles.pageInput}
                value={safePage}
                onChange={(e) => {
                  const n = parseInt(e.target.value || "1", 10);
                  if (!Number.isNaN(n)) setPage(n);
                }}
              />
              <span>of {pageCount}</span>
            </div>

            <div className={styles.pagerBtns}>
              <button className={styles.pageBtn} onClick={() => setPage(1)} aria-label="First">«</button>
              <button className={styles.pageBtn} onClick={() => setPage(Math.max(1, safePage - 1))} aria-label="Prev">‹</button>
              <button className={styles.pageBtn} onClick={() => setPage(Math.min(pageCount, safePage + 1))} aria-label="Next">›</button>
              <button className={styles.pageBtn} onClick={() => setPage(pageCount)} aria-label="Last">»</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   Page Container
========================================================= */

export default function DatasetsPage() {
  const { setHeader } = useOutletContext<HeaderSetterCtx>(); // ★ 목록 헤더도 여기서 설정
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Dataset | null>(null);
  const [opened, setOpened] = useState<Dataset | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const location = useLocation();
  const navigate = useNavigate();

  const hasData = datasets.length > 0;

  const fmt = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

  // ✅ /datasets?new=1 이면 모달 오픈
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "1") setOpenCreate(true);
  }, [location.search]);

  // ✅ 모달 닫을 때 쿼리 제거
  const closeCreate = () => {
    setOpenCreate(false);
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "1") navigate("/datasets", { replace: true });
  };

  const handleCreate = (form: { name: string; description?: string; metadata?: string }) => {
    const item: Dataset = {
      id: crypto.randomUUID(),
      name: form.name,
      description: form.description,
      items: 0,
      runs: 0,
      createdAt: fmt(new Date()),
      lastRunAt: undefined,
      metadata: form.metadata,
    };
    setDatasets((prev) => [item, ...prev]);
    setOpenCreate(false);
    // 헤더 버튼으로 들어온 경우 쿼리 제거
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "1") navigate("/datasets", { replace: true });
  };

  const handleEditSave = (form: { name: string; description?: string; metadata?: string }) => {
    if (!editTarget) return;
    setDatasets((prev) =>
      prev.map((d) =>
        d.id === editTarget.id
          ? { ...d, name: form.name, description: form.description, metadata: form.metadata }
          : d
      )
    );
    setEditTarget(null);
  };

  const handleDelete = (row: Dataset) => {
    if (!confirm(`Delete dataset "${row.name}"?`)) return;
    setDatasets((prev) => prev.filter((d) => d.id !== row.id));
  };

  /* --- 목록 화면 전역 헤더: Datasets · + New dataset --- */
  useEffect(() => {
    if (!opened) {
      setHeader({
        title: "Datasets",
        rightActions: (
          <button
            className={cx(styles.btn, styles.btnCreateDataset)}
            onClick={() => setOpenCreate(true)}
            style={{ cursor: "pointer" }}
          >
            + New dataset
          </button>
        ),
      });
      return () => setHeader({ title: undefined, rightActions: undefined });
    }
  }, [opened, setHeader]);

  // ---- detail (opened) view
  if (opened) {
    return (
      <div className={styles.page}>
        <main className={cx(styles.main, styles.mainDetail)}>
          <DatasetDetail dataset={opened} onBack={() => setOpened(null)} />
        </main>

        {/* modals */}
        <CreateDatasetModal
          open={openCreate}
          mode="create"
          existingNames={datasets.map((d) => d.name)}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />
        <CreateDatasetModal
          open={!!editTarget}
          mode="edit"
          initial={editTarget ? { name: editTarget.name, description: editTarget.description, metadata: editTarget.metadata } : undefined}
          existingNames={editTarget ? datasets.filter((d) => d.id !== editTarget.id).map((d) => d.name) : datasets.map((d) => d.name)}
          onClose={() => setEditTarget(null)}
          onSubmit={handleEditSave}
        />
      </div>
    );
  }

  // ---- list (index) view
  return (
    <div className={styles.page}>
      {/* ⛔️ 로컬 헤더는 제거 — PageHeader가 타이틀/헤더 버튼 담당 */}
      <main className={styles.main}>
        {!hasData ? (
          <DatasetsEmpty onClickNew={() => setOpenCreate(true)} />
        ) : (
          <DatasetsTable
            data={datasets}
            search={search}
            setSearch={(s) => { setSearch(s); setPage(1); }}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={(n) => { setRowsPerPage(n); setPage(1); }}
            onEdit={(row) => setEditTarget(row)}
            onDelete={handleDelete}
            onOpen={(row) => setOpened(row)}
          />
        )}
      </main>

      {/* modals */}
      <CreateDatasetModal
        open={openCreate}
        mode="create"
        existingNames={datasets.map((d) => d.name)}
        onClose={closeCreate}
        onSubmit={handleCreate}
      />
      <CreateDatasetModal
        open={!!editTarget}
        mode="edit"
        initial={editTarget ? { name: editTarget.name, description: editTarget.description, metadata: editTarget.metadata } : undefined}
        existingNames={editTarget ? datasets.filter((d) => d.id !== editTarget.id).map((d) => d.name) : datasets.map((d) => d.name)}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEditSave}
      />
    </div>
  );
}
