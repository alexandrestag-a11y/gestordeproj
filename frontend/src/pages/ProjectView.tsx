import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Header } from "../components/layout/Header";
import { PageWrapper } from "../components/layout/PageWrapper";
import { StageColumn } from "../components/project/StageColumn";
import { SubprojectPanel } from "../components/project/SubprojectPanel";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { useProjects, useSubprojects } from "../hooks/useProjects";
import { projectService } from "../services/projects";

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: allProjects = [] } = useProjects();
  const project = allProjects.find((entry) => entry.id === id);
  const { data: subprojects = [] } = useSubprojects(id);
  const [activeSubprojectId, setActiveSubprojectId] = useState<string | undefined>(undefined);
  const [subprojectName, setSubprojectName] = useState("");
  const [openSubprojectModal, setOpenSubprojectModal] = useState(false);
  const [openStageModal, setOpenStageModal] = useState(false);
  const [stageName, setStageName] = useState("");
  const [stageSubprojectId, setStageSubprojectId] = useState<string>("");
  const [openFieldModal, setOpenFieldModal] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [fieldOptions, setFieldOptions] = useState("");
  const [content, setContent] = useState("");
  const [isSavingContent, setIsSavingContent] = useState(false);

  useEffect(() => {
    if (project?.content) {
      setContent(project.content);
    }
  }, [project?.content]);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState("viewer");

  const activeSubproject = useMemo(() => {
    const fallback = subprojects[0];
    return subprojects.find((entry) => entry.id === activeSubprojectId) || fallback;
  }, [activeSubprojectId, subprojects]);

  const createSubproject = useMutation({
    mutationFn: () => projectService.createSubproject(id!, { name: subprojectName }),
    onSuccess: async () => {
      setOpenSubprojectModal(false);
      setSubprojectName("");
      await queryClient.invalidateQueries({ queryKey: ["subprojects", id] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const createStage = useMutation({
    mutationFn: () => projectService.createStage(stageSubprojectId, { name: stageName }),
    onSuccess: async () => {
      setOpenStageModal(false);
      setStageName("");
      await queryClient.invalidateQueries({ queryKey: ["subprojects", id] });
    },
  });

  const [openItemModal, setOpenItemModal] = useState(false);
  const [editingItemId, setEditingId] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [targetStageId, setTargetStageId] = useState("");

  const createItem = useMutation({
    mutationFn: () => {
      if (editingItemId) {
        return projectService.updateItem(editingItemId, { name: itemName });
      }
      return projectService.createItem(targetStageId, { name: itemName });
    },
    onSuccess: async () => {
      setOpenItemModal(false);
      setItemName("");
      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: ["subprojects", id] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: projectService.deleteItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subprojects", id] });
    },
  });

  const createField = useMutation({
    mutationFn: () => {
      const payload = {
        name: fieldName,
        type: fieldType,
        options:
          fieldType === "select"
            ? fieldOptions
                .split(",")
                .map((option) => option.trim())
                .filter(Boolean)
            : undefined,
      } as any;
      if (editingFieldId) {
        return projectService.updateField(editingFieldId, payload);
      }
      return projectService.createField(id!, payload);
    },
    onSuccess: async () => {
      setOpenFieldModal(false);
      setFieldName("");
      setFieldType("text");
      setFieldOptions("");
      setEditingFieldId(null);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteField = useMutation({
    mutationFn: projectService.deleteField,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const saveContent = async () => {
    if (!id) return;
    setIsSavingContent(true);
    try {
      await projectService.updateProject(id, { content });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } finally {
      setIsSavingContent(false);
    }
  };

  const shareProject = useMutation({
    mutationFn: () => projectService.shareProject(id!, { email: shareEmail, role: shareRole }),
    onSuccess: async () => {
      setOpenShareModal(false);
      setShareEmail("");
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <PageWrapper>
      <Header title={project?.name || "Projeto"} subtitle={project?.description || "Visao kanban por subprojeto"} />
      <div className="flex flex-col lg:flex-row h-full overflow-hidden">
        <div className="flex lg:flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/30 overflow-x-auto lg:overflow-y-auto shrink-0">
          <SubprojectPanel
            subprojects={subprojects}
            activeId={activeSubproject?.id}
            onSelect={setActiveSubprojectId}
            onCreate={() => setOpenSubprojectModal(true)}
          />
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{activeSubproject?.name || "Sem subprojeto"}</h2>
              <p className="text-sm text-slate-500">Etapas customizaveis, arranjo visual e fluxo rapido.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="bg-slate-100 text-slate-900 hover:bg-slate-200"
                onClick={() => setOpenShareModal(true)}
              >
                Compartilhar
              </Button>
              <Button className="bg-slate-900 hover:bg-slate-800" onClick={() => setOpenFieldModal(true)}>
                Campos
              </Button>
              {activeSubproject ? (
                <div className="flex gap-2">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setStageSubprojectId(activeSubproject.id);
                      setOpenStageModal(true);
                    }}
                  >
                    Nova Etapa
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex gap-4 overflow-auto pb-6">
            {activeSubproject?.stages.map((stage) => (
              <StageColumn
                key={stage.id}
                stage={stage}
                onAddItem={(stageId) => {
                  setTargetStageId(stageId);
                  setItemName("");
                  setEditingId(null);
                  setOpenItemModal(true);
                }}
                onOpenItem={(itemId) => {
                  navigate(`/items/${itemId}`);
                }}
                onEditItem={(item) => {
                  setItemName(item.name);
                  setEditingId(item.id);
                  setOpenItemModal(true);
                }}
                onDeleteItem={(itemId) => {
                  if (confirm("Deseja realmente excluir este item?")) {
                    deleteItem.mutate(itemId);
                  }
                }}
              />
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Documentacao do Projeto</h3>
              <Button onClick={saveContent} disabled={isSavingContent}>
                {isSavingContent ? "Salvando..." : "Salvar Texto"}
              </Button>
            </div>
            <ReactQuill theme="snow" value={content} onChange={setContent} />
          </div>
        </div>
      </div>

      <Modal
        open={openSubprojectModal}
        title="Novo subprojeto"
        onClose={() => setOpenSubprojectModal(false)}
      >
        <div className="space-y-4">
          <Input
            placeholder="Nome do subprojeto"
            value={subprojectName}
            onChange={(event) => setSubprojectName(event.target.value)}
          />
          <Button className="w-full" onClick={() => createSubproject.mutate()} disabled={!subprojectName}>
            Criar subprojeto
          </Button>
        </div>
      </Modal>

      <Modal open={openStageModal} title="Nova etapa" onClose={() => setOpenStageModal(false)}>
        <div className="space-y-4">
          <Input
            placeholder="Nome da etapa"
            value={stageName}
            onChange={(event) => setStageName(event.target.value)}
          />
          <Button className="w-full" onClick={() => createStage.mutate()} disabled={!stageName}>
            Criar etapa
          </Button>
        </div>
      </Modal>

      <Modal open={openFieldModal} title="Gerenciar campos customizados" onClose={() => setOpenFieldModal(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Nome do campo"
              value={fieldName}
              onChange={(event) => setFieldName(event.target.value)}
            />
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={fieldType}
              onChange={(event) => setFieldType(event.target.value)}
            >
              <option value="text">Texto</option>
              <option value="number">Numero</option>
              <option value="date">Data</option>
              <option value="select">Selecao</option>
              <option value="checkbox">Checkbox</option>
              <option value="url">URL</option>
            </select>
          </div>
          {fieldType === "select" ? (
            <Input
              placeholder="Opcoes separadas por virgula"
              value={fieldOptions}
              onChange={(event) => setFieldOptions(event.target.value)}
            />
          ) : null}
          <div className="space-y-2 max-h-60 overflow-auto">
            {project?.customFields?.map((field) => (
              <div key={field.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                <span>{field.name} <span className="text-slate-400">({field.type})</span></span>
                <div className="flex gap-1">
                  <button
                    className="p-1 hover:text-blue-600"
                    onClick={() => {
                      setFieldName(field.name);
                      setFieldType(field.type);
                      setFieldOptions(field.options ? JSON.parse(field.options).join(",") : "");
                      setEditingFieldId(field.id);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="p-1 hover:text-red-600"
                    onClick={() => {
                      if (confirm("Deseja realmente excluir este campo?")) {
                        deleteField.mutate(field.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={() => createField.mutate()} disabled={!fieldName}>
            {editingFieldId ? "Salvar Alteracoes" : "Salvar campo"}
          </Button>
        </div>
      </Modal>

      <Modal
        open={openItemModal}
        title={editingItemId ? "Editar Item" : "Novo Item"}
        onClose={() => {
          setOpenItemModal(false);
          setEditingId(null);
          setItemName("");
        }}
      >
        <div className="space-y-4">
          <Input
            placeholder="Nome do item"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
          />
          <Button
            className="w-full"
            onClick={() => createItem.mutate()}
            disabled={!itemName || createItem.isPending}
          >
            {createItem.isPending ? "Salvando..." : (editingItemId ? "Salvar Alteracoes" : "Criar Item")}
          </Button>
        </div>
      </Modal>

      <Modal open={openShareModal} title="Compartilhar Projeto" onClose={() => setOpenShareModal(false)}>
        <div className="space-y-4">
          <Input
            placeholder="E-mail do usuario"
            value={shareEmail}
            onChange={(event) => setShareEmail(event.target.value)}
          />
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={shareRole}
            onChange={(event) => setShareRole(event.target.value)}
          >
            <option value="viewer">Visualizador</option>
            <option value="editor">Editor</option>
          </select>
          <Button className="w-full" onClick={() => shareProject.mutate()} disabled={!shareEmail}>
            Convidar
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
