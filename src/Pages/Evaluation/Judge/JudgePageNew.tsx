import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./JudgePageNew.module.css";

/** 전역 PageHeader 세터 (레이아웃에서 내려줌) */
type HeaderSetterCtx = {
  setHeader: (cfg: { title?: React.ReactNode; rightActions?: React.ReactNode; flushLeft?: boolean }) => void;
};

type EvalRow = {
  id: string;
  name: string;
  tag?: "beta" | "new";
  hasInfo?: boolean;
};

const ALL: EvalRow[] = [
  { id: "Conciseness", name: "Conciseness", tag: "beta" },
  { id: "Contextcorrectness", name: "Contextcorrectness", hasInfo: true },
  { id: "Contextrelevance", name: "Contextrelevance" },
  { id: "Correctness", name: "Correctness", tag: "beta" },
  { id: "Hallucination", name: "Hallucination", tag: "beta" },
  { id: "Helpfulness", name: "Helpfulness", tag: "beta" },
  { id: "Relevance", name: "Relevance", tag: "beta" },
  { id: "Toxicity", name: "Toxicity", tag: "beta" },
  { id: "Answer Correctness", name: "Answer Correctness", hasInfo: true },
  { id: "Answer Critic", name: "Answer Critic" },
  { id: "Answer Relevance", name: "Answer Relevance", hasInfo: true },
  { id: "Context Precision", name: "Context Precision", hasInfo: true },
  { id: "Context Recall", name: "Context Recall", hasInfo: true },
  { id: "Faithfulness", name: "Faithfulness", hasInfo: true },
  { id: "Goal Accuracy", name: "Goal Accuracy", hasInfo: true },
  { id: "Simple Criteria", name: "Simple Criteria" },
  { id: "SQL Semantic Equivalence", name: "SQL Semantic Equivalence", tag: "beta" },
  { id: "Topic Adherence Classification", name: "Topic Adherence Classification", hasInfo: true },
  { id: "Topic Adherence Refusal", name: "Topic Adherence Refusal", hasInfo: true },
];

const cx = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(" ");

/* ──────────────────────────────────────────────────────
   Create Custom Evaluator Modal
────────────────────────────────────────────────────── */
function CreateEvaluatorModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: {
    name: string;
    useDefaultModel: boolean;
    evalPrompt: string;
    scoreReasoning: string;
    scoreRange: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [useDefaultModel, setUseDefaultModel] = useState(true);
  const [evalPrompt, setEvalPrompt] = useState("");
  const [scoreReasoning, setScoreReasoning] = useState("One sentence reasoning for the score");
  const [scoreRange, setScoreRange] = useState(
    "Score between 0 and 1. Score 0 if false or negative and 1 if true or positive."
  );

  useEffect(() => {
    if (!open) return;
    // 폼 초기화 (필요 시 유지하려면 제거)
    setName("");
    setUseDefaultModel(true);
    setEvalPrompt("");
    setScoreReasoning("One sentence reasoning for the score");
    setScoreRange(
      "Score between 0 and 1. Score 0 if false or negative and 1 if true or positive."
    );
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.modalHeader}>
          <h3>Create new evaluator</h3>
          <button className={styles.iconBtn} aria-label="Close" onClick={onClose}>
            <span className={styles.iconClose}>×</span>
          </button>
        </div>

        {/* 바디 */}
        <div className={styles.modalBody}>
          {/* Name */}
          <label className={styles.label}>
            <span>Name</span>
            <input
              className={styles.input}
              placeholder="Select a template name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          {/* Model */}
          <div className={styles.cardBlock}>
            <div className={styles.cardBlockHeader}>Model</div>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={useDefaultModel}
                onChange={(e) => setUseDefaultModel(e.target.checked)}
              />
              <span>Use default evaluation model</span>
            </label>

            <div className={styles.helpRow}>
              <span className={styles.warnText}>
                No default model set. Set up default evaluation model
              </span>
              <a className={styles.smallBtn} href="/evals/default-model" target="_blank" rel="noreferrer" title="Set default model">
                ✎
              </a>
            </div>

            <div className={styles.subBlock}>
              <div className={styles.subTitle}>Custom model configuration</div>
              <div className={styles.subDesc}>No LLM API key set in project.</div>
              <button type="button" className={styles.smallBtn} onClick={() => alert("Add LLM Connection")}>
                + Add LLM Connection
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div className={styles.cardBlock}>
            <div className={styles.cardBlockHeader}>Prompt</div>

            <label className={styles.label}>
              <span>Evaluation prompt</span>
              <div className={styles.helpText}>
                Define your llm-as-a-judge evaluation template. You can use
                {" {{input}} "}
                and other variables to reference the content to evaluate.
              </div>
              <textarea
                className={cx(styles.input, styles.textarea)}
                value={evalPrompt}
                onChange={(e) => setEvalPrompt(e.target.value)}
                rows={8}
                placeholder="Write evaluation prompt…"
              />
            </label>

            <label className={styles.label}>
              <span>Score reasoning prompt</span>
              <div className={styles.helpText}>
                Define how the LLM should explain its evaluation. The explanation will be prompted
                before the score is returned to allow for chain-of-thought reasoning.
              </div>
              <input
                className={styles.input}
                value={scoreReasoning}
                onChange={(e) => setScoreReasoning(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              <span>Score range prompt</span>
              <div className={styles.helpText}>
                Define how the LLM should return the evaluation score in natural language. Needs to
                yield a numeric value.
              </div>
              <input
                className={styles.input}
                value={scoreRange}
                onChange={(e) => setScoreRange(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* 푸터 */}
        <div className={styles.modalFooter}>
          <button
            className={styles.primaryBtn}
            onClick={() => {
              onSave({ name, useDefaultModel, evalPrompt, scoreReasoning, scoreRange });
              onClose();
            }}
            disabled={!name.trim()}
            title={!name.trim() ? "Please enter name" : "Save"}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   Main Page
────────────────────────────────────────────────────── */
export default function JudgePageNew() {
  const navigate = useNavigate();
  const { setHeader } = useOutletContext<HeaderSetterCtx>();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  // Header
  useEffect(() => {
    setHeader({
      title: "Set up evaluator",
      rightActions: (
        <button
          type="button"
          className={styles.modelPill}
          onClick={() => {/* 기본 모델 설정 다이얼로그로 이동 등 */}}
          title="Edit default model"
        >
          No default model set <span className={styles.pencil}>✎</span>
        </button>
      ),
    });
    return () => setHeader({ title: undefined, rightActions: undefined, flushLeft: undefined });
  }, [setHeader]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? ALL.filter((r) => r.name.toLowerCase().includes(s)) : ALL;
  }, [q]);

  const goNext = () => {
    if (!selected) return;
    navigate(`/llm-as-a-judge/run?template=${encodeURIComponent(selected)}`);
  };

  return (
    <div className={styles.page}>
      {/* 단계 표시 */}
      <div className={styles.steps}>
        <span className={styles.stepActive}>1. Select Evaluator</span>
        <span className={styles.stepSep}>›</span>
        <span>2. Run Evaluator</span>
      </div>

      {/* 검색 + 목록 카드 */}
      <section className={styles.card}>
        <div className={styles.searchRow}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search evaluators..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className={styles.groupTitle}>Langfuse managed evaluators</div>

        <ul className={styles.list}>
          {list.map((row) => (
            <li key={row.id} className={styles.row}>
              <label className={styles.rowLeft} onClick={() => setSelected(row.id)}>
                <input
                  type="radio"
                  className={styles.radio}
                  checked={selected === row.id}
                  onChange={() => setSelected(row.id)}
                />
                <span className={styles.nameWrap}>
                  <span className={styles.rowName}>{row.name}</span>
                  {row.tag === "beta" && <span className={cx(styles.badge, styles.badgeBeta)}>β</span>}
                  {row.tag === "new" && <span className={cx(styles.badge, styles.badgeNew)}>NEW</span>}
                  {row.hasInfo && <span className={cx(styles.ic, styles.icInfo)}>ⓘ</span>}
                  <span className={cx(styles.ic, styles.icExt)}>↗</span>
                </span>
              </label>

              <a
                className={styles.docBtn}
                href="https://langfuse.com/docs"
                target="_blank"
                rel="noreferrer"
                title="Docs"
              >
                ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 하단 버튼 */}
      <div className={styles.footer}>
        <button className={styles.btnGhost} onClick={() => setOpenCreate(true)}>
          + Create Custom Evaluator
        </button>
        <button className={styles.btnPrimary} disabled={!selected} onClick={goNext}>
          Use Selected Evaluator
        </button>
      </div>

      {/* 모달 */}
      <CreateEvaluatorModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={(form) => {
          console.log("Create evaluator:", form);
          // TODO: 저장 API 호출/상태 업데이트 연동
        }}
      />
    </div>
  );
}
