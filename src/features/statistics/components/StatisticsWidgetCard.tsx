import { type FC, type ReactNode } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';

type StatisticsEmptyStateProps = {
  title: string;
  description: string;
};

const Container = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const StatisticsEmptyState: FC<StatisticsEmptyStateProps> = ({ title, description }) => {
  const theme = useTheme();

  return (
    <Container>
      <FaIcon name="utensils" size={32} color={theme.colors.textSecondary} />
    <Text $variant="subtitle" style={{ textAlign: 'center' }}>
      {title}
    </Text>
    <Text $variant="caption" $color="textSecondary" style={{ textAlign: 'center' }}>
      {description}
    </Text>
    </Container>
  );
};

type StatisticsWidgetCardProps = {
  title: string;
  children: ReactNode;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

const Card = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Title = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const StatisticsWidgetCard: FC<StatisticsWidgetCardProps> = ({
  title,
  children,
  empty = false,
  emptyTitle,
  emptyDescription,
}) => (
  <Card>
    <Title $variant="subtitle">{title}</Title>
    <GlassPanel>
      {empty ? (
        <StatisticsEmptyState
          title={emptyTitle ?? title}
          description={emptyDescription ?? ''}
        />
      ) : (
        children
      )}
    </GlassPanel>
  </Card>
);
