import { useEffect, useState } from 'react';
import CornerstoneViewport from 'react-cornerstone-viewport'

export interface IViewportProps {
    ids: (string | null)[]
}
export default function Viewport({ ids }: IViewportProps) {

    const [state, setState] = useState({
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

    useEffect(() => {
        console.log('state.imageIds : ', ids);
        console.log('state.imageIds : ', state.imageIds);
        setState(prevState => {
            return {
                ...prevState
            }
        })
    }, []);

    return (
        <CornerstoneViewport
            tools={state.tools}
            imageIds={state.imageIds}
            style={{
                width: '80vh',
                height: '80vh',
                margin: 'auto',
                border: 'solid 1px, whitesmoke'
            }} />
    );
}