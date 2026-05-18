import { Paperclip } from "lucide-react";
import type { Attachment } from "../../types";
import { Button } from "../ui/Button";

export const FileUpload = ({
  attachments,
  onUpload,
  onDelete,
}: {
  attachments: Attachment[];
  onUpload: (file: File) => void;
  onDelete: (attachmentId: string) => void;
}) => (
  <div className="rounded-2xl border border-slate-200 p-4">
    <div className="mb-4 flex items-center justify-between">
      <h4 className="font-semibold text-slate-900">Arquivos</h4>
      <label>
        <input
          className="hidden"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
          }}
        />
        <span className="inline-flex cursor-pointer rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
          Enviar
        </span>
      </label>
    </div>
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
        >
          <span className="inline-flex items-center gap-2 text-slate-700">
            <Paperclip className="h-4 w-4" />
            {attachment.fileName}
          </span>
          <Button className="bg-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-300" onClick={() => onDelete(attachment.id)}>
            Remover
          </Button>
        </div>
      ))}
    </div>
  </div>
);
