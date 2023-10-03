import {
	Button,
	Checkbox,
	ModalButton,
	Select,
	SizedBox,
	Input,
} from 'components/elements'
import { motion } from 'framer-motion'
import { Fragment, useEffect, useRef } from 'react'
import {
	Control,
	FieldArrayWithId,
	SubmitHandler,
	useFieldArray,
	useForm,
} from 'react-hook-form'

import useReactFlowFormData from 'store/react-flow-store/useReactFlowFormData'

import {
	INITIAL_FORM_VALUES,
	LANGUAGE_DATA,
	NO_SQL_DATABASE_DATA,
	SQL_DATABASE_DATA,
} from './data'
import {
	MicroServiceResource,
	MicroServiceServerType,
	TMicroServiceNodeFormData,
} from './Microservice.node.types'
import { getFrameworkData, getTemplateData } from './MicroService.node.utils'

interface MicroServiceNodeFormProps {
	nodeId: string
}
function generateIdForGivenNodeId(input: string, nodeId: string) {
	return `${input}-${nodeId}`
}
export default function MicroServiceNodeForm({
	nodeId,
}: MicroServiceNodeFormProps) {
	const { addNode, getNode } = useReactFlowFormData()
	const {
		register,
		handleSubmit,
		formState,
		watch,
		getValues,
		control,
		setValue,
	} = useForm<TMicroServiceNodeFormData>({
		defaultValues: getNode(nodeId) || INITIAL_FORM_VALUES,
	})
	const watchLanguage = watch('language')
	const watchRestServerCheck = watch('restServer')
	const watchGRPCServerCheck = watch('gRPCServer')
	const watchRestServerTemplate = watch('restServer.template')
	const watchRestResources = watch('restServer.resources')

	const { errors } = formState
	const resourceEditingIndex = useRef<number | null>(null)
	const onSubmit = (data: TMicroServiceNodeFormData) => {
		return addNode(nodeId, data)
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className='align-middle'>
				<Input
					errorMessage={errors['name']?.message}
					placeholder='Name of the Component'
					{...register('name', {
						required: 'This a required field',
					})}
				/>
				<Select
					register={register('language')}
					data={LANGUAGE_DATA}
					placeholderText='select a language'
				/>
				<SizedBox vertical={20} />
				<div className='h-0.5 w-["100%"] bg-gray-300 mb-4'></div>
				<div className='flex flex-row mb-2 gap-3'>
					<Checkbox
						disabled={!watchLanguage || !!watchGRPCServerCheck}
						id={generateIdForGivenNodeId('isRestServer', nodeId)}
						label='REST server'
						register={register('restServer')}
					/>
					<Checkbox
						disabled={!watchLanguage || !!watchRestServerCheck}
						id={generateIdForGivenNodeId('isGRPC', nodeId)}
						label='GRPC server'
						register={register('gRPCServer')}
					/>
				</div>
				{watchRestServerCheck && (
					<div className='pl-2'>
						<Select
							register={register('restServer.template')}
							data={getTemplateData(
								watchLanguage,
								MicroServiceServerType.RestServer
							)}
							placeholderText='select a template'
						/>
						<SizedBox vertical={20} />
						{watchRestServerTemplate && (
							<Select
								register={register('restServer.framework')}
								data={getFrameworkData(
									MicroServiceServerType.RestServer,
									watchLanguage,
									watchRestServerTemplate
								)}
								placeholderText='select a framework'
							/>
						)}
						<SizedBox vertical={20} />

						<Input
							type='number'
							label='Port'
							id={generateIdForGivenNodeId('port', nodeId)}
							errorMessage={errors['restServer']?.port?.message}
							{...register('restServer.port', {
								maxLength: 4,
							})}
						/>
						{/* <SizedBox vertical={20} /> */}
						<div className=' flex justify-start gap-3 mb-2'>
							<Checkbox
								disabled={!!getValues('restServer.noSQLDatabase')}
								label='SQL DB'
								// id={generateIdForGivenNodeId('sqlDb', nodeId)}
								register={register('restServer.sqlDatabase')}
							/>
							<Checkbox
								disabled={!!getValues('restServer.sqlDatabase')}
								label='NoSQL DB'
								// id={generateIdForGivenNodeId('noSQLDb', nodeId)}
								register={register('restServer.noSQLDatabase')}
							/>
						</div>
						{!!getValues('restServer.sqlDatabase') && (
							<Select
								register={register('restServer.sqlDatabase.sqlDatabaseName')}
								data={SQL_DATABASE_DATA}
							/>
						)}
						{/* <SizedBox vertical={20} /> */}

						{!!getValues('restServer.noSQLDatabase') && (
							<Select
								register={register(
									'restServer.noSQLDatabase.noSQLDatabaseName'
								)}
								data={NO_SQL_DATABASE_DATA}
							/>
						)}

						<ModalButton
							dialog={(close) => (
								<ResourceForm
									close={close}
									control={control}
									resourceData={{
										attributes: [],
										name: '',
									}}
								/>
							)}
							children={(open) => (
								<>
									<Button
										color='lightBlue-outline'
										className='mt-2'
										onClick={(e) => {
											e.preventDefault()
											resourceEditingIndex.current = null
											open()
										}}
									>
										Add Resource
									</Button>
								</>
							)}
						/>
						<SizedBox vertical={20} />
						<div className='bg-slate-200 p-2 rounded mb-2'>
							{watchRestResources?.length !== 0 && (
								<>
									<span className=' mt-1 font-semibold text-gray-500 mb-4 '>
										Existing Current Resources
									</span>
								</>
							)}
							{watchRestResources &&
								watchRestResources.map((resource, index) => {
									if (!resource.name) return <Fragment key={index}></Fragment>
									return (
										<div key={index} className='mb-2  p-2'>
											<h6>{resource.name}</h6>
											<div className='flex h-8 flex-row align-middle'>
												<Button
													size='sm'
													onClick={(e) => {
														console.log(watchRestResources)
														e.preventDefault()
														const currentValues = getValues()
														return setValue(
															'restServer.resources',
															currentValues.restServer!.resources!.filter(
																(_resource, i) => i !== index
															)
														)
													}}
													color='red'
												>
													Delete
												</Button>
												<SizedBox horizontal={10} />
												<ModalButton
													key={index}
													dialog={(close) => (
														<ResourceForm
															resourceData={resource}
															close={close}
															control={control}
															editingIndex={index}
														/>
													)}
													children={(open) => (
														<>
															<Button
																size='sm'
																color='lightBlue'
																onClick={(e) => {
																	e.preventDefault()
																	resourceEditingIndex.current = index
																	open()
																}}
															>
																Edit Resource
															</Button>
														</>
													)}
												/>
											</div>
										</div>
									)
								})}
						</div>
					</div>
				)}
				{watchGRPCServerCheck && <div className='pl-2'>TBD</div>}
				<div className='flex flex-row justify-center align-middle'>
					<Button
						color='lightBlue'
						style={{
							alignSelf: 'center',
						}}
					>
						Submit
					</Button>
				</div>
			</form>
		</>
	)
}
interface ResourceFormProps {
	close: () => void
	control: Control<TMicroServiceNodeFormData> | undefined
	resourceData: MicroServiceResource
	editingIndex?: number | null
}

interface FormInput {
	resourceName: string
	attributes: {
		attributeType: string
		attributeName: string
	}[]
}
const ResourceForm = ({
	close,
	control: parentControl,
	resourceData,
	editingIndex,
}: ResourceFormProps) => {
	console.log('resourceData: ', resourceData)
	const emptyInput = {
		resourceName: '',
		attributes: [],
	}
	const { register, handleSubmit, control, getValues, reset, setValue } =
		useForm<FormInput>({
			defaultValues: {
				...emptyInput,
			},
			shouldUnregister: true,
		})
	const { fields, append, remove, update } = useFieldArray({
		control,
		name: 'attributes',
	})
	const parentField = useFieldArray({
		control: parentControl,
		name: 'restServer.resources',
	})

	useEffect(() => {
		setValue('resourceName', resourceData.name)
		setValue(
			'attributes',
			resourceData.attributes.map((attribute) => {
				return {
					attributeName: attribute.attribute,
					attributeType: attribute.type.id,
				}
			})
		)
	}, [])
	const onSubmit: SubmitHandler<FormInput> = (data) => {
		console.log(data)
		reset()
	}

	const handleAttributeAction = (
		index: number,
		field: FieldArrayWithId<FormInput, 'attributes', 'id'>
	) => {
		if (!field.attributeName) {
			return append({
				attributeName: '',
				attributeType: 'string',
			})
		}
		const data = getValues()
		const updatedName = data.attributes[index].attributeName
		const updatedType = data.attributes[index].attributeType
		return update(index, {
			attributeName: updatedName,
			attributeType: updatedType,
		})
	}

	const handleRemove = (index: number) => remove(index)

	const handleAddNewAttribute = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	): void => {
		e.preventDefault()
		if (!getValues('resourceName')) {
			return
		}
		append({ attributeName: '', attributeType: 'string' })
	}
	return (
		<div className='p-4'>
			<motion.form onSubmit={handleSubmit(onSubmit)} className='mb-4'>
				<input
					type='text'
					placeholder='Resource Name'
					{...register('resourceName')}
					className='w-full px-2 py-1 mb-4 border rounded-lg'
				/>

				{fields.map((field, index) => (
					<motion.div
						key={field.id}
						className='mb-4 p-2 border rounded-lg'
						layout='position'
					>
						<input
							type='text'
							placeholder='Attribute Name'
							{...register(`attributes.${index}.attributeName`)}
							defaultValue={field.attributeName}
							className='w-full px-2 py-1 mb-2 border rounded-lg'
						/>
						<select
							{...register(`attributes.${index}.attributeType`)}
							defaultValue={field.attributeType}
							className='w-full px-2 py-1 border rounded-lg'
						>
							<option value='string'>string</option>
							<option value='int'>int</option>
							<option value='bool'>bool</option>
						</select>
						<button
							type='button'
							onClick={() => handleAttributeAction(index, field)}
							className='mt-2  bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg'
						>
							{field.attributeName ? 'Update' : 'Add'}
						</button>
						<button
							type='button'
							onClick={(e) => {
								e.preventDefault()
								return handleRemove(index)
							}}
							className='ml-2 mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg'
						>
							Remove
						</button>
					</motion.div>
				))}

				<Button onClick={handleAddNewAttribute}>Add New Attribute</Button>
			</motion.form>
			<h1 className='border px-2 py-1'>{getValues('resourceName')}</h1>
			<table className='w-full'>
				<thead>
					<tr>
						<th className='bg-gray-200'>Attribute Name</th>
						<th className='bg-gray-200'>Attribute Type</th>
					</tr>
				</thead>
				<tbody>
					{fields.map((attribute, index) => {
						if (!attribute.attributeName) {
							return <Fragment key={index}></Fragment>
						}
						return (
							<tr key={index}>
								<td className='border px-2 py-1'>{attribute.attributeName}</td>
								<td className='border px-2 py-1'>{attribute.attributeType}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
			<div className='flex justify-center mt-4'>
				{editingIndex !== null && editingIndex !== undefined ? (
					<Button
						onClick={(e) => {
							e.preventDefault()
							const dataInRequiredFormat = {
								name: getValues('resourceName'),
								attributes: fields
									.map((field) => {
										return {
											attribute: field.attributeName,
											type: {
												id: field.attributeType,
												label: field.attributeType,
											},
										}
									})
									.filter((field) => !!field.attribute),
							}
							parentField.remove(editingIndex)
							parentField.insert(editingIndex, dataInRequiredFormat)
							close()
						}}
						color='emerald'
					>
						Update
					</Button>
				) : (
					<Button
						color='emerald'
						onClick={(e) => {
							e.preventDefault()

							const dataInRequiredFormat = {
								name: getValues('resourceName'),
								attributes: fields
									.map((field) => {
										return {
											attribute: field.attributeName,
											type: {
												id: field.attributeType,
												label: field.attributeType,
											},
										}
									})
									.filter((field) => !!field.attribute),
							}
							parentField.append(dataInRequiredFormat)
							close()
						}}
					>
						Save
					</Button>
				)}
				<Button
					onClick={(e) => {
						e.preventDefault()
						close()
					}}
					color='red'
					className='ml-2'
				>
					close
				</Button>
			</div>
		</div>
	)
}
