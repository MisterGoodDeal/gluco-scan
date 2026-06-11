import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ProgressStepsProps } from 'react-native-progress-steps/dist/types';

import StepIcon from './StepIcon';

const ProgressSteps = ({
  children,
  isComplete = false,
  activeStep: initialActiveStep = 0,
  topOffset = 60,
  marginBottom = 30,
  ...props
}: ProgressStepsProps) => {
  const [stepCount, setStepCount] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(initialActiveStep);

  React.useEffect(() => {
    setStepCount(React.Children.count(children));
  }, [children]);

  React.useEffect(() => {
    setActiveStep(initialActiveStep);
  }, [initialActiveStep]);

  const handleSetActiveStep = (step: number): void => {
    const boundedStep = Math.min(Math.max(step, 0), stepCount - 1);
    setActiveStep(boundedStep);
  };

  const renderStepIcons = () => {
    return Array.from({ length: stepCount }, (_, i) => {
      const isCompletedStep = isComplete ? true : i < activeStep;
      const isActiveStep = isComplete ? false : i === activeStep;

      return (
        <View key={i} style={styles.stepContainer}>
          <StepIcon
            {...props}
            stepNum={i + 1}
            label={children[i].props.label}
            isFirstStep={i === 0}
            isLastStep={i === stepCount - 1}
            isCompletedStep={isCompletedStep}
            isActiveStep={isActiveStep}
          />
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.stepsContainer, { paddingTop: topOffset, marginBottom }]}>
        {renderStepIcons()}
      </View>
      <View style={styles.contentContainer}>
        {React.cloneElement(children[activeStep], {
          setActiveStep: handleSetActiveStep,
          activeStep,
          stepCount,
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  stepContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

export default ProgressSteps;
