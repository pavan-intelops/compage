import { ReactElement } from 'react'

export type ModalButtonProps = {
	dialog: (close: (remount?: boolean) => void) => ReactElement
	children: (open: () => void) => ReactElement
}
