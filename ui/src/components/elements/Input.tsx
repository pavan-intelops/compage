import React, { FC } from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from './utils'

const variants = cva(
	'w-full p-2  placeholder-blueGray-200 text-blueGray-700 relative bg-white rounded-md outline-none focus:ring focus:ring-lightBlue-500 focus:ring-1 focus:border-lightBlue-500 border border-solid transition duration-200',
	{
		variants: {
			border: {
				border: 'border-blueGray-300',
				borderless: 'border-transparent shadow',
			},
			size: {
				sm: 'px-2 py-2 text-sm',
				regular: 'px-3 py-2 text-sm',
				lg: 'px-3 py-3 text-sm',
			},
			leftIcon: {
				true: 'pl-10',
				false: '',
			},
			rightIcon: {
				true: 'pr-10',
				false: '',
			},
		},
	}
)

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
	React.TextareaHTMLAttributes<HTMLTextAreaElement> &
	VariantProps<typeof variants> & {
		leftIcon?: FC
		rightIcon?: FC
		label?: string
		type?: string
		errorMessage?: string
	}

const Input = React.forwardRef<
	HTMLInputElement & HTMLTextAreaElement,
	InputProps
>(
	(
		{
			leftIcon: LeftIcon,
			rightIcon: RightIcon,
			type,
			className,
			errorMessage: error,
			...props
		},
		ref
	) => {
		const inputClasses = cn(variants(props), className)

		let leftAddon = null
		let rightAddon = null
		let wrapperClasses = 'mb-3 pt-0'

		if (LeftIcon) {
			wrapperClasses = 'relative flex w-full flex-wrap items-stretch mb-3'
			leftAddon = (
				<span className='z-10 h-full flex absolute text-center text-blueGray-300 text-sm items-center w-8 pl-3'>
					<LeftIcon />
				</span>
			)
		}

		if (RightIcon) {
			wrapperClasses = 'relative flex w-full flex-wrap items-stretch mb-3'
			rightAddon = (
				<span className='z-10 h-full flex absolute text-center text-blueGray-300 text-sm items-center w-8 right-0'>
					<RightIcon />
				</span>
			)
		}

		return (
			<>
				<span className='text-gray-500 font-semibold'>{props.label}</span>
				<div className={wrapperClasses} ref={ref}>
					{leftAddon}
					{type && type === 'textarea' ? (
						<textarea {...props} className={inputClasses} />
					) : (
						<input {...props} type={type} className={inputClasses} />
					)}
					{rightAddon}
					{error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
				</div>
			</>
		)
	}
)

export default Input
