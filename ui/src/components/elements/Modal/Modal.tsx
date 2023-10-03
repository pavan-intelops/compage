import { createRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { ModalButtonProps } from './Modal.types'

const ModalButton = ({ dialog, children }: ModalButtonProps) => {
	const [uniqueKey, setUniqueKey] = useState(
		Math.random().toString(36).substring(7)
	)
	const ref = createRef<HTMLDialogElement>()
	const open = () => ref.current?.showModal()
	const close = (remount = true) => {
		if (remount) setUniqueKey(Math.random().toString(36).substring(7))
		return ref.current?.close()
	}
	return (
		<>
			{createPortal(
				<dialog
					key={uniqueKey}
					ref={ref}
					onClick={(e) => e.target === ref.current && close()}
					className="rounded  backdrop:backdrop-blur-sm w['90vw'] h['90vh'] p-4"
				>
					{dialog(close)}
				</dialog>,
				document.getElementById('app-modal')!
			)}
			{children(open)}
		</>
	)
}
export default ModalButton
