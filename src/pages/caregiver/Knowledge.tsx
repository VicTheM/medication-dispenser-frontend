import { useEffect, useRef, useState } from "react";
import AppShell from "../../components/AppShell";
import { EmptyState, formatDateTime } from "../../components/Shared";
import { api, ApiError } from "../../api/client";
import { KnowledgeDocument } from "../../api/types";
import { useToast } from "../../context/ToastContext";

const NAV = [
  { to: "/app", label: "Patients", icon: "◈", end: true },
  { to: "/app/knowledge", label: "Knowledge base", icon: "▤" },
];

export default function Knowledge() {
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { show } = useToast();

  async function load() {
    setLoading(true);
    try {
      setDocs(await api.get<KnowledgeDocument[]>("/ai/knowledge"));
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't load documents", "error");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const doc = await api.postForm<KnowledgeDocument>("/ai/knowledge", form);
      show(doc.ingest_status === "ingested" ? "Uploaded and indexed" : "Uploaded, but indexing failed — check the AI service");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <AppShell navItems={NAV} roleLabel="Caregiver">
      <div className="topbar">
        <h2 style={{ fontSize: 22 }}>Knowledge base</h2>
      </div>
      <div className="content" style={{ maxWidth: 760 }}>
        <p className="mb-24">
          Upload care plans, discharge summaries, or medication guides. The assistant uses these
          documents to ground its answers when patients or caregivers ask a question.
        </p>

        <form onSubmit={onUpload} className="card card-pad mb-24 flex" style={{ gap: 12, alignItems: "center" }}>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.md" required style={{ flex: 1 }} />
          <button className="btn btn-primary" disabled={uploading} type="submit">
            {uploading ? <span className="spinner" /> : "Upload"}
          </button>
        </form>

        <div className="card">
          {loading ? (
            <div className="flex" style={{ justifyContent: "center", padding: 40 }}><span className="spinner" /></div>
          ) : docs.length === 0 ? (
            <EmptyState title="No documents yet" hint="Upload a .pdf, .txt, or .md file to get started." />
          ) : (
            <table>
              <thead><tr><th>File</th><th>Status</th><th>Uploaded</th></tr></thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>{d.filename}</td>
                    <td>
                      <span className={`badge ${d.ingest_status === "ingested" ? "badge-success" : d.ingest_status === "failed" ? "badge-failed" : "badge-unassigned"}`}>
                        {d.ingest_status}
                      </span>
                    </td>
                    <td className="text-sm">{formatDateTime(d.uploaded_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}
