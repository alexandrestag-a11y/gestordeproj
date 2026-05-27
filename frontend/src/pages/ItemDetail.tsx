import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { FileUpload } from "../components/item/FileUpload";
import { FieldEditor } from "../components/item/FieldEditor";
import { ItemDetailCard } from "../components/item/ItemDetail";
import { ListEditor } from "../components/item/ListEditor";
import { Header } from "../components/layout/Header";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { useItem } from "../hooks/useItems";
import { projectService } from "../services/projects";

export default function ItemDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: item } = useItem(id);

  const saveFieldValue = useMutation({
    mutationFn: ({ fieldId, value }: { fieldId: string; value: string }) =>
      projectService.saveFieldValue(id!, { fieldId, value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
  });

  const uploadAttachment = useMutation({
    mutationFn: (file: File) => projectService.uploadAttachment(id!, file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
  });

  const deleteAttachment = useMutation({
    mutationFn: projectService.deleteAttachment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
  });

  const createChecklist = useMutation({
    mutationFn: () =>
      projectService.createList(id!, {
        title: "Checklist",
        entries: [{ text: "Primeiro item", order: 0 }],
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
  });

  const [openSubtaskModal, setOpenSubtaskModal] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [subtaskName, setSubtaskName] = useState("");

  const createChild = useMutation({
    mutationFn: () => {
      if (editingSubtaskId) {
        return projectService.updateItem(editingSubtaskId, { name: subtaskName });
      }
      return projectService.createChildItem(id!, { name: subtaskName });
    },
    onSuccess: async () => {
      setOpenSubtaskModal(false);
      setSubtaskName("");
      setEditingSubtaskId(null);
      await queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: projectService.deleteItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
  });

  const deleteList = useMutation({
    mutationFn: projectService.deleteList,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
  });

  const toggleChecklist = async (listId: string, entryId: string, nextDone: boolean) => {
    const list = item?.lists.find((entry) => entry.id === listId);
    if (!list) return;

    await projectService.updateList(listId, {
      title: list.title,
      entries: list.entries.map((entry) =>
        entry.id === entryId ? { ...entry, done: nextDone } : entry,
      ),
    });
    await queryClient.invalidateQueries({ queryKey: ["item", id] });
  };

  if (!item) {
    return (
      <PageWrapper>
        <div className="p-8">
          <div className="h-52 animate-pulse rounded-3xl bg-white/70" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header
        title={item.name}
        subtitle={`${item.stage?.subproject.project.name} > ${item.stage?.subproject.name} > ${item.stage?.name}`}
      />
      <div className="grid grid-cols-[1.4fr_0.8fr] gap-6 p-8">
        <div className="space-y-6">
          <ItemDetailCard item={item} />
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Campos customizados</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {item.stage?.subproject.project.customFields.map((field) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  value={item.fieldValues.find((value) => value.fieldId === field.id)}
                  onChange={(value) => saveFieldValue.mutate({ fieldId: field.id, value })}
                />
              ))}
            </div>
          </Card>
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Subtarefas</h3>
              <Button onClick={() => setOpenSubtaskModal(true)}>
                Adicionar subtarefa
              </Button>
            </div>
            <div className="space-y-3">
              {item.children.map((child) => (
                <div key={child.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 group">
                  <div className="font-medium text-slate-900">{child.name}</div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      className="p-1 text-slate-400 hover:text-blue-600"
                      onClick={() => {
                        setSubtaskName(child.name);
                        setEditingSubtaskId(child.id);
                        setOpenSubtaskModal(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-slate-400 hover:text-red-600"
                      onClick={() => {
                        if (confirm("Excluir esta subtarefa?")) {
                          deleteItem.mutate(child.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Checklists</h3>
              <Button onClick={() => createChecklist.mutate()}>Nova lista</Button>
            </div>
            <div className="space-y-6">
              {item.lists.map(list => (
                <div key={list.id} className="relative group">
                   <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition">
                      <button
                        className="p-1 text-slate-400 hover:text-red-600"
                        onClick={() => {
                          if (confirm("Excluir esta lista?")) {
                            deleteList.mutate(list.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                   </div>
                   <ListEditor lists={[list]} onToggle={toggleChecklist} />
                </div>
              ))}
            </div>
          </Card>
          <FileUpload
            attachments={item.attachments}
            onUpload={(file) => uploadAttachment.mutate(file)}
            onDelete={(attachmentId) => deleteAttachment.mutate(attachmentId)}
          />
          <Card className="space-y-4 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Novo campo</h3>
            <Input placeholder="Gerencie no painel de projeto" readOnly />
          </Card>
        </div>
      </div>

      <Modal
        open={openSubtaskModal}
        title={editingSubtaskId ? "Editar Subtarefa" : "Nova Subtarefa"}
        onClose={() => {
          setOpenSubtaskModal(false);
          setEditingSubtaskId(null);
          setSubtaskName("");
        }}
      >
        <div className="space-y-4">
          <Input
            placeholder="Nome da subtarefa"
            value={subtaskName}
            onChange={(event) => setSubtaskName(event.target.value)}
          />
          <Button
            className="w-full"
            onClick={() => createChild.mutate()}
            disabled={!subtaskName || createChild.isPending}
          >
            {createChild.isPending ? "Salvando..." : (editingSubtaskId ? "Salvar Alteracoes" : "Criar Subtarefa")}
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
