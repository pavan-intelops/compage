import { SelectProps } from './Select.types'
import './Select.styles.scss'

const Select = ({
	register,
	data,
	placeholderText = '',
	selectFirstItemAsDefault = false,
}: SelectProps) => {
	if (register) {
		return (
			<select
				{...register}
				className=' w-full bg-white border border-gray-300 px-3 py-2 pr-10  shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
				defaultValue={selectFirstItemAsDefault ? data[0].id : ''}
			>
				{!selectFirstItemAsDefault && (
					<option label='' value={''} disabled hidden>
						{placeholderText}
					</option>
				)}
				{data.map((item) => (
					<option key={item.id} value={item.id}>
						{item.label}
					</option>
				))}
			</select>
		)
	} else {
		return (
			<select
				className=' w-full bg-white border border-gray-300 px-3 py-2 pr-10  shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
				defaultValue={selectFirstItemAsDefault ? data[0].id : ''}
			>
				{!selectFirstItemAsDefault && (
					<option label='' value={''} disabled hidden>
						{placeholderText}
					</option>
				)}
				{data.map((item) => (
					<option key={item.id} value={item.id}>
						{item.label}
					</option>
				))}
			</select>
		)
	}
}

export default Select
