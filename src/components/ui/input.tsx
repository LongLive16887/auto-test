import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon, XIcon } from 'lucide-react'
import * as React from 'react'

const Input = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement> & {
		border?: boolean
		clearable?: boolean
	}
>(({ className, type, border, clearable, value, onChange, ...props }, ref) => {
	const [showPassword, setShowPassword] = React.useState(false)

	const isPassword = type === 'password'
	const hasValue = !!value // Используем внешний value
	const showClearButton = clearable && hasValue && !props.disabled
	const showPasswordToggle = isPassword && hasValue && !props.disabled
	const inputType = isPassword && showPassword ? 'text' : type

	const handleClear = () => {
		// Обработаем очистку через внешний onChange
		if (onChange) {
			onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
		}
	}

	return (
		<div className='relative w-full'>
			<input
				ref={ref}
				type={inputType}
				data-slot='input'
				value={value} // Теперь напрямую используем value
				onChange={onChange} // и onChange
				className={cn(
					'file:text-foreground placeholder:text-muted-foreground focus:border-primary selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-sm bg-white px-3 py-2 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-white file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:textlg',
					'aria-invalid:border-destructive',
					border && 'border border-input',
					(showClearButton || showPasswordToggle) && 'pr-10', 
					className
				)}
				{...props}
			/>

			{showClearButton && (
				<button
					type='button'
					onClick={handleClear}
					className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100'
					aria-label='Clear input'
				>
					<XIcon className='h-5 w-5 text-muted-foreground' />
				</button>
			)}

			{showPasswordToggle && ( 
				<button
					type='button'
					onClick={() => setShowPassword(!showPassword)}
					className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100'
					aria-label={showPassword ? 'Hide password' : 'Show password'}
				>
					{showPassword ? (
						<EyeOffIcon className='h-5 w-5 text-muted-foreground' />
					) : (
						<EyeIcon className='h-5 w-5 text-muted-foreground' />
					)}
				</button>
			)}
		</div>
	)
})

Input.displayName = 'Input'

export { Input }
