import { Select } from 'heroui-native';
import { type FC, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { FIELD_NO_BORDER_CLASSNAME } from '@/components/ui/fieldClassName';

export type AppSelectOption = {
  value: string;
  label: string;
};

export type AppSelectTriggerVariant = 'field' | 'surface';

type AppSelectBaseProps = {
  options: AppSelectOption[];
  placeholder: string;
  listLabel?: string;
  isDisabled?: boolean;
  scrollable?: boolean;
  triggerVariant?: AppSelectTriggerVariant;
  trigger?: ReactNode;
  additionalButton?: ReactNode;
  renderItem?: (option: AppSelectOption, isSelected: boolean) => ReactNode;
};

type AppSelectSingleProps = AppSelectBaseProps & {
  selectionMode?: 'single';
  value: AppSelectOption | undefined;
  onValueChange: (value: AppSelectOption | undefined) => void;
};

type AppSelectMultipleProps = AppSelectBaseProps & {
  selectionMode: 'multiple';
  value: AppSelectOption[];
  onValueChange: (value: AppSelectOption[]) => void;
};

export type AppSelectProps = AppSelectSingleProps | AppSelectMultipleProps;

const FIELD_TRIGGER_CLASSNAME = [
  'min-h-12 w-full flex-row items-center justify-between gap-3 px-3 rounded-2xl bg-field text-field-foreground font-normal',
  FIELD_NO_BORDER_CLASSNAME,
].join(' ');

const SURFACE_TRIGGER_CLASSNAME =
  'min-h-12 w-full flex-row items-center justify-between gap-3 px-3 rounded-2xl bg-surface border border-border text-foreground font-normal';

const getTriggerClassName = (variant: AppSelectTriggerVariant): string =>
  variant === 'surface' ? SURFACE_TRIGGER_CLASSNAME : FIELD_TRIGGER_CLASSNAME;

export const APP_SELECT_DIALOG_ICON_BUTTON_CLASS = 'h-10 w-10';

const SelectItems: FC<
  Pick<AppSelectBaseProps, 'options' | 'renderItem'> & { selectionMode: 'single' | 'multiple' }
> = ({ options, renderItem, selectionMode }) => (
  <>
    {options.map((option) => (
      <Select.Item key={option.value} value={option.value} label={option.label}>
        {renderItem ? ({ isSelected }) => renderItem(option, isSelected) : undefined}
      </Select.Item>
    ))}
  </>
);

export const AppSelect: FC<AppSelectProps> = (props) => {
  const {
    options,
    placeholder,
    listLabel,
    isDisabled,
    scrollable = false,
    triggerVariant = 'field',
    trigger,
    additionalButton,
    renderItem,
    selectionMode = 'single',
  } = props;

  const items = (
    <SelectItems options={options} renderItem={renderItem} selectionMode={selectionMode} />
  );

  const isMultiple = selectionMode === 'multiple';

  return (
    <Select
      presentation="dialog"
      selectionMode={selectionMode}
      value={props.value}
      onValueChange={(next) => {
        if (isMultiple) {
          (props as AppSelectMultipleProps).onValueChange((next as AppSelectOption[]) ?? []);
          return;
        }
        (props as AppSelectSingleProps).onValueChange(next as AppSelectOption | undefined);
      }}
      isDisabled={isDisabled}>
      {trigger ? (
        <Select.Trigger variant="unstyled" asChild>
          {trigger}
        </Select.Trigger>
      ) : (
        <Select.Trigger variant="unstyled" className={getTriggerClassName(triggerVariant)}>
          <Select.Value placeholder={placeholder} />
          <Select.TriggerIndicator />
        </Select.Trigger>
      )}
      <Select.Portal>
        <Select.Overlay className="bg-backdrop" />
        <Select.Content presentation="dialog">
          {listLabel || additionalButton ? (
            <View className="mb-2 flex-row items-center justify-between gap-2">
              {listLabel ? (
                <Select.ListLabel className="mb-0 flex-1">{listLabel}</Select.ListLabel>
              ) : (
                <View className="flex-1" />
              )}
              <View className="flex-row items-center gap-1">
                {additionalButton}
                <Select.Close
                  className={APP_SELECT_DIALOG_ICON_BUTTON_CLASS}
                  iconProps={{ size: 18 }}
                />
              </View>
            </View>
          ) : (
            <Select.Close
              className={APP_SELECT_DIALOG_ICON_BUTTON_CLASS}
              iconProps={{ size: 18 }}
            />
          )}
          {scrollable ? (
            <ScrollView className="max-h-[360px]" showsVerticalScrollIndicator={false}>
              {items}
            </ScrollView>
          ) : (
            items
          )}
        </Select.Content>
      </Select.Portal>
    </Select>
  );
};
