import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveView } from '../../reducers/slices/navigation/navigation.slice';
import { CalendarDays, Clock, Sparkles } from 'lucide-react';
import {
  CalendarContainer,
  ComingSoonCard,
  IconWrapper,
  Title,
  Subtitle,
  Description,
  FeatureList,
  FeatureItem,
  FeatureIcon,
  FeatureText,
} from './Calendar.styles';

/**
 * Calendar Page Component
 * Placeholder page showing "Coming Soon" message
 * Will be implemented with React Big Calendar in the future
 */
const Calendar = () => {
  const upcomingFeatures = [
    { icon: CalendarDays, text: 'Month, Week, and Day views' },
    { icon: Clock, text: 'Track issue due dates visually' },
    { icon: Sparkles, text: 'Drag-and-drop event management' },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveView('calendar'));
  }, [dispatch]);

  return (
    <CalendarContainer>
      <ComingSoonCard>
        <IconWrapper>
          <CalendarDays size={64} />
        </IconWrapper>
        
        <Title>Calendar</Title>
        <Subtitle>Coming Soon</Subtitle>
        
        <Description>
          We're working on a powerful calendar view to help you visualize your 
          project timeline and manage deadlines more effectively.
        </Description>
        
        <FeatureList>
          {upcomingFeatures.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>
                <feature.icon size={20} />
              </FeatureIcon>
              <FeatureText>{feature.text}</FeatureText>
            </FeatureItem>
          ))}
        </FeatureList>
      </ComingSoonCard>
    </CalendarContainer>
  );
};

export default Calendar;
