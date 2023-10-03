import clsx from 'clsx'
import {
	MdCode,
	MdContentCopy,
	MdOutlineChangeCircle,
	MdUpdate,
} from 'react-icons/md'
import useReactFlowFormData from 'store/react-flow-store/useReactFlowFormData'

import { json } from '@codemirror/lang-json'
import { dracula } from '@uiw/codemirror-theme-dracula'
import ReactCodeMirror from '@uiw/react-codemirror'

import { Button } from '..'

type Props = {
	collapsed: boolean
	setCollapsed(collapsed: boolean): void
	shown: boolean
	position?: 'left' | 'right'
	width?: number
}

const Sidebar: React.FC<Props> = ({
	collapsed,
	shown,
	setCollapsed,
	position = 'left',
	width = 300,
}) => {
	const IconSymbol =
		position === 'left' ? (collapsed ? '>' : '<') : collapsed ? '<' : '>'
	const collapsedWidth = 16
	const { nodes, edges } = useReactFlowFormData()
	return (
		<div
			style={{
				width: collapsed ? `${collapsedWidth}px` : `${width}px`,
			}}
			className={clsx(
				"bg['#F0F6FF'] text-zinc-50 fixed md:static z-20 transition-all duration-300 ease-in-out h-screen",
				{
					'md:translate-x-0': !collapsed,
					'-translate-x-full': !shown && position === 'left',
					'translate-x-[-100%+64px]': !shown && position === 'right', // subtracting width of the collapsed sidebar
					'left-0': position === 'left',
					'right-0': position === 'right',
				}
			)}
		>
			<div
				className={clsx(
					'flex flex-col justify-between h-screen md:h-full sticky inset-0'
				)}
			>
				<div
					className={clsx(
						'flex items-center border-b border-b-indigo-800 transition-none',
						{
							'p-4 justify-between': !collapsed,
							'py-4 justify-center': collapsed,
							'flex-row-reverse': position === 'right',
						}
					)}
				>
					<button
						className='grid place-content-center hover:bg-indigo-800 w-10 h-10 rounded-full opacity-0 md:opacity-100 text-black transition-all duration-300 ease-in-out'
						onClick={() => setCollapsed(!collapsed)}
					>
						{IconSymbol}
					</button>
				</div>
				{!collapsed && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-start',
							height: '100%',
							width: `${width}px`,
						}}
					>
						<ReactCodeMirror
							value={JSON.stringify(
								{
									nodes,
									edges,
								},
								null,
								1
							)}
							extensions={[json()]}
							theme={dracula}
							height='500px'
						/>
						<>
							<h1 className='text-lg font-bold text-left text-indigo-800 mt-6 mb-2'>
								PROJECT_NAME
							</h1>
						</>
						<div className='flex flex-row flex-wrap gap-3 pr-2'>
							<Button color='lightBlue-outline' size='sm' fullWidth>
								<div className='flex flex-row align-middle justify-center my-auto items-center'>
									<MdContentCopy />
									<span className='ml-2'>Copy to Clipboard</span>
								</div>
							</Button>
							<Button color='lightBlue-outline' size='sm' fullWidth>
								<div className='flex flex-row align-middle justify-center my-auto items-center'>
									<MdUpdate />
									<span className='ml-2'>Update Changes</span>
								</div>
							</Button>
							<Button color='lightBlue-outline' size='sm' fullWidth>
								<div className='flex flex-row align-middle justify-center my-auto items-center'>
									<MdCode />
									<span className='ml-2'>Generate Code</span>
								</div>
							</Button>
							<Button color='lightBlue-outline' size='sm' fullWidth>
								<div className='flex flex-row align-middle justify-center my-auto items-center'>
									<MdOutlineChangeCircle />
									<span className='ml-2'>Switch Project</span>
								</div>
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Sidebar
