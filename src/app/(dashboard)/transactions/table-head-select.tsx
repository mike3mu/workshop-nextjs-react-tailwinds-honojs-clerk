import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectGroup, SelectLabel } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};

const options = [
  'amount', //
  'payee',
  'date',
];

export const TableHeadSelect = ({ columnIndex, selectedColumns, onChange }: Props) => {
  const currentSelection = selectedColumns[`column_${columnIndex}`];

  //   onChange = (columnIndex, value) => {
  //     console.log(columnIndex, value);
  //   };

  return (
    <div>
      {
        <Select //
          value={currentSelection || ''}
          onValueChange={(value) => onChange(columnIndex, value)}
          name={`column_${columnIndex}`}
        >
          <SelectTrigger
            className={cn(
              'focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize',
              currentSelection && 'text-blue-500'
            )}
          >
            <SelectValue placeholder="Skip" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="skip">Skip</SelectItem>
            {options.map((option, index) => {
              const disabled =
                Object.values(selectedColumns).includes(option) && selectedColumns[`column_${columnIndex}`] !== option;
              return (
                <SelectItem key={index} value={option} disabled={disabled}>
                  {option}
                </SelectItem>
              );
            })}
          </SelectContent>
          {/* <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent> */}
        </Select>
      }
    </div>
  );
};
