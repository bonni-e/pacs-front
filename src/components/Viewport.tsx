import { useRef } from 'react';
import CornerstoneViewport from 'react-cornerstone-viewport'

export interface IViewportProps {
    ids: (string | null)[]
}
export default function Viewport({ ids }: IViewportProps) {

    const state = useRef({
        tools: [
            // Mouse
            {
                name: 'Wwwc',
                mode: 'active',
                modeOptions: { mouseButtonMask: 1 },
            },
            {
                name: 'Zoom',
                mode: 'active',
                modeOptions: { mouseButtonMask: 2 },
            },
            {
                name: 'Pan',
                mode: 'active',
                modeOptions: { mouseButtonMask: 4 },
            },
            // Scroll
            { name: 'StackScrollMouseWheel', mode: 'active' },
            // Touch
            { name: 'PanMultiTouch', mode: 'active' },
            { name: 'ZoomTouchPinch', mode: 'active' },
            { name: 'StackScrollMultiTouch', mode: 'active' },
        ],
        imageIds: ids,
    });

    return (
        <CornerstoneViewport
            tools={state.current.tools}
            imageIds={state.current.imageIds}
            style={{
                width: '80vh',
                height: '80vh',
                margin: 'auto',
                border: 'solid 1px, whitesmoke'
            }} />
    );
}