import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Content,
  Header,
  HeaderLeft,
  Title,
  Subtitle,
  NewButton,
  ProjectsGrid,
  ProjectCard,
  ProjectName,
  ProjectDescription,
  ProjectMeta,
  DeleteButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Input,
  Textarea,
  ButtonGroup,
  Button,
} from "./Projects.styles";
import { formatDate } from "../../utils/date";
import {
  useGetMyProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} from "../../reducers/slices/project/project.apiSlice";
import ConfirmModal from "../../components/ui/confirm-modal/ConfirmModal";

const Projects = () => {
  const navigate = useNavigate();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", key: "", description: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const { data: projects = [], isLoading } = useGetMyProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  if (isLoading) return <div>Loading...</div>;

  const openProject = (project) => {
    navigate(`/app/project/${project.id}`);
  };

  const handleDeleteClick = (e, projectId) => {
    e.stopPropagation();
    setProjectToDelete(projectId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete).unwrap();
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error(error.data?.message || "Failed to delete project");
    } finally {
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!newProject.key.trim()) {
      toast.error("Project key is required");
      return;
    }

    try {
      const result = await createProject({
        name: newProject.name,
        key: newProject.key.toUpperCase(),
        description: newProject.description,
      }).unwrap();

      toast.success("Project created successfully");
      setShowNewProject(false);
      setNewProject({ name: "", key: "", description: "" });

      // Navigate to the newly created project
      navigate(`/app/project/${result.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error(error.data?.message || "Failed to create project");
    }
  };

  return (
    <>
      <Content>
        <Header>
          <HeaderLeft>
            <Title>My Projects</Title>
            <Subtitle>Select a project to manage tasks</Subtitle>
          </HeaderLeft>

          <NewButton onClick={() => setShowNewProject(true)}>
            + New Project
          </NewButton>
        </Header>

        <ProjectsGrid>
          {projects.length === 0 ? (
            <div style={{ textAlign: "center", color: "#6b7280", padding: "2rem", fontSize: "1.5rem" }}>
              No projects yet. 
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                onClick={() => openProject(project)}
              >
                <ProjectName>{project.name}</ProjectName>
                <ProjectDescription>
                  {project.description || "No description"}
                </ProjectDescription>

                <ProjectMeta>
                  <div>
                    <span>{project._count?.boards || 0} boards</span>
                    <span style={{ margin: "0 0.5rem" }}>•</span>
                    <span style={{ fontWeight: "bold" }}>{project.key}</span>
                    <span style={{ margin: "0 0.5rem" }}>•</span>
                    <span>
                      {project.lastVisitedAt
                        ? formatDate(project.lastVisitedAt)
                        : "Never visited"}
                    </span>
                  </div>

                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(e, project.id);
                    }}
                  >
                    Delete
                  </DeleteButton>
                </ProjectMeta>
              </ProjectCard>
            ))
          )}
        </ProjectsGrid>
      </Content>

      {showNewProject && (
        <ModalOverlay onClick={() => setShowNewProject(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New Project</ModalTitle>

            <Input
              placeholder="Project key (e.g. PROJ)"
              value={newProject.key}
              onChange={(e) =>
                setNewProject({ ...newProject, key: e.target.value.toUpperCase() })
              }
              maxLength={10}
              style={{ marginBottom: "1rem", textTransform: "uppercase" }}
              disabled={isCreating}
              required
            />

            <Input
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              autoFocus
              disabled={isCreating}
            />

            <Textarea
              placeholder="Project description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
              disabled={isCreating}
            />

            <ButtonGroup>
              <Button primary onClick={handleCreateProject} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Project"}
              </Button>
              <Button
                onClick={() => {
                  setShowNewProject(false);
                  setNewProject({ name: "", key: "", description: "" });
                }}
                disabled={isCreating}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setProjectToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};

export default Projects;
