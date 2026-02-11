import { Folder, FolderOpen,} from 'lucide-react';
import {
  ProjectItem as ProjectItemWrapper,
  ProjectButton,
  ProjectName,
} from './Sidebar.styles';

import { useDispatch } from 'react-redux';
import {setActiveProject} from '../../reducers/slices/navigation/navigation.slice';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
const ProjectItem = ({ project }) => {
  const {projectId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (projectId) {
      dispatch(setActiveProject({ projectId }));
    }
  }, [dispatch, projectId])

  const onProjectClick = () => {
    console.log("Project clicked", project.id);
    navigate(`/app/project/${project.id}`)
    dispatch(setActiveProject({ projectId: project.id }));
  };
  return (
    <ProjectItemWrapper>
      <ProjectButton
        onClick={onProjectClick}
        $active={projectId === project.id}
      >
        {projectId === project.id ? <FolderOpen size={16} /> : <Folder size={16} />}
        <ProjectName>{project.name}</ProjectName>
      
      </ProjectButton>

    </ProjectItemWrapper>
  );
};

export default ProjectItem;
