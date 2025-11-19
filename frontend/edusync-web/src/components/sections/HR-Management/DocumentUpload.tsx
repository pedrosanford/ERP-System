import React, { useState, useRef, useEffect, useMemo } from "react";
import {
    FiFile,
    FiUpload,
    FiSearch,
    FiDownload,
    FiEye,
    FiPaperclip,
    FiClock,
    FiCalendar,
    FiX,
} from "react-icons/fi";

interface Document {
    id: string;
    title: string;
    type: "CONTRACT" | "POLICY" | "AGREEMENT" | "REPORT" | "FORM";
    category: "HR" | "LEGAL" | "FINANCIAL" | "ADMINISTRATIVE" | "EMPLOYEE";
    dateCreated: string;
    lastModified: string;
    status: "ACTIVE" | "DRAFT" | "EXPIRED" | "PENDING_REVIEW";
    fileSize: number;
    fileType: string;
    creator: string;
    description: string;
    tags: string[];
    fileName: string;
    fileData: string;
}

interface UploadFormData {
    title: string;
    type: string;
    category: string;
    description: string;
    tags: string;
}

const DocumentUpload: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInput = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<UploadFormData>({
        title: "",
        type: "POLICY",
        category: "HR",
        description: "",
        tags: "",
    });

    const categories = ["All", "HR", "LEGAL", "FINANCIAL", "ADMINISTRATIVE", "EMPLOYEE"];
    const types = ["CONTRACT", "POLICY", "AGREEMENT", "REPORT", "FORM"];

    useEffect(() => {
        const stored = localStorage.getItem("documents");
        if (stored) setDocuments(JSON.parse(stored));
    }, []);

    const saveDocuments = (docs: Document[]) => {
        setDocuments(docs);
        localStorage.setItem("documents", JSON.stringify(docs));
    };

    const filteredDocuments = useMemo(() => {
        return documents.filter(d => {
            const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = category === "All" || d.category === category;
            return matchesSearch && matchesCategory;
        });
    }, [documents, search, category]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
    };

    const removeSelectedFile = (name: string) => {
        setSelectedFiles(prev => prev.filter(f => f.name !== name));
    };

    const fileToBase64 = (file: File) => new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return alert("Title required.");
        if (selectedFiles.length === 0) return alert("Select at least one file.");
        setLoading(true);

        const newDocs: Document[] = [];
        for (const file of selectedFiles) {
            const base64 = await fileToBase64(file);
            newDocs.push({
                id: crypto.randomUUID(),
                title: formData.title,
                type: formData.type as any,
                category: formData.category as any,
                description: formData.description,
                tags: formData.tags.split(",").map(t => t.trim()),
                creator: "Local User",
                status: "ACTIVE",
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type || "Unknown",
                fileData: base64,
                dateCreated: new Date().toLocaleDateString(),
                lastModified: new Date().toLocaleDateString(),
            });
        }

        saveDocuments([...documents, ...newDocs]);
        setSelectedFiles([]);
        setFormData({ title: "", type: "POLICY", category: "HR", description: "", tags: "" });
        setIsDialogOpen(false);
        setLoading(false);
    };

    const handleDownload = (doc: Document) => {
        const link = document.createElement("a");
        link.href = doc.fileData;
        link.download = doc.fileName;
        link.click();
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: any = {
            ACTIVE: "bg-green-100 text-green-800",
            DRAFT: "bg-yellow-100 text-yellow-800",
            EXPIRED: "bg-red-100 text-red-800",
            PENDING_REVIEW: "bg-blue-100 text-blue-800",
        };
        return <span className={`px-3 py-1 rounded-full text-xs ${colors[status]}`}>{status.replace("_", " ")}</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"><FiFile className="text-primary-600" /> Documents</h1>
                    <p className="text-gray-600">Upload, search & manage documents</p>
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700" onClick={() => setIsDialogOpen(true)}><FiUpload /> Upload</button>
            </div>

            {/* Search + Filters */}
            <div className="flex gap-3">
                <div className="flex items-center border rounded-lg px-3 py-2 flex-1">
                    <FiSearch className="text-gray-400 mr-2" />
                    <input className="w-full outline-none" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded-lg px-3 py-2">
                    {categories.map(c => <option key={c}>{c}</option>)}
                </select>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map(doc => (
                    <div key={doc.id} className="bg-white rounded-lg shadow p-5 border hover:shadow-lg transition">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-semibold">{doc.title}</h3>
                                <p className="text-xs text-gray-500">{doc.fileName}</p>
                            </div>
                            <StatusBadge status={doc.status} />
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{doc.description}</p>
                        <div className="mt-4 space-y-1 text-sm text-gray-700">
                            <div className="flex items-center gap-2"><FiPaperclip /> {doc.fileType} • {Math.round(doc.fileSize / 1024)} KB</div>
                            <div className="flex items-center gap-2"><FiCalendar /> {doc.dateCreated}</div>
                            <div className="flex items-center gap-2"><FiClock /> {doc.lastModified}</div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">{doc.tags.map((t, i) => <span key={i} className="bg-gray-100 px-2 py-1 text-xs rounded">{t}</span>)}</div>
                        <div className="flex justify-between mt-4 pt-3 border-t">
                            <button className="text-primary-600 flex items-center gap-1 hover:text-primary-800" onClick={() => setPreviewDocument(doc)}><FiEye /> Preview</button>
                            <button className="text-primary-600 flex items-center gap-1 hover:text-primary-800" onClick={() => handleDownload(doc)}><FiDownload /> Download</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Title *" className="w-full border px-3 py-2 rounded-lg" required />
                            <div className="grid grid-cols-2 gap-3">
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full border px-3 py-2 rounded-lg">{types.map(t => <option key={t}>{t}</option>)}</select>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border px-3 py-2 rounded-lg">{categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}</select>
                            </div>
                            <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border px-3 py-2 rounded-lg" placeholder="Description" />
                            <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="Tags (comma separated)" className="w-full border px-3 py-2 rounded-lg" />
                            <div className="border-2 border-dashed rounded-lg p-5 text-center">
                                <input type="file" className="hidden" ref={fileInput} multiple accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
                                <button type="button" className="bg-gray-100 px-3 py-2 rounded hover:bg-gray-200 flex items-center gap-2 mx-auto" onClick={() => fileInput.current?.click()}><FiUpload /> Select Files</button>
                                {selectedFiles.length > 0 && <ul className="mt-4 space-y-1 text-left text-sm">{selectedFiles.map(f => <li key={f.name} className="flex justify-between"><span>{f.name} ({Math.round(f.size / 1024)} KB)</span><button type="button" className="text-red-500" onClick={() => removeSelectedFile(f.name)}>Remove</button></li>)}</ul>}
                            </div>
                            <div className="flex justify-end gap-3 pt-3">
                                <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{loading ? "Uploading..." : "Upload"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Dialog */}
            {previewDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col shadow-xl">
                        <div className="flex justify-between p-4 border-b">
                            <div>
                                <h3 className="font-semibold text-lg">{previewDocument.title}</h3>
                                <p className="text-sm text-gray-500">{previewDocument.fileType} • {Math.round(previewDocument.fileSize / 1024)} KB</p>
                            </div>
                            <button onClick={() => setPreviewDocument(null)}><FiX className="text-gray-600 w-6 h-6" /></button>
                        </div>

                        <div className="flex-1 bg-gray-50 flex items-center justify-center p-6 overflow-auto">
                            {previewDocument.fileType === "application/pdf" ? (
                                <iframe src={previewDocument.fileData} className="w-full h-full border rounded" title="Preview" />
                            ) : (
                                <p className="text-gray-500">Preview not available for this file type.</p>
                            )}
                        </div>

                        <div className="p-4 border-t flex justify-end gap-3">
                            <button className="px-4 py-2 border rounded-lg" onClick={() => setPreviewDocument(null)}>Close</button>
                            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2" onClick={() => handleDownload(previewDocument)}><FiDownload /> Download</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;