import { EdgeFormValues } from 'components/react-flow/connectors/CustomEdge'
import { TMicroServiceNodeFormData } from 'components/react-flow/nodes/microservice/Microservice.node.types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type RFFormData = {
	nodes: {
		[id: string]: TMicroServiceNodeFormData
	}
	edges: {
		[id: string]: EdgeFormValues
	}
	addNode: (id: string, formData: TMicroServiceNodeFormData) => boolean
	getNode: (id: string) => TMicroServiceNodeFormData
	addEdge: (id: string, formData: EdgeFormValues) => void
	getEdge: (id: string) => EdgeFormValues
}
const useReactFlowFormData = create<RFFormData>()(
	devtools((set, get) => {
		return {
			nodes: {},
			edges: {},
			addNode: (id, formData) => {
				set((state) => ({
					nodes: {
						...state.nodes,
						[id]: formData,
					},
				}))
				return true
			},
			getNode: (id) => {
				return get().nodes[id]
			},
			addEdge: (id, formData) => {
				set((state) => ({
					edges: {
						...state.edges,
						[id]: formData,
					},
				}))
			},
			getEdge: (id) => {
				return get().edges[id]
			},
		}
	})
)
export default useReactFlowFormData
