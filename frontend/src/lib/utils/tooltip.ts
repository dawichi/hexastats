export function tooltip(element: HTMLElement) {
    let div: HTMLDivElement
    let title: string | null

    function mouseOver(event: MouseEvent) {
        // NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
        // remember to set it back on `mouseleave`
        title = element.getAttribute('title')
        element.removeAttribute('title')

        div = document.createElement('div')
        div.textContent = title
        // ignore this error
        div.style = `
            color: #fff;
			border: 1px solid #ccc;
			background: #121212;
			border-radius: 4px;
			padding: 4px;
			position: absolute;
			top: ${event.pageX + 5}px;
			left: ${event.pageY + 5}px;
		`
        document.body.appendChild(div)
    }

    function mouseMove(event: MouseEvent) {
        div.style.left = `${event.pageX + 5}px`
        div.style.top = `${event.pageY + 5}px`
    }

    function mouseLeave() {
        document.body.removeChild(div)
        // NOTE: restore the `title` attribute
        element.setAttribute('title', `${title}`)
    }

    element.addEventListener('mouseover', mouseOver)
    element.addEventListener('mouseleave', mouseLeave)
    element.addEventListener('mousemove', mouseMove)

    return {
        destroy() {
            element.removeEventListener('mouseover', mouseOver)
            element.removeEventListener('mouseleave', mouseLeave)
            element.removeEventListener('mousemove', mouseMove)
        },
    }
}
