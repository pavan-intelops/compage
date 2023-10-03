import './MicroService.node.styles.scss'

import { Button } from 'components/elements'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import {
	Handle,
	NodeProps,
	Position,
	ReactFlowState,
	useStore,
} from 'reactflow'
import { useReactFlowStore } from 'store'

import { ReactComponent as DeleteIcon } from 'assets/deleteIcon.svg'
import { ReactComponent as DragHandleIcon } from 'assets/drag-handle.svg'

import MicroServiceNodeForm from './MicroService.node.form'
import { TMicroServiceNodeData } from './Microservice.node.types'

// Rest of your imports...
const connectionNodeIdSelector = (state: ReactFlowState) =>
	state.connectionNodeId
function MicroService({ data, id }: NodeProps<TMicroServiceNodeData>) {
	const connectionNodeId = useStore(connectionNodeIdSelector)
	const { deleteNodeGivenAnUid } = useReactFlowStore()
	const isConnecting = !!connectionNodeId

	// Define a state to handle the open/close of the form
	const [isOpen, setIsOpen] = useState(false)

	// Animation variants for framer-motion
	const variants = {
		open: { opacity: 1, height: 'auto' },
		closed: { opacity: 0, height: 0 },
	}

	return (
		<>
			<div className='custom-drag-handle'>
				<DragHandleIcon />
			</div>

			<div className='customNode nowheel nodrag bg-blue-50'>
				<div className='customNodeHeader mb-3 align-middle justify-center flex flex-row h-8 '>
					<span className='text-slate-700 font-semibold align-middle text-lg mr-3'>
						{data.name}
					</span>
					<div className='flex flex-row justify-end align-middle flex-1'>
						{/* Toggle button for collapsing/expanding the form */}
						<Button
							color='lightBlue-outline'
							size='sm'
							onClick={() => setIsOpen(!isOpen)}
						>
							{isOpen ? 'Hide Me' : 'Show Me'}
						</Button>
						<DeleteIcon
							className='delete-icon ml-3 align-middle mt-auto mb-auto'
							onClick={() => deleteNodeGivenAnUid(id)}
						/>
					</div>
				</div>

				<div className='customNodeBody'>
					{!isConnecting && (
						<Handle
							className='customHandle'
							position={Position.Right}
							type='source'
						/>
					)}

					<Handle
						id={`microservice-${id}-1}`}
						className='customHandle'
						position={Position.Left}
						type='target'
					/>

					{/* Use AnimatePresence for entering/exiting animations */}
					<AnimatePresence>
						{isOpen && (
							<motion.div
								initial='closed'
								animate='open'
								exit='closed'
								variants={variants}
							>
								<MicroServiceNodeForm nodeId={id} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</>
	)
}

export default MicroService
