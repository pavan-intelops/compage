import { CUSTOM_EDGE } from 'components/react-flow/types'
import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Connection,
	Edge,
	EdgeChange,
	MarkerType,
	Node,
	NodeChange,
} from 'reactflow'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { RFState } from './types'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useReactFlowStore = create<RFState>()(
	devtools((set, get) => ({
		nodes: initialNodes,
		edges: initialEdges,
		addNode: (node: Node) => {
			set({
				nodes: get().nodes.concat(node),
			})
		},
		deleteNodeGivenAnUid: (uid: string) => {
			set({
				nodes: get().nodes.filter((node) => node.id !== uid),
			})
		},
		getNodeGivenAnUid: (uid: string) => {
			return get().nodes.find((node) => node.id === uid)
		},
		onNodesChange: (changes: NodeChange[]) => {
			console.log('I am called by react flow')

			set({
				nodes: applyNodeChanges(changes, get().nodes),
			})
		},
		onEdgesChange: (changes: EdgeChange[]) => {
			set({
				edges: applyEdgeChanges(changes, get().edges),
			})
		},
		reRenderNodeGivenAnUid: (uid: string) => {
			const node = get().getNodeGivenAnUid(uid)
			if (node) {
				set({
					nodes: get().nodes.map((n) => {
						if (n.id === node.id) {
							return { ...node }
						}
						return n
					}),
				})
			}
		},
		onConnect: (connection: Connection) => {
			set({
				edges: addEdge(
					{
						...connection,
						type: CUSTOM_EDGE.EDGE_WITH_BUTTON,
						markerEnd: {
							type: MarkerType.Arrow,
						},
					},
					get().edges
				),
			})
		},
	}))
)

export default useReactFlowStore
