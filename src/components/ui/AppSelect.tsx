import { Select } from 'heroui-native';
import { type FC, type ReactNode } from 'react';
import { ScrollView } from 'react-native';

export type AppSelectOption = {
  value: string;
  label: string;
};

type AppSelectBaseProps = {
  options: AppSelectOption[];
  placeholder: string;
  listLabel?: string;
  isDisabled?: boolean;
  scrollable?: boolean;
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

const FIELD_TRIGGER_CLASSNAME =
  'min-h-12 w-full flex-row items-center justify-between gap-3 px-3 rounded-2xl border-[1.5px] bg-field border-field-border text-field-foreground font-normal ios:shadow-field android:shadow-sm';

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
      <Select.Trigger variant="unstyled" className={FIELD_TRIGGER_CLASSNAME}>
        <Select.Value placeholder={placeholder} />
        <Select.TriggerIndicator />
      </Select.Trigger>
      <Select.Portal>
        <Select.Overlay className="bg-backdrop" />
        <Select.Content presentation="dialog">
          <Select.Close />
          {listLabel ? <Select.ListLabel>{listLabel}</Select.ListLabel> : null}
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
