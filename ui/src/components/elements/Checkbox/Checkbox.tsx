import React, { InputHTMLAttributes } from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '../utils' // Adjust the import path according to your project structure
import { UseFormRegisterReturn } from 'react-hook-form'

const variants = cva(
	' ml-1 w-5 h-5 ease-linear transition-all duration-150 border border-blueGray-300 rounded  checked:border-blueGray-700'
)

interface CheckboxProps
	extends InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof variants> {
	label?: string
	register?: UseFormRegisterReturn
}

const Checkbox: React.FC<CheckboxProps> = ({
	label,
	className,
	register,
	...rest
}) => {
	return (
		<label className='inline-flex items-center cursor-pointer'>
			<input
				{...rest}
				type='checkbox'
				className={cn(variants(), className)}
				{...register}
			/>
			{label ? (
				<span className='ml-2 text-xs font-bold text-slate-600'>{label}</span>
			) : null}
		</label>
	)
}

export default Checkbox
