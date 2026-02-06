import React from "react";
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
import { useGetMyProjectsQuery } from "../../reducers/slices/project/project.apiSlice";

const Projects = ({
  
  openProject,
  handleDeleteProject,
  showNewProject,
  setShowNewProject,
  newProject,
  setNewProject,
  handleCreateProject,
}) => {
  const {data: projects = [], isLoading} = useGetMyProjectsQuery();
  if (isLoading) return <div>Loading...</div>
  console.log(projects)
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
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              onClick={() => openProject(project)}
            >
              <ProjectName>{project.name}</ProjectName>
              <ProjectDescription>
                {project.description}
              </ProjectDescription>

              <ProjectMeta>
                <div>
                  <span>{project._count.boards} boards</span>
                  <span style={{ margin: "0 0.5rem" }}>•</span>
                  <span>{formatDate(project.lastVisitedAt)}</span>
                </div>

                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                >
                  Delete
                </DeleteButton>
              </ProjectMeta>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </Content>

      {showNewProject && (
        <ModalOverlay onClick={() => setShowNewProject(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New Project</ModalTitle>

            <Input
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              autoFocus
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
            />

            <ButtonGroup>
              <Button primary onClick={handleCreateProject}>
                Create Project
              </Button>
              <Button
                onClick={() => {
                  setShowNewProject(false);
                  setNewProject({ name: "", description: "" });
                }}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Projects;
