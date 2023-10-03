import { Button, Checkbox } from 'components/elements'
import Input from 'components/elements/Input'
import ModalButton from 'components/elements/Modal/Modal'
import useReactFlowFormData from 'store/react-flow-store/useReactFlowFormData'
import { FC, MouseEvent } from 'react'
import { useForm } from 'react-hook-form'
import {
	BaseEdge,
	EdgeLabelRenderer,
	EdgeProps,
	getBezierPath,
} from 'reactflow'

interface CustomEdgeProps extends EdgeProps {
	style?: React.CSSProperties
	markerEnd?: string
}

const CustomEdge: FC<CustomEdgeProps> = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	markerEnd,
}) => {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	})

	const onEdgeClick = (evt: MouseEvent) => {
		evt.stopPropagation()
	}
	return (
		<>
			<BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						fontSize: 12,
						pointerEvents: 'all',
					}}
					className='nodrag nopan'
				>
					<ModalButton
						dialog={(close) => {
							return <EdgeForm close={close} id={id} />
						}}
						children={(open) => {
							return (
								<span
									className='w-5 h-5 bg-gray-200 border border-white cursor-pointer rounded-full text-xs leading-none p-2'
									onClick={(event) => {
										open()
										onEdgeClick(event)
									}}
								>
									{id.split('-')[1].substring(0, 2) +
										'-' +
										id.split('-')[2].substring(2, 4)}
								</span>
							)
						}}
					/>
				</div>
			</EdgeLabelRenderer>
		</>
	)
}

export default CustomEdge
function generateIdForGivenEdgeId(text: string, id: string) {
	return `${text}-${id}`
}
interface EdgeFormProps {
	id: string
	close: (remount?: boolean | undefined) => void
}
export interface EdgeFormValues {
	name: string
	sqlDatabase: boolean
	noSqlDatabase: boolean
}
const INITIAL_STATE = {
	name: '',
	sqlDatabase: false,
	noSqlDatabase: false,
}
const EdgeForm = ({ id, close }: EdgeFormProps) => {
	const { getEdge, addEdge } = useReactFlowFormData()
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<EdgeFormValues>({
		defaultValues: getEdge(id) || INITIAL_STATE,
	})

	const watchNoSqlDatabase = watch('noSqlDatabase')
	const watchSqlDatabase = watch('sqlDatabase')
	const onSubmit = (data: EdgeFormValues) => {
		addEdge(id, data)
		return close()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Input
				id='name'
				label='Name of the Component'
				errorMessage={errors['name']?.message}
				{...register('name', {
					required: 'This a required field',
				})}
			/>
			<div className='flex flex-col justify-between h-36 align-middle'>
				<Checkbox
					disabled={!!watchNoSqlDatabase}
					id={generateIdForGivenEdgeId('sqlDatabase', id)}
					label='SQL Database'
					register={register('sqlDatabase')}
				/>

				<Checkbox
					disabled={!!watchSqlDatabase}
					id={generateIdForGivenEdgeId('noSqlDatabase', id)}
					label='NO SQL Database'
					register={register('noSqlDatabase')}
				/>
				<Button
					color='emerald'
					// onClick={(e) => {
					// 	e.preventDefault()
					// 	close()
					// }}
				>
					Submit
				</Button>
			</div>
		</form>
	)
}
