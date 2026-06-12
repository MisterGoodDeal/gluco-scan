import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ProgressStepsProps } from 'react-native-progress-steps/dist/types';

import StepIcon from './StepIcon';

type AppProgressStepsProps = ProgressStepsProps & {
  hideStepper?: boolean;
};

const ProgressSteps = ({
  children,
  isComplete = false,
  activeStep: initialActiveStep = 0,
  topOffset = 60,
  marginBottom = 30,
  hideStepper = false,
  ...props
}: AppProgressStepsProps) => {
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
      {!hideStepper ? (
        <View style={[styles.stepsContainer, { paddingTop: topOffset, marginBottom }]}>
          {renderStepIcons()}
        </View>
      ) : null}
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

type ProgressStepperBarProps = Omit<AppProgressStepsProps, 'children' | 'hideStepper'> & {
  activeStep: number;
  labels: string[];
};

export const ProgressStepperBar = ({
  labels,
  activeStep,
  isComplete = false,
  marginBottom = 12,
  topOffset: _topOffset,
  ...props
}: ProgressStepperBarProps) => (
  <View style={[styles.stepsContainer, { marginBottom }]}>
    {labels.map((label, index) => {
      const isCompletedStep = isComplete ? true : index < activeStep;
      const isActiveStep = isComplete ? false : index === activeStep;

      return (
        <View key={label} style={styles.stepContainer}>
          <StepIcon
            {...props}
            stepNum={index + 1}
            label={label}
            isFirstStep={index === 0}
            isLastStep={index === labels.length - 1}
            isCompletedStep={isCompletedStep}
            isActiveStep={isActiveStep}
          />
        </View>
      );
    })}
  </View>
);

export default ProgressSteps;
